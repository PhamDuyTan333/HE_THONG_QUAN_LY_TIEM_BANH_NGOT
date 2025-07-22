# 🚀 Hướng Dẫn Triển Khai Ứng Dụng Quản Lý Tiệm Bánh

## 📋 Tổng Quan

Ứng dụng quản lý tiệm bánh được triển khai với kiến trúc hiện đại:

- **🗄️ Database**: Supabase (PostgreSQL)
- **⚡ Backend**: Vercel Serverless Functions (Node.js + Express)
- **🎨 Frontend**: Vercel Static Hosting (React + Vite)

## 🛠️ Yêu Cầu Hệ Thống

- Node.js 18+ 
- npm hoặc yarn
- Git
- Tài khoản Supabase (miễn phí)
- Tài khoản Vercel (miễn phí)

## 🚀 Triển Khai Nhanh (Quick Start)

### Bước 1: Chuẩn Bị
```bash
# Clone repository (nếu chưa có)
git clone <repository-url>
cd quan_ly_tiem_banh/HE_THONG_QUAN_LY_TIEM_BANH_NGOT/src

# Chạy script tự động (Windows)
deploy.bat

# Hoặc (Linux/Mac)
chmod +x deploy.sh
./deploy.sh
```

### Bước 2: Thiết Lập Database
1. Tạo tài khoản tại [supabase.com](https://supabase.com)
2. Tạo project mới
3. Vào SQL Editor, copy và chạy nội dung file `supabase-migration.sql`

### Bước 3: Deploy
Sử dụng script tự động hoặc làm theo hướng dẫn chi tiết trong `DEPLOYMENT_GUIDE.md`

## 📁 Cấu Trúc Dự Án

```
src/
├── backend/                 # Node.js + Express API
│   ├── config/             # Cấu hình database
│   ├── controllers/        # Logic xử lý API
│   ├── middleware/         # Middleware
│   ├── routes/            # Định tuyến API
│   ├── utils/             # Utilities
│   ├── package.json       # Dependencies
│   ├── server.js          # Entry point
│   ├── vercel.json        # Cấu hình Vercel
│   └── .env.example       # Environment variables mẫu
├── frontend/               # React + Vite
│   ├── src/               # Source code
│   ├── public/            # Static assets
│   ├── package.json       # Dependencies
│   ├── vite.config.js     # Cấu hình Vite
│   ├── vercel.json        # Cấu hình Vercel
│   └── .env.example       # Environment variables mẫu
├── database/              # Database scripts
│   └── init.sql          # MySQL schema (legacy)
├── supabase-migration.sql # PostgreSQL migration
├── DEPLOYMENT_GUIDE.md    # Hướng dẫn chi tiết
├── deploy.bat            # Script Windows
└── deploy.sh             # Script Linux/Mac
```

## 🔧 Cấu Hình Environment Variables

### Backend (.env)
```env
# Supabase Database
DB_HOST=db.supabase.co
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_supabase_password
DB_NAME=postgres

# Supabase API
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d

# Server
PORT=3000
NODE_ENV=production
FRONTEND_URL=https://your-frontend.vercel.app
```

### Frontend (.env)
```env
# API
VITE_API_URL=http://localhost:3000/api
VITE_API_URL_PRODUCTION=https://your-backend.vercel.app/api

# Supabase (client-side)
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key

# App
VITE_APP_NAME=Tiệm Bánh Ngọt
VITE_APP_VERSION=1.0.0
```

## 🔐 Tài Khoản Mặc Định

Sau khi chạy migration, bạn có thể đăng nhập với:

### Admin
- Email: `admin@tiembanh.com`
- Password: `admin123`

### Manager
- Email: `quanly@tiembanh.com`
- Password: `quanly123`

### Customer
- Email: `customer1@gmail.com`
- Password: `customer123`

## 🌐 URLs Sau Khi Deploy

- **Frontend**: `https://your-project-name.vercel.app`
- **Backend API**: `https://your-backend-name.vercel.app/api`
- **Database**: Supabase Dashboard

## 📊 Monitoring và Logs

### Vercel
- Dashboard: [vercel.com/dashboard](https://vercel.com/dashboard)
- Functions logs: Project → Functions tab
- Analytics: Project → Analytics tab

### Supabase
- Dashboard: [app.supabase.com](https://app.supabase.com)
- Database logs: Project → Logs
- API logs: Project → API → Logs

## 🔧 Troubleshooting

### Lỗi Thường Gặp

1. **Database Connection Error**
   - Kiểm tra credentials Supabase
   - Đảm bảo IP được whitelist (Supabase cho phép tất cả IPs mặc định)

2. **CORS Error**
   - Cập nhật `FRONTEND_URL` trong backend
   - Kiểm tra CORS configuration trong `server.js`

3. **Build Failed**
   - Kiểm tra environment variables
   - Xem logs chi tiết trong Vercel Dashboard

4. **API Not Found**
   - Đảm bảo backend đã deploy thành công
   - Kiểm tra API URL trong frontend config

### Debug Commands

```bash
# Test backend locally
cd backend
npm run dev

# Test frontend locally
cd frontend
npm run dev

# Check Vercel deployments
vercel ls

# View deployment logs
vercel logs [deployment-url]
```

## 📚 Tài Liệu Tham Khảo

- [Supabase Documentation](https://supabase.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [React Documentation](https://react.dev)
- [Express.js Documentation](https://expressjs.com)

## 🆘 Hỗ Trợ

Nếu gặp vấn đề:
1. Kiểm tra logs trong Vercel và Supabase Dashboard
2. Xem lại cấu hình environment variables
3. Tham khảo `DEPLOYMENT_GUIDE.md` để biết chi tiết
4. Tạo issue trên GitHub repository

## 📝 Ghi Chú

- Lần đầu deploy có thể mất 5-10 phút
- Supabase free tier có giới hạn 500MB database
- Vercel free tier có giới hạn 100GB bandwidth/tháng
- Nhớ đổi tất cả passwords mặc định trong production

---

**🎉 Chúc bạn deploy thành công!**
