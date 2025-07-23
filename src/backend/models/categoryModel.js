// models/categoryModel.js - PostgreSQL version
const pool = require('../config/db');

class Category {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.slug = data.slug;
    this.description = data.description;
    this.image = data.image;
    this.parent_id = data.parent_id;
    this.sort_order = data.sort_order;
    this.is_featured = data.is_featured;
    this.status = data.status;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
    this.product_count = data.product_count;
  }

  // Get all categories
  static async getAll(filters = {}) {
    let query = `
      SELECT c.*, 
             COUNT(p.id) as product_count
      FROM categories c
      LEFT JOIN products p ON c.id = p.category_id AND p.status = 'active'
      WHERE 1=1
    `;
    
    const queryParams = [];
    let paramIndex = 1;

    if (filters.status) {
      query += ` AND c.status = $${paramIndex}`;
      queryParams.push(filters.status);
      paramIndex++;
    }

    if (filters.parent_id !== undefined) {
      if (filters.parent_id === null) {
        query += ` AND c.parent_id IS NULL`;
      } else {
        query += ` AND c.parent_id = $${paramIndex}`;
        queryParams.push(filters.parent_id);
        paramIndex++;
      }
    }

    if (filters.search) {
      query += ` AND (c.name ILIKE $${paramIndex} OR c.description ILIKE $${paramIndex + 1})`;
      queryParams.push(`%${filters.search}%`, `%${filters.search}%`);
      paramIndex += 2;
    }

    query += ` GROUP BY c.id`;

    const sortBy = filters.sortBy || 'sort_order';
    const sortOrder = filters.sortOrder || 'ASC';
    query += ` ORDER BY c.${sortBy} ${sortOrder}`;

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
    return result.rows.map(row => new Category(row));
  }

  // Find category by ID
  static async findById(id) {
    const query = `
      SELECT c.*, 
             COUNT(p.id) as product_count
      FROM categories c
      LEFT JOIN products p ON c.id = p.category_id AND p.status = 'active'
      WHERE c.id = $1
      GROUP BY c.id
    `;
    
    const result = await pool.query(query, [id]);
    return result.rows.length > 0 ? new Category(result.rows[0]) : null;
  }

  // Find category by slug
  static async findBySlug(slug) {
    const query = `
      SELECT c.*, 
             COUNT(p.id) as product_count
      FROM categories c
      LEFT JOIN products p ON c.id = p.category_id AND p.status = 'active'
      WHERE c.slug = $1
      GROUP BY c.id
    `;
    
    const result = await pool.query(query, [slug]);
    return result.rows.length > 0 ? new Category(result.rows[0]) : null;
  }

  // Create new category
  static async create(categoryData) {
    const query = `
      INSERT INTO categories (
        name, slug, description, image, parent_id, sort_order, is_featured, status
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8
      ) RETURNING id
    `;

    const values = [
      categoryData.name,
      categoryData.slug,
      categoryData.description,
      categoryData.image,
      categoryData.parent_id,
      categoryData.sort_order || 0,
      categoryData.is_featured || false,
      categoryData.status || 'active'
    ];

    const result = await pool.query(query, values);
    return this.findById(result.rows[0].id);
  }

  // Update category
  static async update(id, categoryData) {
    const updateFields = [];
    const updateValues = [];
    let paramIndex = 1;

    Object.keys(categoryData).forEach(key => {
      if (categoryData[key] !== undefined && key !== 'id') {
        updateFields.push(`${key} = $${paramIndex}`);
        updateValues.push(categoryData[key]);
        paramIndex++;
      }
    });

    if (updateFields.length === 0) {
      return this.findById(id);
    }

    updateFields.push(`updated_at = NOW()`);
    updateValues.push(id);

    const query = `UPDATE categories SET ${updateFields.join(', ')} WHERE id = $${paramIndex}`;
    await pool.query(query, updateValues);
    
    return this.findById(id);
  }

  // Delete category
  static async delete(id) {
    // Check if category has products
    const productCheck = await pool.query('SELECT COUNT(*) as count FROM products WHERE category_id = $1', [id]);
    if (parseInt(productCheck.rows[0].count) > 0) {
      throw new Error('Cannot delete category that has products');
    }

    const query = 'DELETE FROM categories WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rowCount > 0;
  }

  // Get categories count
  static async getCount(filters = {}) {
    let query = 'SELECT COUNT(*) as total FROM categories WHERE 1=1';
    const queryParams = [];
    let paramIndex = 1;

    if (filters.status) {
      query += ` AND status = $${paramIndex}`;
      queryParams.push(filters.status);
      paramIndex++;
    }

    if (filters.parent_id !== undefined) {
      if (filters.parent_id === null) {
        query += ` AND parent_id IS NULL`;
      } else {
        query += ` AND parent_id = $${paramIndex}`;
        queryParams.push(filters.parent_id);
        paramIndex++;
      }
    }

    if (filters.search) {
      query += ` AND (name ILIKE $${paramIndex} OR description ILIKE $${paramIndex + 1})`;
      queryParams.push(`%${filters.search}%`, `%${filters.search}%`);
    }

    const result = await pool.query(query, queryParams);
    return parseInt(result.rows[0].total);
  }

  // Get featured categories
  static async getFeatured(limit = 8) {
    const query = `
      SELECT c.*, 
             COUNT(p.id) as product_count
      FROM categories c
      LEFT JOIN products p ON c.id = p.category_id AND p.status = 'active'
      WHERE c.is_featured = true AND c.status = 'active'
      GROUP BY c.id
      ORDER BY c.sort_order ASC
      LIMIT $1
    `;
    
    const result = await pool.query(query, [limit]);
    return result.rows.map(row => new Category(row));
  }

  // Get parent categories
  static async getParents() {
    const query = `
      SELECT c.*, 
             COUNT(p.id) as product_count
      FROM categories c
      LEFT JOIN products p ON c.id = p.category_id AND p.status = 'active'
      WHERE c.parent_id IS NULL AND c.status = 'active'
      GROUP BY c.id
      ORDER BY c.sort_order ASC
    `;
    
    const result = await pool.query(query);
    return result.rows.map(row => new Category(row));
  }

  // Get children categories
  static async getChildren(parentId) {
    const query = `
      SELECT c.*, 
             COUNT(p.id) as product_count
      FROM categories c
      LEFT JOIN products p ON c.id = p.category_id AND p.status = 'active'
      WHERE c.parent_id = $1 AND c.status = 'active'
      GROUP BY c.id
      ORDER BY c.sort_order ASC
    `;
    
    const result = await pool.query(query, [parentId]);
    return result.rows.map(row => new Category(row));
  }
}

module.exports = Category;
