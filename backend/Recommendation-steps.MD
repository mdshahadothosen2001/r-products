Recommendation Steps

This document provides step-by-step instructions to implement, run, test, and deploy the recommendation flow implemented in `backend/product/views.py`.

________________________________
             STEP 1
-------------------------------------------------------
1. Confirm product model fields
   - Ensure `product.models.Product` contains the fields used by the logic: `id`, `name`, `brand`, `category`, `subcategory` (optional), `is_best_selling`, `is_trending`, `is_featured`, `rating`, `discount_percent`, `thumbnail`, `is_active`, `stock`, and `price`.

2. Endpoint location
   - The recommendations view is implemented in `backend/product/views.py` as `ProductRecommendationView`.
   - Confirm the URL route is registered in `backend/product/urls.py` and included in the project `config/urls.py`.

________________________________
             STEP 2
-------------------------------------------------------
3. Candidate collection
   - If the request contains `?pk=<id>`:
     - Fetch the base product (skip if not found).
     - Collect candidate product IDs from the following pools (excluding base product):
       a. Subcategory matches (if base product has subcategory)
       b. Same brand
       c. Same category
       d. Global high-signal pool (best_selling, trending, featured)
   - If no `pk` or no candidates found, use the global high-signal pool.
   - If still empty, fall back to all active products.

________________________________
             STEP 3
-------------------------------------------------------
4. Deduplicate & shuffle
   - Deduplicate candidate IDs while preserving first-seen order.
   - Shuffle the deduplicated list on every request to guarantee different results on refresh.

________________________________
             STEP 4
-------------------------------------------------------
5. Sampling & ordering
   - Slice the first `N` IDs from the shuffled list (default N=20).
   - Fetch product records for the sampled IDs in bulk and preserve the sampled order for the response.

________________________________
             STEP 5
-------------------------------------------------------
6. Build response & explainability
   - For each product in sampled order, produce a JSON object with fields: `id`, `name`, `brand`, `price`, `price_ceil`, `discount_percent`, `rating`, `thumbnail`, and `reasons`.
   - `reasons` is a short array of tags indicating why the item was recommended (e.g., same_subcategory, same_brand, best_selling, trending, featured, high_discount, top_rated).

________________________________
             STEP 6
-------------------------------------------------------
7. Testing & verification
   - Manual test: start the Django server and call the endpoint with and without `pk` multiple times. Verify the results change between requests and `reasons` contain expected tags.
   - Automated test idea: write a small integration test that calls the endpoint twice and asserts that at least one returned item differs between the two responses (or that orders differ).

8. Load testing & performance
   - If the catalog is large, monitor DB queries and consider caching candidate ID lists with short TTLs. Sampling can still happen on each request from the cached pool.

________________________________
             STEP 7
-------------------------------------------------------
9. Deployment notes
   - Add the new code to your feature branch and run unit tests.
   - Deploy to staging and run smoke tests that validate recommendation endpoints.
   - Optionally run an A/B experiment comparing new randomized recommendations vs. a control.

10. Follow-ups
   - Implement weighted sampling to prefer same_subcategory and best_selling candidates more often while preserving variety.
   - Add logging/metrics for the recommendation pipeline (selected reason tags, sample sizes, source pools) for offline analysis.

