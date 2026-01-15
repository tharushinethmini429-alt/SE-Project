<nav>
    <div class="container">
        <div class="nav-wrapper">
            <div class="logo-wrapper">
                <button class="mobile-nav-toggle" id="mobile-nav-toggle" onclick="openMobileNav()">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M7 8H17M7 12H17M7 16H17" stroke="#141718" stroke-width="1.5" stroke-linecap="round"/>
                        <path d="M7 8H17M7 12H17M7 16H17" stroke="black" stroke-opacity="0.2" stroke-width="1.5" stroke-linecap="round"/>
                    </svg>
                </button>
                <p>Rasa Giri</p>
            </div>
            
            <ul class="nav-list" role="list">
                <li><a href="index.jsp">Home</a></li>
                <li><a href="shop.jsp">Shop</a></li>
                <li><a href="contactus.jsp">Contact us</a></li>
            </ul>
            
            <div class="nav-icons">

                <button class="profile-button" onclick="toggleProfileDropdown()">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M18.5588 19.5488C17.5654 16.8918 15.0036 15 12 15C8.99638 15 6.4346 16.8918 5.44117 19.5488M18.5588 19.5488C20.6672 17.7154 22 15.0134 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 15.0134 3.33285 17.7154 5.44117 19.5488M18.5588 19.5488C16.8031 21.0756 14.5095 22 12 22C9.49052 22 7.19694 21.0756 5.44117 19.5488M15 9C15 10.6569 13.6569 12 12 12C10.3431 12 9 10.6569 9 9C9 7.34315 10.3431 6 12 6C13.6569 6 15 7.34315 15 9Z" stroke="#141718" stroke-width="1.5" stroke-linejoin="round"/>
                        <path d="M18.5588 19.5488C17.5654 16.8918 15.0036 15 12 15C8.99638 15 6.4346 16.8918 5.44117 19.5488M18.5588 19.5488C20.6672 17.7154 22 15.0134 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 15.0134 3.33285 17.7154 5.44117 19.5488M18.5588 19.5488C16.8031 21.0756 14.5095 22 12 22C9.49052 22 7.19694 21.0756 5.44117 19.5488M15 9C15 10.6569 13.6569 12 12 12C10.3431 12 9 10.6569 9 9C9 7.34315 10.3431 6 12 6C13.6569 6 15 7.34315 15 9Z" stroke="black" stroke-opacity="0.2" stroke-width="1.5" stroke-linejoin="round"/>
                    </svg>
                    
                    <div class="profile-dropdown" id="profile-dropdown">
                        <ul class="list" role="list">
                            <%
                              Integer navUserId = (Integer) session.getAttribute("userId");
                              if (navUserId != null) {
                            %>
                                <li><a href="profile.jsp">Profile</a></li>
                                <li><a onClick="signOut()">Log Out</a></li>
                            <%
                              } else {
                            %>
                                <li><a href="signup.jsp">Sign Up</a></li>
                                <li><a href="signin.jsp">Sign In</a></li>
                            <%
                              }
                            %>
                        </ul>
                    </div>
                </button>

                <!-- SHOW ONLY IF LOGGED IN -->
                <% if (session.getAttribute("userId") != null) { %>

                <a href="cart.jsp" class="cart-button">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M9 6L9 7C9 8.65685 10.3431 10 12 10C13.6569 10 15 8.65685 15 7V6" stroke="#141718" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M9 6L9 7C9 8.65685 10.3431 10 12 10C13.6569 10 15 8.65685 15 7V6" stroke="black" stroke-opacity="0.2" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M15.6113 3H8.38836C6.433 3 4.76424 4.41365 4.44278 6.3424L2.77612 16.3424C2.36976 18.7805 4.24994 21 6.72169 21H17.278C19.7498 21 21.6299 18.7805 21.2236 16.3424L19.5569 6.3424C19.2355 4.41365 17.5667 3 15.6113 3Z" stroke="#141718" stroke-width="1.5" stroke-linejoin="round"/>
                        <path d="M15.6113 3H8.38836C6.433 3 4.76424 4.41365 4.44278 6.3424L2.77612 16.3424C2.36976 18.7805 4.24994 21 6.72169 21H17.278C19.7498 21 21.6299 18.7805 21.2236 16.3424L19.5569 6.3424C19.2355 4.41365 17.5667 3 15.6113 3Z" stroke="black" stroke-opacity="0.2" stroke-width="1.5" stroke-linejoin="round"/>
                    </svg>
                    <span id="cart-total">0</span>
                </a>

                <button class="cart-button" id="wishlist-btn" onclick="openWishlistSidebar()">
                    <img src="assets/images/icons/heart.png" />
                </button>

                <% } %>

            </div>
        </div>
    </div>
    
    <div class="mobile-nav" id="mobile-nav">
        <div class="mobile-nav-top">
            <div class="top-wrapper">
                <button onclick="closeMobileNav()">
                    <img src="assets/images/icons/close.png"/>
                </button>
            </div>

            <div class="search">
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M18.5 18.5L22 22M21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21C16.7467 21 21 16.7467 21 11.5Z" stroke="#141718" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M18.5 18.5L22 22M21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21C16.7467 21 21 16.7467 21 11.5Z" stroke="black" stroke-opacity="0.2" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
                <input type="text" placeholder="Search"/>
            </div>

            <ul class="mobile-nav-list" role="list">
                <li><a href="index.jsp">Home</a></li>
                <li><a href="shop.jsp">Shop</a></li>
                <li><a href="contactus.jsp">Contact us</a></li>
            </ul>
        </div>

        <div class="mobile-nav-bottom">

            <% if (session.getAttribute("userId") != null) { %>
            <a href="cart.jsp" class="action-wrapper">
                <span>Cart</span>
                <div class="action-icon">
                    <span id="mobile-cart-total">0</span>
                </div>
            </a>

            <a href="" class="action-wrapper" onclick="openWishlistSidebar()">
                <span>Wishlist</span>
                <div class="action-icon">
                    <span id="mobile-wishlist-total">0</span>
                </div>
            </a>
            <% } %>

        </div>
    </div>

    <script>
        const currentPage = window.location.pathname.split("/").pop();

        document.querySelectorAll('.nav-list li a').forEach(link => {
            if(link.getAttribute('href') === currentPage) {
                link.classList.add('active');
            }
        });

        document.querySelectorAll('.mobile-nav-list li a').forEach(link => {
            if(link.getAttribute('href') === currentPage) {
                link.classList.add('active');
            }
        });
        
        
    document.addEventListener('click', function(event) {
    var profileDropdown = document.getElementById('profile-dropdown');
    var profileButton = document.querySelector('.profile-button');
    
   
    if (!profileButton.contains(event.target)) {
        profileDropdown.classList.remove('active');
    }
});
    </script>
</nav>