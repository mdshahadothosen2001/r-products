Backend Module Breakdown — r-products

1. Auth Module
   - Files: backend/user/*, backend/config/JWT_SETTINGS.py
   - Responsibilities: register/login, token issuance, permissions, user profile

2. Product Module
   - Files: backend/product/*
   - Responsibilities: product CRUD, thumbnails, listing, filters, categories

3. Category Module
   - Files: backend/category/*
   - Responsibilities: category CRUD, priority management

4. Order Module
   - Files: backend/order/*
   - Responsibilities: cart conversion to order, order lifecycle, order items, address handling

5. Coupon Module
   - Files: backend/coupon/*
   - Responsibilities: coupon creation, validation, application, usage tracking

6. Wishlist Module
   - Files: backend/wishlist/*
   - Responsibilities: wishlist add/remove, unique constraint

7. Review & Rating Module
   - Files: backend/rating/*
   - Responsibilities: product reviews, rating aggregation

8. Notification Module
   - Files: backend/common or backend/notifications (not present yet)
   - Responsibilities: email/sms sending via Celery tasks

9. Activity Module
   - Files: backend/activity/*
   - Responsibilities: record events and audit trail

10. Admin Module
   - Files: admin.py files in modules, backend/config/jazzmin_settings.py
   - Responsibilities: admin dashboards for content and order management

11. Common Utilities
   - Files: backend/common/*
   - Responsibilities: validators, pagination, email host data

Integration Points
- Payment Gateway: used by Order Module
- Media Storage: used by Product & User modules
- Redis & Celery: used by Notification & background tasks

Testing
- Each module should have unit tests and integration tests in respective apps

Deployment
- Provide Dockerfile and k8s manifests for each service component

Roadmap Items
- Implement Cart model (not yet present) for explicit cart handling
- Add dedicated Notification module with Celery tasks
- Add audit export utilities for ActivityLog
