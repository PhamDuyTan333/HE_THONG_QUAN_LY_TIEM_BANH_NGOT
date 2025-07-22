# Hướng Dẫn Triển Khai Ứng Dụng Quản Lý Tiệm Bánh

## Tổng Quan
Hướng dẫn này sẽ giúp bạn triển khai ứng dụng quản lý tiệm bánh lên:
- **Database**: Supabase (PostgreSQL)
- **Backend**: Vercel Serverless Functions
- **Frontend**: Vercel Static Hosting

## Bước 1: Thiết Lập Supabase Database

### 1.1 Tạo Project Supabase
1. Truy cập [supabase.com](https://supabase.com)
2. Đăng ký/Đăng nhập tài khoản
3. Tạo project mới:
   - Project name: `tiem-banh-ngot`
   - Database password: Tạo password mạnh
   - Region: Chọn gần nhất với người dùng

### 1.2 Chạy Migration Script
1. Vào Supabase Dashboard → SQL Editor
2. Copy nội dung file `supabase-migration.sql`
3. Paste vào SQL Editor và chạy
4. Kiểm tra các bảng đã được tạo thành công

### 1.3 Lấy Thông Tin Kết Nối
Từ Supabase Dashboard → Settings → Database:
- Host: `db.supabase.co`
- Database name: `postgres`
- Port: `5432`
- User: `postgres`
- Password: [password bạn đã tạo]

Từ Settings → API:
- Project URL: `https://your-project-id.supabase.co`
- Anon key: `eyJ...`
- Service role key: `eyJ...`

## Bước 2: Deploy Backend lên Vercel

### 2.1 Chuẩn Bị Backend
1. Mở terminal trong thư mục `src/backend`
2. Cài đặt dependencies:
```bash
npm install
```

3. Tạo file `.env` từ `.env.example`:
```bash
cp .env.example .env
```

4. Cập nhật file `.env` với thông tin Supabase:
```env
# Supabase Database Configuration
DB_HOST=db.supabase.co
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_supabase_password
DB_NAME=postgres

# Supabase Configuration
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=3000
NODE_ENV=production

# CORS Configuration
FRONTEND_URL=https://your-frontend-domain.vercel.app
```

### 2.2 Deploy Backend
1. Cài đặt Vercel CLI:
```bash
npm install -g vercel
```

2. Login vào Vercel:
```bash
vercel login
```

3. Deploy backend:
```bash
cd src/backend
vercel
```

4. Làm theo hướng dẫn:
   - Set up and deploy: `Y`
   - Which scope: Chọn account của bạn
   - Link to existing project: `N`
   - Project name: `tiem-banh-backend`
   - Directory: `./` (current directory)

5. Thêm environment variables trên Vercel Dashboard:
   - Vào project → Settings → Environment Variables
   - Thêm tất cả variables từ file `.env`

### 2.3 Kiểm Tra Backend
- URL backend: `https://tiem-banh-backend.vercel.app`
- Test endpoint: `https://tiem-banh-backend.vercel.app/api/health`

## Bước 3: Deploy Frontend lên Vercel

### 3.1 Chuẩn Bị Frontend
1. Mở terminal trong thư mục `src/frontend`
2. Cài đặt dependencies:
```bash
npm install
```

3. Tạo file `.env` từ `.env.example`:
```bash
cp .env.example .env
```

4. Cập nhật file `.env`:
```env
# API Configuration
VITE_API_URL=http://localhost:3000/api
VITE_API_URL_PRODUCTION=https://tiem-banh-backend.vercel.app/api

# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# App Configuration
VITE_APP_NAME=Tiệm Bánh Ngọt
VITE_APP_VERSION=1.0.0
```

### 3.2 Deploy Frontend
1. Deploy frontend:
```bash
cd src/frontend
vercel
```

2. Làm theo hướng dẫn:
   - Set up and deploy: `Y`
   - Which scope: Chọn account của bạn
   - Link to existing project: `N`
   - Project name: `tiem-banh-frontend`
   - Directory: `./` (current directory)

3. Thêm environment variables trên Vercel Dashboard:
   - Vào project → Settings → Environment Variables
   - Thêm tất cả variables từ file `.env`

### 3.3 Cấu Hình Domain (Tùy Chọn)
1. Vào Vercel Dashboard → Project → Settings → Domains
2. Thêm custom domain nếu có
3. Cập nhật DNS records theo hướng dẫn

## Bước 4: Cấu Hình CORS và Security

### 4.1 Cập Nhật CORS
Trong backend, cập nhật CORS origin với domain frontend thực tế:
```javascript
// server.js
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://your-frontend-domain.vercel.app'
  ],
  credentials: true
}));
```

### 4.2 Cấu Hình Supabase RLS (Row Level Security)
1. Vào Supabase Dashboard → Authentication → Settings
2. Bật RLS cho các bảng cần thiết
3. Tạo policies phù hợp với ứng dụng

## Bước 5: Testing và Monitoring

### 5.1 Test Chức Năng
1. Truy cập frontend URL
2. Test đăng nhập với tài khoản mẫu:
   - Admin: `admin@tiembanh.com` / `admin123`
   - Customer: `customer1@gmail.com` / `customer123`
3. Test các chức năng chính:
   - Quản lý sản phẩm
   - Đặt hàng
   - Quản lý khách hàng

### 5.2 Monitoring
1. Vercel Dashboard → Functions → View logs
2. Supabase Dashboard → Logs
3. Set up alerts cho errors

## Bước 6: Bảo Mật và Tối Ưu

### 6.1 Bảo Mật
- [ ] Đổi tất cả passwords mặc định
- [ ] Cấu hình JWT secret mạnh
- [ ] Bật HTTPS cho tất cả endpoints
- [ ] Cấu hình rate limiting
- [ ] Review RLS policies

### 6.2 Tối Ưu Performance
- [ ] Enable caching cho static assets
- [ ] Optimize images
- [ ] Minify CSS/JS
- [ ] Set up CDN nếu cần

## Troubleshooting

### Lỗi Thường Gặp
1. **Database connection failed**: Kiểm tra credentials Supabase
2. **CORS error**: Cập nhật CORS origin
3. **Build failed**: Kiểm tra environment variables
4. **Function timeout**: Tối ưu queries hoặc tăng timeout

### Logs và Debug
- Backend logs: Vercel Dashboard → Functions
- Frontend logs: Browser DevTools
- Database logs: Supabase Dashboard

## Liên Hệ Hỗ Trợ
Nếu gặp vấn đề, vui lòng tạo issue trên GitHub repository.
