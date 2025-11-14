Recommendation Process

Purpose

This document describes the high-level recommendation process used by the backend to generate product suggestions for users. It explains the goals, signals used, expected behavior, and evaluation notes.

Goals

- Provide relevant, non-static recommendations that feel fresh on every visit.
- Prioritize relevance when a product context (pk) is provided, while still allowing variety.
- Provide explainability by including short ``reasons`` metadata for each recommended product.
- Keep the approach simple, scalable, and cache-friendly.

Primary signals

- same_subcategory: products in the exact same subcategory as the viewed product.
- same_category: products in the same category (less specific than subcategory).
- same_brand: products from the same brand as the viewed product.
- is_best_selling: boolean flag indicating best sellers.
- is_trending: boolean flag indicating currently trending items.
- is_featured: boolean flag indicating editorial or curated picks.
- rating: numeric rating (higher rating elevates the product).
- discount_percent: percent discount / offer. Higher discount may increase chances.
- stock: available stock used as a minor tiebreaker.

High-level flow

1. Candidate selection
   - If a product `pk` is given and exists: collect candidate IDs from subcategory (if present), brand, category, and global high-signal pools (best_selling, trending, featured). Exclude the base product.
   - If no `pk` or no candidates found: use global high-signal pools.
   - If still empty: fall back to all active products.

2. Deduplication
   - Deduplicate candidate IDs while preserving the first-seen order of candidates.

3. Variability and sampling
   - To ensure non-static responses, shuffle the deduplicated list of candidate IDs on every request.
   - Select up to N candidates (default N=20) by slicing the shuffled list.
   - Fetch product records for the sampled IDs and preserve the sampled order for the response.

4. Explainability
   - For each returned product, compute a short list of reasons (e.g., same_subcategory, best_selling, trending, high_discount, top_rated).
   - Include the `reasons` array in the response so UI can show a small explainability tag or tooltip.

Performance considerations

- We avoid expensive database operations such as order_by('?') on large tables.
- Candidate ID collection uses small, targeted queries that return only IDs then sample in Python. This is generally efficient and easy to cache.
- If scale becomes a concern, cache the candidate ID lists for short TTL (for example, 30s to 2 minutes) and sample from cached IDs to reduce DB load while retaining variability.

Evaluation & metrics

- CTR (click-through rate) on recommended items
- Conversion rate from recommendations
- Diversity score (how often a user sees new items across multiple visits)
- Relevance score (user engagement with same_category / same_brand picks vs. global picks)

Privacy and personalization

- Current approach uses product metadata only — no personal user data.
- To add personalization later, maintain opt-in, and record explicit user consent for personalized models.

Next steps

- Add weighted sampling (increase probability for same_subcategory and high-signal items while keeping variety).
- Add integration tests and a small experiment (A/B) to measure the business impact of the new recommendations.
- Consider caching and precomputation for very large catalogs.
