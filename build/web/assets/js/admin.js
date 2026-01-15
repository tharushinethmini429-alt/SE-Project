function addCategory(event){
    if (event) {
        event.preventDefault();
    }
    
    var catName = $("#catName").val().trim();
    var catSlug = $("#catSlug").val().trim();
    
    if (!catName) {
        notify.warning('Validation Error', 'Category name is required');
        return false;
    }
    
    if (!catSlug) {
        notify.warning('Validation Error', 'Category slug is required');
        return false;
    }
    
    var formData = $("#categoryForm").serialize();
    
    var submitButton = event ? event.target : $("#catBtn")[0];
    var originalText = submitButton.innerHTML;
    submitButton.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Adding...';
    submitButton.disabled = true;
    
    $.ajax({
        type: "POST",
        url: contextPath + "/AddCategoryServlet",
        data: formData,
        success: function(response) {
            $("#loadingIndicator").hide();
            notify.success('Success!', response);
            setTimeout(() => location.reload(), 1500);
        },
        error: function(xhr, status, error) {
            notify.error('Error', 'Failed to add category: ' + (xhr.responseText || error));
            
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
        }
    });
    return false;
}

async function deleteCategory(catId){
    if (!catId) {
        notify.error('Error', 'Invalid category ID');
        return;
    }
    
    const confirmed = await confirmModal.delete('this category');
    
    if (!confirmed) {
        return;
    }
    
    $.ajax({
        url: contextPath + '/DeleteServlet',
        type: 'POST',
        data: {catId: catId},
        success: function(response){
            notify.success('Deleted!', response);
            setTimeout(() => location.reload(), 1500);
        },
        error: function(xhr, status, error){
            if (xhr.status === 409) {
                notify.warning('Cannot Delete Category', xhr.responseText);
            } else {
        
                notify.error('Error', 'Failed to delete category: ' + (xhr.responseText || error));
            }
        }
    });
}


var editMode = false;

function switchMode(catId) {
    editMode = !editMode;
    var buttonText = editMode ? "Edit Category" : "Add Category";
    var onClickFunction = editMode ? "updateCategory()" : "addCategory()";
    $("#catBtn").text(buttonText).attr("onclick", onClickFunction);
}

function editCategory(catId) {
    if (!catId) {
        notify.error('Error', 'Invalid category ID');
        return;
    }
    
    $.ajax({
        url: contextPath + '/GetCategoryServlet',
        type: 'GET',
        data: { catId: catId },
        dataType: 'json',
        success: function(category) {
            if (!category || category.length === 0) {
                notify.error('Error', 'Category not found');
                return;
            }
            
            console.log(category);
            var catId = category[0].catId;
            var catName = category[0].catName;
            var catSlug = category[0].catSlug;
            $('#catId').val(catId);
            $('#catName').val(catName);
            $('#catSlug').val(catSlug);
            switchMode(catId);
        },
        error: function(xhr, status, error) {
            notify.error('Error', 'Failed to fetch category data: ' + (xhr.responseText || error));
        }
    });
}

function updateCategory(event){
    if (event) {
        event.preventDefault();
    }
    
    var catName = $("#catName").val().trim();
    var catSlug = $("#catSlug").val().trim();

    if (!catName) {
        notify.warning('Validation Error', 'Category name is required');
        return false;
    }

    if (!catSlug) {
        notify.warning('Validation Error', 'Category slug is required');
        return false;
    }

    var formData = $("#categoryForm").serialize();

    var submitButton = event ? event.target : $("#catBtn")[0];
    var originalText = submitButton.innerHTML;
    submitButton.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Updating...';
    submitButton.disabled = true;

    $.ajax({
        type: "POST",
        url: contextPath + "/UpdateCategoryServlet",
        data: formData,
        success: function(response) {
            notify.success('Updated!', response);
            setTimeout(() => location.reload(), 1500);
        },
        error: function(xhr, status, error) {
            notify.error('Error', 'Failed to update category: ' + (xhr.responseText || error));
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
        }
    });
    return false;
}

$(document).ready(function() {
    
function fetchCategories() {
    $.ajax({
        url: contextPath + '/CategoriesServlet',
        type: 'GET',
        dataType: 'json',
        success: function(categories) {
            var tbody = $('#categoriesTableBody');
            var dropdown = $('#pro_cat');
            tbody.empty(); 
            
            if (categories.length === 0) {
                tbody.append('<tr><td colspan="4" class="text-center">No categories available</td></tr>');
            } else {
                $.each(categories, function(index, category) {
                    var row = $('<tr>').addClass('category-row').attr('data-cat-id', category.catId);
                    
                    // Add sequential number instead of ID
                    row.append($('<td>').addClass('cat-number').text(index + 1));
                    row.append($('<td>').addClass('cat-name').text(category.catName));
                    row.append($('<td>').addClass('cat-slug').text(category.catSlug));
                    row.append($('<td>').addClass('action').html(
                        '<div class="d-flex align-items-center gap-2">' +
                        '<button class="btn btn-sm btn-outline-primary" onclick="editCategory(' + category.catId + ')" data-bs-toggle="tooltip" title="Edit category">' +
                        '<i class="bi bi-pencil-fill"></i> Edit' +
                        '</button>' +
                        '<button class="btn btn-sm btn-outline-danger" onclick="deleteCategory(' + category.catId + ')" data-bs-toggle="tooltip" title="Delete category">' +
                        '<i class="bi bi-trash-fill"></i> Delete' +
                        '</button>' +
                        '</div>'
                    ));
                    tbody.append(row);
                    
                    dropdown.append($('<option>').text(category.catName).val(category.catId));
                });
                
                $('[data-bs-toggle="tooltip"]').tooltip();
            }
        },
        error: function(xhr, status, error) {
            notify.error('Error', 'Failed to fetch categories: ' + (xhr.responseText || error));
        }
    });
}

    
    function fetchProducts() {
        $.ajax({
            url: contextPath + '/ProductsServlet',
            type: 'GET',
            dataType: 'json',
            success: function(products) {
                populateProductGrid(products);
            },
            error: function(xhr, status, error) {
                notify.error('Error', 'Failed to fetch products: ' + (xhr.responseText || error));
            }
        });
    }
    
    function populateProductGrid(products) {
        var productGrid = $('#productGrid');
        productGrid.empty();

        if (products.length === 0) {
            productGrid.append('<div class="col-12 text-center py-5"><div class="alert alert-info"><i class="bi bi-info-circle me-2"></i>No products available. Click "Add New Product" to get started!</div></div>');
        } else {
            $.each(products, function(index, product) {
                var card = $('<div>').addClass('col');
                var cardBody = $('<div>').addClass('card-body text-center');

                var imageSrc = product.proImg && product.proImg.trim() !== '' 
                    ? contextPath + '/assets/images/uploads/' + product.proImg 
                    : contextPath + '/assets/images/placeholder.png';
                
                var img = $('<img>')
                    .addClass('img-fluid mb-3')
                    .attr('src', imageSrc)
                    .attr('alt', product.proName || 'Product')
                    .on('error', function() {
                        $(this).attr('src', 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23ddd" width="200" height="200"/%3E%3Ctext fill="%23999" font-family="sans-serif" font-size="18" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ENo Image%3C/text%3E%3C/svg%3E');
                    });
                
                var title = $('<h6>').addClass('product-title').text(product.proName);
                var price = $('<p>').addClass('product-price fs-5 mb-1').html('<span>Rs. ' + product.proPrice + '</span>');
                var rating = $('<div>').addClass('rating mb-0');

                for (var i = 0; i < Math.round(product.proReviews); i++) {
                    rating.append('<i class="bi bi-star-fill text-warning"></i>');
                }
                var reviews = $('<small>').text(product.proReviews + ' Reviews');

                var actions = $('<div>').addClass('actions d-flex align-items-center justify-content-center gap-2 mt-3');
                var editButton = $('<button>').addClass('btn btn-sm btn-outline-primary').attr('onclick', 'editProduct('+ product.proId +')').html('<i class="bi bi-pencil-fill"></i> Edit');
                var deleteButton = $('<button>')
                    .addClass('btn btn-sm btn-outline-danger')
                    .attr('onclick', 'deleteProduct(' + product.proId + ')')
                    .html('<i class="bi bi-trash-fill"></i> Delete');

                actions.append(editButton);
                actions.append(deleteButton);

                cardBody.append(img);
                cardBody.append(title);
                cardBody.append(price);
                cardBody.append(rating);
                cardBody.append(reviews);
                cardBody.append(actions);

                card.append(cardBody);
                productGrid.append(card);
            });
        }
    }
    
    function fetchOrders() {
        $.ajax({
            url: contextPath + '/OrdersServlet',
            type: 'GET',
            dataType: 'json',
            success: function(orders) {
                console.log(orders);
                var tbody = $('#ordersTableBody');
                tbody.empty();

                if (orders.length === 0) {
                    tbody.append('<tr><td colspan="6" class="text-center">No orders available</td></tr>');
                } else {
                    $.each(orders, function(index, order) {
                        var row = $('<tr>');
                        row.append($('<td>').text(order.orderCode));
                        row.append($('<td>').text(order.userName));
                        row.append($('<td>').text('Rs. ' + order.total.toFixed(2)));
                        row.append($('<td>').html('<span class="'+ getStatusBadgeClass(order.status) + '">' + order.status + '</span>'));
                        row.append($('<td>').text(order.date));
                        tbody.append(row);
                    });
                }
            },
            error: function(xhr, status, error) {
                notify.error('Error', 'Failed to fetch orders: ' + (xhr.responseText || error));
            }
        });
    }
    
    function getStatusBadgeClass(status) {
        switch (status) {
            case 'Received':
                return 'alert-success';
            case 'Cancelled':
                return 'alert-danger';
            case 'Pending':
                return 'alert-warning';
            default:
                return '';
        }
    }
    
    fetchCategories();
    fetchProducts();
    fetchOrders();
    
    $('#addProductModal').on('show.bs.modal', function() {
        loadCategoriesForAddProduct();
    });
    
    $('#addProductModal').on('hidden.bs.modal', function() {
        $('#addProductForm')[0].reset();
        $('#add_preview_container').addClass('d-none');
    });
});

function loadCategoriesForAddProduct() {
    $.ajax({
        url: contextPath + '/CategoriesServlet',
        type: 'GET',
        dataType: 'json',
        success: function(categories) {
            var dropdown = $('#add_pro_cat');
            dropdown.empty();
            dropdown.append($('<option>').text('Select a category').val('').attr('disabled', true).attr('selected', true));
            
            if (categories && categories.length > 0) {
                $.each(categories, function(index, category) {
                    dropdown.append($('<option>').text(category.catName).val(category.catId));
                });
            } else {
                dropdown.append($('<option>').text('No categories available').val('').attr('disabled', true));
                notify.warning('No Categories', 'Please add categories first before adding products');
            }
        },
        error: function(xhr, status, error) {
            notify.error('Error', 'Failed to load categories: ' + (xhr.responseText || error));
        }
    });
}

function previewAddImage() {
    const file = document.getElementById("add_pro_img").files[0];
    if (file) {
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
        if (!validTypes.includes(file.type)) {
            notify.warning('Invalid File', 'Please select a valid image file (JPG, PNG, GIF)');
            document.getElementById("add_pro_img").value = '';
            $('#add_preview_container').addClass('d-none');
            return;
        }
        
        if (file.size > 5 * 1024 * 1024) {
            notify.warning('File Too Large', 'Image size should not exceed 5MB');
            document.getElementById("add_pro_img").value = '';
            $('#add_preview_container').addClass('d-none');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = document.getElementById("add_preview");
            img.src = e.target.result;
            $('#add_preview_container').removeClass('d-none');
        };
        reader.onerror = function() {
            notify.error('Error', 'Failed to read image file');
            $('#add_preview_container').addClass('d-none');
        };
        reader.readAsDataURL(file);
    }
}

function addProduct() {
    var form = $('#addProductForm')[0];
    if (!form.checkValidity()) {
        form.reportValidity();
        notify.warning('Validation Error', 'Please fill in all required fields');
        return false;
    }
    
    var proName = $('#add_pro_name').val().trim();
    var proPrice = $('#add_pro_price').val();
    var proCat = $('#add_pro_cat').val();
    var proDesc = $('#add_pro_desc').val().trim();
    var proImg = $('#add_pro_img')[0].files.length;
    
    if (!proName) {
        notify.warning('Validation Error', 'Product name is required');
        return false;
    }
    
    if (!proPrice || proPrice <= 0) {
        notify.warning('Validation Error', 'Please enter a valid price');
        return false;
    }
    
    if (!proCat) {
        notify.warning('Validation Error', 'Please select a category');
        return false;
    }
    
    if (!proDesc) {
        notify.warning('Validation Error', 'Product description is required');
        return false;
    }
    
    if (proImg === 0) {
        notify.warning('Validation Error', 'Please select a product image');
        return false;
    }
    
    var formData = new FormData(form);
    
    var submitButton = event.target;
    var originalText = submitButton.innerHTML;
    submitButton.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Adding...';
    submitButton.disabled = true;
    
    $.ajax({
        type: "POST",
        url: contextPath + "/AddProductServlet",
        data: formData,
        processData: false,  
        contentType: false,
        timeout: 30000,
        success: function(response) {
            var addModal = bootstrap.Modal.getInstance(document.getElementById('addProductModal'));
            if (addModal) {
                addModal.hide();
            }
            
            notify.success('Success!', response || 'Product added successfully');
            
            $('#addProductForm')[0].reset();
            $('#add_preview_container').addClass('d-none');
            
            setTimeout(() => location.reload(), 1500);
        },
        error: function(xhr, status, error) {
            var errorMessage = 'Failed to add product';
            
            if (xhr.status === 0) {
                errorMessage = 'Network error. Please check your connection';
            } else if (xhr.status === 404) {
                errorMessage = 'Server endpoint not found';
            } else if (xhr.status === 500) {
                errorMessage = 'Server error. Please try again';
            } else if (status === 'timeout') {
                errorMessage = 'Request timeout. Please try again';
            } else if (xhr.responseText) {
                errorMessage = xhr.responseText;
            }
            
            notify.error('Error', errorMessage);
            
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
        }
    });
    return false;
}

function editProduct(proId) {
    if (!proId) {
        notify.error('Error', 'Invalid product ID');
        return;
    }
    
    $.ajax({
        url: contextPath + '/GetProductServlet',
        type: 'GET',
        data: { proId: proId },
        dataType: 'json',
        success: function(response) {
            console.log('Product data:', response);
            
            if (!response || (Array.isArray(response) && response.length === 0)) {
                notify.error('Error', 'Product not found');
                return;
            }
            
            var product = Array.isArray(response) ? response[0] : response;
            
            $('#pro_id').val(product.proId);
            $('#pro_name').val(product.proName);
            $('#pro_desc').val(product.proDesc);
            $('#pro_price').val(product.proPrice);
            $('#pro_cat').val(product.catId);
            
            var imagePath = contextPath + '/assets/images/uploads/' + product.proImg;
            $('#pro_img').attr('src', imagePath);
            $('#img_input').val(product.proImg);
            
            $('#image_box').removeClass('d-none');
            $('#image_input').addClass('d-none');
            $('#new_preview_container').addClass('d-none');
            $('#new_pro_img').val('');
            
            var editModal = new bootstrap.Modal(document.getElementById('editProductModal'));
            editModal.show();
        },
        error: function(xhr, status, error) {
            console.error('Error fetching product:', error);
            notify.error('Error', 'Failed to fetch product data: ' + (xhr.responseText || error));
        }
    });
}

function changeImage(){
    event.preventDefault();
    $('#image_box').addClass('d-none');
    $('#image_input').removeClass('d-none');
}

function cancelImageChange(){
    event.preventDefault();
    $('#image_input').addClass('d-none');
    $('#image_box').removeClass('d-none');
    $('#new_preview_container').addClass('d-none');
    $('#new_pro_img').val('');
}

function previewNewImage() {
    const file = document.getElementById("new_pro_img").files[0];
    if (file) {
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
        if (!validTypes.includes(file.type)) {
            notify.warning('Invalid File', 'Please select a valid image file (JPG, PNG, GIF)');
            document.getElementById("new_pro_img").value = '';
            $('#new_preview_container').addClass('d-none');
            return;
        }
        
        if (file.size > 5 * 1024 * 1024) {
            notify.warning('File Too Large', 'Image size should not exceed 5MB');
            document.getElementById("new_pro_img").value = '';
            $('#new_preview_container').addClass('d-none');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = document.getElementById("new_preview");
            img.src = e.target.result;
            $('#new_preview_container').removeClass('d-none');
        };
        reader.onerror = function() {
            notify.error('Error', 'Failed to read image file');
            $('#new_preview_container').addClass('d-none');
        };
        reader.readAsDataURL(file);
    }
}

function updateProduct(event) {
    event.preventDefault();

    var form = $("#editProductForm")[0];
    if (!form.checkValidity()) {
        form.reportValidity();
        notify.warning('Validation Error', 'Please fill in all required fields');
        return false;
    }

    var formData = new FormData(form);

    var newImageInput = document.getElementById("new_pro_img");
    var newImage = newImageInput?.files.length > 0 ? newImageInput.files[0] : null;

    var imageChanged = !$("#image_input").hasClass("d-none");

    if (imageChanged && newImage) {
        formData.append("isImageChanged", "yes");
        formData.append("pro_img", newImage);
    } else {
        formData.append("isImageChanged", "no");
    }
    
    var submitButton = event.target;
    var originalText = submitButton.innerHTML;
    submitButton.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Updating...';
    submitButton.disabled = true;

    $.ajax({
        type: "POST",
        url: contextPath + "/UpdateProductServlet",
        data: formData,
        processData: false,
        contentType: false,
        timeout: 30000,
        success: function(response) {
            var editModal = bootstrap.Modal.getInstance(document.getElementById('editProductModal'));
            if (editModal) {
                editModal.hide();
            }
            
            notify.success('Success!', 'Product updated successfully');
            
            setTimeout(() => location.reload(), 1500);
        },
        error: function(xhr, status, error) {
            console.log(xhr.responseText);
            
            var errorMessage = 'Failed to update product';
            
            if (xhr.status === 0) {
                errorMessage = 'Network error. Please check your connection';
            } else if (xhr.status === 404) {
                errorMessage = 'Server endpoint not found';
            } else if (xhr.status === 500) {
                errorMessage = 'Server error. Please try again';
            } else if (status === 'timeout') {
                errorMessage = 'Request timeout. Please try again';
            } else if (xhr.responseText) {
                errorMessage = xhr.responseText;
            }
            
            notify.error('Error', errorMessage);
            
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
        }
    });

    return false;
}

async function deleteProduct(proId) {
    if (!proId) {
        notify.error('Error', 'Invalid product ID');
        return;
    }
    
    const confirmed = await confirmModal.delete('this product');
    
    if (!confirmed) {
        return;
    }

    $.ajax({
        url: contextPath + '/DeleteProductServlet',
        type: 'POST',
        data: { proId: proId },
        success: function(response) {
            notify.success('Deleted!', response || 'Product deleted successfully');
            setTimeout(() => {
                $('#productGrid').find(`[onclick="editProduct(${proId})"]`).closest('.col').remove();
            }, 1000);
        },
        error: function(xhr, status, error) {
            notify.error('Error', 'Failed to delete product: ' + (xhr.responseText || error));
        }
    });
}

function signOut() {
    $.ajax({
        type: 'GET',
        url: contextPath + '/SignoutServlet',
        success: function (response) {
            if (response === 'Sign out Succesfully') {
                notify.success('Success', 'Signed out successfully');
                setTimeout(() => {
                    window.location.href = '../signin.jsp';
                }, 1000);
            }
        },
        error: function (xhr, status, error) {
            notify.error('Error', 'Sign out failed: ' + (xhr.responseText || error));
        },
    });
}

$(document).ready(function() {
    function getTotalProducts(){
        $.ajax({
            type: 'GET',
            url: contextPath + '/GetTotalsServlet',
            success: function(products){
                $('#totalProducts').text(products.totalProducts || 0);
                $('#totalCategories').text(products.totalCategories || 0);
                $('#totalOrders').text(products.totalOrders || 0);
                $('#totalUsers').text(products.totalUsers || 0);
            },
            error: function(xhr, status, error) {
                notify.error('Error', 'Failed to fetch totals: ' + (xhr.responseText || error));
            }
        });
    } 
      
    getTotalProducts();
});

$(document).ready(function() {
    loadUsers();
});

function loadUsers() {
    $.ajax({
        type: "GET",
        url: contextPath + "/admin/getUsers",
        dataType: "json",
        success: function(users) {
            let tbody = $("#usersTableBody");
            tbody.empty();
            
            if (!users || users.length === 0) {
                tbody.append('<tr><td colspan="7" class="text-center">No users available</td></tr>');
                return;
            }
            
            users.forEach(function(user) {
                let row = `<tr data-user-id="${user.userId}">
                    <td>${user.userId}</td>
                    <td>${user.userFname || 'N/A'}</td>
                    <td>${user.userLname || 'N/A'}</td>
                    <td>${user.userEmail || 'N/A'}</td>
                    <td>${user.userPno || 'N/A'}</td>
                    <td>${user.userStatus || 'N/A'}</td>
                    <td>
                        <div class="d-flex align-items-center gap-2">
                            <button class="btn btn-sm btn-outline-primary" onclick="editUser(${user.userId})" data-bs-toggle="tooltip" title="Edit user">
                                <i class="bi bi-pencil-fill"></i> Edit
                            </button>
                            <button class="btn btn-sm btn-outline-danger" onclick="deleteUser(${user.userId})" data-bs-toggle="tooltip" title="Delete user">
                                <i class="bi bi-trash-fill"></i> Delete
                            </button>
                        </div>
                    </td>
                </tr>`;
                tbody.append(row);
            });
            
            $('[data-bs-toggle="tooltip"]').tooltip();
        },
        error: function(xhr, status, error) {
            console.error("Error fetching users:", error);
            notify.error('Error', 'Failed to fetch users: ' + (xhr.responseText || error));
        }
    });
}

function addOrUpdateUser(event) {
    if (event) {
        event.preventDefault();
    }
    
    let userId = $("#userId").val();
    let userFname = $("#userFname").val();
    let userLname = $("#userLname").val();
    let userEmail = $("#userForm input[name='userEmail']").val();
    let userPassword = $("#userPassword").val();
    let userPno = $("#userPno").val();
    let userStatus = $("#userStatus").val();
    
    userId = userId ? userId.trim() : "";
    userFname = userFname ? userFname.trim() : "";
    userLname = userLname ? userLname.trim() : "";
    userEmail = userEmail ? userEmail.trim() : "";
    userPassword = userPassword ? userPassword.trim() : "";
    userPno = userPno ? userPno.trim() : "";
    
    if (!userFname) {
        notify.warning('Validation Error', 'First name is required');
        return false;
    }
    
    if (!userLname) {
        notify.warning('Validation Error', 'Last name is required');
        return false;
    }
    
    if (!userEmail) {
        notify.warning('Validation Error', 'Email is required');
        return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userEmail)) {
        notify.warning('Validation Error', 'Please enter a valid email address');
        return false;
    }
    
    if (!userId && !userPassword) {
        notify.warning('Validation Error', 'Password is required for new users');
        return false;
    }
    
    if (userPassword && userPassword.length < 6) {
        notify.warning('Validation Error', 'Password must be at least 6 characters');
        return false;
    }
    
    if (!userPno) {
        notify.warning('Validation Error', 'Phone number is required');
        return false;
    }
    
    if (!userStatus) {
        notify.warning('Validation Error', 'User status is required');
        return false;
    }
    
    let data = {
        userId: userId,
        userFname: userFname,
        userLname: userLname,
        userEmail: userEmail,
        userPno: userPno,
        userStatus: userStatus
    };
    
    if (userPassword) {
        data.userPassword = userPassword;
    }

    let url = userId ? contextPath + "/admin/updateUser" : contextPath + "/admin/addUser";
    
    var submitButton = event ? event.target : $("#userBtn")[0];
    var originalText = submitButton.innerHTML;
    submitButton.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>' + (userId ? 'Updating...' : 'Adding...');
    submitButton.disabled = true;

    $.ajax({
        type: "POST",
        url: url,
        data: data,
        success: function(response) {
            notify.success('Success!', userId ? "User updated successfully!" : "User added successfully!");
            $("#userForm")[0].reset();
            $("#userId").val("");
            $("#userPassword").attr('placeholder', 'Password');
            $("#userBtn").text("Add User");
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
            loadUsers();
        },
        error: function(xhr, status, error) {
            console.error("Error saving user:", error);
            notify.error('Error', 'Failed to save user: ' + (xhr.responseText || error));
            
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
        }
    });
    
    return false;
}

function editUser(userId) {
    if (!userId) {
        notify.error('Error', 'Invalid user ID');
        return;
    }
    
    let tr = $(`tr[data-user-id="${userId}"]`);
    
    if (tr.length === 0) {
        notify.error('Error', 'User not found');
        return;
    }
    
    $("#userId").val(userId);
    $("#userFname").val(tr.find('td:eq(1)').text());
    $("#userLname").val(tr.find('td:eq(2)').text());
    
    $("#userForm input[name='userEmail']").val(tr.find('td:eq(3)').text());
    $("#userPassword").val('').attr('placeholder', 'Enter new password or leave blank to keep current');
    
    $("#userPno").val(tr.find('td:eq(4)').text());
    $("#userStatus").val(tr.find('td:eq(5)').text());
    $("#userBtn").text("Update User");
    
    $('html, body').animate({
        scrollTop: $("#userForm").offset().top - 100
    }, 500);
}

async function deleteUser(userId) {
    if (!userId) {
        notify.error('Error', 'Invalid user ID');
        return;
    }
    
    const confirmed = await confirmModal.delete('this user');
    
    if (!confirmed) {
        return;
    }

    $.ajax({
        type: "POST",
        url: contextPath + "/admin/deleteUser",
        data: { userId: userId },
        success: function(response) {
            notify.success('Deleted!', response || "User deleted successfully!");
            loadUsers();
        },
        error: function(xhr, status, error) {
            console.error("Error deleting user:", error);
            let errorMessage = xhr.responseText || 'Failed to delete user';
            notify.error('Error', errorMessage);
        }
    });
}