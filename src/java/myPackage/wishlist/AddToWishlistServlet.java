package myPackage.wishlist;
import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import myPackage.db.DbUtil;

public class AddToWishlistServlet extends HttpServlet {
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        response.setContentType("text/plain");
        response.setCharacterEncoding("UTF-8");
        
        try {
            String productIdStr = request.getParameter("pro_id");
            String subTotalStr = request.getParameter("sub_total");
            
            if (productIdStr == null || subTotalStr == null) {
                response.getWriter().write("Missing parameters");
                return;
            }
            
            int userId = getUserIdFromSession(request);
            
            if (userId == -1) {
                response.getWriter().write("User Not Authenticated");
                return;
            }
            
            int productId = Integer.parseInt(productIdStr);
            double subTotal = Double.parseDouble(subTotalStr);
            
            int productExists = checkProductExists(userId, productId);
            
            if(productExists > 0){
                response.getWriter().write("Product already in wishlist");
            } else {
                insertToWishlist(userId, productId, subTotal, response);
            }
        } catch (NumberFormatException e) {
            response.getWriter().write("Invalid parameters");
        }
    }
    
    private int getUserIdFromSession(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session != null) {
            Object userIdObj = session.getAttribute("userId");
            if (userIdObj instanceof Integer) {
                return (Integer) userIdObj;
            }
        }
        return -1;
    }
    
    private int checkProductExists(int userId, int productId){
        try(Connection conn = DbUtil.getConnection()){
            String query = "SELECT COUNT(*) FROM wishlist WHERE pro_id = ? AND user_id = ?";
            
            try(PreparedStatement statement = conn.prepareStatement(query)){
                statement.setInt(1, productId);
                statement.setInt(2, userId);
                
                try(ResultSet result = statement.executeQuery()){
                    if(result.next()){
                        return result.getInt(1);
                    }
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return -1;
    }
    
    private void insertToWishlist(int userId, int productId, double subTotal, HttpServletResponse response) throws IOException{
        try(Connection conn = DbUtil.getConnection()){
            String query = "INSERT INTO wishlist (pro_id, user_id, price, date) VALUES (?, ?, ?, ?)";
            
            try(PreparedStatement statement = conn.prepareStatement(query)){
                statement.setInt(1, productId);
                statement.setInt(2, userId);
                statement.setDouble(3, subTotal);
                statement.setTimestamp(4, new java.sql.Timestamp(System.currentTimeMillis()));
                
                int rowsAffected = statement.executeUpdate();
                if (rowsAffected > 0) {
                    response.getWriter().write("Product added to wishlist successfully");
                } else {
                    response.getWriter().write("Failed to add product to wishlist");
                }
            }  
        } catch (SQLException e) {
            e.printStackTrace();
            response.getWriter().write("Database error: " + e.getMessage());
        }
    }
}