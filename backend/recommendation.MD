Recommendation strategy for product suggestions

Purpose

- Provide non-static, varied product recommendations so users see different suggestions across visits.
- When a product `pk` is provided, prioritize recommendations from the same subcategory, category, or brand so suggestions feel relevant.
- Provide explainability: each recommended product includes the reason(s) it was selected (e.g., same_subcategory, same_brand, best_selling, trending).

Contract (inputs / outputs)

- Input: HTTP GET to recommendation endpoint with optional `pk` (product id).
- Output: JSON array of recommended product objects (max 20): each item contains
  - id, name, brand, price, price_ceil, discount_percent, rating, thumbnail
  - reasons: array of short reason tags (e.g., "same_subcategory", "best_selling")

Signals used (ranked by priority when pk provided)

- same_subcategory: exact subcategory match with the viewed product (highest relevance)
- same_brand: same brand as the viewed product
- same_category: same category as the viewed product
- is_best_selling: product flagged as best selling
- is_trending: product flagged as trending
- is_featured: product flagged as featured
- rating: high average rating
- discount_percent / offers: higher discount increases prominence
- stock: available stock used as minor tiebreaker
- price: used for secondary relevance or later personalization (not used alone initially)

Algorithm (summary)

1. Base candidates: active products (is_active=True).
2. If `pk` provided and product exists:
   - Build candidate pools (excluding the base product): subcategory, brand, category, plus general high-signal lists (best_selling / trending / featured).
   - Combine pools and deduplicate.
3. If `pk` not provided or product not found:
   - Use global candidate pool taken from high-signal products (best_selling / trending / featured / top_rated).
4. Sampling & variability:
   - Collect candidate IDs, deduplicate, then randomly sample up to N=20 each request.
   - This preserves relevance while ensuring the returned products differ between requests.
   - After sampling, we fetch those products and preserve the sampled order.
5. Explainability:
   - For each returned product, compute a short list of "reasons" (e.g., same_subcategory, same_brand, best_selling, trending, featured, top_rated, high_discount) to show why it was recommended.

Edge cases and fallbacks

- Not enough candidates: fall back to global high-signal products and then to all active products.
- Product missing/invalid `pk`: treat as the non-pk case and return global suggestions.
- Subcategory/brand missing on product: skip that pool.
- DB size / performance concerns:
  - Building candidate id lists is cheap if we query only IDs and then sample in Python.
  - We avoid order_by('?') because it's expensive on large tables.

Privacy & safety

- No personal user data is used in this approach; all signals come from product metadata and global attributes. Future personalization can be added carefully with opt-in controls.

How to validate manually

- Call GET /api/products/recommendations/ (or the project's recommendation endpoint) multiple times: results should differ across requests.
- Call GET /api/products/recommendations/?pk=<id> and inspect the `reasons` field for each returned product — expect same_subcategory/brand/category when relevant.

Notes & next steps

- Consider weighting sampling probability (e.g., give higher chance to same_subcategory or best_selling) for better UX.
- Add A/B tests to measure click-through or conversion from recommended items.
- Add caching with short expiry to reduce DB load while retaining variability (e.g., cache many candidate ids and sample from cache).