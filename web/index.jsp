<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%
    Integer userId = (Integer) session.getAttribute("userId");
    boolean userLoggedIn = (userId != null);
%>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>Home - Rasa Giri</title>
        
        <link rel="icon" type="image/x-icon" href="<%= request.getContextPath() %>/favicon.ico">
        <link rel="stylesheet" type="text/css" href="assets/css/style.css">
        <link rel="stylesheet" type="text/css" href="assets/css/notification.css">
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
        
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Space+Grotesk:wght@300..700&display=swap" rel="stylesheet">
        
        <script type="text/javascript">
            var contextPath = "<%= request.getContextPath() %>";
            var isUserLoggedIn = <%= userLoggedIn %>;
            
            console.log('Index Page - Context Path:', contextPath === '' ? '(root context)' : contextPath);
            console.log('Index Page - User logged in:', isUserLoggedIn);
        </script>
        
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    </head>
    <body>
        <div id="notification-container"></div>
        
        <%@include file="includes/shared/navbar.jsp" %>
        <%@include file="includes/shared/wishlistSidebar.jsp" %>
        
        <header class="main-header">
            <div class="container">
                <div class="hero-text">
                    <p>MADE WITH LOVE</p>
                    <h1>Best Foods Which Makes <br/> You Hungry</h1>
                    <a href="shop.jsp" class="button button-hero">Show More</a>
                </div>
            </div>
        </header>
        
        <section class='latest-products'>
            <div class="container">
                <h1>Latest Products</h1>
                            
                <div class='row' id="latestProducts">
                    <div class="col-12 text-center py-5">
                        <div class="spinner-border text-primary" role="status">
                            <span class="visually-hidden">Loading...</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        
        <section class="categories-section">
            <div class="container">
                <h1>Shop By Categories</h1>
                
                <div class="row" id="categoriesContainer">
                    <div class="col-12 text-center py-5">
                        <div class="spinner-border text-primary" role="status">
                            <span class="visually-hidden">Loading...</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        
        <%@include file="includes/shared/newsletter.jsp" %>
        <%@include file="includes/shared/footer.jsp" %>
        
        <%@include file="includes/shared/authModal.jsp" %>
        
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
        
        <script src="assets/js/index.js"></script>
    </body>
</html>