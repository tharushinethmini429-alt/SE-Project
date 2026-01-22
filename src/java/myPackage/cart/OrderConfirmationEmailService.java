package myPackage.cart;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import myPackage.db.DbUtil;
import myPackage.util.EmailUtil;

public class OrderConfirmationEmailService {
    

    public static boolean sendOrderConfirmation(int userId, int orderId, String contextPath) {
        try {
           
            String[] userInfo = getUserInfo(userId);
            if (userInfo == null) {
                System.err.println("✗ User not found for userId: " + userId);
                return false;
            }
            
            String userEmail = userInfo[0];
            String userName = userInfo[1];
            
            System.out.println("→ Sending order confirmation to: " + userEmail + " (" + userName + ")");
            
            OrderDetails orderDetails = getOrderDetails(orderId);
            if (orderDetails == null) {
                System.err.println("✗ Order not found for orderId: " + orderId);
                return false;
            }
            
            ArrayList<OrderItemDetail> orderItems = getOrderItems(orderId);
            if (orderItems.isEmpty()) {
                System.err.println("✗ No order items found for orderId: " + orderId);
                return false;
            }
            
            System.out.println("→ Processing " + orderItems.size() + " order items...");
            
            StringBuilder orderItemsHtml = new StringBuilder();
            double subtotal = 0;
            
            String baseUrl = "http://localhost:8080" + contextPath; 
            
            for (OrderItemDetail item : orderItems) {
                String imageUrl = baseUrl + "/assets/images/uploads/" + 
                    (item.productImg != null && !item.productImg.isEmpty() ? item.productImg : "placeholder.png");
                
                double itemTotal = item.quantity * item.productPrice;
                subtotal += itemTotal;
                
                orderItemsHtml.append(
                    "<div class='item'>" +
                    "    <img src='" + imageUrl + "' alt='" + item.productName + "' class='item-image' onerror=\"this.src='" + baseUrl + "/assets/images/uploads/placeholder.png'\">" +
                    "    <div class='item-details'>" +
                    "        <p class='item-name'>" + item.productName + "</p>" +
                    "        <p class='item-meta'>Quantity: " + item.quantity + "</p>" +
                    "        <p class='item-meta'>Price: Rs. " + String.format("%.2f", item.productPrice) + " each</p>" +
                    "    </div>" +
                    "    <div class='item-price'>Rs. " + String.format("%.2f", itemTotal) + "</div>" +
                    "</div>"
                );
            }
            
            String emailContent = EmailUtil.generateOrderConfirmationEmail(
                orderDetails.orderCode,
                userName,
                orderItemsHtml.toString(),
                subtotal,
                orderDetails.shippingMethod,
                orderDetails.total,
                orderDetails.orderedDate
            );
            
            String subject = "Order Confirmation - " + orderDetails.orderCode;
            
            System.out.println("→ Sending email...");
            boolean result = EmailUtil.sendEmail(userEmail, subject, emailContent);
            
            if (result) {
                System.out.println("✓ Email sent successfully!");
            }
            
            return result;
            
        } catch (Exception e) {
            System.err.println("✗ Error sending order confirmation email: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }
    
    private static String[] getUserInfo(int userId) {
        String query = "SELECT user_email, CONCAT(user_fname, ' ', user_lname) as full_name " +
                      "FROM users WHERE user_id = ?";
        
        try (Connection conn = DbUtil.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {
            
            stmt.setInt(1, userId);
            
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return new String[] {
                        rs.getString("user_email"),
                        rs.getString("full_name")
                    };
                }
            }
        } catch (SQLException e) {
            System.err.println("✗ Error getting user info: " + e.getMessage());
            e.printStackTrace();
        }
        
        return null;
    }
    
    private static OrderDetails getOrderDetails(int orderId) {
        String query = "SELECT order_code, total, shipping_method, ordered_date " +
                      "FROM orders WHERE order_id = ?";
        
        try (Connection conn = DbUtil.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {
            
            stmt.setInt(1, orderId);
            
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    OrderDetails details = new OrderDetails();
                    details.orderCode = rs.getString("order_code");
                    details.total = rs.getDouble("total");
                    details.shippingMethod = rs.getString("shipping_method");
                    details.orderedDate = rs.getString("ordered_date");
                    return details;
                }
            }
        } catch (SQLException e) {
            System.err.println("✗ Error getting order details: " + e.getMessage());
            e.printStackTrace();
        }
        
        return null;
    }
    

    private static ArrayList<OrderItemDetail> getOrderItems(int orderId) {
        ArrayList<OrderItemDetail> items = new ArrayList<>();
        
        String query = "SELECT oi.quantity, p.pro_name, p.pro_img, p.pro_price " +
                      "FROM order_items oi " +
                      "INNER JOIN products p ON oi.pro_id = p.pro_id " +
                      "WHERE oi.order_id = ?";
        
        try (Connection conn = DbUtil.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {
            
            stmt.setInt(1, orderId);
            
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    OrderItemDetail item = new OrderItemDetail();
                    item.quantity = rs.getInt("quantity");
                    item.productName = rs.getString("pro_name");
                    item.productImg = rs.getString("pro_img");
                    item.productPrice = rs.getDouble("pro_price");
                    items.add(item);
                }
            }
        } catch (SQLException e) {
            System.err.println("✗ Error getting order items: " + e.getMessage());
            e.printStackTrace();
        }
        
        return items;
    }
    
    private static class OrderDetails {
        String orderCode;
        double total;
        String shippingMethod;
        String orderedDate;
    }
    
    private static class OrderItemDetail {
        int quantity;
        String productName;
        String productImg;
        double productPrice;
    }
}