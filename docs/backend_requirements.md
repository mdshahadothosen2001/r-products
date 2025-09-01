# Backend Requirement Analysis — r-products

Purpose
- Capture requirements for the backend only: APIs, data, integrations, non‑functional constraints and acceptance criteria.

Stakeholders
- Product owner
- Backend engineers
- Frontend engineers
- QA
- DevOps

Scope (backend only)
- In scope: user management & auth, product & category management, banners, coupons, wishlist, orders & order items, reviews, activity logging, admin operations, notifications, payment integration, persistence and backups, APIs for frontend.
- Out of scope: frontend UI, mobile apps, external analytics dashboards (only integration endpoints). 

Functional Requirements
1. Authentication & Authorization
   - Phone/password based authentication (current `UserAccount`).
   - Token-based auth for frontend (JWT or DRF Token).
   - Roles: normal user, staff/admin.
2. Product & Category Management
   - CRUD APIs for `Product` and `Category` with pagination, filtering, search, and sorting.
   - Upload/serve product thumbnails and banners.
3. Catalog
   - Public endpoints for product lists, product detail, category listing, banners.
4. Wishlist
   - Add/remove product to wishlist; unique constraint per user-product.
5. Cart & Orders
   - Create order from cart data; store `Order` and `OrderItem` snapshot fields (product_name, price etc.).
   - Apply coupon codes with validation and tracking (`Coupon.used_count`).
   - Order lifecycle statuses: start, address, pending, processing, shipped, delivered, cancelled, return.
6. Payments
   - Integrate with external Payment Gateway; verify payment and mark orders accordingly.
7. Reviews & Ratings
   - Create/read product reviews; associate reviews to users and orders; rating 1–5.
8. Notifications
   - Send order confirmations and status updates via Email/SMS (async).
9. Activity Logging
   - Record important events (order created/updated, coupon applied) in `ActivityLog`.
10. Admin Operations
   - Admin APIs for product stock update, coupon management, banner management, and order management.

Data Model Summary (derived from code)
- Users: `UserAccount` (phone_number PK-ish), roles and profile fields.
- Category: `Category` (name, priority, is_active).
- Product: `Product` (FK to Category, price, stock, flags for featured/best selling, etc.).
- Order: `Order` (FK to User, address fields, total_price, status).
- OrderItem: `OrderItem` (FK to Order, product snapshot fields, quantity).
- Wishlist: `Wishlist` (unique per user-product).
- Coupon: `Coupon` (code, type, limits, validity checks).
- ProductReview: `ProductReview` (FK user, FK order, rating, optional product_ids string).
- ActivityLog: `ActivityLog` (action_type, FK order, performed_by).

API Design (representative endpoints)
- POST /api/auth/login/ — authenticate and return token
- POST /api/auth/register/ — create user
- GET /api/products/ — list, filter, paginate
- GET /api/products/{id}/ — product detail
- POST /api/products/ — (admin) create
- GET /api/categories/ — list
- GET /api/banners/ — list
- POST /api/wishlist/ — add
- DELETE /api/wishlist/{id}/ — remove
- POST /api/orders/ — create order
- GET /api/orders/{id}/ — order detail
- POST /api/orders/{id}/pay/ — start payment
- POST /api/coupons/validate/ — validate coupon
- POST /api/reviews/ — add review
- GET /api/activities/ — admin access to logs

Non‑Functional Requirements
- Security: HTTPS mandatory, protect endpoints with auth, input validation, rate limiting on auth endpoints, store secrets in environment variables.
- Performance: API median latency <200ms for simple reads; support pagination and caching for product lists (Redis/HTTP cache).
- Scalability: Stateless app instances behind load balancer; shared Redis for caching and Celery broker; DB horizontally scaled read replicas if needed.
- Availability: 99.9% target; health endpoints and graceful retries for external services.
- Durability/Backup: Daily DB backups; point-in-time recovery if using RDBMS that supports it.
- Auditability: All order state changes should be logged in `ActivityLog`.

Integration Points
- Payment Gateway (e.g., Stripe or local gateway): charge, webhooks for payment result.
- Email/SMS provider (SMTP, SendGrid, Twilio) for notifications.
- Storage for media (S3 or equivalent) to store product images and user pictures.
- Optional analytics tracking endpoint or event stream.

Operational Requirements
- Logging: structured logs (JSON) with request IDs and user IDs for tracing.
- Monitoring: metrics (requests, errors, latency) exported to Prometheus/Grafana.
- Error handling: central error responses, retries for transient errors.
- CI/CD: run tests, lint, build image, run migrations and deploy via pipeline.

Data Privacy & Compliance
- Do not store payment card data on backend; use gateway tokens.
- Comply with local data protection laws for user PII retention and deletion on request.

Constraints & Assumptions
- Backend uses Django + Django REST Framework (existing codebase).
- SQLite used in repo for dev; production should use PostgreSQL or managed RDBMS.
- Async tasks should use Celery + Redis for notifications and long-running jobs.
- Storage: local media in dev, S3 in production.

Acceptance Criteria
- All listed functional endpoints implemented with tests (unit + integration) and documented OpenAPI/Swagger specs.
- Coupon validation and application match business rules and are tracked in DB.
- Order lifecycle transitions are enforced and logged.
- Payment flow secured and confirmed via webhook, with order updated on success/failure.

Deliverables
- API endpoints with Swagger/OpenAPI documentation.
- ERD and DFD diagrams (PlantUML sources are in `docs/diagrams/`).
- Test suite and CI pipeline for backend.
- Deployment scripts (Dockerfile, k8s manifest or deployment instructions).

Next Steps
1. Review and confirm scope and acceptance criteria with product owner.
2. Add OpenAPI contract and iterate with frontend team.
3. Implement missing APIs and background workers for notifications.
4. Prepare production configuration: PostgreSQL, S3, Redis, Celery, and payment gateway keys.

Contact
- Developers should refer to the models in `backend/` for field-level details and to `docs/diagrams/erd.puml` for the model overview.
