<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>Sign In</title>
        
        <link rel="stylesheet" type="text/css" href="assets/css/style.css">
        <link rel="stylesheet" type="text/css" href="assets/css/notification.css">
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
        
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Space+Grotesk:wght@300..700&display=swap" rel="stylesheet">
        
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    </head>
    <body>
        <div id="notification-container"></div>
        
        <div class="authentication-section">
            <div class="row g-0">
                <div class="col-md-6 authentication-img">
                    <img src="assets/images/ecommerce.jpg" alt="E-Commerce" />
                </div>
                <div class="col-md-6 d-flex align-items-center justify-content-center">
                    <div class="w-100 d-flex justify-content-center">
                        <form class="authentication-form" id="signin-form">
                            <div class="logo-wrapper mb-4">
                                <p>Rasa Giri</p>
                            </div>
                            
                            <h3>Sign In</h3>
                            <p>Don't have an account yet? <a href="signup.jsp">Sign Up</a></p>
                            <p class="error" id="error"></p>
                            
                            <div class="outlined-input">
                                <div class="input-wrapper">
                                    <input type="email" placeholder="Email Address" name="email" id="signin-email"/>
                                </div>
                            </div>
                            
                            <div class="outlined-input">
                                <div class="input-wrapper">
                                    <input type="password" placeholder="Password" id="passwordInput" name="password"/>
                                </div>
                                <button type="button" onclick="togglePasswordVisibility()">
                                    <img src="assets/images/icons/eye.png" alt="Toggle Password" />
                                </button>
                            </div>
                            
                            <button type="button" class="button" onclick="signIn()">Sign in</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        
        <script>
            var contextPath = "${pageContext.request.contextPath}";
        </script>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
        <script>
            
    var contextPath = '<%= request.getContextPath() %>';
    var isUserLoggedIn = <%= session.getAttribute("userId") != null %>;
    
    console.log('Context Path:', contextPath);
    console.log('User Logged In:', isUserLoggedIn);
        </script>
        <script src="assets/js/index.js"></script>
        
    </body>
</html>