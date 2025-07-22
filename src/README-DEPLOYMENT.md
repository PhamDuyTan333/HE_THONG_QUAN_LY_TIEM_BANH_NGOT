# Hướng dẫn triển khai Hệ thống Quản lý Tiệm Bánh

## Tổng quan
Hệ thống bao gồm:
- **Frontend**: React + Vite
- **Backend**: Node.js + Express
- **Database**: PostgreSQL (Supabase)
- **Deployment**: Vercel

## Thông tin Supabase đã cấu hình
- **Project URL**: https://yvgrqnhkkqauficaxpzl.supabase.co
- **Database Password**: Tanpro1412
- **Anon Key**: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2Z3Jxbmhra3FhdWZpY2F4cHpsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMxOTkwNzUsImV4cCI6MjA2ODc3NTA3NX0.XVhkTngPxs2yg7LkPY5I5AMbjEoi0_NS7I8qk6uyADg

## Các bước triển khai

### 1. Thiết lập Database trên Supabase

#### 1.1. Chạy Migration Script
1. Truy cập [Supabase Dashboard](https://supabase.com/dashboard)
2. Chọn project `yvgrqnhkkqauficaxpzl`
3. Vào **SQL Editor**
4. Copy và chạy nội dung file `supabase-migration.sql`
5. Chạy tiếp file `supabase-setup.sql` để cấu hình RLS và policies

#### 1.2. Kiểm tra kết nối
```bash
cd src
node test-supabase-connection.js
```

### 2. Triển khai Backend lên Vercel

#### 2.1. Chuẩn bị
1. Tạo repository GitHub mới cho backend
2. Copy thư mục `backend` vào repository
3. Commit và push code

#### 2.2. Deploy trên Vercel
1. Truy cập [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import repository backend
4. Cấu hình Environment Variables:

```
DATABASE_URL=postgresql://postgres:Tanpro1412@db.yvgrqnhkkqauficaxpzl.supabase.co:5432/postgres
JWT_SECRET=bakery_management_system_jwt_secret_2024_very_secure_key
JWT_EXPIRES_IN=24h
NODE_ENV=production
CORS_ORIGIN=https://your-frontend-domain.vercel.app
SUPABASE_URL=https://yvgrqnhkkqauficaxpzl.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2Z3Jxbmhra3FhdWZpY2F4cHpsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMxOTkwNzUsImV4cCI6MjA2ODc3NTA3NX0.XVhkTngPxs2yg7LkPY5I5AMbjEoi0_NS7I8qk6uyADg
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2Z3Jxbmhra3FhdWZpY2F4cHpsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzE5OTA3NSwiZXhwIjoyMDY4Nzc1MDc1fQ.xYvWtcuSnqkcHqmQZC3Wck7UFF1YvISnzde6z9GNHu0
```

5. Deploy project

### 3. Triển khai Frontend lên Vercel

#### 3.1. Chuẩn bị
1. Tạo repository GitHub mới cho frontend
2. Copy thư mục `frontend` vào repository
3. Cập nhật file `.env.production` với URL backend thực tế
4. Commit và push code

#### 3.2. Deploy trên Vercel
1. Import repository frontend
2. Cấu hình Environment Variables:

```
VITE_API_URL=https://your-backend-domain.vercel.app/api
VITE_SUPABASE_URL=https://yvgrqnhkkqauficaxpzl.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2Z3Jxbmhra3FhdWZpY2F4cHpsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMxOTkwNzUsImV4cCI6MjA2ODc3NTA3NX0.XVhkTngPxs2yg7LkPY5I5AMbjEoi0_NS7I8qk6uyADg
VITE_APP_NAME=Quản Lý Tiệm Bánh
```

3. Deploy project

### 4. Cập nhật Cross-References

#### 4.1. Cập nhật CORS trong Backend
Sau khi có URL frontend, cập nhật `CORS_ORIGIN` trong Vercel Environment Variables của backend.

#### 4.2. Cập nhật API URL trong Frontend
Sau khi có URL backend, cập nhật `VITE_API_URL` trong Vercel Environment Variables của frontend.

### 5. Testing và Verification

#### 5.1. Test Backend
- Truy cập: `https://your-backend-domain.vercel.app/api/health`
- Kiểm tra response: `{"status": "OK", "database": "connected"}`

#### 5.2. Test Frontend
- Truy cập frontend URL
- Test đăng nhập với tài khoản admin:
  - Username: `admin`
  - Password: `password`
- Test các chức năng chính

## Tài khoản mặc định

### Admin Account
- **Username**: admin
- **Email**: admin@bakery.com
- **Password**: password (đổi ngay sau lần đăng nhập đầu tiên)

## Troubleshooting

### Database Connection Issues
1. Kiểm tra DATABASE_URL có đúng format không
2. Kiểm tra password database: `Tanpro1412`
3. Kiểm tra SSL configuration

### CORS Issues
1. Kiểm tra CORS_ORIGIN có đúng URL frontend không
2. Đảm bảo không có trailing slash

### Build Issues
1. Kiểm tra Node.js version >= 18
2. Kiểm tra tất cả dependencies đã được install
3. Kiểm tra environment variables

## Bảo mật

1. **Đổi password admin** ngay sau lần đăng nhập đầu tiên
2. **Tạo JWT secret mạnh** cho production
3. **Không commit file .env** lên repository
4. **Cấu hình RLS policies** phù hợp với yêu cầu bảo mật

## Monitoring

1. Kiểm tra logs trong Vercel Dashboard
2. Monitor database usage trong Supabase Dashboard
3. Set up alerts cho errors và performance issues

## Backup

1. Backup database định kỳ từ Supabase Dashboard
2. Backup source code trên GitHub
3. Export environment variables để backup cấu hình
