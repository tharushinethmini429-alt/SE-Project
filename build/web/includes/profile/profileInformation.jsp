<div class="col-lg-8 col-md-10">
    <div class="profile-form-wrapper">
        <div class="profile-section-header">
            <h3>Account Details</h3>
            <p>Update your personal information</p>
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
                    <span class="btn-loader" style="display: none;">Saving...</span>
                </button>
            </div>
            
            <div class="alert alert-success mt-3" id="success-message" style="display: none;">
                Profile updated successfully!
            </div>
            <div class="alert alert-danger mt-3" id="error-message" style="display: none;">
                Failed to update profile. Please try again.
            </div>
        </form>
    </div>
</div>