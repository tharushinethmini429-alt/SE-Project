if (typeof contextPath === 'undefined') {
    console.warn('⚠️ contextPath is not defined! Setting to empty string as fallback.');
    var contextPath = '';
}

if (typeof isUserLoggedIn === 'undefined') {
    console.warn('⚠️ isUserLoggedIn is not defined! Setting to false as fallback.');
    var isUserLoggedIn = false;
}

console.log('✓ Script loaded - contextPath:', contextPath === '' ? '(root)' : contextPath, '| isUserLoggedIn:', isUserLoggedIn);

window.openMobileNav = function() {
    var mobileNav = document.getElementById("mobile-nav");
    if (mobileNav) mobileNav.classList.add("active");
};
window.closeMobileNav = function() {
    var mobileNav = document.getElementById("mobile-nav");
    mobileNav.classList.remove("active");
};


window.toggleSearch = function(){
    var searchWrapper = document.getElementById("search-wrapper");
    searchWrapper.classList.toggle("active");
};


window.toggleProfileDropdown = function(){
    var profileDropdown = document.getElementById("profile-dropdown");
    profileDropdown.classList.toggle("active");
};

window.openWishlistSidebar = function(){
    var wishlistSidebar = document.getElementById("wishlist-sidebar");
    var backDrop = document.getElementById("back-drop");
    wishlistSidebar.classList.add('active');
    backDrop.classList.add('active');
};
window.closeWishlistSidebar = function(){
    var wishlistSidebar = document.getElementById("wishlist-sidebar");
    var backDrop = document.getElementById("back-drop");
    wishlistSidebar.classList.remove('active');
    backDrop.classList.remove('active');
};

window.showAuthModal = function() {
    var backdrop = document.getElementById('authModalBackdrop');
    if (!backdrop) {
        console.warn('Auth modal not available. Redirecting to sign in...');
        window.location.href = contextPath + '/signin.jsp';
        return;
    }
    
    backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
};


window.closeAuthModal = function() {
    var backdrop = document.getElementById('authModalBackdrop');
    if (backdrop) {
        backdrop.classList.remove('active');
        document.body.style.overflow = '';
    }
};

window.NotificationSystem = {
    show: function(message, type = 'info', duration = 5000) {
        const container = document.getElementById('notification-container');
        if (!container) {
            console.error('Notification container not found!');
            return;
        }

        const notification = document.createElement('div');
        notification.className = `notification notification-${type} notification-enter`;
        
        const icons = {
            success: '✓',
            error: '✕',
            warning: '⚠',
            info: 'ℹ'
        };
        
        notification.innerHTML = `
            <div class="notification-icon">${icons[type] || icons.info}</div>
            <div class="notification-content">
                <p class="notification-message">${message}</p>
            </div>
            <button class="notification-close" onclick="NotificationSystem.close(this.parentElement)">×</button>
        `;
        
        container.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.remove('notification-enter');
            notification.classList.add('notification-visible');
        }, 10);
        
        if (duration > 0) {
            setTimeout(() => {
                this.close(notification);
            }, duration);
        }
        
        return notification;
    },
    
    close: function(notification) {
        if (!notification) return;
        
        notification.classList.remove('notification-visible');
        notification.classList.add('notification-exit');
        
        setTimeout(() => {
            if (notification.parentElement) {
                notification.parentElement.removeChild(notification);
            }
        }, 300);
    },
    
    success: function(message, duration = 5000) {
        return this.show(message, 'success', duration);
    },
    
    error: function(message, duration = 7000) {
        return this.show(message, 'error', duration);
    },
    
    warning: function(message, duration = 6000) {
        return this.show(message, 'warning', duration);
    },
    
    info: function(message, duration = 5000) {
        return this.show(message, 'info', duration);
    }
};


window.handleAjaxError = function(xhr, status, error, customMessage) {
    console.error('AJAX Error:', {xhr, status, error});
    
    let errorMessage = customMessage || 'An unexpected error occurred. Please try again.';
    
    if (xhr.status === 0) {
        errorMessage = 'No connection. Please check your internet.';
    } else if (xhr.status === 400) {
        errorMessage = xhr.responseText || 'Invalid request. Please check your input.';
    } else if (xhr.status === 401) {
        errorMessage = 'Session expired. Please sign in again.';
        setTimeout(() => {
            window.location.href = contextPath + '/signin.jsp';
        }, 2000);
    } else if (xhr.status === 403) {
        errorMessage = 'Access denied. You do not have permission.';
    } else if (xhr.status === 404) {
        errorMessage = 'Resource not found. Please try again.';
    } else if (xhr.status === 500) {
        errorMessage = 'Server error. Please contact support.';
    } else if (xhr.responseText) {
        errorMessage = xhr.responseText;
    }
    
    NotificationSystem.error(errorMessage);
};

window.handleSuccess = function(message, shouldReload = false, redirectUrl = null) {
    NotificationSystem.success(message);
    
    if (redirectUrl) {
        setTimeout(() => {
            window.location.href = redirectUrl;
        }, 1500);
    } else if (shouldReload) {
        setTimeout(() => {
            location.reload();
        }, 1500);
    }
};

function addToCart(event) {
    if (event) {
        event.preventDefault();
    }
    
    if (!isUserLoggedIn) {
        showAuthModal();
        return false;
    }
    
    var formData = $('#addToCartForm').serialize();
    $.ajax({
        type: 'POST',
        url: contextPath + '/AddToCartServlet',
        data: formData,
        success: function (response) {
            handleSuccess(response, true);
        },
        error: function(xhr, status, error) {
            handleAjaxError(xhr, status, error, 'Failed to add item to cart');
        }
    });
    return false;
}

//Add To Cart for Index Page (Latest Products)
window.addToCartIndex = function(event, proId, proPrice) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    
    if (!isUserLoggedIn) {
        showAuthModal();
        return false;
    }
    
    var $button = $(event.currentTarget);
    var originalText = $button.text();
    
    $button.prop('disabled', true).text('Adding...');
    
    var formData = {
        pro_id: proId,
        quantity: 1,
        sub_total: proPrice
    };
    
    $.ajax({
        type: 'POST',
        url: contextPath + '/AddToCartServlet',
        data: formData,
        success: function (response) {
            $button.text('Added ✓').css('background-color', '#38cb89');
            NotificationSystem.success('Product added to cart successfully!');
            
            setTimeout(function() {
                $button.text(originalText).css('background-color', '').prop('disabled', false);
            }, 2000);
            
            fetchCartTotal();
        },
        error: function(xhr, status, error) {
            handleAjaxError(xhr, status, error, 'Failed to add product to cart');
            $button.text('Error').css('background-color', '#ff3333');
            
            setTimeout(function() {
                $button.text(originalText).css('background-color', '').prop('disabled', false);
            }, 2000);
        }
    });
    
    return false;
};

window.addToCartShop = function(event, proId, proPrice) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    
    if (!isUserLoggedIn) {
        showAuthModal();
        return false;
    }
    
    var $button = $(event.currentTarget);
    var originalText = $button.text();
    
    $button.prop('disabled', true).text('Adding...');
    
    var formData = {
        pro_id: proId,
        quantity: 1,
        sub_total: proPrice
    };
    
    $.ajax({
        type: 'POST',
        url: contextPath + '/AddToCartServlet',
        data: formData,
        success: function (response) {
            $button.text('Added ✓').css('background-color', '#38cb89');
            NotificationSystem.success('Product added to cart!');
            
            fetchCartTotal();
            
            setTimeout(function() {
                $button.text(originalText).css('background-color', '').prop('disabled', false);
            }, 2000);
        },
        error: function(xhr, status, error) {
            handleAjaxError(xhr, status, error);
            $button.text('Error').css('background-color', '#ff3333');
            
            setTimeout(function() {
                $button.text(originalText).css('background-color', '').prop('disabled', false);
            }, 2000);
        }
    });
    
    return false;
};


function addToWishlist(event, proId, price){
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    
    if (!isUserLoggedIn) {
        showAuthModal();
        return false;
    }
    
    console.log('Adding to wishlist - Product ID:', proId, 'Price:', price);
    
    $.ajax({
        url: contextPath + '/AddToWishlistServlet',
        type: 'POST',
        data: {
            pro_id: proId,
            sub_total: price
        },
        success: function (response){
            handleSuccess(response, true);
        },
        error: function(xhr, status, error){
            handleAjaxError(xhr, status, error, 'Failed to add to wishlist');
        }
    });
    
    return false;
}


window.addToWishlistIndex = function(event, proId, price) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    
    if (!isUserLoggedIn) {
        showAuthModal();
        return false;
    }
    
    $.ajax({
        url: contextPath + '/AddToWishlistServlet',
        type: 'POST',
        data: {
            pro_id: proId,
            sub_total: price
        },
        success: function (response){
            handleSuccess(response, true);
        },
        error: function(xhr, status, error){
            handleAjaxError(xhr, status, error);
        }
    });
    
    return false;
};


window.addToWishlistShop = function(event, proId, proPrice) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    
    if (!isUserLoggedIn) {
        showAuthModal();
        return false;
    }
    
    $.ajax({
        url: contextPath + '/AddToWishlistServlet',
        type: 'POST',
        data: {
            pro_id: proId,
            sub_total: proPrice
        },
        success: function (response){
            handleSuccess(response, true);
        },
        error: function(xhr, status, error){
            handleAjaxError(xhr, status, error);
        }
    });
    
    return false;
};

function deleteWishlist(wishlistId){
    $.ajax({
        url: 'DeleteWishlistServlet',
        type: 'POST',
        data: {wishlistId: wishlistId},
        success: function(response){
            handleSuccess(response, true);
        },
        error: function(xhr, status, error){
            handleAjaxError(xhr, status, error, 'Failed to remove item from wishlist');
        }
    });
}



window.getShipping = function(){
    var selectedValue = parseFloat($('input[name="shipping-method"]:checked').val());
    

    var subtotalString = $('.cart-sum-sub-total .price').text();
    var subtotalNumeric = parseFloat(subtotalString.replace('Rs.', ''));
    
    var newTotal = subtotalNumeric + selectedValue;
    
    $('.cart-sum-total .price').text('Rs.' + newTotal.toFixed(2));
    $('.cart-sum-total .shipping').text('Rs.' + selectedValue.toFixed(2));
};


function minus(cartId) {
  var quantityInput = document.getElementById('quantity_' + cartId);
  if (quantityInput) {
    var currentValue = parseInt(quantityInput.value);
    if (currentValue === 1) {
      document.getElementById('minus-btn_' + cartId).disabled = true;
    }
    if (!isNaN(currentValue) && currentValue > 0) {
      quantityInput.value = currentValue - 1;
      updateSubtotal(cartId);
      updateCartTotal();
    }
  }
}

function add(cartId) {
  var quantityInput = document.getElementById('quantity_' + cartId);
  if (quantityInput) {
    var currentValue = parseInt(quantityInput.value);
    if (!isNaN(currentValue)) {
      quantityInput.value = currentValue + 1;
      updateSubtotal(cartId);
      updateCartTotal();
    }
  }
}

function updateSubtotal(cartId) {
  var quantity = parseInt(document.getElementById('quantity_' + cartId).value);
  var price = parseFloat(
    document
      .querySelector('#cartItem_' + cartId + ' .price')
      .innerText.replace('Rs.', '')
  );
  var subtotal = quantity * price;
  document.querySelector('#cartItem_' + cartId + ' .sub-total').textContent =
    'Rs.' + subtotal.toFixed(2);
}

function updateCartTotal() {
  var sumSubtotal = 0;
  $('.sub-total').each(function () {
    var subtotal = parseFloat($(this).text().replace('Rs.', ''));
    if (!isNaN(subtotal)) {
      sumSubtotal += subtotal;
    }
  });
  
  var shippingText = $('.cart-sum-total .shipping').text().trim();
  var shippingCost = 0;
  if (shippingText && shippingText.length > 0) {
    shippingCost = parseFloat(shippingText.replace('Rs.', '').replace('Rs', '').trim());
    if (isNaN(shippingCost)) {
      shippingCost = 0;
    }
  }
  
  $('.cart-sum-sub-total .price').text('Rs.' + sumSubtotal.toFixed(2));
  updateCartWithShippingTotal(sumSubtotal + shippingCost);
}

function updateCartWithShippingTotal(subTotal) {
  $('.cart-sum-total .price').text('Rs.' + subTotal.toFixed(2));
}

function removeCartItem(cartId) {
    if (!confirm('Are you sure you want to remove this item from your cart?')) {
        return;
    }
    
    $.ajax({
        url: contextPath + '/RemoveCartItemServlet',
        type: 'POST',
        data: { cartId: cartId },
        success: function(response) {
            handleSuccess(response, true);
        },
        error: function(xhr, status, error) {
            handleAjaxError(xhr, status, error, 'Failed to remove item from cart');
        }
    });
}

 $(document).ready(function() {
    function fetchCartItemsAndUpdateTotal() {
        $.ajax({
            url: contextPath + '/CartServlet',
            type: 'GET',
            dataType: 'json',
            success: function(data) {
                var tbody = $('.cart-table tbody');
                var sumSubtotal = 0; 
                $.each(data, function(index, item) {
                    var minusButton = $('<button>').addClass('minus-btn').attr({id:'minus-btn_' + item.cartId, 'data-cart-id': item.cartId}).append(
                        $('<img>').attr('src', 'assets/images/icons/minus.png')
                    ).click(function() {
                        var cartId = $(this).attr('data-cart-id');
                        minus(cartId);
                    }).prop('disabled', false);

                    var addButton = $('<button>').addClass('add-btn').attr({id:'add-btn', 'data-cart-id': item.cartId}).append(
                        $('<img>').attr('src', 'assets/images/icons/add.png')
                    ).click(function() {
                        var cartId = $(this).attr('data-cart-id');
                        add(cartId);
                    });

                    var removeButton = $('<button>').addClass('remove-btn').append(
                        $('<img>').attr('src', 'assets/images/icons/close.png')
                    ).text('Remove').data('cart-id', item.cartId).click(function() {
                        removeCartItem(item.cartId);
                    });

                    var row = $('<tr>').addClass('cart-item').attr({id: 'cartItem_' + item.cartId, 'data-pro-id': item.productId });

                    var imagePath = contextPath + '/assets/images/uploads/' + (item.productImage || 'placeholder.png');
                    
                    var productDetailsColumn = $('<td>').append(
                        $('<div>').addClass('cart-product-details').append(
                            $('<img>').attr('src', imagePath).addClass('pro-img'),
                            $('<div>').addClass('pro-details').append(
                                $('<h3>').text(item.productName),
                                removeButton
                            )
                        )
                    );

                    var quantityColumn = $('<td>').append(
                        $('<div>').addClass('cart-product-element').append(
                            $('<div>').addClass('quantity-wrapper').append(
                                minusButton,
                                $('<input>').attr({
                                    type: 'text',
                                    value: item.quantity,
                                    id: 'quantity_' + item.cartId
                                }),
                                addButton
                            )
                        )
                    );

                    var priceColumn = $('<td>').append(
                        $('<div>').addClass('cart-product-element').append(
                            $('<div>').addClass('price').text('Rs.' + item.price)
                        )
                    );

                    var subtotal = item.quantity * item.price;
                    var subtotalColumn = $('<td>').append(
                        $('<div>').addClass('cart-product-element').append(
                            $('<div>').addClass('sub-total').attr({id: 'subtotal_' + item.cartId}).text('Rs.' + subtotal.toFixed(2))
                        )
                    );

                    sumSubtotal += subtotal;
                    row.append(productDetailsColumn, quantityColumn, priceColumn, subtotalColumn);
                    tbody.append(row);

                });
                
                $('.cart-sum-sub-total .price').text('Rs.' + sumSubtotal.toFixed(2));
                $('.cart-sum-total .price').text('Rs.' + sumSubtotal.toFixed(2));
                
            },
            error: function(xhr, status, error) {
                console.error('Error fetching cart items:', error);
            }
        });
    }
    
    
   function fetchContactInformation() {
       $.ajax({
         url: 'ContactInformationServlet',
         type: 'GET',
         dataType: 'json',
         success: function (data) {
           if (data.length > 0) {
             var contactInfo = data[0];

             $('#fname').val(contactInfo.firstName);
             $('#lname').val(contactInfo.lastName);
             $('#email').val(contactInfo.email);
             $('#phone').val(contactInfo.phoneNo);
           }
         },
         error: function(xhr, status, error) {
            console.error('Error fetching contact information:', error);
        },
       });
  }
  
    function fetchAddressInformation() {
        $.ajax({
          url: 'AddressInfoServlet',
          type: 'GET',
          dataType: 'json',
          success: function (data) {
            if (data.length > 0) {
              var addressInfo = data[0];

              $('#street').val(addressInfo.streetAddress);
              $('#city').val(addressInfo.city);
              $('#state').val(addressInfo.state);
              $('#postalCode').val(addressInfo.postalCode);
              $('#db-country').text(addressInfo.country);
            }
          },
          error: function () {
          },
        });
    }
    
    function fetchOrderSummary() {
    $.ajax({
        url: 'OrderSummaryServlet',
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            var orderSummaryList = $('.order-summary-list');
            var sumSubtotal = 0;
            var shippingMethod = '';
            var total = 0;
            var orderId = 0;

            orderSummaryList.empty();

            var activeOrders = data.filter(function(item) {

                var orderStatus = item.status || item.orderStatus || '';
                return orderStatus.toLowerCase() !== 'completed';
            });

            console.log('Total orders:', data.length);
            console.log('Active (non-completed) orders:', activeOrders.length);


            if (activeOrders.length === 0) {
                orderSummaryList.append(
                    $('<div>')
                        .addClass('empty-order')
                        .append(
                            $('<p>').text('No items in your order.')
                        )
                );
                return;
            }

            $.each(activeOrders, function (index, item) {
                var imagePath = contextPath + '/assets/images/uploads/' + 
                    (item.productImg || item.productImage || item.proImg || 'placeholder.png');
                
                orderId = item.orderId;
                
                var product = $('<div>')
                    .addClass('list-item')
                    .append(
                        $('<div>')
                            .addClass('product')
                            .append(
                                $('<img>')
                                    .addClass('pro-img')
                                    .attr('src', imagePath)
                                    .attr('alt', item.productName)
                                    .on('error', function() {
                                        $(this).attr('src', contextPath + '/assets/images/uploads/placeholder.png');
                                    }),
                                $('<div>')
                                    .addClass('details')
                                    .append(
                                        $('<h3>').text(item.productName),
                                        $('<span>').text('Quantity: ' + item.quantity)
                                    )
                            ),
                        $('<div>')
                            .addClass('price')
                            .css('display', 'none')
                            .text('Rs. ' + item.productPrice.toFixed(2)),
                        $('<div>')
                            .addClass('sub-total')
                            .text('Rs. ' + (item.productPrice * item.quantity).toFixed(2)),
                        $('<button>')
                            .addClass('remove-order-item-btn')
                            .append($('<img>').attr('src', contextPath + '/assets/images/icons/close.png'))
                            .attr('title', 'Remove item')
                            .click(function(e) {
                                e.preventDefault();
                                removeOrderItem(orderId, item.proId);
                            }),
                        $('<input>').attr({
                            type: 'hidden',
                            class: 'order-id',
                            id: 'order-id',
                            value: orderId
                        })
                    );

                orderSummaryList.append(product);

                sumSubtotal += item.productPrice * item.quantity;
                total = item.total;
                shippingMethod = item.shippingMethod;
            });

            orderSummaryList.append(
                $('<div>')
                    .addClass('shipping')
                    .append(
                        $('<span>').addClass('text').text('Shipping'),
                        $('<span>').addClass('value').text(shippingMethod)
                    ),
                $('<div>')
                    .addClass('shipping')
                    .append(
                        $('<span>').addClass('text').text('SubTotal'),
                        $('<span>')
                            .addClass('value')
                            .text('Rs. ' + sumSubtotal.toFixed(2))
                    ),
                $('<div>')
                    .addClass('total-cost')
                    .append(
                        $('<span>').addClass('text').text('Total'),
                        $('<span>')
                            .addClass('value')
                            .text('Rs. ' + total.toFixed(2))
                    )
            );
        },
        error: function (xhr, status, error) {
            console.error('Error fetching order summary:', error);
            console.error('Response:', xhr.responseText);
            $('.order-summary-list').html(
                '<div class="alert alert-danger">Error loading order summary. Please try again.</div>'
            );
        }
    });
}

function removeOrderItem(orderId, proId) {
    if (!confirm('Are you sure you want to remove this item from your order?')) {
        return;
    }
    
    $.ajax({
        url: contextPath + '/RemoveOrderItemServlet',
        type: 'POST',
        data: { 
            orderId: orderId,
            proId: proId
        },
        success: function(response) {
            NotificationSystem.success(response);
            fetchOrderSummary();
        },
        error: function(xhr, status, error) {
            handleAjaxError(xhr, status, error, 'Failed to remove item from order');
        }
    });
}

    function fetchOrderComplete() {
    $.ajax({
        url: 'OrderCompleteServlet',
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            console.log('Order Complete Data:', data);
            
            if (!data || data.length === 0) {
                $('.ordered-items').html('<p class="text-center">No order found.</p>');
                $('.order-details .details li').text('-');
                return;
            }
            
            var firstItem = data[0];
            var orderCode = firstItem.orderCode || '-';
            var orderedDate = firstItem.orderedDate || '-';
            var total = firstItem.total || 0;
            var paymentMethod = firstItem.paymentMethod || '-';

            $('.order-details .details li:nth-child(1)').text(orderCode);
            $('.order-details .details li:nth-child(2)').text(orderedDate);
            $('.order-details .details li:nth-child(3)').text('Rs. ' + total.toFixed(2));
            $('.order-details .details li:nth-child(4)').text(paymentMethod);

            var orderedItems = $('.ordered-items');
            orderedItems.empty();

            $.each(data, function (index, item) {
                var imagePath = contextPath + '/assets/images/uploads/' + 
                    (item.productImg || 'placeholder.png');
                
                console.log('Product:', item.productName, 'Image:', imagePath, 'Qty:', item.quantity);
                
                var orderedItem = $('<div>')
                    .addClass('ordered-item')
                    .append(
                        $('<span>').addClass('circle').text(item.quantity),
                        $('<img>')
                            .attr('src', imagePath)
                            .attr('alt', item.productName || 'Product')
                            .on('error', function() {
                                console.error('Image failed to load:', imagePath);
                                $(this).attr('src', contextPath + '/assets/images/uploads/placeholder.png');
                            })
                    );
                    
                orderedItems.append(orderedItem);
            });
        },
        error: function (xhr, status, error) {
            console.error('Error fetching order details:', error);
            console.error('Response:', xhr.responseText);
            $('.ordered-items').html(
                '<div class="alert alert-danger">Error loading order details. Please try again.</div>'
            );
            $('.order-details .details li').text('-');
        }
    });
}
    
    window.fetchCartTotal = function(){
        if (!isUserLoggedIn) {
            return;
        }
        
        $.ajax({
            url: contextPath + '/GetCartTotalServlet',
            type: 'GET',
            dataType: 'json',
            success: function(data){
                $('#cart-total').text(data);
                $('#mobile-cart-total').text(data);
            }
        });
    };
    
    function fetchWishlist(){
    if (!isUserLoggedIn) {
        return;
    }
    
    $.ajax({
        url: contextPath + '/WishlistServlet',
        type: 'GET',
        dataType: 'json',
        success: function(products){
            $('#wishlist-container').empty();       
            products.forEach(function(product){
                console.log('Product data:', product);
                
                var imagePath = contextPath + '/assets/images/uploads/' + (product.proImage || product.proImg || 'placeholder.png');
                
                var productHtml = '<a href="productDetails.jsp?proId='+ product.proId +'" style="width: 100%;">' +
                        '<div class="wishlist-item">'+
                        '<img src="' + imagePath + '" alt="' + product.proName + '"/>' +
                        '<div class="wishlist-details">'+
                        '<div class="details-top">'+
                        '<h4 style="margin-bottom: 1rem!important;">'+ product.proName +'</h4>'+
                        '<p>Rs.'+ product.price +'</p>'+
                        '</div>'+
                        '<div class="wishlist-actions">'+
                        '<button type="button" class="add-to-cart" onclick="addToCartWishlist(event, ' + product.proId + ', ' + product.price + ')">Add To Cart</button>' +
                        '<button type="button" onclick="deleteWishlist(' + product.wishlistId +')"><img src="assets/images/icons/close.png"/></button>'+
                        '</div>'+
                        '</div>'+
                        '</div>'+
                        '</a>';
                        
                $('#wishlist-container').append(productHtml);
            });
        },
        error: function(xhr, status, error) {
            console.error('Error fetching wishlist:', error);
        }
    });
}
    
    initAuthModal();
    
    if ($('.cart-table').length > 0) {
        fetchCartItemsAndUpdateTotal();
    }
    
    if ($('#fname, #lname, #email, #phone').length > 0) {
        fetchContactInformation();
    }
    
    if ($('#street, #city, #state, #postalCode').length > 0) {
        fetchAddressInformation();
    }
    
    if ($('.order-summary-list').length > 0) {
        fetchOrderSummary();
    }
    
    if ($('.ordered-items').length > 0) {
        fetchOrderComplete();
    }
    
    fetchCartTotal();
    
    if ($('#wishlist-container').length > 0) {
        fetchWishlist();
    }
 });
 

 function showPaymentInfo(paymentMethod) {
  var cardInfo = document.getElementById('card-info');
  var paypalInfo = document.getElementById('paypal-info');

  if (paymentMethod === 'credit-card') {
    cardInfo.style.display = 'block';
    paypalInfo.style.display = 'none';
  } else if (paymentMethod === 'paypal') {
    cardInfo.style.display = 'none';
    paypalInfo.style.display = 'block';
  }
}

function sendData() {
    var total = $('.cart-sum-total .price').text().trim();
    total = total.replace('Rs.', '');
    var cartItems = [];
    var shipping = parseInt($('input[name=shipping-method]:checked').val());
    var shippingMethod;
    
    if (shipping === 15) {
        shippingMethod = 'Express Shipping';
    } else {
        shippingMethod = 'Free Shipping';
    }

    $('.cart-item').each(function () {
        var cartId = $(this).attr('id').split('_')[1];
        var proId = $(this).data('pro-id');
        var quantity = parseInt($('input[id^=quantity_]', this).val());

        cartItems.push({
            cartId: cartId,
            productId: proId,
            quantity: quantity,
        });
    });

    $.ajax({
        url: 'CartDetailsServlet',
        type: 'POST',
        data: {
            total_price: total,
            cart_items: JSON.stringify(cartItems),
            shipping_method: shippingMethod,
        },
        success: function (response) {
            if (response.startsWith('Success')) {
                NotificationSystem.success('Order prepared successfully! Redirecting to checkout...');
                setTimeout(() => {
                    window.location.href = 'checkout.jsp';
                }, 1500);
            } else {
                NotificationSystem.error(response);
            }
        },
        error: function (xhr, status, error) {
            handleAjaxError(xhr, status, error, 'Failed to process order');
        }
    });
}

function sendCheckoutData() {
    var firstName = $('#fname').val();
    var lastName = $('#lname').val();
    var email = $('#email').val();
    var phoneNo = $('#phone').val();
    var street = $('#street').val();
    var city = $('#city').val();
    var state = $('#state').val();
    var postalCode = $('#postalCode').val();
    var country = $('#country').val();
    var orderId = $('#order-id').val();
    var paymentMethod = $('input[name=payment-method]:checked').val();

    $.ajax({
        url: 'CheckoutDetailsServlet',
        type: 'POST',
        data: {
            firstName: firstName,
            lastName: lastName,
            email: email,
            phoneNo: phoneNo,
            street: street,
            city: city,
            state: state,
            postalCode: postalCode,
            country: country,
            orderId: orderId,
            paymentMethod: paymentMethod,
        },
        success: function (response) {
            if (response.startsWith('Success')) {
                NotificationSystem.success('Order placed successfully! Redirecting...');
                setTimeout(() => {
                    window.location.href = 'orderComplete.jsp';
                }, 1500);
            } else {
                NotificationSystem.error(response);
            }
        },
        error: function (xhr, status, error) {
            handleAjaxError(xhr, status, error, 'Failed to complete checkout');
        }
    });
}


function togglePasswordVisibility() {
  event.preventDefault();
  var passwordInput = document.getElementById('passwordInput');
  if (passwordInput.type === 'password') {
    passwordInput.type = 'text';
  } else {
    passwordInput.type = 'password';
  }
}

function validatePassword(password) {
  if (password.length < 8) {
    return false;
  }
  if (!/[A-Z]/.test(password)) {
    return false;
  }
  if (!/\d/.test(password)) {
    return false;
  }
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password)) {
    return false;
  }
  return true;
}


function signUp() {
    event.preventDefault();

    var firstName = $('#signup-fname').val();
    var lastName = $('#signup-lname').val();
    var email = $('#signup-email').val();
    var password = $('#passwordInput').val();
    var phoneNumber = $('#signup-pno').val();
    var agreement = $('#signup-terms').prop('checked');

    if (firstName.length === 0 || lastName.length === 0 || email.length === 0 || 
        password.length === 0 || phoneNumber.length === 0 || !agreement) {
        NotificationSystem.warning('Please fill in all fields and agree to the terms.');
        return;
    }
    
    if (!validatePassword(password)) {
        NotificationSystem.error('Password must be at least 8 characters with uppercase, digit, and special character.');
        return;
    }
    
    var formData = $('#signup-form').serialize();

    $.ajax({
        type: 'POST',
        url: contextPath + '/SignupServlet',
        data: formData,
        success: function (response) {
            if (response === 'Successfully Registered') {
                NotificationSystem.success(response + '! Redirecting...');
                setTimeout(() => {
                    window.location.href = 'index.jsp';
                }, 1500);
            } else {
                NotificationSystem.error(response);
            }
        },
        error: function (xhr, status, error) {
            handleAjaxError(xhr, status, error, 'Registration failed');
        }
    });
}


function signIn() {
    event.preventDefault();

    var email = $('#signin-email').val();
    var password = $('#passwordInput').val();

    if (email.length === 0 || password.length === 0) {
        NotificationSystem.warning('Please enter both email and password.');
        return;
    }

    var formData = $('#signin-form').serialize();

    $.ajax({
        type: 'GET',
        url: contextPath + '/SigninServlet',
        data: formData,
        success: function (response) {
            if (response === 'Authentication successful as admin!') {
                NotificationSystem.success('Welcome Admin! Redirecting...');
                setTimeout(() => {
                    window.location.href = 'admin';
                }, 1500);
            } else if (response === 'Authentication successful') {
                NotificationSystem.success('Sign in successful! Redirecting...');
                setTimeout(() => {
                    window.location.href = 'index.jsp';
                }, 1500);
            } else {
                NotificationSystem.error(response);
            }
        },
        error: function (xhr, status, error) {
            handleAjaxError(xhr, status, error, 'Sign in failed');
        }
    });
}

function signOut() {
    $.ajax({
        type: 'GET',
        url: contextPath + '/SignoutServlet',
        success: function (response) {
            if (response === 'Sign out Succesfully') {
                NotificationSystem.success('Signed out successfully! Redirecting...');
                setTimeout(() => {
                    window.location.href = 'signin.jsp';
                }, 1500);
            } else {
                NotificationSystem.info(response);
                setTimeout(() => {
                    window.location.href = 'signin.jsp';
                }, 1500);
            }
        },
        error: function (xhr, status, error) {
            handleAjaxError(xhr, status, error, 'Sign out failed');
        }
    });
}


$(document).ready(function(){
    function loadAllProducts() {
        $.ajax({
            type: "POST",
            url: contextPath + "/ProductByCatServlet",
            data: { category: 0 }, 
            success: function(products){
                $('#productContainer').empty();
                products.forEach(function(product){
                    var imagePath = contextPath + '/assets/images/uploads/' + (product.proImg || 'placeholder.png');
                    
                    var productHTML = '<div class="col-md-4 product-card-wrapper">' +
                                        '<a href="productDetails.jsp?proId='+ product.proId +'" class="product-card">' +
                                        '<div class="product-box">' +
                                        '<img src="' + imagePath + '" class="product-img"/>' +
                                        '<h3>' + product.proName + '</h3>' +
                                        '<p>Rs.' + product.proPrice + '</p>' +
                                        '<form id="addToCartForm" method="POST">' +
                                        '<input type="hidden" name="pro_id" value="' + product.proId +'" />'+
                                        '<input type="hidden" name="quantity" value="1" />' +
                                        '<input type="hidden" name="sub_total" value="' + product.proPrice + '" />' +
                                        '<button class="button" onclick="addToCart(event)">Add To Cart</button>' +
                                        '</form>'+
                                        '<button class="wishlistBtn" onclick="addToWishlist(event, ' + product.proId + ', ' + product.proPrice + ')"><img src="assets/images/icons/heart.png" /></button>'+
                                        '</div>' +
                                        '</a>' +
                                        '</div>';
                    $('#productContainer').append(productHTML);
                });
            }
        });
    }

    loadAllProducts();

    $(document).on('click', '.categoryBtn', function(){
        var category = $(this).data('category');
        console.log(category)
        $.ajax({
            type: "POST",
            url: contextPath + "/ProductByCatServlet",
            data: { category: category },
            success: function(products){
                console.log(products)
                $('#productContainer').empty();
                products.forEach(function(product){
                    var imagePath = contextPath + '/assets/images/uploads/' + (product.proImg || 'placeholder.png');
                    
                    var productHTML = '<div class="col-md-4 product-card-wrapper">' +
                                        '<a href="productDetails.jsp?proId='+ product.proId +'" class="product-card">' +
                                        '<div class="product-box">' +
                                        '<img src="' + imagePath + '" class="product-img"/>' +
                                        '<h3>' + product.proName + '</h3>' +
                                        '<p>Rs.' + product.proPrice + '</p>' +
                                        '<form id="addToCartForm" method="POST">' +
                                        '<input type="hidden" name="pro_id" value="' + product.proId +'" />'+
                                        '<input type="hidden" name="quantity" value="1" />' +
                                        '<input type="hidden" name="sub_total" value="' + product.proPrice + '" />' +
                                        '<button class="button" onclick="addToCart(event)">Add To Cart</button>' +
                                        '</form>'+
                                        '<button type="button" class="wishlistBtn" onclick="addToWishlist(event, ' + product.proId + ', ' + product.proPrice + ')"><img src="assets/images/icons/heart.png" /></button>' +
                                        '</div>' +
                                        '</a>' +
                                        '</div>';
                    $('#productContainer').append(productHTML);
                });
            }
        });
    });
    
    
    window.fetchLatestProducts = function(){
        $.ajax({
            url: contextPath + '/GetLatestProductsServlet',
            type: 'GET',
            dataType: 'json',
            success: function(data){
                $('#latestProducts').empty();
                
                if (!data || data.length === 0) {
                    $('#latestProducts').append('<div class="col-12 text-center py-5"><div class="alert alert-info">No products available.</div></div>');
                    return;
                }
                
                data.forEach(function(product){
                    var imagePath = contextPath + '/assets/images/uploads/' + (product.proImg || 'placeholder.png');
                     
                    var productHTML = '<div class="col-md-4 product-card-wrapper">' +
                                        '<a href="productDetails.jsp?proId='+ product.proId +'" class="product-card">' +
                                        '<div class="product-box">' +
                                        '<img src="' + imagePath + '" class="product-img"/>' +
                                        '<h3>' + product.proName + '</h3>' +
                                        '<p>Rs.' + product.proPrice + '</p>' +
                                        '<div class="product-actions">' +
                                        '<button type="button" class="button" onclick="addToCartIndex(event, ' + product.proId + ', ' + product.proPrice + ')">Add To Cart</button>' +
                                        '<button type="button" class="wishlistBtn" onclick="addToWishlistIndex(event, ' + product.proId + ', ' + product.proPrice + ')"><img src="assets/images/icons/heart.png" /></button>' +
                                        '</div>' +
                                        '</div>' +
                                        '</a>' +
                                        '</div>';
                    $('#latestProducts').append(productHTML);
                });
            },
            error: function(err) {
                console.error('Error loading latest products:', err);
                $('#latestProducts').html('<div class="col-12 text-center py-5"><div class="alert alert-danger">Failed to load products.</div></div>');
            }
        });
    };
    
    if ($('#latestProducts').length > 0) {
        fetchLatestProducts();
    }
    
    if ($('#categoriesContainer').length > 0) {
        fetchCategoriesForIndex();
    }
    
});
 
 
 
function sendMessage(){
    event.preventDefault();
    var formData = $('#contactForm').serialize();
    
    $.ajax({
        url: contextPath + "/SendMessageServlet",
        type: "POST",
        data: formData,
        success: function(response){
            handleSuccess(response, true);
        },
        error: function(xhr, status, error){
            handleAjaxError(xhr, status, error, 'Failed to send message');
        }
    });
}

$(document).ready(function(){
    function fetchContactInformationProfile() {
       $.ajax({
         url: 'ContactInformationServlet',
         type: 'GET',
         dataType: 'json',
         success: function (data) {
           if (data.length > 0) {
             var contactInfo = data[0];

             $('#profile-fname').val(contactInfo.firstName);
             $('#profile-lname').val(contactInfo.lastName);
             $('#profile-email').val(contactInfo.email);
             $('#profile-phone').val(contactInfo.phoneNo);
           }
         },
         error: function () {
         }
       });
    }
    
    if ($('#profile-fname, #profile-lname').length > 0) {
        fetchContactInformationProfile();
    }
 });
 

window.fetchCategoriesForIndex = function() {
    $.ajax({
        url: contextPath + '/CategoriesServlet',
        type: 'GET',
        dataType: 'json',
        success: function(categories) {
            $('#categoriesContainer').empty();
            
            if (!categories || categories.length === 0) {
                $('#categoriesContainer').append('<div class="col-12 text-center py-5"><div class="alert alert-info">No categories available.</div></div>');
                return;
            }
            
            var categoryImages = {
                'Beverages': 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=300&fit=crop',
                'Meat': 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=400&h=300&fit=crop',
                'Condiments and Sauces': 'https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=400&h=300&fit=crop',
                'Water': 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400&h=300&fit=crop',
                'Fruits': 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=400&h=300&fit=crop',
                'Vegetables': 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=300&fit=crop',
                'Bakery': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop',
                'Dairy': 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=400&h=300&fit=crop',
                'Seafood': 'https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?w=400&h=300&fit=crop',
                'Grains': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop',
                'Snacks': 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=400&h=300&fit=crop',
                'Frozen Foods': 'https://images.unsplash.com/photo-1476887334197-56adbf254e1a?w=400&h=300&fit=crop',
                'Canned Goods': 'https://images.unsplash.com/photo-1625938145312-598c0bdf6fe0?w=400&h=300&fit=crop',
                'Spices': 'https://images.unsplash.com/photo-1596040033229-a0b9564d9f55?w=400&h=300&fit=crop',
                'Organic': 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=400&h=300&fit=crop'
            };
            
            var defaultImage = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=300&fit=crop';
            
            categories.forEach(function(cat) {
                var imageUrl = categoryImages[cat.catName] || defaultImage;
                
                var categoryHTML = 
                    '<div class="col-md-4 mt-5 category-card">' +
                        '<a href="shop.jsp">' +
                            '<img src="' + imageUrl + '" alt="' + cat.catName + '"/>' +
                            '<h4>' + cat.catName + '</h4>' +
                        '</a>' +
                    '</div>';
                
                $('#categoriesContainer').append(categoryHTML);
            });
        },
        error: function(err) {
            console.error('Error loading categories:', err);
            $('#categoriesContainer').html('<div class="col-12 text-center py-5"><div class="alert alert-danger">Failed to load categories.</div></div>');
        }
    });
};

function initAuthModal() {
    var backdrop = document.getElementById('authModalBackdrop');
    if (!backdrop) {
        //console.warn('Auth modal backdrop not found on this page');
        return;
    }
    
    backdrop.addEventListener('click', function(e) {
        if (e.target === this) {
            closeAuthModal();
        }
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && backdrop.classList.contains('active')) {
            closeAuthModal();
        }
    });
}

window.loadShopProducts = function(categoryId) {
    var container = $('#productContainer');
    
    container.html('<div class="col-12 text-center py-5"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div></div>');
    
    $.ajax({
        url: contextPath + '/ProductsServlet',
        type: 'GET',
        dataType: 'json',
        success: function(products) {
            container.empty();
            
            if (!products || products.length === 0) {
                container.append('<div class="col-12 text-center py-5"><div class="alert alert-info">No products available.</div></div>');
                return;
            }

            if(categoryId != 0) {
                products = products.filter(p => p.catId == categoryId);
                
                if(products.length === 0) {
                    container.append('<div class="col-12 text-center py-5"><div class="alert alert-info">No products in this category.</div></div>');
                    return;
                }
            }

            $.each(products, function(i, product) {
                var imgSrc = product.proImg && product.proImg.trim() !== '' 
                    ? contextPath + '/assets/images/uploads/' + product.proImg
                    : 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&q=80';
                
                var card = 
                    '<div class="col-lg-4 col-md-6 product-card-wrapper">' +
                        '<a href="productDetails.jsp?proId=' + product.proId + '" class="product-card">' +
                            '<div class="product-box">' +
                                '<div class="product-img">' +
                                    '<img src="' + imgSrc + '" alt="' + product.proName + '" loading="lazy"/>' +
                                '</div>' +
                                '<h3>' + product.proName + '</h3>' +
                                '<p>Rs. ' + parseFloat(product.proPrice).toLocaleString() + '</p>' +
                                '<div class="product-actions">' +
                                    '<button type="button" class="button button-small" onclick="addToCartShop(event, ' + product.proId + ', ' + product.proPrice + ')">Add To Cart</button>' +
                                    '<button type="button" class="wishlistBtn" onclick="addToWishlistShop(event, ' + product.proId + ', ' + product.proPrice + ')"><img src="assets/images/icons/heart.png" /></button>' +
                                '</div>' +
                            '</div>' +
                        '</a>' +
                    '</div>';
                
                container.append(card);
            });
        },
        error: function(err) {
            console.error('Error loading products:', err);
            container.html('<div class="col-12 text-center py-5"><div class="alert alert-danger">Failed to load products. Please try again.</div></div>');
        }
    });
};

window.loadShopCategories = function() {
    var catContainer = $('#categoryButtons');
    catContainer.empty();
    
    catContainer.append('<button class="categoryBtn active" data-category="0">All Products</button>');
    
    $.ajax({
        url: contextPath + '/CategoriesServlet',
        type: 'GET',
        dataType: 'json',
        success: function(categories) {
            $.each(categories, function(i, cat) {
                catContainer.append('<button class="categoryBtn" data-category="' + cat.catId + '">' + cat.catName + '</button>');
            });
        },
        error: function(err) {
            console.error('Error loading categories:', err);
        }
    });
};

$(document).ready(function() {
    if ($('#categoryButtons').length > 0 && $('#productContainer').length > 0) {
        window.categoriesLoadedForShop = true;
        
        loadShopCategories();
        loadShopProducts(0);
        
        $('#categoryButtons').on('click', '.categoryBtn', function() {
            $('.categoryBtn').removeClass('active');
            $(this).addClass('active');
            
            var selectedId = $(this).data('category');
            loadShopProducts(selectedId);
            
            $('html, body').animate({
                scrollTop: $('#productContainer').offset().top - 100
            }, 400);
        });
    }
});




window.continueShopping = function() {
    window.location.href = contextPath + '/shop.jsp';
};

window.viewOrderHistory = function() {
    window.location.href = contextPath + '/profile.jsp';
};

$(document).ready(function() {
    if ($('.ordered-items').length > 0 && $('.order-complete-section').length > 0) {
        console.log('Order Complete page detected, fetching order...');
        fetchOrderComplete();
    }
});




/* */

$(document).ready(function() {
    let isEditMode = false;
    let currentReviewData = null;

    // Tab switching
    $('.profile-tab-btn').click(function() {
        const tab = $(this).data('tab');
        
        $('.profile-tab-btn').removeClass('active');
        $(this).addClass('active');
        
        $('.profile-tab-content').removeClass('active');
        $('#' + tab + '-tab').addClass('active');
        
        if (tab === 'orders') {
            loadUserOrders();
        }
    });

    // Edit toggle
    $('#edit-toggle-btn').click(function() {
        isEditMode = !isEditMode;
        
        if (isEditMode) {
            $('#view-mode').hide();
            $('#profile-form').show();
            $('#edit-btn-text').text('Cancel');
        } else {
            $('#view-mode').show();
            $('#profile-form').hide();
            $('#edit-btn-text').text('Edit');
            loadUserProfile();
        }
    });

    $('#cancel-btn').click(function() {
        isEditMode = false;
        $('#view-mode').show();
        $('#profile-form').hide();
        $('#edit-btn-text').text('Edit');
        loadUserProfile();
    });

    // Profile form submission
    $('#profile-form').submit(function(e) {
        e.preventDefault();
        
        const formData = $(this).serialize();
        
        $('#save-btn').prop('disabled', true);
        $('#save-btn').find('.btn-text').hide();
        $('#save-btn').find('.btn-loader').show();
        
        $.ajax({
            url: contextPath + '/UpdateProfileServlet',
            type: 'POST',
            data: formData,
            success: function(response) {
                NotificationSystem.success('Profile updated successfully!');
                isEditMode = false;
                $('#view-mode').show();
                $('#profile-form').hide();
                $('#edit-btn-text').text('Edit');
                loadUserProfile();
            },
            error: function(xhr, status, error) {
                handleAjaxError(xhr, status, error, 'Failed to update profile');
            },
            complete: function() {
                $('#save-btn').prop('disabled', false);
                $('#save-btn').find('.btn-text').show();
                $('#save-btn').find('.btn-loader').hide();
            }
        });
    });

    // Load user profile
    function loadUserProfile() {
        $.ajax({
            url: contextPath + '/ContactInformationServlet',
            type: 'GET',
            dataType: 'json',
            success: function(data) {
                if (data && data.length > 0) {
                    const user = data[0];
                    
                    // Update header
                    const initial = user.firstName.charAt(0).toUpperCase();
                    $('#user-initial').text(initial);
                    $('#profile-name').text(user.firstName + ' ' + user.lastName);
                    $('#profile-email').text(user.email);
                    
                    // Update view mode
                    $('#view-fname').text(user.firstName);
                    $('#view-lname').text(user.lastName);
                    $('#view-email').text(user.email);
                    $('#view-phone').text(user.phoneNo || '-');
                    
                    // Update form fields
                    $('#fname').val(user.firstName);
                    $('#lname').val(user.lastName);
                    $('#email').val(user.email);
                    $('#phone').val(user.phoneNo);
                }
            },
            error: function(xhr, status, error) {
                console.error('Error loading profile:', error);
            }
        });
    }

    // Load user orders
    function loadUserOrders() {
        $('#orders-loading').show();
        $('#orders-empty').hide();
        $('#orders-container').hide();
        
        $.ajax({
            url: contextPath + '/GetUserOrdersServlet',
            type: 'GET',
            dataType: 'json',
            success: function(data) {
                $('#orders-loading').hide();
                
                if (!data || data.length === 0) {
                    $('#orders-empty').show();
                    return;
                }
                
                $('#orders-container').show().empty();
                
                // Group items by order
                const orderGroups = {};
                data.forEach(item => {
                    if (!orderGroups[item.orderId]) {
                        orderGroups[item.orderId] = {
                            orderId: item.orderId,
                            orderCode: item.orderCode,
                            total: item.total,
                            status: item.status,
                            orderedDate: item.orderedDate,
                            items: []
                        };
                    }
                    orderGroups[item.orderId].items.push(item);
                });
                
                // Render each order
                Object.values(orderGroups).forEach(order => {
                    renderOrder(order);
                });
            },
            error: function(xhr, status, error) {
                $('#orders-loading').hide();
                handleAjaxError(xhr, status, error, 'Failed to load orders');
            }
        });
    }

    function renderOrder(order) {
        const statusClass = order.status.toLowerCase() === 'completed' ? 'success' : 
                          order.status.toLowerCase() === 'pending' ? 'warning' : 'info';
        
        let orderHtml = `
            <div class="order-card">
                <div class="order-header">
                    <div class="order-info">
                        <h4>${order.orderCode}</h4>
                        <p class="order-date">${formatDate(order.orderedDate)}</p>
                    </div>
                    <div class="order-status">
                        <span class="badge badge-${statusClass}">${order.status}</span>
                        <p class="order-total">Rs. ${parseFloat(order.total).toFixed(2)}</p>
                    </div>
                </div>
                <div class="order-items">
        `;
        
        order.items.forEach(item => {
            const imagePath = contextPath + '/assets/images/uploads/' + (item.productImg || 'placeholder.png');
            
            orderHtml += `
                <div class="order-item">
                    <img src="${imagePath}" alt="${item.productName}" class="order-item-img" 
                         onerror="this.src='${contextPath}/assets/images/uploads/placeholder.png'">
                    <div class="order-item-details">
                        <h5>${item.productName}</h5>
                        <p>Quantity: ${item.quantity}</p>
                        <p class="item-price">Rs. ${parseFloat(item.productPrice).toFixed(2)}</p>
                    </div>
                    ${order.status.toLowerCase() === 'completed' ? 
                        `<button class="button button-small review-btn" 
                                 data-order-id="${order.orderId}" 
                                 data-pro-id="${item.proId}" 
                                 data-pro-name="${item.productName}">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                            </svg>
                            Review
                        </button>` 
                        : ''}
                </div>
            `;
        });
        
        orderHtml += `
                </div>
            </div>
        `;
        
        $('#orders-container').append(orderHtml);
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    }

    // Review button click handler
    $(document).on('click', '.review-btn', function() {
        const orderId = $(this).data('order-id');
        const proId = $(this).data('pro-id');
        const proName = $(this).data('pro-name');
        
        currentReviewData = { orderId, proId, proName };
        openReviewModal(proName);
    });

    function openReviewModal(productName) {
        // Create modal HTML
        const modalHtml = `
            <div class="review-modal-backdrop" id="reviewModalBackdrop">
                <div class="review-modal">
                    <div class="review-modal-header">
                        <h3>Write a Review</h3>
                        <button class="review-modal-close" onclick="closeReviewModal()">×</button>
                    </div>
                    <div class="review-modal-body">
                        <p class="review-product-name">${productName}</p>
                        
                        <div class="rating-input">
                            <label>Your Rating</label>
                            <div class="star-rating" id="starRating">
                                <span class="star" data-rating="1">☆</span>
                                <span class="star" data-rating="2">☆</span>
                                <span class="star" data-rating="3">☆</span>
                                <span class="star" data-rating="4">☆</span>
                                <span class="star" data-rating="5">☆</span>
                            </div>
                            <input type="hidden" id="ratingValue" value="0">
                        </div>
                        
                        <div class="review-message-input">
                            <label>Your Review</label>
                            <textarea id="reviewMessage" placeholder="Share your experience with this product..." rows="5"></textarea>
                        </div>
                        
                        <div class="review-modal-actions">
                            <button class="button button-secondary" onclick="closeReviewModal()">Cancel</button>
                            <button class="button" id="submitReviewBtn">Submit Review</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        $('body').append(modalHtml);
        $('body').css('overflow', 'hidden');
        
        // Star rating interaction
        let selectedRating = 0;
        
        $('.star').hover(
            function() {
                const rating = $(this).data('rating');
                highlightStars(rating);
            },
            function() {
                highlightStars(selectedRating);
            }
        );
        
        $('.star').click(function() {
            selectedRating = $(this).data('rating');
            $('#ratingValue').val(selectedRating);
            highlightStars(selectedRating);
        });
        
        function highlightStars(rating) {
            $('.star').each(function() {
                if ($(this).data('rating') <= rating) {
                    $(this).text('★').addClass('active');
                } else {
                    $(this).text('☆').removeClass('active');
                }
            });
        }
        
        // Submit review
        $('#submitReviewBtn').click(function() {
            submitReview();
        });
    }

    window.closeReviewModal = function() {
        $('#reviewModalBackdrop').remove();
        $('body').css('overflow', '');
        currentReviewData = null;
    };

    function submitReview() {
        const rating = parseInt($('#ratingValue').val());
        const message = $('#reviewMessage').val().trim();
        
        if (rating === 0) {
            NotificationSystem.warning('Please select a rating');
            return;
        }
        
        if (message.length === 0) {
            NotificationSystem.warning('Please write a review message');
            return;
        }
        
        $('#submitReviewBtn').prop('disabled', true).text('Submitting...');
        
        $.ajax({
            url: contextPath + '/AddReviewServlet',
            type: 'POST',
            data: {
                order_id: currentReviewData.orderId,
                pro_id: currentReviewData.proId,
                rating: rating,
                review_message: message
            },
            success: function(response) {
                NotificationSystem.success(response);
                closeReviewModal();
                loadUserOrders();
            },
            error: function(xhr, status, error) {
                handleAjaxError(xhr, status, error, 'Failed to submit review');
            },
            complete: function() {
                $('#submitReviewBtn').prop('disabled', false).text('Submit Review');
            }
        });
    }

    // Initialize
    loadUserProfile();
});