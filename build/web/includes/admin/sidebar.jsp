<div class="admin-sidebar">
    <!-- Sidebar Header -->
    <div class="sidebar-header">
        <div class="logo">
            Rasa Giri
        </div>
    </div>
    
    <div class="user-profile">
        <div class="user-avatar" id="userAvatar">
            U
        </div>
        <div class="user-info">
            <div class="user-name" id="userName">Loading...</div>
            <div class="user-role" id="userEmail">Loading...</div>
        </div>
    </div>
    
    <nav class="sidebar-nav">
        <ul class="admin-list" role="list">
            <li>
                <a href="index.jsp">
                    <span class="menu-icon">&#9776;</span>
                    <span>Dashboard</span>
                </a>
            </li>
            <li>
                <a href="products.jsp">
                    <span class="menu-icon">&#128230;</span>
                    <span>Products</span>
                </a>
            </li>
            <li>
                <a href="categories.jsp">
                    <span class="menu-icon">&#127991;</span>
                    <span>Categories</span>
                </a>
            </li>
            <li>
                <a href="orders.jsp">
                    <span class="menu-icon">&#128722;</span>
                    <span>Orders</span>
                </a>
            </li>
            <li>
                <a href="users.jsp">
                    <span class="menu-icon">&#128101;</span>
                    <span>Users</span>
                </a>
            </li>
        </ul>
    </nav>
    
    <div class="sidebar-footer">
        <button class="logout-btn" onclick="signOut()">
            <span class="logout-icon">&#10132;</span>
            <span>Sign Out</span>
        </button>
    </div>
</div>

<script>

    $(document).ready(function() {
        loadCurrentUser();
        highlightActiveMenu();
    });
    
    function loadCurrentUser() {
        $.ajax({
            type: "GET",
            url: contextPath + "/GetCurrentUserServlet",
            dataType: "json",
            success: function(user) {
                if (user && user.firstName) {
                    
                    $('#userName').text(user.fullName || user.firstName);
                    
                    
                    $('#userEmail').text(user.email);
                    
                    
                    $('#userAvatar').text(user.initial || user.firstName.charAt(0).toUpperCase());
                } else {
                    $('#userName').text('Guest User');
                    $('#userEmail').text('Not logged in');
                    $('#userAvatar').text('G');
                }
            },
            error: function(xhr, status, error) {
                console.error('Failed to load user data:', error);
                $('#userName').text('Guest User');
                $('#userEmail').text('Error loading data');
                $('#userAvatar').text('?');
            }
        });
    }
    

    function highlightActiveMenu() {
        const currentPage = window.location.pathname.split('/').pop();
        const menuLinks = document.querySelectorAll('.admin-list a');
        
        menuLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPage) {
                link.classList.add('active');
            }
        });
    }
</script>