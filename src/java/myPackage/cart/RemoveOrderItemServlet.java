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

public class RemoveOrderItemServlet extends HttpServlet {
    
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        String orderIdStr = request.getParameter("orderId");
        String proIdStr = request.getParameter("proId");
        
        int userId = getUserIdFromSession(request);
        
        if (userId == -1) {
            response.getWriter().write("User Not Authenticated");
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            return;
        }
        
        if (orderIdStr == null || proIdStr == null) {
            response.getWriter().write("Missing required parameters");
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            return;
        }
        
        int orderId = Integer.parseInt(orderIdStr);
        int proId = Integer.parseInt(proIdStr);
        
        if (!verifyOrderOwnership(orderId, userId)) {
            response.getWriter().write("Unauthorized: Order does not belong to user");
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            return;
        }
        
        boolean success = deleteOrderItem(orderId, proId, userId);
        
        response.setContentType("text/plain");
        response.setCharacterEncoding("UTF-8");
        
        if (success) {
            response.getWriter().write("Product removed from order successfully");
        } else {
            response.getWriter().write("Failed to remove product from order");
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
    
    private boolean verifyOrderOwnership(int orderId, int userId) {
        try (Connection conn = DbUtil.getConnection()) {
            String query = "SELECT user_id FROM orders WHERE order_id = ?";
            
            try (PreparedStatement statement = conn.prepareStatement(query)) {
                statement.setInt(1, orderId);
                
                try (ResultSet rs = statement.executeQuery()) {
                    if (rs.next()) {
                        int orderUserId = rs.getInt("user_id");
                        return orderUserId == userId;
                    }
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }
    
    private boolean deleteOrderItem(int orderId, int proId, int userId) {
        try (Connection conn = DbUtil.getConnection()) {
            String query = "DELETE FROM order_items " +
                          "WHERE order_id = ? AND pro_id = ? " +
                          "AND order_id IN (SELECT order_id FROM orders WHERE user_id = ?)";
            
            try (PreparedStatement statement = conn.prepareStatement(query)) {
                statement.setInt(1, orderId);
                statement.setInt(2, proId);
                statement.setInt(3, userId);
                
                int rowsAffected = statement.executeUpdate();
                
                if (rowsAffected > 0) {
                    checkAndUpdateOrderTotal(conn, orderId);
                }
                
                return rowsAffected > 0;
            }
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }
    
    private void checkAndUpdateOrderTotal(Connection conn, int orderId) throws SQLException {
        String countQuery = "SELECT COUNT(*) as item_count FROM order_items WHERE order_id = ?";
        
        try (PreparedStatement countStmt = conn.prepareStatement(countQuery)) {
            countStmt.setInt(1, orderId);
            
            try (ResultSet rs = countStmt.executeQuery()) {
                if (rs.next() && rs.getInt("item_count") == 0) {

                    String deleteOrderQuery = "DELETE FROM orders WHERE order_id = ?";
                    try (PreparedStatement deleteStmt = conn.prepareStatement(deleteOrderQuery)) {
                        deleteStmt.setInt(1, orderId);
                        deleteStmt.executeUpdate();
                    }
                } else {
                   
                    String updateQuery = "UPDATE orders o " +
                                       "SET total = (SELECT SUM(p.pro_price * oi.quantity) " +
                                       "FROM order_items oi " +
                                       "JOIN products p ON oi.pro_id = p.pro_id " +
                                       "WHERE oi.order_id = ?) " +
                                       "WHERE o.order_id = ?";
                    
                    try (PreparedStatement updateStmt = conn.prepareStatement(updateQuery)) {
                        updateStmt.setInt(1, orderId);
                        updateStmt.setInt(2, orderId);
                        updateStmt.executeUpdate();
                    }
                }
            }
        }
    }
}