<%@page contentType="text/html" pageEncoding="UTF-8"%> 
<div class="auth-modal-backdrop" id="authModalBackdrop"> 
    <div class="auth-modal"> 
        <div class="auth-modal-content"> 
            <button class="auth-modal-close" onclick="closeAuthModal()"> 
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"> 
                    <path d="M18 6L6 18M6 6L18 18" stroke="#141718" stroke-width="2" stroke-linecap="round"/> 
                </svg> 
            </button> 
             
            <div class="auth-modal-icon"> 
                🔒 
            </div> 
             
            <h3>Authentication Required</h3> 
            <p>You need to be logged in to add items to your cart or wishlist. Please sign in or create an account to continue shopping.</p> 
             
            <div class="auth-modal-actions"> 
                <a href="signin.jsp" class="button">Sign In</a> 
                <a href="signup.jsp" class="button button-outline">Create Account</a> 
            </div> 
        </div> 
    </div> 
</div>