# Hướng dẫn triển khai lên Vercel và Supabase

## Bước 1: Thiết lập Supabase Database

### 1.1. Truy cập Supabase Dashboard
- Đăng nhập vào https://supabase.com
- Chọn project: `yvgrqnhkkqauficaxpzl`

### 1.2. Chạy Migration Script
1. Vào **SQL Editor** trong Supabase Dashboard
2. Copy toàn bộ nội dung file `supabase-migration.sql`
3. Paste vào SQL Editor và chạy script
4. Kiểm tra các bảng đã được tạo thành công

### 1.3. Cấu hình Row Level Security (RLS)
Chạy các câu lệnh sau trong SQL Editor:

```sql
-- Enable RLS for all tables
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE website_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (adjust as needed)
CREATE POLICY "Allow public read access" ON products FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON categories FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users" ON customers FOR ALL USING (auth.uid() IS NOT NULL);
```

## Bước 2: Triển khai Backend lên Vercel

### 2.1. Chuẩn bị Repository
1. Tạo repository mới trên GitHub cho backend
2. Upload thư mục `backend` lên repository

### 2.2. Triển khai trên Vercel
1. Truy cập https://vercel.com
2. Đăng nhập và chọn "New Project"
3. Import repository backend từ GitHub
4. Cấu hình Environment Variables:

```
DATABASE_URL=postgresql://postgres:Tanpro1412@db.yvgrqnhkkqauficaxpzl.supabase.co:5432/postgres
JWT_SECRET=your_production_jwt_secret_key_make_it_very_secure_and_long_random_string_2024
JWT_EXPIRES_IN=24h
NODE_ENV=production
CORS_ORIGIN=https://your-frontend-app.vercel.app
SUPABASE_URL=https://yvgrqnhkkqauficaxpzl.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2Z3Jxbmhra3FhdWZpY2F4cHpsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMxOTkwNzUsImV4cCI6MjA2ODc3NTA3NX0.XVhkTngPxs2yg7LkPY5I5AMbjEoi0_NS7I8qk6uyADg
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2Z3Jxbmhra3FhdWZpY2F4cHpsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzE5OTA3NSwiZXhwIjoyMDY4Nzc1MDc1fQ.xYvWtcuSnqkcHqmQZC3Wck7UFF1YvISnzde6z9GNHu0
```

5. Deploy project

## Bước 3: Triển khai Frontend lên Vercel

### 3.1. Chuẩn bị Repository
1. Tạo repository mới trên GitHub cho frontend
2. Upload thư mục `frontend` lên repository

### 3.2. Cập nhật Environment Variables cho Frontend
Tạo file `.env.production` trong thư mục frontend:

```
VITE_API_URL=https://your-backend-app.vercel.app/api
VITE_SUPABASE_URL=https://yvgrqnhkkqauficaxpzl.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2Z3Jxbmhra3FhdWZpY2F4cHpsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMxOTkwNzUsImV4cCI6MjA2ODc3NTA3NX0.XVhkTngPxs2yg7LkPY5I5AMbjEoi0_NS7I8qk6uyADg
VITE_APP_NAME=Quản Lý Tiệm Bánh
```

### 3.3. Triển khai trên Vercel
1. Import repository frontend từ GitHub
2. Cấu hình Environment Variables (same as above)
3. Deploy project

## Bước 4: Cập nhật CORS và URLs

### 4.1. Cập nhật CORS_ORIGIN
Sau khi có URL frontend, cập nhật biến môi trường `CORS_ORIGIN` trong backend Vercel:
```
CORS_ORIGIN=https://your-frontend-app.vercel.app
```

### 4.2. Cập nhật VITE_API_URL
Sau khi có URL backend, cập nhật biến môi trường `VITE_API_URL` trong frontend Vercel:
```
VITE_API_URL=https://your-backend-app.vercel.app/api
```

## Bước 5: Test và Verify

### 5.1. Test Database Connection
- Truy cập backend URL + `/api/health` để kiểm tra kết nối database
- Kiểm tra logs trong Vercel Dashboard

### 5.2. Test Frontend
- Truy cập frontend URL
- Test đăng nhập/đăng ký
- Test các chức năng chính

## Lưu ý quan trọng

1. **Bảo mật**: Không commit file `.env` lên GitHub
2. **JWT Secret**: Sử dụng JWT secret mạnh cho production
3. **Database**: Backup database trước khi deploy
4. **Domain**: Có thể cấu hình custom domain sau khi deploy thành công

## Troubleshooting

### Lỗi Database Connection
- Kiểm tra DATABASE_URL có đúng không
- Kiểm tra password database
- Kiểm tra SSL configuration

### Lỗi CORS
- Kiểm tra CORS_ORIGIN có đúng URL frontend không
- Kiểm tra cấu hình CORS trong backend

### Lỗi Build
- Kiểm tra Node.js version
- Kiểm tra dependencies trong package.json
- Kiểm tra logs trong Vercel Dashboard
