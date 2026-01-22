package myPackage.wishlist;
import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import myPackage.db.DbUtil;

public class DeleteWishlistServlet extends HttpServlet {
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        response.setContentType("text/plain");
        response.setCharacterEncoding("UTF-8");
        
        try {
            String wishlistIdStr = request.getParameter("wishlistId");
            
            if (wishlistIdStr == null) {
                response.getWriter().write("Missing wishlist ID");
                return;
            }
            
            int wishlistId = Integer.parseInt(wishlistIdStr);
            
            boolean removed = removeItemFromWishlist(wishlistId);
            
            if (removed) {
                response.getWriter().write("Item removed successfully");
            } else {
                response.getWriter().write("Failed to remove item");
            }
        } catch (NumberFormatException e) {
            response.getWriter().write("Invalid wishlist ID");
        }
    }
    
    private boolean removeItemFromWishlist(int wishlistId){
        try (Connection conn = DbUtil.getConnection();
            PreparedStatement stmt = conn.prepareStatement("DELETE FROM wishlist WHERE wishlist_id = ?")) {
            stmt.setInt(1, wishlistId);
            int rowsAffected = stmt.executeUpdate();
            return rowsAffected > 0;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }
}