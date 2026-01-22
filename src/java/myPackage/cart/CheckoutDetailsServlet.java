package myPackage.cart;

import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.Date;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import myPackage.db.DbUtil;
import myPackage.util.EmailUtil;

public class CheckoutDetailsServlet extends HttpServlet {
    
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("userId") == null) {
            response.getWriter().write("Error: User not authenticated");
            return;
        }
        
        int userId = (Integer) session.getAttribute("userId");
        
        String firstName = request.getParameter("firstName");
        String lastName = request.getParameter("lastName");
        String email = request.getParameter("email");
        String phoneNo = request.getParameter("phoneNo");
        String street = request.getParameter("street");
        String city = request.getParameter("city");
        String state = request.getParameter("state");
        String postalCode = request.getParameter("postalCode");
        String country = request.getParameter("country");
        String orderIdStr = request.getParameter("orderId");
        String paymentMethod = request.getParameter("paymentMethod");
        
        if (orderIdStr == null || orderIdStr.isEmpty()) {
            response.getWriter().write("Error: Order ID is missing");
            return;
        }
        
        int orderId = Integer.parseInt(orderIdStr);
        
        Connection conn = null;
        try {
            conn = DbUtil.getConnection();
            conn.setAutoCommit(false);
            
            updateContactInformation(conn, userId, firstName, lastName, email, phoneNo);
            
            updateAddressInformation(conn, userId, street, city, state, postalCode, country);
            
            updateOrderStatus(conn, orderId, paymentMethod);
            
            clearUserCart(conn, userId);
            
            conn.commit();
            
            try {
                sendOrderConfirmationEmail(conn, orderId, email, firstName + " " + lastName);
            } catch (Exception emailError) {
                System.err.println("Email sending failed: " + emailError.getMessage());
                emailError.printStackTrace();
            }
            
            response.getWriter().write("Success: Order completed successfully");
            
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
    
    private void updateContactInformation(Connection conn, int userId, String firstName, 
            String lastName, String email, String phoneNo) throws SQLException {
        
        String checkQuery = "SELECT user_id FROM users WHERE user_id = ?";
        try (PreparedStatement checkStmt = conn.prepareStatement(checkQuery)) {
            checkStmt.setInt(1, userId);
            ResultSet rs = checkStmt.executeQuery();
            
            if (rs.next()) {
                String updateQuery = "UPDATE users SET user_fname = ?, user_lname = ?, " +
                                   "user_email = ?, user_pno = ? WHERE user_id = ?";
                try (PreparedStatement updateStmt = conn.prepareStatement(updateQuery)) {
                    updateStmt.setString(1, firstName);
                    updateStmt.setString(2, lastName);
                    updateStmt.setString(3, email);
                    updateStmt.setString(4, phoneNo);
                    updateStmt.setInt(5, userId);
                    updateStmt.executeUpdate();
                }
            } else {
                String insertQuery = "INSERT INTO users (user_id, user_fname, user_lname, " +
                                   "user_email, user_pno) VALUES (?, ?, ?, ?, ?)";
                try (PreparedStatement insertStmt = conn.prepareStatement(insertQuery)) {
                    insertStmt.setInt(1, userId);
                    insertStmt.setString(2, firstName);
                    insertStmt.setString(3, lastName);
                    insertStmt.setString(4, email);
                    insertStmt.setString(5, phoneNo);
                    insertStmt.executeUpdate();
                }
            }
        }
    }
    
    private void updateAddressInformation(Connection conn, int userId, String street, 
            String city, String state, String postalCode, String country) throws SQLException {
        
        String checkQuery = "SELECT user_id FROM addresses WHERE user_id = ?";
        try (PreparedStatement checkStmt = conn.prepareStatement(checkQuery)) {
            checkStmt.setInt(1, userId);
            ResultSet rs = checkStmt.executeQuery();
            
            if (rs.next()) {
                String updateQuery = "UPDATE addresses SET street_address = ?, city = ?, " +
                                   "state = ?, postal_code = ?, country = ? WHERE user_id = ?";
                try (PreparedStatement updateStmt = conn.prepareStatement(updateQuery)) {
                    updateStmt.setString(1, street);
                    updateStmt.setString(2, city);
                    updateStmt.setString(3, state);
                    updateStmt.setString(4, postalCode);
                    updateStmt.setString(5, country);
                    updateStmt.setInt(6, userId);
                    updateStmt.executeUpdate();
                }
            } else {
                String insertQuery = "INSERT INTO addresses (user_id, street_address, city, " +
                                   "state, postal_code, country) VALUES (?, ?, ?, ?, ?, ?)";
                try (PreparedStatement insertStmt = conn.prepareStatement(insertQuery)) {
                    insertStmt.setInt(1, userId);
                    insertStmt.setString(2, street);
                    insertStmt.setString(3, city);
                    insertStmt.setString(4, state);
                    insertStmt.setString(5, postalCode);
                    insertStmt.setString(6, country);
                    insertStmt.executeUpdate();
                }
            }
        }
    }
    
    private void updateOrderStatus(Connection conn, int orderId, String paymentMethod) 
            throws SQLException {
        String query = "UPDATE orders SET payment_method = ?, status = 'Completed', " +
                      "ordered_date = NOW() WHERE order_id = ?";
        try (PreparedStatement stmt = conn.prepareStatement(query)) {
            stmt.setString(1, paymentMethod);
            stmt.setInt(2, orderId);
            stmt.executeUpdate();
        }
    }
    
    private void clearUserCart(Connection conn, int userId) throws SQLException {
        String query = "DELETE FROM cart WHERE user_id = ?";
        try (PreparedStatement stmt = conn.prepareStatement(query)) {
            stmt.setInt(1, userId);
            stmt.executeUpdate();
        }
    }
    
    private void sendOrderConfirmationEmail(Connection conn, int orderId, 
            String recipientEmail, String customerName) throws SQLException {
        
        System.out.println("=== PREPARING ORDER CONFIRMATION EMAIL ===");
        System.out.println("Order ID: " + orderId);
        System.out.println("Recipient: " + recipientEmail);
        
        String orderQuery = "SELECT order_code, total, shipping_method, ordered_date " +
                          "FROM orders WHERE order_id = ?";
        
        String orderCode = "";
        double total = 0;
        String shippingMethod = "";
        String orderedDate = "";
        
        try (PreparedStatement orderStmt = conn.prepareStatement(orderQuery)) {
            orderStmt.setInt(1, orderId);
            ResultSet orderRs = orderStmt.executeQuery();
            
            if (orderRs.next()) {
                orderCode = orderRs.getString("order_code");
                total = orderRs.getDouble("total");
                shippingMethod = orderRs.getString("shipping_method");
                
                Date date = orderRs.getTimestamp("ordered_date");
                SimpleDateFormat sdf = new SimpleDateFormat("MMM dd, yyyy hh:mm a");
                orderedDate = sdf.format(date);
            } else {
                throw new SQLException("Order not found with ID: " + orderId);
            }
        }
        
        String itemsQuery = "SELECT oi.quantity, p.pro_name, p.pro_price " +
                           "FROM order_items oi " +
                           "JOIN products p ON oi.pro_id = p.pro_id " +
                           "WHERE oi.order_id = ?";
        
        StringBuilder orderItemsHtml = new StringBuilder();
        double subtotal = 0;
        
        try (PreparedStatement itemsStmt = conn.prepareStatement(itemsQuery)) {
            itemsStmt.setInt(1, orderId);
            ResultSet itemsRs = itemsStmt.executeQuery();
            
            while (itemsRs.next()) {
                int quantity = itemsRs.getInt("quantity");
                String productName = itemsRs.getString("pro_name");
                double price = itemsRs.getDouble("pro_price");
                
                double itemTotal = quantity * price;
                subtotal += itemTotal;
                
                System.out.println("Product: " + productName);
                
                orderItemsHtml.append(
                    "<div style='padding: 15px; border-bottom: 1px solid #e5e7eb; margin-bottom: 10px;'>" +
                    "    <div>" +
                    "        <h4 style='margin: 0 0 5px 0; font-size: 16px; color: #1f2937;'>").append(productName).append("</h4>" +
                    "        <p style='margin: 0; font-size: 14px; color: #6b7280;'>Quantity: ").append(quantity).append("</p>" +
                    "        <p style='margin: 0; font-size: 14px; color: #6b7280;'>Unit Price: Rs. ").append(String.format("%.2f", price)).append("</p>" +
                    "    </div>" +
                    "    <div style='font-weight: 600; font-size: 16px; color: #1f2937; margin-top: 10px;'>Rs. ").append(String.format("%.2f", itemTotal)).append("</div>" +
                    "</div>"
                );
            }
        }
        
        if (orderItemsHtml.length() == 0) {
            orderItemsHtml.append("<p style='text-align: center; padding: 20px; color: #6b7280;'>No items found in order.</p>");
        }
        
        String emailHtml = EmailUtil.generateOrderConfirmationEmail(
            orderCode,
            customerName,
            orderItemsHtml.toString(),
            subtotal,
            shippingMethod,
            total,
            orderedDate
        );
        
        boolean emailSent = EmailUtil.sendEmail(
            recipientEmail,
            "Order Confirmation - " + orderCode,
            emailHtml
        );
        
        if (emailSent) {
            System.out.println("✓ Order confirmation email sent successfully to: " + recipientEmail);
        } else {
            System.err.println("✗ Failed to send order confirmation email to: " + recipientEmail);
        }
    }
}