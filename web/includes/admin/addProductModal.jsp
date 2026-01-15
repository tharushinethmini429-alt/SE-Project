<%@page contentType="text/html" pageEncoding="UTF-8"%>

<div class="modal fade" id="addProductModal" tabindex="-1" aria-labelledby="addProductModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="addProductModalLabel">
                    <i class="bi bi-plus-circle me-2"></i>Add New Product
                </h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form id="addProductForm" enctype="multipart/form-data">
                    <div class="row g-3">
                        <div class="col-md-6">
                            <label for="add_pro_name" class="form-label">Product Name <span class="text-danger">*</span></label>
                            <input type="text" class="form-control" id="add_pro_name" name="pro_name" required>
                        </div>

                        <div class="col-md-6">
                            <label for="add_pro_price" class="form-label">Price <span class="text-danger">*</span></label>
                            <div class="input-group">
                                <span class="input-group-text">Rs. </span>
                                <input type="number" step="0.01" class="form-control" id="add_pro_price" name="pro_price" required>
                            </div>
                        </div>

                        <div class="col-md-12">
                            <label for="add_pro_cat" class="form-label">Category <span class="text-danger">*</span></label>
                            <select class="form-select" id="add_pro_cat" name="pro_cat" required>
                                <option value="" selected disabled>Select a category</option>
                            </select>
                        </div>

                        <div class="col-md-12">
                            <label for="add_pro_desc" class="form-label">Description <span class="text-danger">*</span></label>
                            <textarea class="form-control" id="add_pro_desc" name="pro_desc" rows="4" required></textarea>
                        </div>

                        <div class="col-md-12">
                            <label for="add_pro_img" class="form-label">Product Image <span class="text-danger">*</span></label>
                            <input type="file" class="form-control" id="add_pro_img" name="pro_img" accept="image/*" onchange="previewAddImage()" required>
                            <small class="text-muted">Recommended: 300x300px, PNG or JPG</small>
                        </div>

                        <div class="col-md-12 d-none" id="add_preview_container">
                            <label class="form-label">Image Preview</label>
                            <div class="text-center p-3 border rounded">
                                <img id="add_preview" src="" alt="Preview" style="max-width: 300px; max-height: 300px;" class="img-fluid rounded">
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                    <i class="bi bi-x-circle me-1"></i>Cancel
                </button>
                <button type="button" class="btn btn-primary" onclick="addProduct()">
                    <i class="bi bi-check-circle me-1"></i>Add Product
                </button>
            </div>
        </div>
    </div>
</div>