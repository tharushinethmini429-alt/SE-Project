<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>Product Details</title>

    <link rel="stylesheet" type="text/css" href="assets/css/style.css">
    <link rel="stylesheet" type="text/css" href="assets/css/notification.css">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=Poppins&display=swap" rel="stylesheet">
    
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css">

    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>

    <script>
        $(document).ready(function () {

            function getUrlParameter(name) {
                name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
                var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
                var results = regex.exec(location.search);
                return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
            }

            var proId = getUrlParameter('proId');

            $.ajax({
                url: '${pageContext.request.contextPath}/GetProductServlet',
                type: 'GET',
                data: { proId: proId },
                dataType: 'json',
                success: function (product) {

                    var data = product[0];

                    var proName = data.proName;
                    var proPrice = data.proPrice;
                    var proDesc = data.proDesc;
                    var proImg = data.proImg;
                    var reviews = data.proReviews || 0;

                    var imageUrl = '${pageContext.request.contextPath}/assets/images/uploads/' + proImg;

                    $('#pro_id').val(proId);
                    $('#product-name').text(proName);
                    $('#product-price').text('Rs. ' + proPrice);
                    $('#product-desc').text(proDesc); 
                    $('#product-img').attr('src', imageUrl);
                    $('#sub_total').val(proPrice);
                    
    
                    displayStarRating(reviews);
                },
                error: function () {
                    alert('Error fetching product data.');
                }
            });

            function displayStarRating(reviews) {
                var ratingContainer = $('#product-rating');
                ratingContainer.empty();
                
                var fullStars = Math.floor(reviews);
                var hasHalfStar = (reviews % 1) >= 0.5;
                var emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
                
                for (var i = 0; i < fullStars; i++) {
                    ratingContainer.append('<i class="bi bi-star-fill text-warning"></i>');
                }
                
                if (hasHalfStar) {
                    ratingContainer.append('<i class="bi bi-star-half text-warning"></i>');
                }
                
                for (var i = 0; i < emptyStars; i++) {
                    ratingContainer.append('<i class="bi bi-star text-warning"></i>');
                }
                
                var reviewText = reviews.toFixed(1) + ' (' + Math.round(reviews) + ' Reviews)';
                $('#review-count').text(reviewText);
            }

        });
    </script>
</head>

<body>
    <div id="notification-container"></div>
    
    <%@include file="includes/shared/navbar.jsp" %>
    <%@include file="includes/shared/wishlistSidebar.jsp" %>

    <section class="product-details-section">
        <div class="container">
            <div class="row">

                <div class="col-md-6">
                    <div class="product-details-img">
                        <img id="product-img" src="" alt="Product Image">
                    </div>
                </div>

                <div class="col-md-6">
                    <div class="product-details">
                        <h1 id="product-name"></h1>
                        
                        <!-- Star Rating Section -->
                        <div class="rating mb-3 d-flex align-items-center gap-2">
                            <div id="product-rating"></div>
                            <small id="review-count" class="text-muted"></small>
                        </div>
                        
                        <p id="product-desc"></p>
                        <h3 id="product-price"></h3>

                        <div class="product-details-action">
                            <form id="addToCartForm" method="POST">
                                <input type="hidden" name="pro_id" id="pro_id" />
                                <input type="hidden" name="quantity" value="1" id="quantity" />
                                <input type="hidden" name="sub_total" id="sub_total" />
                                <button class="button" onclick="addToCart()">Add To Cart</button>
                            </form>

                            <form id="addToWishList" method="POST">
                                <input type="hidden" name="pro_id" id="pro_id" />
                                <button class="button button-outline" onclick="addToWishlist()" >
                                    Add To Wishlist
                                </button>
                            </form>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    </section>

    <script>
        var contextPath = "${pageContext.request.contextPath}";
    </script>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <script>
    var contextPath = '<%= request.getContextPath() %>';
    var isUserLoggedIn = <%= session.getAttribute("userId") != null %>;
    
    console.log('Context Path:', contextPath);
    console.log('User Logged In:', isUserLoggedIn);
</script>
    <script src="assets/js/index.js"></script>

</body>
</html>