-- =============================================
-- Supabase PostgreSQL Migration Script
-- Quản Lý Tiệm Bánh Database Schema
-- =============================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- =============================================
-- 1. ACCOUNTS TABLE (Admin/Staff Management)
-- =============================================
DROP TABLE IF EXISTS accounts CASCADE;
CREATE TABLE accounts (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'manager', 'staff')),
    phone VARCHAR(15),
    avatar VARCHAR(500),
    last_login TIMESTAMP,
    login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'banned', 'pending'))
);

-- Create indexes for accounts
CREATE INDEX idx_accounts_username ON accounts(username);
CREATE INDEX idx_accounts_email ON accounts(email);
CREATE INDEX idx_accounts_role ON accounts(role);
CREATE INDEX idx_accounts_status ON accounts(status);
CREATE INDEX idx_accounts_created_at ON accounts(created_at);

-- Set starting sequence value
ALTER SEQUENCE accounts_id_seq RESTART WITH 1000;

-- =============================================
-- 2. CUSTOMERS TABLE
-- =============================================
DROP TABLE IF EXISTS customers CASCADE;
CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(15),
    address TEXT,
    date_of_birth DATE,
    gender VARCHAR(10) CHECK (gender IN ('male', 'female', 'other')),
    avatar VARCHAR(500),
    email_verified BOOLEAN DEFAULT FALSE,
    phone_verified BOOLEAN DEFAULT FALSE,
    last_login TIMESTAMP,
    login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'banned', 'pending'))
);

-- Create indexes for customers
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_customers_phone ON customers(phone);
CREATE INDEX idx_customers_status ON customers(status);
CREATE INDEX idx_customers_created_at ON customers(created_at);
CREATE INDEX idx_customers_full_name ON customers(full_name);

-- Set starting sequence value
ALTER SEQUENCE customers_id_seq RESTART WITH 10000;

-- =============================================
-- 3. CATEGORIES TABLE
-- =============================================
DROP TABLE IF EXISTS categories CASCADE;
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    image VARCHAR(500),
    parent_id INTEGER NULL,
    sort_order INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive'))
);

-- Create indexes for categories
CREATE INDEX idx_categories_name ON categories(name);
CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_parent_id ON categories(parent_id);
CREATE INDEX idx_categories_status ON categories(status);
CREATE INDEX idx_categories_sort_order ON categories(sort_order);
CREATE INDEX idx_categories_is_featured ON categories(is_featured);

-- Add foreign key constraint
ALTER TABLE categories ADD CONSTRAINT fk_categories_parent 
    FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL;

-- =============================================
-- 4. PRODUCTS TABLE
-- =============================================
DROP TABLE IF EXISTS products CASCADE;
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    short_description VARCHAR(500),
    sku VARCHAR(100) UNIQUE,
    price DECIMAL(10,2) NOT NULL,
    sale_price DECIMAL(10,2) NULL,
    cost_price DECIMAL(10,2) NULL,
    stock_quantity INTEGER DEFAULT 0,
    min_stock_level INTEGER DEFAULT 0,
    weight DECIMAL(8,2) NULL,
    dimensions VARCHAR(100) NULL,
    category_id INTEGER NOT NULL,
    featured_image VARCHAR(500),
    gallery TEXT, -- JSON array of image URLs
    ingredients TEXT,
    nutritional_info TEXT, -- JSON object
    allergen_info TEXT,
    preparation_time INTEGER NULL, -- in minutes
    shelf_life INTEGER NULL, -- in days
    storage_instructions TEXT,
    is_featured BOOLEAN DEFAULT FALSE,
    is_bestseller BOOLEAN DEFAULT FALSE,
    view_count INTEGER DEFAULT 0,
    rating_average DECIMAL(3,2) DEFAULT 0.00,
    rating_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'out_of_stock', 'discontinued'))
);

-- Create indexes for products
CREATE INDEX idx_products_name ON products(name);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_stock_quantity ON products(stock_quantity);
CREATE INDEX idx_products_is_featured ON products(is_featured);
CREATE INDEX idx_products_is_bestseller ON products(is_bestseller);
CREATE INDEX idx_products_rating_average ON products(rating_average);
CREATE INDEX idx_products_created_at ON products(created_at);

-- Add foreign key constraint
ALTER TABLE products ADD CONSTRAINT fk_products_category
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT;

-- =============================================
-- 5. ORDERS TABLE
-- =============================================
DROP TABLE IF EXISTS orders CASCADE;
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    customer_id INTEGER NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(15) NOT NULL,
    customer_address TEXT NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    tax_amount DECIMAL(10,2) DEFAULT 0.00,
    discount_amount DECIMAL(10,2) DEFAULT 0.00,
    shipping_amount DECIMAL(10,2) DEFAULT 0.00,
    total_amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(20) NOT NULL CHECK (payment_method IN ('cash', 'card', 'bank_transfer', 'e_wallet')),
    payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
    delivery_method VARCHAR(20) NOT NULL CHECK (delivery_method IN ('pickup', 'delivery')),
    delivery_date DATE NULL,
    delivery_time VARCHAR(20) NULL,
    delivery_notes TEXT,
    coupon_code VARCHAR(50) NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'preparing', 'ready', 'delivering', 'delivered', 'cancelled'))
);

-- Create indexes for orders
CREATE INDEX idx_orders_order_number ON orders(order_number);
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_orders_customer_email ON orders(customer_email);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_payment_status ON orders(payment_status);
CREATE INDEX idx_orders_delivery_method ON orders(delivery_method);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_orders_delivery_date ON orders(delivery_date);

-- Set starting sequence value
ALTER SEQUENCE orders_id_seq RESTART WITH 100000;

-- Add foreign key constraint
ALTER TABLE orders ADD CONSTRAINT fk_orders_customer
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE RESTRICT;

-- =============================================
-- 6. ORDER_ITEMS TABLE
-- =============================================
DROP TABLE IF EXISTS order_items CASCADE;
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    product_sku VARCHAR(100),
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    product_options TEXT, -- JSON for customizations
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for order_items
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);

-- Add foreign key constraints
ALTER TABLE order_items ADD CONSTRAINT fk_order_items_order
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE;
ALTER TABLE order_items ADD CONSTRAINT fk_order_items_product
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT;

-- =============================================
-- 7. COUPONS TABLE
-- =============================================
DROP TABLE IF EXISTS coupons CASCADE;
CREATE TABLE coupons (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(20) NOT NULL CHECK (type IN ('percentage', 'fixed_amount')),
    value DECIMAL(10,2) NOT NULL,
    minimum_amount DECIMAL(10,2) DEFAULT 0.00,
    maximum_discount DECIMAL(10,2) NULL,
    usage_limit INTEGER NULL,
    used_count INTEGER DEFAULT 0,
    usage_limit_per_customer INTEGER DEFAULT 1,
    valid_from TIMESTAMP NOT NULL,
    valid_until TIMESTAMP NOT NULL,
    applicable_products TEXT, -- JSON array of product IDs
    applicable_categories TEXT, -- JSON array of category IDs
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'expired'))
);

-- Create indexes for coupons
CREATE INDEX idx_coupons_code ON coupons(code);
CREATE INDEX idx_coupons_status ON coupons(status);
CREATE INDEX idx_coupons_valid_from ON coupons(valid_from);
CREATE INDEX idx_coupons_valid_until ON coupons(valid_until);
CREATE INDEX idx_coupons_type ON coupons(type);

-- =============================================
-- 8. COUPON_USAGE TABLE
-- =============================================
DROP TABLE IF EXISTS coupon_usage CASCADE;
CREATE TABLE coupon_usage (
    id SERIAL PRIMARY KEY,
    coupon_id INTEGER NOT NULL,
    customer_id INTEGER NOT NULL,
    order_id INTEGER NOT NULL,
    discount_amount DECIMAL(10,2) NOT NULL,
    used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for coupon_usage
CREATE INDEX idx_coupon_usage_coupon_id ON coupon_usage(coupon_id);
CREATE INDEX idx_coupon_usage_customer_id ON coupon_usage(customer_id);
CREATE INDEX idx_coupon_usage_order_id ON coupon_usage(order_id);
CREATE INDEX idx_coupon_usage_used_at ON coupon_usage(used_at);

-- Add foreign key constraints and unique constraint
ALTER TABLE coupon_usage ADD CONSTRAINT fk_coupon_usage_coupon
    FOREIGN KEY (coupon_id) REFERENCES coupons(id) ON DELETE CASCADE;
ALTER TABLE coupon_usage ADD CONSTRAINT fk_coupon_usage_customer
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE;
ALTER TABLE coupon_usage ADD CONSTRAINT fk_coupon_usage_order
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE;
ALTER TABLE coupon_usage ADD CONSTRAINT unique_coupon_order
    UNIQUE (coupon_id, order_id);

-- =============================================
-- 9. MESSAGES TABLE
-- =============================================
DROP TABLE IF EXISTS messages CASCADE;
CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(15),
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(20) DEFAULT 'contact' CHECK (type IN ('contact', 'complaint', 'suggestion', 'order_inquiry')),
    order_id INTEGER NULL,
    replied_by INTEGER NULL,
    reply_message TEXT NULL,
    replied_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'closed'))
);

-- Create indexes for messages
CREATE INDEX idx_messages_customer_id ON messages(customer_id);
CREATE INDEX idx_messages_customer_email ON messages(customer_email);
CREATE INDEX idx_messages_status ON messages(status);
CREATE INDEX idx_messages_type ON messages(type);
CREATE INDEX idx_messages_created_at ON messages(created_at);
CREATE INDEX idx_messages_order_id ON messages(order_id);

-- Add foreign key constraints
ALTER TABLE messages ADD CONSTRAINT fk_messages_customer
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL;
ALTER TABLE messages ADD CONSTRAINT fk_messages_order
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL;
ALTER TABLE messages ADD CONSTRAINT fk_messages_replied_by
    FOREIGN KEY (replied_by) REFERENCES accounts(id) ON DELETE SET NULL;

-- =============================================
-- 10. WEBSITE_SETTINGS TABLE
-- =============================================
DROP TABLE IF EXISTS website_settings CASCADE;
CREATE TABLE website_settings (
    id SERIAL PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    setting_type VARCHAR(20) DEFAULT 'text' CHECK (setting_type IN ('text', 'number', 'boolean', 'json', 'image')),
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for website_settings
CREATE INDEX idx_website_settings_setting_key ON website_settings(setting_key);
CREATE INDEX idx_website_settings_is_public ON website_settings(is_public);

-- =============================================
-- 11. PRODUCT_REVIEWS TABLE
-- =============================================
DROP TABLE IF EXISTS product_reviews CASCADE;
CREATE TABLE product_reviews (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL,
    customer_id INTEGER NOT NULL,
    order_id INTEGER NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255),
    review_text TEXT,
    is_verified_purchase BOOLEAN DEFAULT FALSE,
    helpful_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected'))
);

-- Create indexes for product_reviews
CREATE INDEX idx_product_reviews_product_id ON product_reviews(product_id);
CREATE INDEX idx_product_reviews_customer_id ON product_reviews(customer_id);
CREATE INDEX idx_product_reviews_rating ON product_reviews(rating);
CREATE INDEX idx_product_reviews_status ON product_reviews(status);
CREATE INDEX idx_product_reviews_created_at ON product_reviews(created_at);

-- Add foreign key constraints and unique constraint
ALTER TABLE product_reviews ADD CONSTRAINT fk_product_reviews_product
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE;
ALTER TABLE product_reviews ADD CONSTRAINT fk_product_reviews_customer
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE;
ALTER TABLE product_reviews ADD CONSTRAINT fk_product_reviews_order
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL;
ALTER TABLE product_reviews ADD CONSTRAINT unique_customer_product_order
    UNIQUE (customer_id, product_id, order_id);

-- =============================================
-- 12. INVENTORY_LOGS TABLE
-- =============================================
DROP TABLE IF EXISTS inventory_logs CASCADE;
CREATE TABLE inventory_logs (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('in', 'out', 'adjustment')),
    quantity INTEGER NOT NULL,
    previous_stock INTEGER NOT NULL,
    new_stock INTEGER NOT NULL,
    reason VARCHAR(255),
    reference_type VARCHAR(20) NULL CHECK (reference_type IN ('order', 'purchase', 'adjustment', 'return')),
    reference_id INTEGER NULL,
    created_by INTEGER NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for inventory_logs
CREATE INDEX idx_inventory_logs_product_id ON inventory_logs(product_id);
CREATE INDEX idx_inventory_logs_type ON inventory_logs(type);
CREATE INDEX idx_inventory_logs_created_at ON inventory_logs(created_at);
CREATE INDEX idx_inventory_logs_reference_type ON inventory_logs(reference_type);
CREATE INDEX idx_inventory_logs_reference_id ON inventory_logs(reference_id);

-- Add foreign key constraints
ALTER TABLE inventory_logs ADD CONSTRAINT fk_inventory_logs_product
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE;
ALTER TABLE inventory_logs ADD CONSTRAINT fk_inventory_logs_created_by
    FOREIGN KEY (created_by) REFERENCES accounts(id) ON DELETE SET NULL;

-- =============================================
-- 13. AUDIT_LOGS TABLE
-- =============================================
DROP TABLE IF EXISTS audit_logs CASCADE;
CREATE TABLE audit_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NULL,
    user_type VARCHAR(20) NOT NULL CHECK (user_type IN ('account', 'customer')),
    action VARCHAR(100) NOT NULL,
    table_name VARCHAR(100) NOT NULL,
    record_id INTEGER NULL,
    old_values TEXT NULL, -- JSON
    new_values TEXT NULL, -- JSON
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for audit_logs
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_user_type ON audit_logs(user_type);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_table_name ON audit_logs(table_name);
CREATE INDEX idx_audit_logs_record_id ON audit_logs(record_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);

-- =============================================
-- SAMPLE DATA INSERTION
-- =============================================

-- Insert default accounts (Passwords: admin123, quanly123, nhanvien123)
INSERT INTO accounts (username, email, password, full_name, role, phone, created_at, status) VALUES
('admin', 'admin@tiembanh.com', '$2b$10$Ub9FTueIVuElKxzxpxMpvedLW9sysC2HqFOcj0wiQJ/oodd6WoU7K', 'Quản Trị Viên', 'admin', '0123456789', NOW(), 'active'),
('quanly', 'quanly@tiembanh.com', '$2b$10$fY7mfsFi5QcAXRkwymaRuOFNrZIQl50LCB4C3ta3WCGw44eY.W5S2', 'Quản Lý Cửa Hàng', 'manager', '0123456790', NOW(), 'active'),
('nhanvien1', 'nhanvien1@tiembanh.com', '$2b$10$evrjT7SiPAtFTqnAbfIfPulh/YH86Bog8.wwHWGY9e6J.YWEAtEsW', 'Nhân Viên Bán Hàng 1', 'staff', '0123456791', NOW(), 'active'),
('nhanvien2', 'nhanvien2@tiembanh.com', '$2b$10$evrjT7SiPAtFTqnAbfIfPulh/YH86Bog8.wwHWGY9e6J.YWEAtEsW', 'Nhân Viên Bán Hàng 2', 'staff', '0123456792', NOW(), 'active'),
('nhanvien3', 'nhanvien3@tiembanh.com', '$2b$10$evrjT7SiPAtFTqnAbfIfPulh/YH86Bog8.wwHWGY9e6J.YWEAtEsW', 'Nhân Viên Bán Hàng 3', 'staff', '0123456793', NOW(), 'active');

-- Insert sample categories
INSERT INTO categories (name, slug, description, sort_order, is_featured, status) VALUES
('Bánh Ngọt', 'banh-ngot', 'Các loại bánh ngọt thơm ngon', 1, TRUE, 'active'),
('Bánh Mì', 'banh-mi', 'Bánh mì tươi ngon hàng ngày', 2, TRUE, 'active'),
('Bánh Kem', 'banh-kem', 'Bánh kem sinh nhật và sự kiện', 3, TRUE, 'active'),
('Đồ Uống', 'do-uong', 'Các loại đồ uống giải khát', 4, FALSE, 'active'),
('Bánh Quy', 'banh-quy', 'Bánh quy giòn tan', 5, FALSE, 'active');

-- Insert sample products
INSERT INTO products (name, slug, description, short_description, sku, price, sale_price, stock_quantity, category_id, is_featured, status) VALUES
('Bánh Tiramisu', 'banh-tiramisu', 'Bánh Tiramisu Ý truyền thống với hương vị cà phê đậm đà', 'Bánh Tiramisu Ý truyền thống', 'CAKE001', 250000, 220000, 20, 1, TRUE, 'active'),
('Bánh Red Velvet', 'banh-red-velvet', 'Bánh Red Velvet mềm mịn với lớp kem cheese thơm ngon', 'Bánh Red Velvet mềm mịn', 'CAKE002', 280000, NULL, 15, 1, TRUE, 'active'),
('Bánh Mì Việt Nam', 'banh-mi-viet-nam', 'Bánh mì Việt Nam truyền thống với nhân thịt nguội', 'Bánh mì Việt Nam truyền thống', 'BREAD001', 25000, NULL, 50, 2, FALSE, 'active'),
('Bánh Kem Sinh Nhật', 'banh-kem-sinh-nhat', 'Bánh kem sinh nhật tùy chỉnh theo yêu cầu', 'Bánh kem sinh nhật tùy chỉnh', 'BIRTHDAY001', 350000, 320000, 10, 3, TRUE, 'active'),
('Cà Phê Đen', 'ca-phe-den', 'Cà phê đen nguyên chất hương vị đậm đà', 'Cà phê đen nguyên chất', 'DRINK001', 20000, NULL, 100, 4, FALSE, 'active');

-- Insert sample customers (Password: customer123)
INSERT INTO customers (email, password, full_name, phone, address, status) VALUES
('customer1@gmail.com', '$2b$10$evrjT7SiPAtFTqnAbfIfPulh/YH86Bog8.wwHWGY9e6J.YWEAtEsW', 'Nguyễn Văn A', '0987654321', '123 Đường ABC, Quận 1, TP.HCM', 'active'),
('customer2@gmail.com', '$2b$10$evrjT7SiPAtFTqnAbfIfPulh/YH86Bog8.wwHWGY9e6J.YWEAtEsW', 'Trần Thị B', '0987654322', '456 Đường DEF, Quận 2, TP.HCM', 'active'),
('customer3@gmail.com', '$2b$10$evrjT7SiPAtFTqnAbfIfPulh/YH86Bog8.wwHWGY9e6J.YWEAtEsW', 'Lê Văn C', '0987654323', '789 Đường GHI, Quận 3, TP.HCM', 'active');

-- Insert website settings
INSERT INTO website_settings (setting_key, setting_value, setting_type, description, is_public) VALUES
('site_name', 'Tiệm Bánh Ngọt', 'text', 'Tên website', TRUE),
('site_description', 'Tiệm bánh ngọt chất lượng cao', 'text', 'Mô tả website', TRUE),
('contact_email', 'contact@tiembanh.com', 'text', 'Email liên hệ', TRUE),
('contact_phone', '0123456789', 'text', 'Số điện thoại liên hệ', TRUE),
('contact_address', '123 Đường ABC, Quận 1, TP.HCM', 'text', 'Địa chỉ liên hệ', TRUE),
('business_hours', '{"monday": "8:00-22:00", "tuesday": "8:00-22:00", "wednesday": "8:00-22:00", "thursday": "8:00-22:00", "friday": "8:00-22:00", "saturday": "8:00-22:00", "sunday": "8:00-20:00"}', 'json', 'Giờ hoạt động', TRUE),
('delivery_fee', '20000', 'number', 'Phí giao hàng', TRUE),
('free_delivery_threshold', '200000', 'number', 'Miễn phí giao hàng từ', TRUE),
('tax_rate', '10', 'number', 'Thuế VAT (%)', FALSE),
('currency', 'VND', 'text', 'Đơn vị tiền tệ', TRUE);

-- Insert sample coupons
INSERT INTO coupons (code, name, description, type, value, minimum_amount, usage_limit, valid_from, valid_until, status) VALUES
('WELCOME10', 'Chào mừng khách hàng mới', 'Giảm 10% cho đơn hàng đầu tiên', 'percentage', 10.00, 100000, 100, NOW(), NOW() + INTERVAL '30 days', 'active'),
('FREESHIP', 'Miễn phí giao hàng', 'Miễn phí giao hàng cho đơn từ 150k', 'fixed_amount', 20000, 150000, 200, NOW(), NOW() + INTERVAL '60 days', 'active');

-- =============================================
-- FUNCTIONS AND TRIGGERS
-- =============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at trigger to all tables that have updated_at column
CREATE TRIGGER update_accounts_updated_at BEFORE UPDATE ON accounts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_coupons_updated_at BEFORE UPDATE ON coupons
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_messages_updated_at BEFORE UPDATE ON messages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_website_settings_updated_at BEFORE UPDATE ON website_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_product_reviews_updated_at BEFORE UPDATE ON product_reviews
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update product rating when review is added/updated
CREATE OR REPLACE FUNCTION update_product_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE products
    SET
        rating_average = (
            SELECT COALESCE(AVG(rating), 0)
            FROM product_reviews
            WHERE product_id = COALESCE(NEW.product_id, OLD.product_id) AND status = 'approved'
        ),
        rating_count = (
            SELECT COUNT(*)
            FROM product_reviews
            WHERE product_id = COALESCE(NEW.product_id, OLD.product_id) AND status = 'approved'
        )
    WHERE id = COALESCE(NEW.product_id, OLD.product_id);

    RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

-- Apply rating update triggers
CREATE TRIGGER update_product_rating_after_review_insert
    AFTER INSERT ON product_reviews
    FOR EACH ROW EXECUTE FUNCTION update_product_rating();

CREATE TRIGGER update_product_rating_after_review_update
    AFTER UPDATE ON product_reviews
    FOR EACH ROW EXECUTE FUNCTION update_product_rating();

CREATE TRIGGER update_product_rating_after_review_delete
    AFTER DELETE ON product_reviews
    FOR EACH ROW EXECUTE FUNCTION update_product_rating();

-- Function to update stock quantity when order item is created
CREATE OR REPLACE FUNCTION update_stock_after_order()
RETURNS TRIGGER AS $$
DECLARE
    old_stock INTEGER;
BEGIN
    -- Get current stock
    SELECT stock_quantity INTO old_stock FROM products WHERE id = NEW.product_id;

    -- Update stock quantity
    UPDATE products
    SET stock_quantity = stock_quantity - NEW.quantity
    WHERE id = NEW.product_id;

    -- Log inventory change
    INSERT INTO inventory_logs (product_id, type, quantity, previous_stock, new_stock, reason, reference_type, reference_id)
    VALUES (
        NEW.product_id,
        'out',
        NEW.quantity,
        old_stock,
        old_stock - NEW.quantity,
        'Order sale',
        'order',
        NEW.order_id
    );

    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply stock update trigger
CREATE TRIGGER update_stock_after_order_item_insert
    AFTER INSERT ON order_items
    FOR EACH ROW EXECUTE FUNCTION update_stock_after_order();

-- =============================================
-- VIEWS FOR REPORTING
-- =============================================

-- Order summary view
CREATE OR REPLACE VIEW order_summary AS
SELECT
    DATE(created_at) as order_date,
    COUNT(*) as total_orders,
    SUM(total_amount) as total_revenue,
    AVG(total_amount) as average_order_value,
    COUNT(CASE WHEN status = 'delivered' THEN 1 END) as completed_orders,
    COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled_orders
FROM orders
GROUP BY DATE(created_at)
ORDER BY order_date DESC;

-- Product performance view
CREATE OR REPLACE VIEW product_performance AS
SELECT
    p.id,
    p.name,
    p.price,
    p.stock_quantity,
    COALESCE(SUM(oi.quantity), 0) as total_sold,
    COALESCE(SUM(oi.total_price), 0) as total_revenue,
    p.view_count,
    p.rating_average,
    p.rating_count
FROM products p
LEFT JOIN order_items oi ON p.id = oi.product_id
LEFT JOIN orders o ON oi.order_id = o.id AND o.status = 'delivered'
GROUP BY p.id, p.name, p.price, p.stock_quantity, p.view_count, p.rating_average, p.rating_count
ORDER BY total_sold DESC;

-- =============================================
-- ADDITIONAL INDEXES FOR PERFORMANCE
-- =============================================

-- Composite indexes for common queries
CREATE INDEX idx_orders_customer_status ON orders(customer_id, status);
CREATE INDEX idx_orders_date_status ON orders(created_at, status);
CREATE INDEX idx_products_category_status ON products(category_id, status);
CREATE INDEX idx_products_featured_status ON products(is_featured, status);
CREATE INDEX idx_order_items_order_product ON order_items(order_id, product_id);

-- Text search indexes using PostgreSQL's full-text search
CREATE INDEX idx_products_search ON products USING gin(to_tsvector('english', name || ' ' || COALESCE(description, '') || ' ' || COALESCE(short_description, '')));
CREATE INDEX idx_customers_search ON customers USING gin(to_tsvector('english', full_name || ' ' || email));

-- =============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================

-- Enable RLS on sensitive tables
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies (can be customized based on requirements)
-- Allow authenticated users to read public data
CREATE POLICY "Allow public read access to products" ON products FOR SELECT USING (status = 'active');
CREATE POLICY "Allow public read access to categories" ON categories FOR SELECT USING (status = 'active');
CREATE POLICY "Allow public read access to website_settings" ON website_settings FOR SELECT USING (is_public = true);

-- Allow customers to access their own data
CREATE POLICY "Customers can view own data" ON customers FOR SELECT USING (auth.uid()::text = id::text);
CREATE POLICY "Customers can update own data" ON customers FOR UPDATE USING (auth.uid()::text = id::text);

-- Allow customers to view their own orders
CREATE POLICY "Customers can view own orders" ON orders FOR SELECT USING (auth.uid()::text = customer_id::text);

-- Allow customers to create their own messages
CREATE POLICY "Customers can create messages" ON messages FOR INSERT WITH CHECK (auth.uid()::text = customer_id::text);
CREATE POLICY "Customers can view own messages" ON messages FOR SELECT USING (auth.uid()::text = customer_id::text);

-- =============================================
-- COMPLETION MESSAGE
-- =============================================
-- Migration completed successfully!
-- Next steps:
-- 1. Run this script in your Supabase SQL editor
-- 2. Update your backend configuration to use PostgreSQL
-- 3. Test all functionality
-- 4. Deploy to production
