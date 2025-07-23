// controllers/categoryController.js - PostgreSQL version
const Category = require('../models/categoryModel');

// Get all categories
exports.getAllCategories = async (req, res) => {
  try {
    const filters = {
      status: req.query.status || 'active',
      parent_id: req.query.parent_id,
      search: req.query.search,
      sortBy: req.query.sortBy || 'sort_order',
      sortOrder: req.query.sortOrder || 'ASC'
    };
    
    if (req.query.limit) {
      filters.limit = parseInt(req.query.limit);
      filters.offset = parseInt(req.query.offset) || 0;
    }
    
    const categories = await Category.getAll(filters);
    
    res.json({
      success: true,
      message: 'Lấy danh sách danh mục thành công',
      data: categories
    });
  } catch (error) {
    console.error('Error getting categories:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách danh mục'
    });
  }
};

// Get category by ID
exports.getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy danh mục'
      });
    }
    
    res.json({
      success: true,
      message: 'Lấy thông tin danh mục thành công',
      data: category
    });
  } catch (error) {
    console.error('Error getting category:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy thông tin danh mục'
    });
  }
};

// Get category by slug
exports.getCategoryBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const category = await Category.findBySlug(slug);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy danh mục'
      });
    }
    
    res.json({
      success: true,
      message: 'Lấy thông tin danh mục thành công',
      data: category
    });
  } catch (error) {
    console.error('Error getting category by slug:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy thông tin danh mục'
    });
  }
};

// Create new category
exports.createCategory = async (req, res) => {
  try {
    const categoryData = req.body;
    
    // Generate slug if not provided
    if (!categoryData.slug && categoryData.name) {
      categoryData.slug = categoryData.name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim('-');
    }
    
    const category = await Category.create(categoryData);
    
    res.status(201).json({
      success: true,
      message: 'Tạo danh mục thành công',
      data: category
    });
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi tạo danh mục'
    });
  }
};

// Update category
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // Check if category exists
    const existingCategory = await Category.findById(id);
    if (!existingCategory) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy danh mục'
      });
    }
    
    const category = await Category.update(id, updateData);
    
    res.json({
      success: true,
      message: 'Cập nhật danh mục thành công',
      data: category
    });
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi cập nhật danh mục'
    });
  }
};

// Delete category
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    
    const deleted = await Category.delete(id);
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy danh mục'
      });
    }
    
    res.json({
      success: true,
      message: 'Xóa danh mục thành công'
    });
  } catch (error) {
    console.error('Error deleting category:', error);
    if (error.message.includes('has products')) {
      return res.status(400).json({
        success: false,
        message: 'Không thể xóa danh mục có sản phẩm'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Lỗi khi xóa danh mục'
    });
  }
};

// Get featured categories
exports.getFeaturedCategories = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 8;
    const categories = await Category.getFeatured(limit);
    
    res.json({
      success: true,
      message: 'Lấy danh mục nổi bật thành công',
      data: categories
    });
  } catch (error) {
    console.error('Error getting featured categories:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh mục nổi bật'
    });
  }
};

// Get parent categories
exports.getParentCategories = async (req, res) => {
  try {
    const categories = await Category.getParents();
    
    res.json({
      success: true,
      message: 'Lấy danh mục cha thành công',
      data: categories
    });
  } catch (error) {
    console.error('Error getting parent categories:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh mục cha'
    });
  }
};

// Get children categories
exports.getChildrenCategories = async (req, res) => {
  try {
    const { parentId } = req.params;
    const categories = await Category.getChildren(parentId);
    
    res.json({
      success: true,
      message: 'Lấy danh mục con thành công',
      data: categories
    });
  } catch (error) {
    console.error('Error getting children categories:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh mục con'
    });
  }
};
