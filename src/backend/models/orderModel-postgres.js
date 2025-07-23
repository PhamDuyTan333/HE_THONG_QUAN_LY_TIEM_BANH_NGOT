// models/orderModel.js - PostgreSQL version
const pool = require('../config/db');

class Order {
  constructor(data) {
    this.id = data.id;
    this.customer_id = data.customer_id;
    this.customer_name = data.customer_name;
    this.customer_email = data.customer_email;
    this.customer_phone = data.customer_phone;
    this.delivery_address = data.delivery_address;
    this.order_date = data.order_date;
    this.delivery_date = data.delivery_date;
    this.delivery_time = data.delivery_time;
    this.subtotal = data.subtotal;
    this.tax_amount = data.tax_amount;
    this.delivery_fee = data.delivery_fee;
    this.discount_amount = data.discount_amount;
    this.total_amount = data.total_amount;
    this.payment_method = data.payment_method;
    this.payment_status = data.payment_status;
    this.order_status = data.order_status;
    this.notes = data.notes;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
    this.items = data.items || [];
  }

  // Get all orders with filters
  static async getAll(filters = {}) {
    let query = `
      SELECT o.*, 
             json_agg(
               json_build_object(
                 'id', oi.id,
                 'product_id', oi.product_id,
                 'product_name', oi.product_name,
                 'quantity', oi.quantity,
                 'unit_price', oi.unit_price,
                 'total_price', oi.total_price,
                 'notes', oi.notes
               )
             ) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE 1=1
    `;
    
    const queryParams = [];
    let paramIndex = 1;

    if (filters.customer_id) {
      query += ` AND o.customer_id = $${paramIndex}`;
      queryParams.push(filters.customer_id);
      paramIndex++;
    }

    if (filters.status) {
      query += ` AND o.order_status = $${paramIndex}`;
      queryParams.push(filters.status);
      paramIndex++;
    }

    if (filters.payment_status) {
      query += ` AND o.payment_status = $${paramIndex}`;
      queryParams.push(filters.payment_status);
      paramIndex++;
    }

    if (filters.date_from) {
      query += ` AND DATE(o.order_date) >= $${paramIndex}`;
      queryParams.push(filters.date_from);
      paramIndex++;
    }

    if (filters.date_to) {
      query += ` AND DATE(o.order_date) <= $${paramIndex}`;
      queryParams.push(filters.date_to);
      paramIndex++;
    }

    if (filters.search) {
      query += ` AND (o.customer_name ILIKE $${paramIndex} OR o.customer_email ILIKE $${paramIndex + 1} OR o.customer_phone ILIKE $${paramIndex + 2})`;
      queryParams.push(`%${filters.search}%`, `%${filters.search}%`, `%${filters.search}%`);
      paramIndex += 3;
    }

    query += ` GROUP BY o.id`;

    const sortBy = filters.sortBy || 'order_date';
    const sortOrder = filters.sortOrder || 'DESC';
    query += ` ORDER BY o.${sortBy} ${sortOrder}`;

    if (filters.limit) {
      query += ` LIMIT $${paramIndex}`;
      queryParams.push(filters.limit);
      paramIndex++;
      
      if (filters.offset) {
        query += ` OFFSET $${paramIndex}`;
        queryParams.push(filters.offset);
      }
    }

    const result = await pool.query(query, queryParams);
    return result.rows.map(row => new Order(row));
  }

  // Find order by ID
  static async findById(id) {
    const query = `
      SELECT o.*, 
             json_agg(
               json_build_object(
                 'id', oi.id,
                 'product_id', oi.product_id,
                 'product_name', oi.product_name,
                 'quantity', oi.quantity,
                 'unit_price', oi.unit_price,
                 'total_price', oi.total_price,
                 'notes', oi.notes
               )
             ) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE o.id = $1
      GROUP BY o.id
    `;
    
    const result = await pool.query(query, [id]);
    return result.rows.length > 0 ? new Order(result.rows[0]) : null;
  }

  // Create new order
  static async create(orderData) {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      // Insert order
      const orderQuery = `
        INSERT INTO orders (
          customer_id, customer_name, customer_email, customer_phone, delivery_address,
          order_date, delivery_date, delivery_time, subtotal, tax_amount, delivery_fee,
          discount_amount, total_amount, payment_method, payment_status, order_status, notes
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17
        ) RETURNING id
      `;

      const orderValues = [
        orderData.customer_id,
        orderData.customer_name,
        orderData.customer_email,
        orderData.customer_phone,
        orderData.delivery_address,
        orderData.order_date || new Date(),
        orderData.delivery_date,
        orderData.delivery_time,
        orderData.subtotal,
        orderData.tax_amount || 0,
        orderData.delivery_fee || 0,
        orderData.discount_amount || 0,
        orderData.total_amount,
        orderData.payment_method,
        orderData.payment_status || 'pending',
        orderData.order_status || 'pending',
        orderData.notes
      ];

      const orderResult = await client.query(orderQuery, orderValues);
      const orderId = orderResult.rows[0].id;

      // Insert order items
      if (orderData.items && orderData.items.length > 0) {
        const itemQuery = `
          INSERT INTO order_items (
            order_id, product_id, product_name, quantity, unit_price, total_price, notes
          ) VALUES ($1, $2, $3, $4, $5, $6, $7)
        `;

        for (const item of orderData.items) {
          await client.query(itemQuery, [
            orderId,
            item.product_id,
            item.product_name,
            item.quantity,
            item.unit_price,
            item.total_price,
            item.notes
          ]);
        }
      }

      await client.query('COMMIT');
      return this.findById(orderId);

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  // Update order
  static async update(id, orderData) {
    const updateFields = [];
    const updateValues = [];
    let paramIndex = 1;

    Object.keys(orderData).forEach(key => {
      if (orderData[key] !== undefined && key !== 'id' && key !== 'items') {
        updateFields.push(`${key} = $${paramIndex}`);
        updateValues.push(orderData[key]);
        paramIndex++;
      }
    });

    if (updateFields.length === 0) {
      return this.findById(id);
    }

    updateFields.push(`updated_at = NOW()`);
    updateValues.push(id);

    const query = `UPDATE orders SET ${updateFields.join(', ')} WHERE id = $${paramIndex}`;
    await pool.query(query, updateValues);
    
    return this.findById(id);
  }

  // Delete order
  static async delete(id) {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Delete order items first
      await client.query('DELETE FROM order_items WHERE order_id = $1', [id]);
      
      // Delete order
      const result = await client.query('DELETE FROM orders WHERE id = $1', [id]);
      
      await client.query('COMMIT');
      return result.rowCount > 0;

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  // Get orders count
  static async getCount(filters = {}) {
    let query = 'SELECT COUNT(*) as total FROM orders WHERE 1=1';
    const queryParams = [];
    let paramIndex = 1;

    if (filters.customer_id) {
      query += ` AND customer_id = $${paramIndex}`;
      queryParams.push(filters.customer_id);
      paramIndex++;
    }

    if (filters.status) {
      query += ` AND order_status = $${paramIndex}`;
      queryParams.push(filters.status);
      paramIndex++;
    }

    if (filters.payment_status) {
      query += ` AND payment_status = $${paramIndex}`;
      queryParams.push(filters.payment_status);
      paramIndex++;
    }

    if (filters.date_from) {
      query += ` AND DATE(order_date) >= $${paramIndex}`;
      queryParams.push(filters.date_from);
      paramIndex++;
    }

    if (filters.date_to) {
      query += ` AND DATE(order_date) <= $${paramIndex}`;
      queryParams.push(filters.date_to);
      paramIndex++;
    }

    if (filters.search) {
      query += ` AND (customer_name ILIKE $${paramIndex} OR customer_email ILIKE $${paramIndex + 1} OR customer_phone ILIKE $${paramIndex + 2})`;
      queryParams.push(`%${filters.search}%`, `%${filters.search}%`, `%${filters.search}%`);
    }

    const result = await pool.query(query, queryParams);
    return parseInt(result.rows[0].total);
  }

  // Get order statistics
  static async getStatistics() {
    const query = `
      SELECT 
        COUNT(*) as total_orders,
        COUNT(CASE WHEN order_status = 'pending' THEN 1 END) as pending_orders,
        COUNT(CASE WHEN order_status = 'confirmed' THEN 1 END) as confirmed_orders,
        COUNT(CASE WHEN order_status = 'preparing' THEN 1 END) as preparing_orders,
        COUNT(CASE WHEN order_status = 'ready' THEN 1 END) as ready_orders,
        COUNT(CASE WHEN order_status = 'delivered' THEN 1 END) as delivered_orders,
        COUNT(CASE WHEN order_status = 'cancelled' THEN 1 END) as cancelled_orders,
        SUM(total_amount) as total_revenue,
        AVG(total_amount) as average_order_value,
        COUNT(CASE WHEN DATE(order_date) = CURRENT_DATE THEN 1 END) as orders_today,
        COUNT(CASE WHEN order_date >= CURRENT_DATE - INTERVAL '7 days' THEN 1 END) as orders_this_week,
        COUNT(CASE WHEN order_date >= CURRENT_DATE - INTERVAL '30 days' THEN 1 END) as orders_this_month
      FROM orders
    `;

    const result = await pool.query(query);
    return result.rows[0];
  }
}

module.exports = Order;
