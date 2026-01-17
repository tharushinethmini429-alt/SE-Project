package myPackage.cart;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import java.io.IOException;
import java.lang.reflect.Type;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.UUID;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import myPackage.db.DbUtil;

public class CartDetailsServlet extends HttpServlet {
    
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("userId") == null) {
            response.getWriter().write("Error: User not authenticated");
            return;
        }
        
        int userId = (Integer) session.getAttribute("userId");
        
        String totalPriceStr = request.getParameter("total_price");
        String cartItemsJson = request.getParameter("cart_items");
        String shippingMethod = request.getParameter("shipping_method");
        
        if (totalPriceStr == null || cartItemsJson == null || shippingMethod == null) {
            response.getWriter().write("Error: Missing required parameters");
            return;
        }
        
        double totalPrice = Double.parseDouble(totalPriceStr);
        
        Gson gson = new Gson();
        Type cartItemListType = new TypeToken<List<CartItem>>(){}.getType();
        List<CartItem> cartItems = gson.fromJson(cartItemsJson, cartItemListType);
        
        Connection conn = null;
        try {
            conn = DbUtil.getConnection();
            conn.setAutoCommit(false); 
            
            String orderCode = generateOrderCode(userId);
            
            String orderQuery = "INSERT INTO orders (user_id, order_code, total, shipping_method, " +
                              "payment_method, status, ordered_date) VALUES (?, ?, ?, ?, 'pending', 'pending', NOW())";
            
            int orderId;
            try (PreparedStatement orderStmt = conn.prepareStatement(orderQuery, 
                    PreparedStatement.RETURN_GENERATED_KEYS)) {
                orderStmt.setInt(1, userId);
                orderStmt.setString(2, orderCode);
                orderStmt.setDouble(3, totalPrice);
                orderStmt.setString(4, shippingMethod);
                orderStmt.executeUpdate();
                
                ResultSet rs = orderStmt.getGeneratedKeys();
                if (rs.next()) {
                    orderId = rs.getInt(1);
                } else {
                    throw new SQLException("Failed to retrieve order ID");
                }
            }
         
            String itemQuery = "INSERT INTO order_items (order_id, pro_id, quantity) VALUES (?, ?, ?)";
            try (PreparedStatement itemStmt = conn.prepareStatement(itemQuery)) {
                for (CartItem item : cartItems) {
                    itemStmt.setInt(1, orderId);
                    itemStmt.setInt(2, item.getProductId());
                    itemStmt.setInt(3, item.getQuantity());
                    itemStmt.addBatch();
                }
                itemStmt.executeBatch();
            }
            
            conn.commit(); 
            
            response.getWriter().write("Success: Order created with ID " + orderId);
            
        } catch (SQLException e) {
            if (conn != null) {
                try {
                    conn.rollback(); 
                } catch (SQLException ex) {
                    ex.printStackTrace();
                }
            }
            e.printStackTrace();
            response.getWriter().write("Error: " + e.getMessage());
        } finally {
            if (conn != null) {
                try {
                    conn.setAutoCommit(true);
                    conn.close();
                } catch (SQLException e) {
                    e.printStackTrace();
                }
            }
        }
    }
    
    private String generateOrderCode(int userId) {
        int random3Digit = (int) (Math.random() * 900) + 100;
        int random8Digit = (int) (Math.random() * 90000000) + 10000000;
        return "#" + random3Digit + "_" + random8Digit;
    }
    
    public static class CartItem {
        private int cartId;
        private int productId;
        private int quantity;
        
        public int getCartId() { return cartId; }
        public void setCartId(int cartId) { this.cartId = cartId; }
        
        public int getProductId() { return productId; }
        public void setProductId(int productId) { this.productId = productId; }
        
        public int getQuantity() { return quantity; }
        public void setQuantity(int quantity) { this.quantity = quantity; }
    }
}