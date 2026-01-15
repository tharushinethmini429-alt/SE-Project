<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%
    Integer userId = (Integer) session.getAttribute("userId");
    boolean userLoggedIn = (userId != null);
%>
<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>Shop Page</title>
    
    <link rel="stylesheet" type="text/css" href="assets/css/style.css">
    <link rel="stylesheet" type="text/css" href="assets/css/notification.css">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=Poppins:wght@100..900&display=swap" rel="stylesheet">
    
    <script type="text/javascript">
        var contextPath = "<%= request.getContextPath() %>";
        var isUserLoggedIn = <%= userLoggedIn %>;
        
        console.log('Shop Page - Context Path:', contextPath);
        console.log('Shop Page - User logged in status:', isUserLoggedIn);
    </script>
    
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
</head>
<body>
    <div id="notification-container"></div>
    
<%@include file="includes/shared/navbar.jsp" %>
<%@include file="includes/shared/wishlistSidebar.jsp" %>

<header class="sub-header">
    <div class="container">
        <div class="hero-text">
            <h1>Our Shop</h1>
        </div>
    </div>
</header>

<section class="shop-wrapper">
    <div class="container">
        <div class="d-flex">
            <div class="product-sidebar">
                <h3>Product Categories</h3>
                <div class="category-buttons" id="categoryButtons">
                    <!-- Categories will be loaded here dynamically -->
                </div>
            </div>
            <div class="product-container" style="width: 100%">
                <div class="row" id="productContainer">
                    <div class="col-12 text-center py-5">
                        <div class="spinner-border text-primary" role="status">
                            <span class="visually-hidden">Loading...</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<%@include file="includes/shared/footer.jsp" %>

<%@include file="includes/shared/authModal.jsp" %>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" crossorigin="anonymous"></script>

<script src="assets/js/index.js"></script>
</body>
</html>