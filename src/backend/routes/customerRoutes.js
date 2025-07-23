// routes/customerRoutes.js
const express = require('express');
const router = express.Router();
const Customer = require('../models/customerModel');

// Customer registration
router.post('/register', async (req, res) => {
  try {
    const { email, password, full_name, phone, address, date_of_birth, gender } = req.body;

    // Validation
    if (!email || !password || !full_name) {
      return res.status(400).json({
        success: false,
        message: 'Email, password và họ tên là bắt buộc'
      });
    }

    // Check if email already exists
    const existingCustomer = await Customer.findByEmail(email);
    if (existingCustomer) {
      return res.status(400).json({
        success: false,
        message: 'Email đã được sử dụng'
      });
    }

    // Check if phone already exists (if provided)
    if (phone) {
      const existingPhone = await Customer.findByPhone(phone);
      if (existingPhone) {
        return res.status(400).json({
          success: false,
          message: 'Số điện thoại đã được sử dụng'
        });
      }
    }

    // Create new customer
    const customerData = {
      email,
      password,
      full_name,
      phone,
      address,
      date_of_birth,
      gender,
      status: 'active'
    };

    const newCustomer = await Customer.create(customerData);

    res.status(201).json({
      success: true,
      message: 'Đăng ký thành công!',
      data: {
        id: newCustomer.id,
        email: newCustomer.email,
        full_name: newCustomer.full_name,
        phone: newCustomer.phone,
        status: newCustomer.status
      }
    });

  } catch (error) {
    console.error('Customer registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi đăng ký tài khoản'
    });
  }
});

// Customer login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email và mật khẩu là bắt buộc'
      });
    }

    // Find customer by email
    const customer = await Customer.findByEmail(email);
    if (!customer) {
      return res.status(401).json({
        success: false,
        message: 'Email hoặc mật khẩu không đúng'
      });
    }

    // Check password
    const isValidPassword = await Customer.verifyPassword(customer, password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Email hoặc mật khẩu không đúng'
      });
    }

    // Check if account is active
    if (customer.status !== 'active') {
      return res.status(403).json({
        success: false,
        message: 'Tài khoản đã bị khóa hoặc vô hiệu hóa'
      });
    }

    // Update last login
    await Customer.updateLastLogin(customer.id);

    res.json({
      success: true,
      message: 'Đăng nhập thành công!',
      data: {
        id: customer.id,
        email: customer.email,
        full_name: customer.full_name,
        phone: customer.phone,
        status: customer.status
      }
    });

  } catch (error) {
    console.error('Customer login error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi đăng nhập'
    });
  }
});

// Get all customers (admin only)
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      status = 'active',
      sortBy = 'created_at',
      sortOrder = 'DESC'
    } = req.query;

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      search,
      status,
      sortBy,
      sortOrder
    };

    const customers = await Customer.findAll(options);
    const total = await Customer.getCount({ search, status });

    res.json({
      success: true,
      data: customers,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get customers error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy danh sách khách hàng'
    });
  }
});

// Get customer by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await Customer.findById(id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy khách hàng'
      });
    }

    res.json({
      success: true,
      data: customer
    });

  } catch (error) {
    console.error('Get customer error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy thông tin khách hàng'
    });
  }
});

// Update customer
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Remove sensitive fields that shouldn't be updated directly
    delete updateData.id;
    delete updateData.created_at;
    delete updateData.updated_at;

    const updatedCustomer = await Customer.update(id, updateData);

    res.json({
      success: true,
      message: 'Cập nhật thông tin khách hàng thành công',
      data: updatedCustomer
    });

  } catch (error) {
    console.error('Update customer error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi cập nhật thông tin khách hàng'
    });
  }
});

// Delete customer
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const deleted = await Customer.delete(id);
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy khách hàng'
      });
    }

    res.json({
      success: true,
      message: 'Xóa khách hàng thành công'
    });

  } catch (error) {
    console.error('Delete customer error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Lỗi server khi xóa khách hàng'
    });
  }
});

// Get customer statistics
router.get('/stats/overview', async (req, res) => {
  try {
    const stats = await Customer.getStatistics();
    
    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Get customer stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy thống kê khách hàng'
    });
  }
});

module.exports = router;
