$(document).ready(function() {
    let originalData = {};
    let isEditMode = false;
    
    function loadUserProfile() {
        $.ajax({
            url: contextPath + '/GetCurrentUserServlet',
            type: 'GET',
            dataType: 'json',
            success: function(data) {
                console.log('User data:', data);
                
                $('#profile-name').text(data.fullName || 'User');
                $('#profile-email').text(data.email || '');
                $('#user-initial').text(data.initial || 'U');
                
                $('#view-fname').text(data.firstName || '-');
                $('#view-lname').text(data.lastName || '-');
                $('#view-email').text(data.email || '-');
                $('#view-phone').text(data.phone || '-');
                
                $('#fname').val(data.firstName || '');
                $('#lname').val(data.lastName || '');
                $('#email').val(data.email || '');
                $('#phone').val(data.phone || '');
                
                originalData = {
                    firstName: data.firstName || '',
                    lastName: data.lastName || '',
                    email: data.email || '',
                    phone: data.phone || ''
                };
            },
            error: function(xhr) {
                if (xhr.status === 401) {
                    window.location.href = contextPath + '/signin.jsp';
                } else {
                    $('#error-message').text('Failed to load profile data').show();
                }
            }
        });
    }
    
    function loadUserOrders() {
        $('#orders-loading').show();
        $('#orders-empty').hide();
        $('#orders-container').empty();
        
        $.ajax({
            url: contextPath + '/GetUserOrdersServlet',
            type: 'GET',
            dataType: 'json',
            success: function(orders) {
                $('#orders-loading').hide();
                
                if (orders.length === 0) {
                    $('#orders-empty').show();
                } else {
                    displayOrders(orders);
                }
            },
            error: function(xhr) {
                $('#orders-loading').hide();
                if (xhr.status === 401) {
                    window.location.href = contextPath + '/signin.jsp';
                } else {
                    $('#orders-container').html('<div class="alert alert-danger">Failed to load orders</div>');
                }
            }
        });
    }
    
    function displayOrders(orders) {
        let html = '';
        
        orders.forEach(function(order) {
            const statusClass = getStatusClass(order.status);
            const statusBadge = getStatusBadge(order.status);
            
            html += `
                <div class="order-card" data-order-id="${order.orderId}">
                    <div class="order-header">
                        <div class="order-info">
                            <h4>Order #${order.orderCode}</h4>
                            <p class="order-date">${formatDate(order.date)}</p>
                        </div>
                        <div class="order-status">
                            <span class="status-badge ${statusClass}">${statusBadge}</span>
                        </div>
                    </div>
                    <div class="order-body">
                        <div class="order-details-row">
                            <div class="order-detail">
                                <span class="label">Total Amount</span>
                                <span class="value">Rs. ${order.total.toFixed(2)}</span>
                            </div>
                            <div class="order-detail">
                                <span class="label">Status</span>
                                <span class="value">${order.status}</span>
                            </div>
                        </div>
                        <button class="button button-secondary view-rate-btn" data-order-id="${order.orderId}" style="margin-top: 16px; width: auto;">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                            </svg>
                            Rate Products
                        </button>
                        <div class="order-reviews-container" data-order-id="${order.orderId}" style="display: none; margin-top: 20px;">
                            <div style="padding: 16px; background: #f9fafb; border-radius: 8px; border: 1px solid #e8ecef;">
                                <h5 style="margin: 0 0 16px 0; font-size: 16px; font-weight: 600; color: #141718; display: flex; align-items: center; gap: 8px;">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                    </svg>
                                    Your Reviews
                                </h5>
                                <div class="reviews-list"></div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });
        
        $('#orders-container').html(html);
        
        orders.forEach(function(order) {
            loadOrderReviews(order.orderId);
        });
    }
    
    function loadOrderReviews(orderId) {
        $.ajax({
            url: contextPath + '/GetOrderReviewsServlet',
            type: 'GET',
            data: { orderId: orderId },
            dataType: 'json',
            success: function(reviews) {
                if (reviews && reviews.length > 0) {
                    displayOrderReviews(orderId, reviews);
                }
            },
            error: function(xhr) {
                console.error('Failed to load reviews for order:', orderId);
            }
        });
    }
    
    function displayOrderReviews(orderId, reviews) {
        const orderCard = $(`.order-card[data-order-id="${orderId}"]`);
        const reviewsContainer = orderCard.find('.order-reviews-container');
        const reviewsList = reviewsContainer.find('.reviews-list');
        
        let html = '';
        
        reviews.forEach(function(review) {
            const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
            
            html += `
                <div style="padding: 12px; background: #fff; border-radius: 6px; margin-bottom: 12px; border: 1px solid #e8ecef;">
                    <div style="display: flex; gap: 12px; align-items: start;">
                        <img src="${contextPath}/assets/images/uploads/${review.productImage}" 
                             alt="${review.productName}"
                             onerror="this.src='${contextPath}/assets/images/uploads/placeholder.png'"
                             style="width: 50px; height: 50px; object-fit: cover; border-radius: 6px; background: #f3f5f7;">
                        <div style="flex: 1;">
                            <h6 style="margin: 0 0 4px 0; font-size: 14px; font-weight: 600; color: #141718;">${review.productName}</h6>
                            <div style="color: #fbbf24; font-size: 16px; margin-bottom: 4px;">${stars}</div>
                            ${review.message ? `<p style="margin: 0; font-size: 13px; color: #6c7275; line-height: 1.5;">${review.message}</p>` : ''}
                            <p style="margin: 4px 0 0 0; font-size: 12px; color: #9ca3af;">Reviewed on ${formatDate(review.reviewDate)}</p>
                        </div>
                    </div>
                </div>
            `;
        });
        
        reviewsList.html(html);
        reviewsContainer.show();
        orderCard.find('.view-rate-btn').hide();
    }
    
    function getStatusClass(status) {
        const statusMap = {
            'Pending': 'status-pending',
            'Processing': 'status-processing',
            'Shipped': 'status-shipped',
            'Delivered': 'status-delivered',
            'Cancelled': 'status-cancelled'
        };
        return statusMap[status] || 'status-pending';
    }
    
    function getStatusBadge(status) {
        return status || 'Pending';
    }
    
    function formatDate(dateString) {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    }
    
    $(document).on('click', '.view-rate-btn', function() {
        const orderId = $(this).data('order-id');
        loadOrderItems(orderId);
    });
    
    function loadOrderItems(orderId) {
        console.log('loadOrderItems called with orderId:', orderId);
        
        $.ajax({
            url: contextPath + '/GetOrderItemsServlet',
            type: 'GET',
            data: { orderId: orderId },
            dataType: 'json',
            success: function(items) {
                console.log('Items loaded successfully:', items);
                
                if (!items || items.length === 0) {
                    alert('No items found for this order');
                    return;
                }
                
                $.ajax({
                    url: contextPath + '/GetOrderReviewsServlet',
                    type: 'GET',
                    data: { orderId: orderId },
                    dataType: 'json',
                    success: function(reviews) {
                        const reviewedProductIds = reviews.map(r => r.productId);
                        const unreviewed = items.filter(item => !reviewedProductIds.includes(item.productId));
                        
                        if (unreviewed.length === 0) {
                            alert('You have already reviewed all products in this order');
                            return;
                        }
                        
                        showRatingModal(unreviewed, orderId);
                    },
                    error: function() {
                        showRatingModal(items, orderId);
                    }
                });
            },
            error: function(xhr, status, error) {
                console.error('Error loading items:', {xhr, status, error});
                console.error('Response text:', xhr.responseText);
                alert('Failed to load order items. Please check the console for details.');
            }
        });
    }
    
    function showRatingModal(items, orderId) {
        console.log('showRatingModal called with items:', items);
        
        if (!items || items.length === 0) {
            alert('No items found for this order');
            return;
        }
        
        let modalHtml = `
            <div class="auth-modal-backdrop active" id="rating-modal">
                <div class="auth-modal" style="max-width: 580px; max-height: 90vh; overflow: hidden; display: flex; flex-direction: column;">
                    <div class="auth-modal-content" style="padding: 32px 28px; overflow: hidden; display: flex; flex-direction: column; height: 100%;">
                        <button class="auth-modal-close" onclick="closeRatingModal()" style="position: absolute; top: 16px; right: 16px; background: #f3f5f7; border: none; border-radius: 50%; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.3s ease; z-index: 10;">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                        <div class="auth-modal-icon" style="font-size: 48px; margin-bottom: 16px;">⭐</div>
                        <h3 style="font-family: 'Poppins', sans-serif; font-size: 24px; font-weight: 600; color: #141718; margin-bottom: 8px;">Rate Products</h3>
                        <p style="font-size: 14px; line-height: 22px; color: #6c7275; margin-bottom: 20px;">Share your experience with these products</p>
                        <div id="rating-items-container" style="flex: 1; overflow-y: auto; width: 100%; margin-bottom: 20px; padding-right: 8px;">
        `;
        
        items.forEach(function(item) {
            console.log('Adding item to modal:', item);
            
            let imagePath = item.productImage;
            if (imagePath.startsWith('/')) {
                imagePath = imagePath.substring(1);
            }
            
            modalHtml += `
                <div class="rating-item-card" style="border: 1.5px solid #e8ecef; border-radius: 10px; padding: 16px; margin-bottom: 14px; background: #fff;">
                    <div style="display: flex; gap: 12px; align-items: center; margin-bottom: 14px;">
                        <img src="${contextPath}/assets/images/uploads/${imagePath}" 
                             alt="${item.productName}" 
                             onerror="this.src='${contextPath}/assets/images/uploads/placeholder.png'"
                             style="width: 50px; height: 50px; object-fit: cover; border-radius: 6px; background: #f3f5f7; flex-shrink: 0;">
                        <div style="flex: 1; min-width: 0;">
                            <h4 style="margin: 0 0 2px 0; font-size: 14px; font-weight: 600; color: #141718; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${item.productName}</h4>
                            <p style="margin: 0; font-size: 13px; color: #6c7275;">Rs. ${item.price.toFixed(2)}</p>
                        </div>
                    </div>
                    <div class="input-box" style="margin-bottom: 10px; gap: 6px;">
                        <label style="font-size: 11px; font-weight: 700; color: #6c7275; text-transform: uppercase; letter-spacing: 0.5px;">Rating *</label>
                        <div class="star-rating" data-product-id="${item.productId}" style="display: flex; gap: 6px; font-size: 28px; cursor: pointer;">
                            <span class="star" data-value="1" style="color: #d1d5db; transition: color 0.2s;">☆</span>
                            <span class="star" data-value="2" style="color: #d1d5db; transition: color 0.2s;">☆</span>
                            <span class="star" data-value="3" style="color: #d1d5db; transition: color 0.2s;">☆</span>
                            <span class="star" data-value="4" style="color: #d1d5db; transition: color 0.2s;">☆</span>
                            <span class="star" data-value="5" style="color: #d1d5db; transition: color 0.2s;">☆</span>
                        </div>
                    </div>
                    <div class="input-box" style="gap: 6px;">
                        <label style="font-size: 11px; font-weight: 700; color: #6c7275; text-transform: uppercase; letter-spacing: 0.5px;">Review Message (Optional)</label>
                        <textarea class="review-message" data-product-id="${item.productId}" 
                                  placeholder="Share your thoughts about this product..." 
                                  style="width: 100%; min-height: 65px; padding: 10px; border: 1.5px solid #e8ecef; border-radius: 6px; font-family: Inter, sans-serif; font-size: 13px; resize: vertical; box-sizing: border-box;"></textarea>
                    </div>
                </div>
            `;
        });
        
        modalHtml += `
                        </div>
                        <div class="auth-modal-actions" style="display: flex; gap: 10px; flex-direction: column;">
                            <button class="button" id="submit-ratings-btn" data-order-id="${orderId}" style="margin: 0; padding: 12px 24px;">
                                <span class="btn-text">Submit Reviews</span>
                                <span class="btn-loader" style="display: none;">
                                    <div class="spinner-border spinner-border-sm" role="status">
                                        <span class="visually-hidden">Loading...</span>
                                    </div>
                                    Submitting...
                                </span>
                            </button>
                            <button class="button button-outline" onclick="closeRatingModal()" style="margin: 0; padding: 12px 24px;">Cancel</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        $('body').append(modalHtml);
        console.log('Modal HTML appended to body');
        
        setTimeout(function() {
            console.log('Initializing star ratings');
            
            $('.star-rating .star').on('click', function() {
                const rating = $(this).data('value');
                const container = $(this).parent();
                container.data('rating', rating);
                
                console.log('Star clicked, rating:', rating);
                
                container.find('.star').each(function(index) {
                    if (index < rating) {
                        $(this).text('★').css('color', '#fbbf24');
                    } else {
                        $(this).text('☆').css('color', '#d1d5db');
                    }
                });
            });
            
            $('.star-rating .star').on('mouseenter', function() {
                const rating = $(this).data('value');
                const container = $(this).parent();
                
                container.find('.star').each(function(index) {
                    if (index < rating) {
                        $(this).css('color', '#fbbf24');
                    } else {
                        $(this).css('color', '#d1d5db');
                    }
                });
            });
            
            $('.star-rating').on('mouseleave', function() {
                const rating = $(this).data('rating') || 0;
                
                $(this).find('.star').each(function(index) {
                    if (index < rating) {
                        $(this).text('★').css('color', '#fbbf24');
                    } else {
                        $(this).text('☆').css('color', '#d1d5db');
                    }
                });
            });
        }, 100);
    }
    
    $(document).on('click', '#submit-ratings-btn', function() {
        const orderId = $(this).data('order-id');
        const reviews = [];
        let allRated = true;
        
        $('.star-rating').each(function() {
            const productId = $(this).data('product-id');
            const rating = $(this).data('rating');
            const message = $(`.review-message[data-product-id="${productId}"]`).val().trim();
            
            if (!rating) {
                allRated = false;
                return false;
            }
            
            reviews.push({
                productId: productId,
                orderId: orderId,
                rating: rating,
                message: message || null
            });
        });
        
        if (!allRated) {
            alert('Please rate all products before submitting');
            return;
        }
        
        $('#submit-ratings-btn').prop('disabled', true);
        $('.btn-text').hide();
        $('.btn-loader').show();
        
        let completedReviews = 0;
        let failedReviews = 0;
        
        reviews.forEach(function(review) {
            $.ajax({
                url: contextPath + '/SubmitReviewServlet',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(review),
                success: function(response) {
                    completedReviews++;
                    if (completedReviews + failedReviews === reviews.length) {
                        handleReviewsComplete(completedReviews, failedReviews, orderId);
                    }
                },
                error: function() {
                    failedReviews++;
                    if (completedReviews + failedReviews === reviews.length) {
                        handleReviewsComplete(completedReviews, failedReviews, orderId);
                    }
                }
            });
        });
    });
    
    function handleReviewsComplete(completed, failed, orderId) {
        $('#submit-ratings-btn').prop('disabled', false);
        $('.btn-text').show();
        $('.btn-loader').hide();
        
        if (failed === 0) {
            alert('All reviews submitted successfully!');
            closeRatingModal();
            loadOrderReviews(orderId);
        } else {
            alert(`${completed} reviews submitted, ${failed} failed. Please try again for failed reviews.`);
        }
    }
    
    window.closeRatingModal = function() {
        $('#rating-modal').remove();
    };
    
    // Edit toggle button handler
    $('#edit-toggle-btn').on('click', function() {
        isEditMode = !isEditMode;
        
        if (isEditMode) {
            $('#view-mode').hide();
            $('#profile-form').show();
            $('#edit-btn-text').text('Cancel');
            $(this).removeClass('button-secondary').addClass('button-danger');
        } else {
            $('#view-mode').show();
            $('#profile-form').hide();
            $('#edit-btn-text').text('Edit');
            $(this).removeClass('button-danger').addClass('button-secondary');
            
            $('#fname').val(originalData.firstName);
            $('#lname').val(originalData.lastName);
            $('#phone').val(originalData.phone);
            $('#success-message, #error-message').hide();
        }
    });
    
    // Profile form submission
    $('#profile-form').on('submit', function(e) {
        e.preventDefault();
        
        const formData = {
            firstName: $('#fname').val().trim(),
            lastName: $('#lname').val().trim(),
            phone: $('#phone').val().trim()
        };
        
        $('#save-btn').prop('disabled', true);
        $('.btn-text').hide();
        $('.btn-loader').show();
        $('#success-message, #error-message').hide();
        
        $.ajax({
            url: contextPath + '/UpdateProfileServlet',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(formData),
            success: function(response) {
                $('#success-message').show();
                
                // Update display
                $('#profile-name').text(formData.firstName + ' ' + formData.lastName);
                $('#user-initial').text(formData.firstName.charAt(0).toUpperCase());
                
                $('#view-fname').text(formData.firstName);
                $('#view-lname').text(formData.lastName);
                $('#view-phone').text(formData.phone || '-');
                
                // Update original data
                originalData.firstName = formData.firstName;
                originalData.lastName = formData.lastName;
                originalData.phone = formData.phone;
                
                // Exit edit mode after successful update
                setTimeout(function() {
                    $('#success-message').fadeOut();
                    
                    // Manually reset the edit mode
                    isEditMode = false;
                    $('#view-mode').show();
                    $('#profile-form').hide();
                    $('#edit-btn-text').text('Edit');
                    $('#edit-toggle-btn').removeClass('button-danger').addClass('button-secondary');
                }, 2000);
            },
            error: function() {
                $('#error-message').show();
            },
            complete: function() {
                $('#save-btn').prop('disabled', false);
                $('.btn-text').show();
                $('.btn-loader').hide();
            }
        });
    });
    
    // Cancel button handler
    $('#cancel-btn').on('click', function() {
        $('#edit-toggle-btn').click();
    });
    
    // Tab switching
    $('.profile-tab-btn').on('click', function() {
        const tab = $(this).data('tab');
        
        $('.profile-tab-btn').removeClass('active');
        $(this).addClass('active');
        
        $('.profile-tab-content').hide();
        $('#' + tab + '-tab').show();
        
        if (tab === 'orders') {
            loadUserOrders();
        }
        
        if (isEditMode) {
            $('#edit-toggle-btn').click();
        }
    });
    
    loadUserProfile();
});