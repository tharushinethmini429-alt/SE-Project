<div class="card">
    <div class="card-header py-3">
      <h6 class="mb-0">Add Product Category</h6>
    </div>
    <div class="card-body">
       <div class="row">
         <div class="col-12 col-lg-4 d-flex">
           <div class="card border shadow-none w-100">
             <div class="card-body">
               <form id="categoryForm" class="row g-3">
                 <div class="col-12">
                   <label class="form-label">Name</label>
                   <input type="text" class="form-control" placeholder="Category name" name="cat_name" id="catName">
                 </div>
                 <div class="col-12">
                  <label class="form-label">Slug</label>
                  <input type="text" class="form-control" placeholder="Slug name" name="cat_slug" id="catSlug">
                  <input type="hidden" name="catId" id="catId">
                </div>
                <div class="col-12">
                  <div class="d-grid">
                      <button class="button" onclick="addCategory(event)" id="catBtn">Add Category</button>
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
                       <th>Name</th>
                       <th>Slug</th>
                       <th>Action</th>
                     </tr>
                   </thead>
                   <tbody id="categoriesTableBody">
                   </tbody>
                 </table>
              </div>
            </div>
          </div>
        </div>
       </div>
    </div>
  </div>