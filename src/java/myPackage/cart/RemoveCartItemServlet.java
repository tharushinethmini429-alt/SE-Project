package myPackage.cart;

import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import myPackage.db.DbUtil;

public class RemoveCartItemServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        String cartIdStr = request.getParameter("cartId");
        
        int userId = getUserIdFromSession(request);
        
        if (userId == -1) {
            response.getWriter().write("User Not Authenticated");
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            return;
        }
        
        int cartId = Integer.parseInt(cartIdStr);
        
        boolean success = deleteCartItem(cartId, userId);
        
        response.setContentType("text/plain");
        response.setCharacterEncoding("UTF-8");
        
        if (success) {
            response.getWriter().write("Product removed from cart successfully");
        } else {
            response.getWriter().write("Failed to remove product from cart");
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
    
    private boolean deleteCartItem(int cartId, int userId) {
        try (Connection conn = DbUtil.getConnection()) {
            String query = "DELETE FROM cart WHERE cart_id = ? AND user_id = ?";
            
            try (PreparedStatement statement = conn.prepareStatement(query)) {
                statement.setInt(1, cartId);
                statement.setInt(2, userId);
                
                int rowsAffected = statement.executeUpdate();
                return rowsAffected > 0;
            }
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }
}