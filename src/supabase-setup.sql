-- =============================================
-- Supabase Setup Script - Run after main migration
-- =============================================

-- Enable Row Level Security for all tables
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE website_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Create policies for public access
CREATE POLICY "Allow public read access to products" ON products FOR SELECT USING (true);
CREATE POLICY "Allow public read access to categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Allow public read access to website_settings" ON website_settings FOR SELECT USING (true);

-- Create policies for authenticated users
CREATE POLICY "Allow authenticated users full access to customers" ON customers FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Allow authenticated users to read orders" ON orders FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Allow authenticated users to read order_items" ON order_items FOR SELECT USING (auth.uid() IS NOT NULL);

-- Create policies for admin/staff (you'll need to implement proper role checking)
CREATE POLICY "Allow admin access to accounts" ON accounts FOR ALL USING (
  EXISTS (
    SELECT 1 FROM accounts 
    WHERE id = auth.uid()::int 
    AND role IN ('admin', 'manager')
  )
);

CREATE POLICY "Allow admin access to all orders" ON orders FOR ALL USING (
  EXISTS (
    SELECT 1 FROM accounts 
    WHERE id = auth.uid()::int 
    AND role IN ('admin', 'manager', 'staff')
  )
);

CREATE POLICY "Allow admin access to products" ON products FOR ALL USING (
  EXISTS (
    SELECT 1 FROM accounts 
    WHERE id = auth.uid()::int 
    AND role IN ('admin', 'manager', 'staff')
  )
);

CREATE POLICY "Allow admin access to categories" ON categories FOR ALL USING (
  EXISTS (
    SELECT 1 FROM accounts 
    WHERE id = auth.uid()::int 
    AND role IN ('admin', 'manager', 'staff')
  )
);

CREATE POLICY "Allow admin access to coupons" ON coupons FOR ALL USING (
  EXISTS (
    SELECT 1 FROM accounts 
    WHERE id = auth.uid()::int 
    AND role IN ('admin', 'manager')
  )
);

CREATE POLICY "Allow admin access to messages" ON messages FOR ALL USING (
  EXISTS (
    SELECT 1 FROM accounts 
    WHERE id = auth.uid()::int 
    AND role IN ('admin', 'manager', 'staff')
  )
);

CREATE POLICY "Allow admin access to website_settings" ON website_settings FOR ALL USING (
  EXISTS (
    SELECT 1 FROM accounts 
    WHERE id = auth.uid()::int 
    AND role IN ('admin', 'manager')
  )
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
CREATE INDEX IF NOT EXISTS idx_customers_status ON customers(status);

-- Insert default admin account (change password after first login)
INSERT INTO accounts (username, email, password, full_name, role, status) 
VALUES (
  'admin', 
  'admin@bakery.com', 
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- password: 'password'
  'System Administrator', 
  'admin', 
  'active'
) ON CONFLICT (username) DO NOTHING;

-- Insert default website settings
INSERT INTO website_settings (setting_key, setting_value, description) VALUES
('site_name', 'Quản Lý Tiệm Bánh', 'Tên website'),
('site_description', 'Hệ thống quản lý tiệm bánh ngọt', 'Mô tả website'),
('contact_email', 'contact@bakery.com', 'Email liên hệ'),
('contact_phone', '0123456789', 'Số điện thoại liên hệ'),
('address', '123 Đường ABC, Quận XYZ, TP.HCM', 'Địa chỉ tiệm bánh'),
('business_hours', 'Thứ 2 - Chủ nhật: 8:00 - 22:00', 'Giờ hoạt động'),
('delivery_fee', '30000', 'Phí giao hàng'),
('min_order_amount', '100000', 'Số tiền đặt hàng tối thiểu')
ON CONFLICT (setting_key) DO NOTHING;

-- Insert sample categories
INSERT INTO categories (name, description, image_url, status) VALUES
('Bánh Sinh Nhật', 'Các loại bánh sinh nhật đặc biệt', '/images/categories/birthday-cake.jpg', 'active'),
('Bánh Ngọt', 'Bánh ngọt hàng ngày', '/images/categories/pastry.jpg', 'active'),
('Bánh Mì', 'Các loại bánh mì tươi ngon', '/images/categories/bread.jpg', 'active'),
('Đồ Uống', 'Cà phê, trà và các đồ uống khác', '/images/categories/drinks.jpg', 'active')
ON CONFLICT (name) DO NOTHING;
