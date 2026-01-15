<head>
    <style>
.modal-backdrop.show {
    backdrop-filter: blur(5px);
    background-color: rgba(0, 0, 0, 0.5);
}

.modal.fade .modal-dialog {
    transition: transform 0.3s ease-out;
}

.modal-content {
    border: none;
    border-radius: 12px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.modal-header {
    padding: 1.5rem;
}

.modal-body {
    padding: 1.5rem;
    max-height: 70vh;
    overflow-y: auto;
}

.modal-footer {
    padding: 1.5rem;
}

.form-control:focus, .form-select:focus {
    border-color: #0d6efd;
    box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
}

.btn {
    padding: 0.5rem 1.25rem;
    border-radius: 6px;
}

.modal-body::-webkit-scrollbar {
    width: 8px;
}

.modal-body::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
}

.modal-body::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 10px;
}

.modal-body::-webkit-scrollbar-thumb:hover {
    background: #555;
}
</style>
</head>
<div class="modal fade" id="editProductModal" tabindex="-1" aria-labelledby="editProductModalLabel" aria-hidden="true" data-bs-backdrop="static">
    <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content">
            <div class="modal-header border-0">
                <h5 class="modal-title" id="editProductModalLabel">Edit Product</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            
            <div class="modal-body">
                <form id="editProductForm" class="row g-3" enctype="multipart/form-data">

                    <div class="col-12">
                        <label class="form-label fw-semibold">Product Title</label>
                        <input type="text" class="form-control" placeholder="Enter product title" name="pro_name" id="pro_name" required>
                    </div>

                    <div class="col-12">
                        <label class="form-label fw-semibold">Description</label>
                        <textarea class="form-control" placeholder="Enter product description" rows="4" name="pro_desc" id="pro_desc" required></textarea>
                    </div>

                    <div class="col-12" id="image_box">
                        <label class="form-label fw-semibold">Current Image</label>
                        <div class="d-flex align-items-center gap-3 p-3 bg-light rounded">
                            <img id="pro_img" 
                                 class="rounded border shadow-sm"
                                 style="width:120px; height:120px; object-fit:cover;" 
                                 alt="Product Image"/>

                            <button type="button" class="btn btn-outline-primary" onclick="changeImage()">
                                <i class="bi bi-image"></i> Change Image
                            </button>
                        </div>
                        <input type="hidden" name="img_input" id="img_input" />
                    </div>

                    <div class="col-12 d-none" id="image_input">
                        <label class="form-label fw-semibold">Select New Image</label>
                        <input type="file" id="new_pro_img" name="pro_img" class="form-control" accept="image/*" onchange="previewNewImage()">

                        <div class="mt-3 p-3 bg-light rounded d-none" id="new_preview_container">
                            <img id="new_preview"
                                 class="rounded border shadow-sm"
                                 style="width:120px; height:120px; object-fit:cover;" 
                                 alt="New Image Preview"/>
                        </div>

                        <button type="button" class="btn btn-outline-secondary mt-2" onclick="cancelImageChange()">
                            <i class="bi bi-x-circle"></i> Cancel
                        </button>
                    </div>

                    <div class="col-12 col-md-6">
                        <label class="form-label fw-semibold">Category</label>
                        <select class="form-select" id="pro_cat" name="pro_cat" required>
                            <option id="cat" value="">Select Category</option>
                        </select>
                    </div>

                    <div class="col-12 col-md-6">
                        <label class="form-label fw-semibold">Price (Rs. )</label>
                        <input type="number" step="0.01" class="form-control" placeholder="0.00" name="pro_price" id="pro_price" required>
                    </div>

                    <div class="col-12">
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" id="flexCheckDefault">
                            <label class="form-check-label" for="flexCheckDefault">
                                Publish on website
                            </label>
                        </div>
                    </div>

                    <input type="hidden" name="pro_id" id="pro_id" />

                </form>
            </div>
            
            <div class="modal-footer border-0">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                <button type="button" class="btn btn-primary" onclick="updateProduct(event)">
                    <i class="bi bi-check-circle"></i> Update Product
                </button>
            </div>
        </div>
    </div>
</div>
