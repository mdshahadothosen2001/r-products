Backend Technology Stack — r-products

Core
- Language: Python 3.11+
- Framework: Django + Django REST Framework
- ORM: Django ORM

Database
- Dev: SQLite (in repo)
- Prod: PostgreSQL recommended

Caching & Async
- Redis for caching and Celery broker
- Celery for background tasks (notifications, webhooks processing)

Authentication
- JWT (djangorestframework-simplejwt) or DRF Token for API auth

Storage
- Local filesystem for dev media
- Amazon S3 / MinIO for production media storage

Payments
- External Payment Gateway (Stripe or local provider) - use webhooks

Email/SMS
- SMTP provider or SendGrid/Twilio for SMS

Observability
- Logging: JSON structured logs
- Metrics: Prometheus + Grafana
- Tracing: optional OpenTelemetry

Deployment
- Containerization: Docker
- Orchestration: Kubernetes or managed services
- Reverse Proxy: NGINX

CI/CD
- GitHub Actions / GitLab CI for tests, lint and deployments

Security
- HTTPS
- Secret management via environment variables or secret manager
- Rate limiting on auth endpoints

Libraries (examples)
- djangorestframework
- djangorestframework-simplejwt
- django-cors-headers
- django-storages[boto3]
- Pillow (image processing)
- celery[redis]

Notes
- Migrate from SQLite to PostgreSQL for production.
- Use connection pooling and proper DB indexes on high-traffic columns.
