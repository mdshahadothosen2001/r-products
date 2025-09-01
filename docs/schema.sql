-- Schema SQL for r-products backend (SQLite-friendly)
-- Derived from Django models in backend/ folder

PRAGMA foreign_keys = ON;

-- Users (db_table = user_account)
CREATE TABLE IF NOT EXISTS user_account (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    phone_number TEXT NOT NULL UNIQUE,
    email TEXT UNIQUE,
    name TEXT,
    gender TEXT,
    religion TEXT,
    date_of_birth DATE,
    picture TEXT,
    marital_status TEXT,
    is_student INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    is_staff INTEGER DEFAULT 0,
    is_superuser INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Category
CREATE TABLE IF NOT EXISTS category (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    priority INTEGER DEFAULT 1,
    is_active INTEGER DEFAULT 1
);

-- Product
CREATE TABLE IF NOT EXISTS product (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category_id INTEGER NOT NULL,
    brand TEXT,
    description TEXT,
    detail TEXT,
    specifications TEXT,
    price NUMERIC(10,2) NOT NULL,
    thumbnail TEXT,
    color TEXT,
    size TEXT,
    discount NUMERIC(10,2) DEFAULT 0.00,
    discount_percent NUMERIC(10,2) DEFAULT 0.00,
    stock INTEGER DEFAULT 0,
    status TEXT,
    made_in TEXT,
    made_for TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    rating NUMERIC(3,1) DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    is_best_selling INTEGER DEFAULT 0,
    is_new_arrival INTEGER DEFAULT 0,
    is_top_brand INTEGER DEFAULT 0,
    is_featured INTEGER DEFAULT 0,
    is_free_delivery INTEGER DEFAULT 0,
    is_trending INTEGER DEFAULT 0,
    is_recently_viewed INTEGER DEFAULT 0,
    is_just_for_you INTEGER DEFAULT 0,
    FOREIGN KEY (category_id) REFERENCES category(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_product_category ON product(category_id);

-- Order
CREATE TABLE IF NOT EXISTS "order" (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    status TEXT DEFAULT 'start',
    total_price NUMERIC(10,2) DEFAULT 0.00,
    receiver_phone TEXT,
    first_name TEXT,
    last_name TEXT,
    address_line_1 TEXT,
    address_line_2 TEXT,
    city TEXT,
    postal_or_zip_code TEXT,
    applied_coupon TEXT,
    coupon_price NUMERIC(10,2) DEFAULT 0.00,
    order_return_condition INTEGER DEFAULT 1,
    is_review INTEGER DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES user_account(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_order_user ON "order"(user_id);

-- OrderItem
CREATE TABLE IF NOT EXISTS orderitem (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,
    product_id INTEGER,
    product_name TEXT,
    price NUMERIC(10,2),
    saved_amount NUMERIC(10,2) DEFAULT 0.00,
    discounted_price NUMERIC(10,2),
    quantity INTEGER DEFAULT 1,
    FOREIGN KEY (order_id) REFERENCES "order"(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_orderitem_order ON orderitem(order_id);

-- Wishlist
CREATE TABLE IF NOT EXISTS wishlist (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user_account(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES product(id) ON DELETE CASCADE,
    UNIQUE(user_id, product_id)
);

CREATE INDEX IF NOT EXISTS idx_wishlist_user ON wishlist(user_id);
CREATE INDEX IF NOT EXISTS idx_wishlist_product ON wishlist(product_id);

-- Coupon
CREATE TABLE IF NOT EXISTS coupon (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT NOT NULL UNIQUE,
    discount_type TEXT NOT NULL,
    discount_value NUMERIC(10,2) NOT NULL,
    min_order_amount NUMERIC(10,2) DEFAULT 0.00,
    max_discount_amount NUMERIC(10,2),
    active INTEGER DEFAULT 1,
    start_date DATETIME,
    end_date DATETIME,
    usage_limit INTEGER,
    used_count INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Banner
CREATE TABLE IF NOT EXISTS banner (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    image TEXT NOT NULL,
    link TEXT,
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ProductReview
CREATE TABLE IF NOT EXISTS productreview (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    product_ids TEXT,
    order_id INTEGER NOT NULL,
    rating INTEGER NOT NULL,
    review TEXT,
    have_product_ids INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user_account(id) ON DELETE CASCADE,
    FOREIGN KEY (order_id) REFERENCES "order"(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_productreview_user ON productreview(user_id);
CREATE INDEX IF NOT EXISTS idx_productreview_order ON productreview(order_id);

-- ActivityLog
CREATE TABLE IF NOT EXISTS activitylog (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    action_type TEXT DEFAULT 'order',
    order_id INTEGER,
    action TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    performed_by_id INTEGER,
    FOREIGN KEY (order_id) REFERENCES "order"(id) ON DELETE SET NULL,
    FOREIGN KEY (performed_by_id) REFERENCES user_account(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_activitylog_order ON activitylog(order_id);
CREATE INDEX IF NOT EXISTS idx_activitylog_performed_by ON activitylog(performed_by_id);

-- End of schema
