// controllers/productController.js - PostgreSQL version
const Product = require('../models/productModel');

// Get all products with pagination and filters
exports.getAllProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    
    const filters = {
      category_id: req.query.category_id,
      search: req.query.search,
      status: req.query.status || 'active',
      sortBy: req.query.sortBy || 'created_at',
      sortOrder: req.query.sortOrder || 'DESC',
      limit,
      offset
    };
    
    const products = await Product.getAll(filters);
    const total = await Product.getCount(filters);
    
    res.json({
      success: true,
      message: 'Lấy danh sách sản phẩm thành công',
      data: products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error getting products:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách sản phẩm'
    });
  }
};

// Get product by ID
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sản phẩm'
      });
    }
    
    res.json({
      success: true,
      message: 'Lấy thông tin sản phẩm thành công',
      data: product
    });
  } catch (error) {
    console.error('Error getting product:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy thông tin sản phẩm'
    });
  }
};

// Get product by slug
exports.getProductBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const product = await Product.findBySlug(slug);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sản phẩm'
      });
    }
    
    res.json({
      success: true,
      message: 'Lấy thông tin sản phẩm thành công',
      data: product
    });
  } catch (error) {
    console.error('Error getting product by slug:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy thông tin sản phẩm'
    });
  }
};

// Create new product
exports.createProduct = async (req, res) => {
  try {
    const productData = req.body;
    
    // Generate slug if not provided
    if (!productData.slug && productData.name) {
      productData.slug = productData.name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim('-');
    }
    
    // Check if SKU already exists
    if (productData.sku) {
      const existingProduct = await Product.findBySku(productData.sku);
      if (existingProduct) {
        return res.status(400).json({
          success: false,
          message: 'SKU đã tồn tại'
        });
      }
    }
    
    const product = await Product.create(productData);
    
    res.status(201).json({
      success: true,
      message: 'Tạo sản phẩm thành công',
      data: product
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi tạo sản phẩm'
    });
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // Check if product exists
    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sản phẩm'
      });
    }
    
    // Check SKU uniqueness if updating
    if (updateData.sku && updateData.sku !== existingProduct.sku) {
      const skuExists = await Product.findBySku(updateData.sku);
      if (skuExists) {
        return res.status(400).json({
          success: false,
          message: 'SKU đã tồn tại'
        });
      }
    }
    
    const product = await Product.update(id, updateData);
    
    res.json({
      success: true,
      message: 'Cập nhật sản phẩm thành công',
      data: product
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi cập nhật sản phẩm'
    });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    const deleted = await Product.delete(id);
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sản phẩm'
      });
    }
    
    res.json({
      success: true,
      message: 'Xóa sản phẩm thành công'
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi xóa sản phẩm'
    });
  }
};

// Update stock
exports.updateStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity, type = 'set' } = req.body;
    
    const product = await Product.updateStock(id, quantity, type);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sản phẩm'
      });
    }
    
    res.json({
      success: true,
      message: 'Cập nhật tồn kho thành công',
      data: product
    });
  } catch (error) {
    console.error('Error updating stock:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi cập nhật tồn kho'
    });
  }
};

// Get featured products
exports.getFeaturedProducts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 8;
    const products = await Product.getFeatured(limit);
    
    res.json({
      success: true,
      message: 'Lấy sản phẩm nổi bật thành công',
      data: products
    });
  } catch (error) {
    console.error('Error getting featured products:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy sản phẩm nổi bật'
    });
  }
};

// Get bestseller products
exports.getBestsellerProducts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 8;
    const products = await Product.getBestsellers(limit);
    
    res.json({
      success: true,
      message: 'Lấy sản phẩm bán chạy thành công',
      data: products
    });
  } catch (error) {
    console.error('Error getting bestseller products:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy sản phẩm bán chạy'
    });
  }
};
