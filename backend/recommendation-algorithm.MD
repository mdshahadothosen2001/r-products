Recommendation algorithm — design

Purpose

This document defines a practical, production-ready recommendation algorithm for the project. It bridges the high-level process (already documented) and the concrete implementation choices: signals, scoring, weighting, sampling, deduplication, caching and monitoring.

Goals / constraints

- Relevance first when a product context (pk) is present.
- High variability across requests (non-static results) to improve discovery.
- Explainability: each returned product includes short `reasons` tags.
- Scalable: avoid expensive DB operations (no order_by('?') on large tables).
- Fast: keep queries small and bulk-fetch product rows by id.

Inputs

- Request: optional `pk` (product id), optional query params (sample_size).
- Product metadata fields (used by scoring and pools):
  - id, category_id, subcategory_id, brand, is_best_selling, is_trending, is_featured, rating (float), discount_percent (float), stock (int), price, is_active

Outputs

- Ordered list of up to N recommended products with fields: id, name, brand, price, price_ceil, discount_percent, rating, thumbnail, reasons[].

High-level approach

1. Build candidate ID pools (IDs only):
   - If `pk` exists and product found:
     a. Subcategory pool: products with same subcategory (exclude pk)
     b. Brand pool: products with same brand (exclude pk)
     c. Category pool: products with same category (exclude pk)
     d. Global high-signal pool (best_selling, trending, featured)
   - If no `pk` or product not found:
     - Use global high-signal pool.
   - If candidate pool empty: fall back to all active products (IDs only).

2. Build a deduplicated ordered list of candidate IDs while retaining pool order (subcategory, brand, category, high signal). This creates an implicit priority ordering.

3. Scoring and weighting (optional but recommended):
   - Compute a numeric score for each candidate id using a lightweight formula combining:
     - pool_boost: a fixed boost depending on pool (e.g., same_subcategory=2.0, same_brand=1.5, same_category=1.2, high_signal=1.0)
     - rating_boost = rating / 5.0  (maps 0..5 -> 0..1)
     - discount_boost = min(discount_percent / 100, 0.5)  (cap influence)
     - stock_boost = sigmoid(stock) * small_weight
     - recency_boost (if `updated_at` or `created_at` exists)
   - Score example: score = pool_boost * (0.6 * rating_boost + 0.3 * discount_boost + 0.1 * stock_norm)

   Why optional: scoring requires fetching candidate attributes or precomputed scores; for low-latency the implementation can skip per-request scoring and rely on pool priority + randomization as a first step.

4. Variability (must-have):
   - Shuffle candidate IDs on each request to ensure different results across refreshes.
   - To preserve relevance while keeping variety, use weighted sampling:
     - Keep top-k of each priority pool (e.g., take up to 10 from subcategory if pk exists, then fill remaining from brand/category/high-signal), and sample within pools.
     - Or implement probability weights: P(select from pool X) proportional to pool_weight * pool_size.

5. Select N IDs (default N=20)
   - After shuffle or weighted sampling, slice the first N items to build the final ordered ID list.

6. Bulk fetch product rows by ID and preserve the chosen order in the response (fetch with id__in and map back to ids in chosen order).

7. Compute `reasons` tags for each product using the same checks used to build pools and signals (e.g., same_subcategory, same_brand, best_selling, trending, featured, high_discount, top_rated).

Pseudocode (Python / Django ORM)

```
# Step 1: candidate id collection (IDs only)
base_qs = Product.objects.filter(is_active=True)
candidate_ids = []
if pk:
    p = base_qs.filter(pk=pk).first()
    if p:
        if p.subcategory_id:
            candidate_ids.extend(base_qs.filter(subcategory_id=p.subcategory_id).exclude(pk=p.pk).values_list('id', flat=True))
        candidate_ids.extend(base_qs.filter(brand=p.brand).exclude(pk=p.pk).values_list('id', flat=True))
        candidate_ids.extend(base_qs.filter(category_id=p.category_id).exclude(pk=p.pk).values_list('id', flat=True))
        candidate_ids.extend(base_qs.filter(Q(is_best_selling=True) | Q(is_trending=True) | Q(is_featured=True)).exclude(pk=p.pk).values_list('id', flat=True))

if not candidate_ids:
    candidate_ids = list(base_qs.filter(Q(is_best_selling=True) | Q(is_trending=True) | Q(is_featured=True)).values_list('id', flat=True))
if not candidate_ids:
    candidate_ids = list(base_qs.values_list('id', flat=True))

# Step 2: dedupe preserving order
seen = set(); deduped = []
for i in candidate_ids:
    if i not in seen:
        seen.add(i); deduped.append(i)

# Step 3 & 4: variability + weighted sampling
random.shuffle(deduped)  # simple approach
sampled_ids = deduped[:N]

# Step 5: bulk fetch
products = base_qs.filter(id__in=sampled_ids)
products_map = {p.id: p for p in products}
ordered_products = [products_map[i] for i in sampled_ids if i in products_map]

# Build response with reasons
```

Weighted selection variation (optional)

- Instead of shuffling entire deduped list, sample from pools with weights.
- Example weights: subcategory 0.4, brand 0.25, category 0.15, high_signal 0.15, random 0.05.
- Implementation sketch:
  - For each pool, compute pool_sample_size = round(weight * N) but cap by pool size.
  - Random.sample() from each pool without replacement.
  - Merge sampled lists and if total < N, fill from remainder of deduped list.
  - Shuffle final list slightly to interleave pools.

Complexity and performance

- Candidate id queries return only IDs — typically inexpensive if proper indexes exist on `category_id`, `subcategory_id`, `brand`, `is_best_selling`, `is_trending`, `is_featured`.
- Combining and deduping in Python is O(M) where M is number of candidate ids (should be small relative to full catalog if pools are limited).
- Bulk fetch uses `id__in` which is efficient for tens to hundreds of ids; for thousands consider chunking or precomputing.

Caching & scaling

- Cache pools (ID lists) per category/brand/subcategory for short TTL (e.g., 30s-2min) to reduce DB hits.
- Precompute static scores offline and store in a small table or Redis for faster scoring.
- If needing high throughput, consider generating candidate pools asynchronously and storing them in Redis; sample from Redis on each request.

Explainability & logging

- Return `reasons` tags with each product.
- Log which pool(s) each returned product came from (for offline analysis): record a compact metric (product_id, pool_tag, timestamp, request_context).

Testing & evaluation

- Unit tests: verify `reasons` calculation, deduplication, and that pk-based responses include same_category/brand tags when appropriate.
- Integration test: call endpoint twice and assert that at least one product or order differs.
- Load test: simulate concurrent requests and measure DB load; tune caching or precomputation accordingly.
- Business metrics: CTR, add-to-cart rate, conversion rate, diversity over sessions.

Tuning knobs

- pool_weights: adjust to favor same_subcategory vs brand vs global
- discount cap and rating weights: tune influence of discount/rating on score
- sample_size (N): how many items to show
- cache_ttl: duration to cache candidate ID lists

Security and privacy

- Algorithm uses product metadata only (no personal data). If personalization is added later, require opt-in and proper consent handling.

Appendix: example SQL/ORM tips

- Ensure indexes on `category_id`, `subcategory_id`, `brand`, and boolean flags used in filters.
- Avoid `order_by('?')` in the DB for randomness. Shuffle in application code.
- Use `values_list('id', flat=True)` to transfer only IDs from DB to app memory.


Summary

The recommended algorithm is a hybrid of prioritized pool selection and randomized sampling. It provides a good balance of relevance, explainability and variety while being simple and scalable. Start with the simple shuffle-and-slice approach (already implemented), then iterate: add weighted sampling, caching, and optional scoring as the next steps when you have metrics to tune against.
