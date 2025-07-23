// models/customerModel.js - PostgreSQL version
const pool = require('../config/db');
const bcrypt = require('bcryptjs');

class Customer {
  constructor(data) {
    this.id = data.id;
    this.email = data.email;
    this.password = data.password;
    this.full_name = data.full_name;
    this.phone = data.phone;
    this.address = data.address;
    this.date_of_birth = data.date_of_birth;
    this.gender = data.gender;
    this.avatar = data.avatar;
    this.email_verified = data.email_verified;
    this.phone_verified = data.phone_verified;
    this.status = data.status;
    this.last_login = data.last_login;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  // Find all customers with pagination and filters
  static async findAll(options = {}) {
    const {
      page = 1,
      limit = 10,
      search,
      status = 'active',
      sortBy = 'created_at',
      sortOrder = 'DESC'
    } = options;

    const offset = (page - 1) * limit;
    let query = `
      SELECT 
        id, email, full_name, phone, address, date_of_birth, gender, 
        avatar, email_verified, phone_verified, status, last_login, 
        created_at, updated_at
      FROM customers
      WHERE status = $1
    `;
    
    const queryParams = [status];
    let paramIndex = 2;

    if (search) {
      query += ` AND (full_name ILIKE $${paramIndex} OR email ILIKE $${paramIndex + 1} OR phone ILIKE $${paramIndex + 2})`;
      queryParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
      paramIndex += 3;
    }

    query += ` ORDER BY ${sortBy} ${sortOrder} LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    queryParams.push(limit, offset);

    const result = await pool.query(query, queryParams);
    return result.rows.map(row => new Customer(row));
  }

  // Find customer by ID
  static async findById(id) {
    const query = `
      SELECT 
        id, email, full_name, phone, address, date_of_birth, gender, 
        avatar, email_verified, phone_verified, status, last_login, 
        created_at, updated_at
      FROM customers 
      WHERE id = $1
    `;
    
    const result = await pool.query(query, [id]);
    return result.rows.length > 0 ? new Customer(result.rows[0]) : null;
  }

  // Find customer by email (for authentication)
  static async findByEmail(email) {
    const query = 'SELECT * FROM customers WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows.length > 0 ? new Customer(result.rows[0]) : null;
  }

  // Find customer by phone
  static async findByPhone(phone) {
    const query = 'SELECT * FROM customers WHERE phone = $1';
    const result = await pool.query(query, [phone]);
    return result.rows.length > 0 ? new Customer(result.rows[0]) : null;
  }

  // Create new customer
  static async create(customerData) {
    // Hash password
    const hashedPassword = await bcrypt.hash(customerData.password, 12);

    const query = `
      INSERT INTO customers (
        email, password, full_name, phone, address, date_of_birth, 
        gender, avatar, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING id
    `;

    const values = [
      customerData.email,
      hashedPassword,
      customerData.full_name,
      customerData.phone || null,
      customerData.address || null,
      customerData.date_of_birth || null,
      customerData.gender || null,
      customerData.avatar || null,
      customerData.status || 'active'
    ];

    const result = await pool.query(query, values);
    return this.findById(result.rows[0].id);
  }

  // Update customer
  static async update(id, customerData) {
    const updateFields = [];
    const updateValues = [];
    let paramIndex = 1;

    // Hash password if provided
    if (customerData.password) {
      customerData.password = await bcrypt.hash(customerData.password, 12);
    }

    Object.keys(customerData).forEach(key => {
      if (customerData[key] !== undefined && key !== 'id') {
        updateFields.push(`${key} = $${paramIndex}`);
        updateValues.push(customerData[key]);
        paramIndex++;
      }
    });

    if (updateFields.length === 0) {
      throw new Error('No data to update');
    }

    updateFields.push(`updated_at = NOW()`);
    updateValues.push(id);

    const query = `UPDATE customers SET ${updateFields.join(', ')} WHERE id = $${paramIndex}`;
    await pool.query(query, updateValues);
    
    return this.findById(id);
  }

  // Delete customer
  static async delete(id) {
    // Check if customer has orders
    const orderCheck = await pool.query('SELECT id FROM orders WHERE customer_id = $1 LIMIT 1', [id]);
    if (orderCheck.rows.length > 0) {
      throw new Error('Cannot delete customer with orders');
    }

    const query = 'DELETE FROM customers WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rowCount > 0;
  }

  // Verify password
  static async verifyPassword(customer, password) {
    return await bcrypt.compare(password, customer.password);
  }

  // Update last login
  static async updateLastLogin(id) {
    const query = 'UPDATE customers SET last_login = NOW() WHERE id = $1';
    await pool.query(query, [id]);
  }

  // Verify email
  static async verifyEmail(id) {
    const query = 'UPDATE customers SET email_verified = true WHERE id = $1';
    await pool.query(query, [id]);
    return this.findById(id);
  }

  // Verify phone
  static async verifyPhone(id) {
    const query = 'UPDATE customers SET phone_verified = true WHERE id = $1';
    await pool.query(query, [id]);
    return this.findById(id);
  }

  // Change password
  static async changePassword(id, newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    const query = 'UPDATE customers SET password = $1, updated_at = NOW() WHERE id = $2';
    await pool.query(query, [hashedPassword, id]);
    return this.findById(id);
  }

  // Get customers count
  static async getCount(filters = {}) {
    let query = 'SELECT COUNT(*) as total FROM customers WHERE status = $1';
    const queryParams = [filters.status || 'active'];
    let paramIndex = 2;

    if (filters.search) {
      query += ` AND (full_name ILIKE $${paramIndex} OR email ILIKE $${paramIndex + 1} OR phone ILIKE $${paramIndex + 2})`;
      queryParams.push(`%${filters.search}%`, `%${filters.search}%`, `%${filters.search}%`);
    }

    const result = await pool.query(query, queryParams);
    return parseInt(result.rows[0].total);
  }

  // Check if email exists
  static async emailExists(email, excludeId = null) {
    let query = 'SELECT id FROM customers WHERE email = $1';
    const params = [email];

    if (excludeId) {
      query += ' AND id != $2';
      params.push(excludeId);
    }

    const result = await pool.query(query, params);
    return result.rows.length > 0;
  }

  // Check if phone exists
  static async phoneExists(phone, excludeId = null) {
    if (!phone) return false;
    
    let query = 'SELECT id FROM customers WHERE phone = $1';
    const params = [phone];

    if (excludeId) {
      query += ' AND id != $2';
      params.push(excludeId);
    }

    const result = await pool.query(query, params);
    return result.rows.length > 0;
  }

  // Get customer statistics
  static async getStatistics() {
    const query = `
      SELECT 
        COUNT(*) as total_customers,
        COUNT(CASE WHEN status = 'active' THEN 1 END) as active_customers,
        COUNT(CASE WHEN status = 'inactive' THEN 1 END) as inactive_customers,
        COUNT(CASE WHEN email_verified = true THEN 1 END) as verified_emails,
        COUNT(CASE WHEN phone_verified = true THEN 1 END) as verified_phones,
        COUNT(CASE WHEN DATE(created_at) = CURRENT_DATE THEN 1 END) as new_today,
        COUNT(CASE WHEN created_at >= CURRENT_DATE - INTERVAL '7 days' THEN 1 END) as new_this_week,
        COUNT(CASE WHEN created_at >= CURRENT_DATE - INTERVAL '30 days' THEN 1 END) as new_this_month
      FROM customers
    `;

    const result = await pool.query(query);
    return result.rows[0];
  }

  // Get customer with order statistics
  static async findByIdWithStats(id) {
    const query = `
      SELECT 
        c.*,
        COUNT(o.id) as total_orders,
        SUM(o.total_amount) as total_spent,
        MAX(o.created_at) as last_order_date
      FROM customers c
      LEFT JOIN orders o ON c.id = o.customer_id
      WHERE c.id = $1
      GROUP BY c.id
    `;
    
    const result = await pool.query(query, [id]);
    return result.rows.length > 0 ? result.rows[0] : null;
  }
}

module.exports = Customer;
