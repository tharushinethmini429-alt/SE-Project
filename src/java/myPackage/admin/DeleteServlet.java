package myPackage.admin;

import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import myPackage.db.DbUtil;

public class DeleteServlet extends HttpServlet {
    
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        response.setContentType("text/plain");
        response.setCharacterEncoding("UTF-8");
        
        try {
            int catId = Integer.parseInt(request.getParameter("catId"));
            
            int productCount = getProductCount(catId);
            
            if (productCount > 0) {
                response.setStatus(HttpServletResponse.SC_CONFLICT); 
                response.getWriter().write("Cannot delete this category. It has " + productCount + 
                                          " product(s) associated with it. Please remove or reassign the products first.");
                return;
            }
            

            boolean deleted = removeItemFromCategory(catId);
            
            if (deleted) {
                response.setStatus(HttpServletResponse.SC_OK);
                response.getWriter().write("Category deleted successfully");
            } else {
                response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                response.getWriter().write("Category not found");
            }
            
        } catch (NumberFormatException e) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write("Invalid category ID");
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("Error deleting category: " + e.getMessage());
        }
    }
    
    private int getProductCount(int catId) {
        String query = "SELECT COUNT(*) as product_count FROM products WHERE cat_id = ?";
        
        try (Connection conn = DbUtil.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {
            
            stmt.setInt(1, catId);
            ResultSet rs = stmt.executeQuery();
            
            if (rs.next()) {
                return rs.getInt("product_count");
            }
            
        } catch (SQLException e) {
            System.err.println("Error checking product count: " + e.getMessage());
            e.printStackTrace();
        }
        
        return 0;
    }
    
    private boolean removeItemFromCategory(int catId) {
        String query = "DELETE FROM categories WHERE cat_id = ?";
        
        try (Connection conn = DbUtil.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {
            
            stmt.setInt(1, catId);
            int rowsAffected = stmt.executeUpdate();
            
            return rowsAffected > 0;
            
        } catch (SQLException e) {
            System.err.println("Error deleting category: " + e.getMessage());
            e.printStackTrace();
        }
        
        return false;
    }
}