<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%
    Integer userId = (Integer) session.getAttribute("userId");
    boolean userLoggedIn = (userId != null);
%>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>Profile - Rasa Giri</title>
        
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=Poppins:wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900&display=swap" rel="stylesheet">
        
        <link rel="stylesheet" type="text/css" href="assets/css/style.css">
        <link rel="stylesheet" type="text/css" href="assets/css/notification.css">
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
        
        <style>
            .nav-list,
            .nav-list li,
            .nav-list li a {
                font-family: Inter, sans-serif !important;
                font-weight: 600;
            }
        </style>
        

        <script type="text/javascript">
            var contextPath = "<%= request.getContextPath() %>";
            var isUserLoggedIn = <%= userLoggedIn %>;
            
            console.log('Profile Page - Context Path:', contextPath);
            console.log('Profile Page - User logged in status:', isUserLoggedIn);
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
                    <h1>My Profile</h1>
                </div>
            </div>
        </header>
        
        <div class="container">
            <div class="profile-header">
                <div class="profile-img-wrapper">
                    <div class="profile-img" id="profile-avatar">
                        <span id="user-initial">U</span>
                    </div>
                </div>
                <h4 id="profile-name">Loading...</h4>
                <p id="profile-email" class="profile-email">Loading...</p>
                
                <div class="profile-buttons">
                    <button class="profile-tab-btn active" data-tab="account">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                        Account Details
                    </button>
                    <button class="profile-tab-btn" data-tab="orders">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                            <rect x="2" y="9" width="4" height="12"></rect>
                            <circle cx="4" cy="4" r="2"></circle>
                        </svg>
                        My Orders
                    </button>
                </div>
            </div>
        </div>
        
        <div class="profile-container">
            <div class="container">
                <div class="row justify-content-center">
                    <div class="col-lg-8 col-md-10">
                        
                        <div class="profile-tab-content active" id="account-tab">
                            <div class="profile-form-wrapper">
                                <div class="profile-section-header">
                                    <div class="d-flex justify-content-between align-items-center">
                                        <div>
                                            <h3>Account Details</h3>
                                            <p>View and update your personal information</p>
                                        </div>
                                        <button type="button" class="button" id="edit-toggle-btn">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                            </svg>
                                            <span id="edit-btn-text">Edit</span>
                                        </button>
                                    </div>
                                </div>
                                
                                <div id="view-mode">
                                    <div class="profile-info-grid">
                                        <div class="profile-info-item">
                                            <label>First Name</label>
                                            <p id="view-fname">-</p>
                                        </div>
                                        <div class="profile-info-item">
                                            <label>Last Name</label>
                                            <p id="view-lname">-</p>
                                        </div>
                                        <div class="profile-info-item">
                                            <label>Email Address</label>
                                            <p id="view-email">-</p>
                                        </div>
                                        <div class="profile-info-item">
                                            <label>Phone Number</label>
                                            <p id="view-phone">-</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <form class="profile-form" id="profile-form">
                                    <div class="row">
                                        <div class="col-md-6">
                                            <div class="input-box">
                                                <label>First Name *</label>
                                                <input type="text" placeholder="Enter first name" name="fname" id="fname" required/>
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="input-box">
                                                <label>Last Name *</label>
                                                <input type="text" placeholder="Enter last name" name="lname" id="lname" required/>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div class="input-box">
                                        <label>Email Address *</label>
                                        <input type="email" placeholder="Enter email" name="email" id="email" required readonly/>
                                        <small class="input-helper">Email cannot be changed</small>
                                    </div>
                                    
                                    <div class="input-box">
                                        <label>Phone Number</label>
                                        <input type="tel" placeholder="Enter phone number" name="pno" id="phone"/>
                                    </div>
                                    
                                    <div class="profile-form-actions">
                                        <button type="button" class="button button-secondary" id="cancel-btn">Cancel</button>
                                        <button type="submit" class="button" id="save-btn">
                                            <span class="btn-text">Save Changes</span>
                                            <span class="btn-loader">Saving...</span>
                                        </button>
                                    </div>
                                    
                                    <div class="alert alert-success mt-3 hidden" id="success-message">
                                        Profile updated successfully!
                                    </div>
                                    <div class="alert alert-danger mt-3 hidden" id="error-message">
                                        Failed to update profile. Please try again.
                                    </div>
                                </form>
                            </div>
                        </div>
                        
                        <div class="profile-tab-content" id="orders-tab">
                            <div class="profile-form-wrapper">
                                <div class="profile-section-header">
                                    <h3>My Orders</h3>
                                    <p>View your order history and track deliveries</p>
                                </div>
                                
                                <div id="orders-loading" class="text-center py-5">
                                    <div class="spinner-border text-primary" role="status">
                                        <span class="visually-hidden">Loading...</span>
                                    </div>
                                    <p class="mt-2">Loading orders...</p>
                                </div>
                                
                                <div id="orders-empty" class="text-center py-5">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#6c7275" stroke-width="1.5">
                                        <circle cx="9" cy="21" r="1"></circle>
                                        <circle cx="20" cy="21" r="1"></circle>
                                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                                    </svg>
                                    <h4>No Orders Yet</h4>
                                    <p class="text-muted">You haven't placed any orders yet.</p>
                                    <a href="shop.jsp" class="button mt-3">Start Shopping</a>
                                </div>
                                
                                <div id="orders-container" class="orders-list">
                                    
                                </div>
                            </div>
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
        
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
        <script src="assets/js/index.js"></script>
        <script src="assets/js/profile.js"></script>
    </body>
</html>