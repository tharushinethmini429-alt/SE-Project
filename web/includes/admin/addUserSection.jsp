
            <div class="row">
                 <div class="col-lg-8 mx-auto">
                  <div class="card">
                    <div class="card-header py-3 bg-transparent"> 
                       <h5 class="mb-0">Add New User</h5>
                      </div>
                    <div class="card-body">
                      <div class="border p-3 rounded">
                      <form id="addProductForm" class="row g-3" enctype="multipart/form-data">
                        <div class="col-12">
                          <label class="form-label">First Name</label>
                          <input type="text" class="form-control" placeholder="First Name" name="fname">
                        </div>
                        <div class="col-12">
                          <label class="form-label">Last Name</label>
                          <input type="text" class="form-control" placeholder="Last Name" name="lname">
                        </div>
                        <div class="col-12">
                          <label class="form-label">Email</label>
                          <input type="email" class="form-control" placeholder="User Email" name="email">
                        </div>
                        <div class="col-12">
                          <label class="form-label">Phone Number</label>
                          <input type="text" class="form-control" placeholder="Phone Number" name="pno">
                        </div>
                        <div class="col-12 col-md-6">
                          <label class="form-label">User Status</label>
                          <select class="form-select" id="user_status" name="status">
                            <option>Admin</option>
                            <option>User</option>
                          </select>
                        </div>
                        <div class="col-12">
                            <button class="button" onclick="addUser()">Add User</button>
                        </div>
                      </form>
                      </div>
                     </div>
                    </div>
                 </div>
              </div>