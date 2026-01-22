package myPackage.cart;

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

public class AddToCartServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        String productIdStr = request.getParameter("pro_id");
        String quantityStr = request.getParameter("quantity");
        String subTotalStr = request.getParameter("sub_total");
        
        int userId = getUserIdFromSession(request);
        
        if (userId == -1) {
            response.getWriter().write("User Not Authenticated");
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            return;
        }
        int productId = Integer.parseInt(productIdStr);
        int quantity = Integer.parseInt(quantityStr);
        double subTotal = Double.parseDouble(subTotalStr);
        
        int productExists = checkProductExists(userId, productId);
        
        if(productExists > 0){
            updateQuantityInCart(userId, productId, quantity);
            response.getWriter().write("Product quantity updated successfully");
        }else {
            insertToCart(userId, productId, quantity, subTotal, response);
        }
        
        response.setContentType("text/plain");
        response.setCharacterEncoding("UTF-8");
    }
    
    private int checkProductExists(int userId, int productId){
        try(Connection conn = DbUtil.getConnection()){
            String query = "SELECT COUNT(*) FROM cart WHERE user_id = ? AND pro_id = ?";
            
            try(PreparedStatement statement = conn.prepareStatement(query)){
                statement.setInt(1, userId);
                statement.setInt(2, productId);
                
                try(ResultSet result = statement.executeQuery()){
                    if(result.next()){
                        int count = result.getInt(1);
                        return count;
                    }
                }
            }
        } catch (SQLException e) {
            e.getMessage();
        }
         return -1;
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
    
    private void updateQuantityInCart(int userId, int productId, int quantity) {
        try (Connection conn = DbUtil.getConnection()) {
            String query = "UPDATE cart SET quantity = quantity + ? WHERE user_id = ? AND pro_id = ?";

            try (PreparedStatement statement = conn.prepareStatement(query)) {
                statement.setInt(1, quantity);
                statement.setInt(2, userId);
                statement.setInt(3, productId);
                statement.executeUpdate();
            }
        } catch (SQLException e) {
            e.getMessage();
        }
    }
    
    private void insertToCart(int userId, int productId, int quantity, double subTotal, HttpServletResponse response) throws IOException{
        try(Connection conn = DbUtil.getConnection()){
            String query = "INSERT INTO cart (user_id, pro_id, quantity, sub_total, date) VALUES (?, ?, ?, ?, ?)";
            
            try(PreparedStatement statement = conn.prepareStatement(query)){
                statement.setInt(1, userId);
                statement.setInt(2, productId);
                statement.setInt(3, quantity);
                statement.setDouble(4, subTotal);
                statement.setTimestamp(5, new java.sql.Timestamp(System.currentTimeMillis()));
                statement.executeUpdate();
                response.getWriter().write("Product added to cart successfully");                    
            }  
        } catch (SQLException e) {
            e.getMessage();
        }
    }


}
