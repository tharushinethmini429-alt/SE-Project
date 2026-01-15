<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>Contact Us - Shop</title>
        
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
        
        <%@include file="includes/shared/navbar.jsp" %>
        <%@include file="includes/shared/wishlistSidebar.jsp" %>
        
        <header class="sub-header">
            <div class="container">
                <div class="hero-text">
                    <h1>Contact Us</h1>
                </div>
            </div>
        </header>
        
        <section class="contact-section">
            <div class="container">
                <div class="row justify-content-center">
                    <div class="col-lg-10">
                        <div class="contact-hero">
                            <div class="contact-hero-content">
                                <span class="contact-badge">💬 Let's Talk</span>
                                <h2>Have Questions?</h2>
                                <p>We're here to help! Whether you have questions about our products, need assistance with an order, or just want to share feedback, we'd love to hear from you.</p>
                            </div>
                        </div>
                        
                        <div class="row g-5 mt-4">
                            <div class="col-lg-5">
                                <div class="contact-reasons">
                                    <h3>Why Reach Out?</h3>
                                    <div class="reason-item">
                                        <span class="reason-icon">🛒</span>
                                        <div>
                                            <h4>Order Support</h4>
                                            <p>Questions about your order or delivery? We're here to help.</p>
                                        </div>
                                    </div>
                                    <div class="reason-item">
                                        <span class="reason-icon">🍽️</span>
                                        <div>
                                            <h4>Product Inquiries</h4>
                                            <p>Want to know more about our fresh ingredients and products?</p>
                                        </div>
                                    </div>
                                    <div class="reason-item">
                                        <span class="reason-icon">💡</span>
                                        <div>
                                            <h4>Feedback & Suggestions</h4>
                                            <p>Your thoughts help us improve and serve you better.</p>
                                        </div>
                                    </div>
                                    <div class="reason-item">
                                        <span class="reason-icon">🤝</span>
                                        <div>
                                            <h4>Partnership Opportunities</h4>
                                            <p>Interested in working with us? Let's discuss!</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="col-lg-7">
                                <div class="contact-form-card">
                                    <h3>Send Us a Message</h3>
                                    <form class="contact-form" id="contactForm" method="POST">
                                        <div class="row g-4">
                                            <div class="col-md-6">
                                                <div class="input-box">
                                                    <label>Full Name</label>
                                                    <input type="text" placeholder="Enter your full name" name="name" id="fname" required/>
                                                </div>
                                            </div>
                                            
                                            <div class="col-md-6">
                                                <div class="input-box">
                                                    <label>Email Address</label>
                                                    <input type="email" placeholder="Enter your email" name="email" id="email" required/>
                                                </div>
                                            </div>
                                            
                                            <div class="col-12">
                                                <div class="input-box">
                                                    <label>Subject</label>
                                                    <input type="text" placeholder="What's this about?" name="subject" id="subject" required/>
                                                </div>
                                            </div>
                                            
                                            <div class="col-12">
                                                <div class="input-box">
                                                    <label>Message</label>
                                                    <textarea placeholder="Tell us what's on your mind..." name="message" id="message" required></textarea>
                                                </div>
                                            </div>
                                            
                                            <div class="col-12">
                                                <button type="submit" class="button" onclick="sendMessage()">Send Message</button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        
        <%@include file="includes/shared/footer.jsp" %>
        
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