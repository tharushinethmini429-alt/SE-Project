package myPackage.admin;

import com.google.gson.Gson;
import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import myPackage.db.DbUtil;

public class GetOrderItemsServlet extends HttpServlet {
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("userId") == null) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("{\"error\": \"No user logged in\"}");
            return;
        }
        
        String orderIdStr = request.getParameter("orderId");
        System.out.println("Received orderId parameter: " + orderIdStr); // Debug log
        
        if (orderIdStr == null || orderIdStr.isEmpty()) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write("{\"error\": \"Order ID is required\"}");
            return;
        }
        
        try {
            int orderId = Integer.parseInt(orderIdStr);
            System.out.println("Fetching items for orderId: " + orderId); // Debug log
            
            ArrayList<OrderItem> items = getOrderItemsFromDb(orderId);
            System.out.println("Found " + items.size() + " items"); // Debug log
            
            String json = new Gson().toJson(items);
            response.getWriter().write(json);
        } catch (NumberFormatException e) {
            System.err.println("Invalid order ID format: " + orderIdStr);
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write("{\"error\": \"Invalid order ID\"}");
        } catch (Exception e) {
            System.err.println("Error in GetOrderItemsServlet: " + e.getMessage());
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
    
    private ArrayList<OrderItem> getOrderItemsFromDb(int orderId) {
    ArrayList<OrderItem> items = new ArrayList<>();
    
    Connection conn = null;
    PreparedStatement stmt = null;
    ResultSet rs = null;
    
    try {
        conn = DbUtil.getConnection();
        
        String query = "SELECT oi.order_item_id, oi.order_id, oi.pro_id, " +
                      "p.pro_name, p.pro_img, p.pro_price, oi.quantity, " +
                      "(p.pro_price * oi.quantity) as sub_total " +
                      "FROM order_items oi " +
                      "JOIN products p ON oi.pro_id = p.pro_id " +
                      "WHERE oi.order_id = ?";
        
        System.out.println("Executing query: " + query);
        System.out.println("With orderId: " + orderId);
        
        stmt = conn.prepareStatement(query);
        stmt.setInt(1, orderId);
        
        rs = stmt.executeQuery();
        
        while (rs.next()) {
            int orderItemId = rs.getInt("order_item_id");
            int productId = rs.getInt("pro_id");
            String productName = rs.getString("pro_name");
            String productImage = rs.getString("pro_img");
            double price = rs.getDouble("pro_price");  // Changed from "price" to "pro_price"
            int quantity = rs.getInt("quantity");
            double subtotal = rs.getDouble("sub_total");
            
            System.out.println("Found item: " + productName + " (ID: " + productId + ")");
            
            items.add(new OrderItem(orderItemId, orderId, productId, productName, 
                                   productImage, price, quantity, subtotal));
        }
        
    } catch (SQLException e) {
        System.err.println("SQL Error in getOrderItemsFromDb: " + e.getMessage());
        e.printStackTrace();
    } finally {
        try {
            if (rs != null) rs.close();
            if (stmt != null) stmt.close();
            if (conn != null) conn.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
    
    return items;
}
}