//Add Category
function addCategory(){
    var formData = $("#categoryForm").serialize();
    $.ajax({
        type: "POST",
        url: contextPath + "/AddCategoryServlet",
        data: formData,
        success: function(response) {
            $("#loadingIndicator").hide();
            alert(response);
        }
    });
    return false;
}

//Delete Category
function deleteCategory(catId){
    $.ajax({
        url: contextPath + '/DeleteServlet',
        type: 'POST',
        data: {catId: catId},
        success: function(response){
            alert(response);
            location.reload();
            
        },
        error: function(){
            alert("Error Deleting category");
        }
    })
}


//Switch add category to Edit Category
var editMode = false;

function switchMode(catId) {
    editMode = !editMode;
    var buttonText = editMode ? "Edit Category" : "Add Category";
    var onClickFunction = editMode ? "updateCategory()" : "addCategory()";
    $("#catBtn").text(buttonText).attr("onclick", onClickFunction);
}

//Get Edit Category Data
function editCategory(catId) {
    $.ajax({
        url: contextPath + '/GetCategoryServlet',
        type: 'GET',
        data: { catId: catId },
        dataType: 'json',
        success: function(category) {
            console.log(category);
            var catId = category[0].catId;
            var catName = category[0].catName;
            var catSlug = category[0].catSlug;
            $('#catId').val(catId);
            $('#catName').val(catName);
            $('#catSlug').val(catSlug);
            switchMode(catId);
        },
        error: function() {
            alert('Error fetching category data.');
        }
    });
}

//Update category
function updateCategory(){
    var formData = $("#categoryForm").serialize();
    
    $.ajax({
        type: "POST",
        url: contextPath + "/UpdateCategoryServlet",
        data: formData,
        success: function(response) {
            $("#loadingIndicator").hide();
            alert(response);
        }
    });
    return false;
}



$(document).ready(function() {
    //Display Categories
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
                tbody.append('<tr><td colspan="5" class="text-center">No categories available</td></tr>');
            } else {
                $.each(categories, function(index, category) {
                    var row = $('<tr>').addClass('category-row').attr('data-cat-id', category.catId);
                    row.append($('<td>').addClass('cat-id').text(category.catId));
                    row.append($('<td>').addClass('cat-name').text(category.catName));
                    row.append($('<td>').addClass('cat-slug').text(category.catSlug));
                    row.append($('<td>').addClass('action').html(
                        '<div class="d-flex align-items-center gap-3 fs-6">' +
                        '<button class="text-warning edit-info" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Edit info" aria-label="Edit" onclick="editCategory(' + category.catId + ')"><img src="../assets/images/icons/edit.png"/></button>' +
                        '<button class="text-danger delete-category" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Delete" aria-label="Delete" onclick="deleteCategory(' + category.catId + ')"><img src="../assets/images/icons/trash.png"/></button>' +
                        '</div>'
                    ));
                    tbody.append(row);
                    
                    dropdown.append($('<option>').text(category.catName).val(category.catId));
                });
            }
        },
        error: function() {
            alert('Error fetching categories.');
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
            error: function() {
                alert('Error fetching products.');
            }
        });
    }
    
    function populateProductGrid(products) {
        var productGrid = $('#productGrid');
        productGrid.empty();

        if (products.length === 0) {
            productGrid.append('<div class="col"><p>No products available</p></div>');
        } else {
            $.each(products, function(index, product) {
                var card = $('<div>').addClass('col');
                var cardBody = $('<div>').addClass('card-body text-center');

                var img = $('<img>').addClass('img-fluid mb-3').attr('src', contextPath + '/assets/images/uploads/' + product.proImg).attr('alt', '');
                var title = $('<h6>').addClass('product-title').text(product.proName);
                var price = $('<p>').addClass('product-price fs-5 mb-1').html('<span>$' + product.proPrice + '</span>');
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
                        row.append($('<td>').text('Rs.' + order.total.toFixed(2)));
                        row.append($('<td>').html('<span class="'+ getStatusBadgeClass(order.status) + '">' + order.status + '</span>'));
                        row.append($('<td>').text(order.date));
                        tbody.append(row);
                    });
                }
            },
            error: function() {
                alert('Error fetching orders.');
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
});

//Add Product
function addProduct(){
    event.preventDefault();
    var formData = new FormData($('#addProductForm')[0]);

    
    $.ajax({
        type: "POST",
        url: contextPath + "/AddProductServlet",
        data: formData,
        processData: false,  
        contentType: false,  
        success: function(response) {
            $("#loadingIndicator").hide();
            alert(response);
            location.reload();
        },
        error: function(xhr, status, error) {
            alert("Error adding product: " + error);
        }
    });
    return false;
}


// ============================================
// MODAL EDIT PRODUCT FUNCTIONS - NEW CODE
// ============================================

// Edit Product - Open Modal and Load Data
function editProduct(proId) {
    // Fetch product data
    $.ajax({
        url: contextPath + '/GetProductServlet',
        type: 'GET',
        data: { proId: proId },
        dataType: 'json',
        success: function(response) {
            console.log('Product data:', response);
            
            // Handle array response (product is at index 0)
            var product = Array.isArray(response) ? response[0] : response;
            
            // Populate form fields
            $('#pro_id').val(product.proId);
            $('#pro_name').val(product.proName);
            $('#pro_desc').val(product.proDesc);
            $('#pro_price').val(product.proPrice);
            $('#pro_cat').val(product.catId);
            $('#pro_img').attr('src', contextPath + '/assets/images/uploads/' + product.proImg);
            
            // IMPORTANT: Store the original image filename
            $('#pro_img').attr('data-original-img', product.proImg);
            
            // Reset image input state
            $('#image_box').removeClass('d-none');
            $('#image_input').addClass('d-none');
            $('#new_preview_container').addClass('d-none');
            $('#new_pro_img').val('');
            
            // Open the modal
            var editModal = new bootstrap.Modal(document.getElementById('editProductModal'));
            editModal.show();
        },
        error: function(xhr, status, error) {
            console.error('Error fetching product:', error);
            alert('Error fetching product data.');
        }
    });
}

// Image Change
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
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = document.getElementById("new_preview");
            img.src = e.target.result;
            $('#new_preview_container').removeClass('d-none');
        };
        reader.readAsDataURL(file);
    }
}

function updateProduct(event) {
    event.preventDefault();

    var formData = new FormData();
    
    // Add all form fields
    formData.append("pro_id", $("#pro_id").val());
    formData.append("pro_name", $("#pro_name").val());
    formData.append("pro_desc", $("#pro_desc").val());
    formData.append("pro_price", $("#pro_price").val());
    formData.append("pro_cat", $("#pro_cat").val());

    // Check if new image is selected
    var newImageInput = document.getElementById("new_pro_img");
    var imageChanged = !$("#image_input").hasClass("d-none");

    if (imageChanged && newImageInput && newImageInput.files.length > 0) {
        // New image selected
        formData.append("isImageChanged", "yes");
        formData.append("pro_img", newImageInput.files[0]);
        console.log("Image changed - sending new file");
    } else {
        // No image change - send original filename as text
        formData.append("isImageChanged", "no");
        var originalImg = $("#pro_img").attr('data-original-img');
        formData.append("oldImage", originalImg);
        console.log("Image NOT changed - keeping: " + originalImg);
    }

    // Debug: Log what we're sending
    console.log("Form data being sent:");
    for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
    }

    $.ajax({
        type: "POST",
        url: contextPath + "/UpdateProductServlet",
        data: formData,
        processData: false,
        contentType: false,
        success: function(response) {
            console.log("Server response:", response);
            
            // Close modal
            var editModal = bootstrap.Modal.getInstance(document.getElementById('editProductModal'));
            if (editModal) {
                editModal.hide();
            }
            
            alert("Product Updated Successfully");
            location.reload();
        },
        error: function(xhr, status, error) {
            console.log("Error response:", xhr.responseText);
            alert("Error updating product: " + error);
        }
    });

    return false;
}

// ============================================
// END MODAL EDIT PRODUCT FUNCTIONS
// ============================================


//Sign out
function signOut() {
  $.ajax({
    type: 'GET',
    url: contextPath + '/SignoutServlet',
    success: function (response) {
      if (response === 'Sign out Succesfully') {
        window.location.href = '../signin.jsp';
      }
    },
    error: function (xhr, status, error) {
      alert('Error occurred: ' + error);
    },
  });
}

// Delete Product
function deleteProduct(proId) {
    if (!confirm("Are you sure you want to delete this product?")) {
        return;
    }

    $.ajax({
        url: contextPath + '/DeleteProductServlet',
        type: 'POST',
        data: { proId: proId },
        success: function(response) {
            alert(response);
            // Optionally remove product card from grid without reloading
            $('#productGrid').find(`[onclick="editProduct(${proId})"]`).closest('.col').remove();
        },
        error: function(xhr, status, error) {
            alert("Error deleting product: " + error);
        }
    });
}

$(document).ready(function() {
    function getTotalProducts(){
     $.ajax({
         type: 'GET',
         url: contextPath + '/GetTotalsServlet',
         success: function(products){
             $('#totalProducts').text(products.totalProducts);
             $('#totalCategories').text(products.totalCategories);
             $('#totalOrders').text(products.totalOrders);
             $('#totalUsers').text(products.totalUsers);
         }
     });
      } 
      
      getTotalProducts();
  })
  
  // Load users on page load
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
            users.forEach(function(user) {
                let row = `<tr data-user-id="${user.userId}">
                    <td>${user.userId}</td>
                    <td>${user.userFname}</td>
                    <td>${user.userLname}</td>
                    <td>${user.userEmail}</td>
                    <td>${user.userPno}</td>
                    <td>${user.userStatus}</td>
                    <td>
    <div class="d-flex align-items-center gap-3 fs-6">
        <button class="text-warning edit-user-btn" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Edit info" aria-label="Edit" onclick="editUser(${user.userId})">
            <img src="../assets/images/icons/edit.png" alt="Edit"/>
        </button>
        <button class="text-danger delete-user-btn" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Delete" aria-label="Delete" onclick="deleteUser(${user.userId})">
            <img src="../assets/images/icons/trash.png" alt="Delete"/>
        </button>
    </div>
</td>

                </tr>`;
                tbody.append(row);
            });
        },
        error: function(err) {
            console.error("Error fetching users:", err);
        }
    });
}

// Add or update user
function addOrUpdateUser() {
    let userId = $("#userId").val();
    let data = {
        userId: userId,
        userFname: $("#userFname").val(),
        userLname: $("#userLname").val(),
        userEmail: $("#userEmail").val(),
        userPno: $("#userPno").val(),
        userStatus: $("#userStatus").val()
    };

    // If userId exists → update, else add
    let url = userId ? contextPath + "/admin/updateUser" : contextPath + "/admin/addUser";

    $.ajax({
        type: "POST",
        url: url,
        data: data,
        success: function(response) {
            alert(userId ? "User updated!" : "User added!");
            $("#userForm")[0].reset();
            $("#userId").val("");
            $("#userBtn").text("Add User");
            loadUsers(); // reload table
        },
        error: function(err) {
            console.error("Error saving user:", err);
        }
    });
}


// Edit button click
$(document).on('click', '.edit-user-btn', function() {
    let tr = $(this).closest('tr');
    $("#userId").val(tr.data('user-id'));
    $("#userFname").val(tr.find('td:eq(1)').text());
    $("#userLname").val(tr.find('td:eq(2)').text());
    $("#userEmail").val(tr.find('td:eq(3)').text());
    $("#userPno").val(tr.find('td:eq(4)').text());
    $("#userStatus").val(tr.find('td:eq(5)').text());
    $("#userBtn").text("Update User");
});

// Delete button click
$(document).on('click', '.delete-user-btn', function() {
    if(!confirm("Are you sure?")) return;
    let userId = $(this).closest('tr').data('user-id');

    $.ajax({
        type: "POST",
        url: contextPath + "/admin/deleteUser",
        data: { userId: userId },
        success: function(response) {
            alert("User deleted!");
            loadUsers();
        },
        error: function(err) {
            console.error("Error deleting user:", err);
        }
    });
});

$(document).ready(function() {
    $('#showAddProductBtn').click(function() {
        // Load addProductSection.jsp into admin-main
        $('#adminMain').load('../includes/admin/addProductSection.jsp');
    });
});