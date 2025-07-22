# ✅ Deployment Checklist - Tiệm Bánh Ngọt

## 📋 Pre-Deployment Checklist

### 🗄️ Database Setup (Supabase)
- [ ] Tạo Supabase project
- [ ] Chạy migration script (`supabase-migration.sql`)
- [ ] Kiểm tra tất cả bảng đã được tạo
- [ ] Test kết nối database
- [ ] Lấy connection strings và API keys
- [ ] Cấu hình Row Level Security (RLS) nếu cần

### ⚙️ Backend Configuration
- [ ] Cài đặt dependencies (`npm install`)
- [ ] Cấu hình `.env` với thông tin Supabase
- [ ] Test kết nối database local
- [ ] Kiểm tra tất cả API endpoints
- [ ] Cấu hình CORS cho production domain
- [ ] Tạo `vercel.json` configuration

### 🎨 Frontend Configuration
- [ ] Cài đặt dependencies (`npm install`)
- [ ] Cấu hình `.env` với API URLs
- [ ] Test build local (`npm run build`)
- [ ] Kiểm tra routing configuration
- [ ] Tối ưu hóa assets và images
- [ ] Tạo `vercel.json` configuration

## 🚀 Deployment Steps

### 1. Deploy Backend
- [ ] Login Vercel CLI (`vercel login`)
- [ ] Deploy backend (`vercel --prod`)
- [ ] Thêm environment variables trên Vercel Dashboard
- [ ] Test API endpoints trên production
- [ ] Kiểm tra logs không có errors

### 2. Deploy Frontend
- [ ] Cập nhật API URL production trong frontend config
- [ ] Deploy frontend (`vercel --prod`)
- [ ] Thêm environment variables trên Vercel Dashboard
- [ ] Test website trên production
- [ ] Kiểm tra routing hoạt động

### 3. Domain Configuration (Optional)
- [ ] Thêm custom domain
- [ ] Cấu hình DNS records
- [ ] Verify SSL certificate
- [ ] Update CORS với domain mới

## 🧪 Post-Deployment Testing

### 🔐 Authentication Testing
- [ ] Test đăng nhập admin (`admin@tiembanh.com`)
- [ ] Test đăng nhập customer (`customer1@gmail.com`)
- [ ] Test đăng ký tài khoản mới
- [ ] Test logout functionality
- [ ] Test JWT token refresh

### 📊 Admin Panel Testing
- [ ] Truy cập admin dashboard
- [ ] Test quản lý sản phẩm (CRUD)
- [ ] Test quản lý danh mục (CRUD)
- [ ] Test quản lý đơn hàng
- [ ] Test quản lý khách hàng
- [ ] Test quản lý coupon
- [ ] Test báo cáo và thống kê

### 🛒 Customer Features Testing
- [ ] Xem danh sách sản phẩm
- [ ] Tìm kiếm sản phẩm
- [ ] Thêm sản phẩm vào giỏ hàng
- [ ] Đặt hàng
- [ ] Xem lịch sử đơn hàng
- [ ] Cập nhật thông tin cá nhân
- [ ] Sử dụng coupon

### 🔧 Technical Testing
- [ ] Test API response times
- [ ] Test database queries performance
- [ ] Test file upload functionality
- [ ] Test responsive design
- [ ] Test cross-browser compatibility
- [ ] Test mobile compatibility

## 🔒 Security Checklist

### 🛡️ Backend Security
- [ ] Đổi tất cả passwords mặc định
- [ ] Cấu hình JWT secret mạnh
- [ ] Enable rate limiting
- [ ] Validate tất cả inputs
- [ ] Sanitize database queries
- [ ] Enable HTTPS only
- [ ] Cấu hình proper CORS

### 🔐 Database Security
- [ ] Review database permissions
- [ ] Enable RLS policies
- [ ] Backup database
- [ ] Monitor database access logs
- [ ] Secure sensitive data

### 🌐 Frontend Security
- [ ] Sanitize user inputs
- [ ] Secure API keys (không expose sensitive keys)
- [ ] Enable CSP headers
- [ ] Secure cookies configuration
- [ ] Remove debug code

## 📈 Performance Optimization

### ⚡ Backend Optimization
- [ ] Optimize database queries
- [ ] Add database indexes
- [ ] Enable query caching
- [ ] Optimize API response sizes
- [ ] Configure proper HTTP caching headers

### 🎨 Frontend Optimization
- [ ] Optimize images (WebP, compression)
- [ ] Minify CSS/JS
- [ ] Enable gzip compression
- [ ] Implement lazy loading
- [ ] Optimize bundle size
- [ ] Add service worker (PWA)

### 🗄️ Database Optimization
- [ ] Add proper indexes
- [ ] Optimize slow queries
- [ ] Set up connection pooling
- [ ] Monitor database performance
- [ ] Regular maintenance tasks

## 📊 Monitoring Setup

### 📈 Application Monitoring
- [ ] Set up Vercel Analytics
- [ ] Configure error tracking
- [ ] Monitor API response times
- [ ] Set up uptime monitoring
- [ ] Configure alerts for errors

### 🗄️ Database Monitoring
- [ ] Monitor Supabase metrics
- [ ] Set up query performance monitoring
- [ ] Configure storage alerts
- [ ] Monitor connection usage

### 📱 User Experience Monitoring
- [ ] Set up user analytics
- [ ] Monitor page load times
- [ ] Track user interactions
- [ ] Monitor conversion rates

## 🚨 Troubleshooting Guide

### Common Issues & Solutions

#### Database Connection Issues
```bash
# Check connection
psql -h db.supabase.co -U postgres -d postgres

# Test from backend
node -e "const pool = require('./config/db'); pool.query('SELECT NOW()').then(console.log)"
```

#### API Issues
```bash
# Test API endpoints
curl https://your-backend.vercel.app/api/health
curl https://your-backend.vercel.app/api/products
```

#### Build Issues
```bash
# Clear cache and rebuild
rm -rf node_modules package-lock.json
npm install
npm run build
```

## 📝 Documentation Updates

- [ ] Update README with production URLs
- [ ] Document API endpoints
- [ ] Create user manual
- [ ] Update environment variables documentation
- [ ] Create backup/restore procedures

## 🎯 Go-Live Checklist

### Final Steps
- [ ] All tests passing ✅
- [ ] Performance acceptable ✅
- [ ] Security measures in place ✅
- [ ] Monitoring configured ✅
- [ ] Documentation updated ✅
- [ ] Backup procedures tested ✅
- [ ] Team trained on new system ✅

### Post Go-Live
- [ ] Monitor for 24 hours
- [ ] Check error logs
- [ ] Verify all features working
- [ ] Collect user feedback
- [ ] Plan next iteration

---

## 📞 Emergency Contacts

- **Technical Issues**: [Your contact]
- **Vercel Support**: [Vercel Dashboard]
- **Supabase Support**: [Supabase Dashboard]

---

**🎉 Deployment Complete!**

Date: ___________
Deployed by: ___________
Version: ___________
