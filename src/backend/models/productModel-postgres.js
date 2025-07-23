// models/productModel.js - PostgreSQL version
const pool = require('../config/db');

class Product {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.slug = data.slug;
    this.description = data.description;
    this.short_description = data.short_description;
    this.sku = data.sku;
    this.price = data.price;
    this.sale_price = data.sale_price;
    this.cost_price = data.cost_price;
    this.stock_quantity = data.stock_quantity;
    this.min_stock_level = data.min_stock_level;
    this.category_id = data.category_id;
    this.featured_image = data.featured_image;
    this.gallery = data.gallery;
    this.ingredients = data.ingredients;
    this.nutritional_info = data.nutritional_info;
    this.allergen_info = data.allergen_info;
    this.weight = data.weight;
    this.dimensions = data.dimensions;
    this.shelf_life = data.shelf_life;
    this.storage_instructions = data.storage_instructions;
    this.preparation_time = data.preparation_time;
    this.difficulty_level = data.difficulty_level;
    this.tags = data.tags;
    this.meta_title = data.meta_title;
    this.meta_description = data.meta_description;
    this.meta_keywords = data.meta_keywords;
    this.is_featured = data.is_featured;
    this.is_bestseller = data.is_bestseller;
    this.status = data.status;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
    this.category_name = data.category_name;
  }

  // Get all products with filters
  static async getAll(filters = {}) {
    let query = `
      SELECT p.*, c.name as category_name 
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE 1=1
    `;
    
    const queryParams = [];
    let paramIndex = 1;

    if (filters.category_id) {
      query += ` AND p.category_id = $${paramIndex}`;
      queryParams.push(filters.category_id);
      paramIndex++;
    }

    if (filters.status) {
      query += ` AND p.status = $${paramIndex}`;
      queryParams.push(filters.status);
      paramIndex++;
    }

    if (filters.search) {
      query += ` AND (p.name ILIKE $${paramIndex} OR p.description ILIKE $${paramIndex + 1})`;
      queryParams.push(`%${filters.search}%`, `%${filters.search}%`);
      paramIndex += 2;
    }

    const sortBy = filters.sortBy || 'created_at';
    const sortOrder = filters.sortOrder || 'DESC';
    query += ` ORDER BY p.${sortBy} ${sortOrder}`;

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
    return result.rows.map(row => new Product(row));
  }

  // Find product by ID
  static async findById(id) {
    const query = `
      SELECT p.*, c.name as category_name 
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = $1
    `;
    
    const result = await pool.query(query, [id]);
    return result.rows.length > 0 ? new Product(result.rows[0]) : null;
  }

  // Find product by SKU
  static async findBySku(sku) {
    const query = 'SELECT * FROM products WHERE sku = $1';
    const result = await pool.query(query, [sku]);
    return result.rows.length > 0 ? new Product(result.rows[0]) : null;
  }

  // Find product by slug
  static async findBySlug(slug) {
    const query = `
      SELECT p.*, c.name as category_name 
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.slug = $1
    `;
    
    const result = await pool.query(query, [slug]);
    return result.rows.length > 0 ? new Product(result.rows[0]) : null;
  }

  // Create new product
  static async create(productData) {
    const query = `
      INSERT INTO products (
        name, slug, description, short_description, sku, price, sale_price, cost_price,
        stock_quantity, min_stock_level, category_id, featured_image, gallery, ingredients,
        nutritional_info, allergen_info, weight, dimensions, shelf_life, storage_instructions,
        preparation_time, difficulty_level, tags, meta_title, meta_description, meta_keywords,
        is_featured, is_bestseller, status
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20,
        $21, $22, $23, $24, $25, $26, $27, $28, $29
      ) RETURNING id
    `;

    const values = [
      productData.name,
      productData.slug,
      productData.description,
      productData.short_description,
      productData.sku,
      productData.price,
      productData.sale_price,
      productData.cost_price,
      productData.stock_quantity || 0,
      productData.min_stock_level || 0,
      productData.category_id,
      productData.featured_image,
      productData.gallery,
      productData.ingredients,
      productData.nutritional_info,
      productData.allergen_info,
      productData.weight,
      productData.dimensions,
      productData.shelf_life,
      productData.storage_instructions,
      productData.preparation_time,
      productData.difficulty_level,
      productData.tags,
      productData.meta_title,
      productData.meta_description,
      productData.meta_keywords,
      productData.is_featured || false,
      productData.is_bestseller || false,
      productData.status || 'active'
    ];

    const result = await pool.query(query, values);
    return this.findById(result.rows[0].id);
  }

  // Update product
  static async update(id, productData) {
    const updateFields = [];
    const updateValues = [];
    let paramIndex = 1;

    Object.keys(productData).forEach(key => {
      if (productData[key] !== undefined && key !== 'id') {
        updateFields.push(`${key} = $${paramIndex}`);
        updateValues.push(productData[key]);
        paramIndex++;
      }
    });

    if (updateFields.length === 0) {
      return this.findById(id);
    }

    updateFields.push(`updated_at = NOW()`);
    updateValues.push(id);

    const query = `UPDATE products SET ${updateFields.join(', ')} WHERE id = $${paramIndex}`;
    await pool.query(query, updateValues);
    
    return this.findById(id);
  }

  // Delete product
  static async delete(id) {
    const query = 'DELETE FROM products WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rowCount > 0;
  }

  // Get products count
  static async getCount(filters = {}) {
    let query = 'SELECT COUNT(*) as total FROM products WHERE 1=1';
    const queryParams = [];
    let paramIndex = 1;

    if (filters.category_id) {
      query += ` AND category_id = $${paramIndex}`;
      queryParams.push(filters.category_id);
      paramIndex++;
    }

    if (filters.status) {
      query += ` AND status = $${paramIndex}`;
      queryParams.push(filters.status);
      paramIndex++;
    }

    if (filters.search) {
      query += ` AND (name ILIKE $${paramIndex} OR description ILIKE $${paramIndex + 1})`;
      queryParams.push(`%${filters.search}%`, `%${filters.search}%`);
    }

    const result = await pool.query(query, queryParams);
    return parseInt(result.rows[0].total);
  }

  // Get featured products
  static async getFeatured(limit = 8) {
    const query = `
      SELECT p.*, c.name as category_name 
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.is_featured = true AND p.status = 'active'
      ORDER BY p.created_at DESC
      LIMIT $1
    `;
    
    const result = await pool.query(query, [limit]);
    return result.rows.map(row => new Product(row));
  }

  // Get bestseller products
  static async getBestsellers(limit = 8) {
    const query = `
      SELECT p.*, c.name as category_name 
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.is_bestseller = true AND p.status = 'active'
      ORDER BY p.created_at DESC
      LIMIT $1
    `;
    
    const result = await pool.query(query, [limit]);
    return result.rows.map(row => new Product(row));
  }
}

module.exports = Product;
