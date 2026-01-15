<div class="card">
    <div class="card-header py-3">
        <h6 class="mb-0">Manage Users</h6>
    </div>
    <div class="card-body">
        <div class="row">
            
            <div class="col-12 col-lg-4 d-flex">
                <div class="card border shadow-none w-100">
                    <div class="card-body">
                        <form id="userForm" class="row g-3">
                            <div class="col-12">
                                <label class="form-label">First Name</label>
                                <input type="text" class="form-control" placeholder="First Name" name="userFname" id="userFname" required>
                            </div>
                            <div class="col-12">
                                <label class="form-label">Last Name</label>
                                <input type="text" class="form-control" placeholder="Last Name" name="userLname" id="userLname" required>
                            </div>
                            <div class="col-12">
                                <label class="form-label">Email</label>
                                <input type="email" class="form-control" placeholder="Email" name="userEmail" id="userEmail" required>
                            </div>
                            <div class="col-12">
                                <label class="form-label">Password</label>
                                <input type="password" class="form-control" placeholder="Password" name="userPassword" id="userPassword">
                                <small class="form-text text-muted">Minimum 6 characters required</small>
                            </div>
                            <div class="col-12">
                                <label class="form-label">Phone Number</label>
                                <input type="text" class="form-control" placeholder="Phone Number" name="userPno" id="userPno" required>
                            </div>
                            <div class="col-12">
                                <label class="form-label">Status</label>
                                <select class="form-select" name="userStatus" id="userStatus" required>
                                    <option value="">Select Status</option>
                                    <option value="admin">Admin</option>
                                    <option value="user">User</option>
                                </select>
                            </div>
                            <input type="hidden" id="userId" name="userId">
                            <div class="col-12">
                                <div class="d-grid">
                                    <button type="button" class="button" id="userBtn" onclick="addOrUpdateUser(event)">Add User</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div class="col-12 col-lg-8 d-flex">
                <div class="card border shadow-none w-100">
                    <div class="card-body">
                        <div class="table-responsive">
                            <table class="table align-middle">
                                <thead class="table-light">
                                    <tr>
                                        <th>No.</th>
                                        <th>First Name</th>
                                        <th>Last Name</th>
                                        <th>Email</th>
                                        <th>Phone</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody id="usersTableBody"></tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>