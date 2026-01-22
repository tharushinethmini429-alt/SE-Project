package myPackage.cart;

import com.google.gson.Gson;
import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import myPackage.db.DbUtil;

public class OrderCompleteServlet extends HttpServlet {
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("userId") == null) {
            response.setContentType("application/json");
            response.getWriter().write("[]");
            return;
        }
        
        int userId = (Integer) session.getAttribute("userId");
        
        Connection conn = null;
        try {
            conn = DbUtil.getConnection();
            
            String getLatestOrderQuery = "SELECT order_id FROM orders " +
                                        "WHERE user_id = ? AND status = 'Completed' " +
                                        "ORDER BY ordered_date DESC LIMIT 1";
            
            int latestOrderId = -1;
            
            try (PreparedStatement latestStmt = conn.prepareStatement(getLatestOrderQuery)) {
                latestStmt.setInt(1, userId);
                ResultSet latestRs = latestStmt.executeQuery();
                
                if (latestRs.next()) {
                    latestOrderId = latestRs.getInt("order_id");
                } else {
                    response.setContentType("application/json");
                    response.getWriter().write("[]");
                    return;
                }
            }
            
            String query = "SELECT o.order_id, o.order_code, o.total, o.payment_method, " +
                          "o.ordered_date, oi.quantity, p.pro_id, p.pro_name, p.pro_price, p.pro_img " +
                          "FROM orders o " +
                          "JOIN order_items oi ON o.order_id = oi.order_id " +
                          "JOIN products p ON oi.pro_id = p.pro_id " +
                          "WHERE o.order_id = ?";
            
            List<OrderCompleteItem> orderItems = new ArrayList<>();
            
            try (PreparedStatement stmt = conn.prepareStatement(query)) {
                stmt.setInt(1, latestOrderId);
                ResultSet rs = stmt.executeQuery();
                
                while (rs.next()) {
                    OrderCompleteItem item = new OrderCompleteItem();
                    item.setOrderId(rs.getInt("order_id"));
                    item.setOrderCode(rs.getString("order_code"));
                    item.setTotal(rs.getDouble("total"));
                    item.setPaymentMethod(rs.getString("payment_method"));
                    
                    java.sql.Timestamp timestamp = rs.getTimestamp("ordered_date");
                    if (timestamp != null) {
                        SimpleDateFormat sdf = new SimpleDateFormat("MMM dd, yyyy");
                        item.setOrderedDate(sdf.format(timestamp));
                    } else {
                        item.setOrderedDate("");
                    }
                    
                    item.setQuantity(rs.getInt("quantity"));
                    item.setProId(rs.getInt("pro_id"));
                    item.setProductName(rs.getString("pro_name"));
                    item.setProductPrice(rs.getDouble("pro_price"));
                    item.setProductImg(rs.getString("pro_img"));
                    
                    orderItems.add(item);
                }
            }
            
            Gson gson = new Gson();
            String json = gson.toJson(orderItems);
            
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            response.getWriter().write(json);
            
        } catch (SQLException e) {
            System.err.println("Error in OrderCompleteServlet: " + e.getMessage());
            e.printStackTrace();
            response.setContentType("application/json");
            response.getWriter().write("[]");
        } finally {
            if (conn != null) {
                try {
                    conn.close();
                } catch (SQLException e) {
                    e.printStackTrace();
                }
            }
        }
    }
    
    public static class OrderCompleteItem {
        private int orderId;
        private String orderCode;
        private double total;
        private String paymentMethod;
        private String orderedDate;
        private int quantity;
        private int proId;
        private String productName;
        private double productPrice;
        private String productImg;
        
        public int getOrderId() { return orderId; }
        public void setOrderId(int orderId) { this.orderId = orderId; }
        
        public String getOrderCode() { return orderCode; }
        public void setOrderCode(String orderCode) { this.orderCode = orderCode; }
        
        public double getTotal() { return total; }
        public void setTotal(double total) { this.total = total; }
        
        public String getPaymentMethod() { return paymentMethod; }
        public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }
        
        public String getOrderedDate() { return orderedDate; }
        public void setOrderedDate(String orderedDate) { this.orderedDate = orderedDate; }
        
        public int getQuantity() { return quantity; }
        public void setQuantity(int quantity) { this.quantity = quantity; }
        
        public int getProId() { return proId; }
        public void setProId(int proId) { this.proId = proId; }
        
        public String getProductName() { return productName; }
        public void setProductName(String productName) { this.productName = productName; }
        
        public double getProductPrice() { return productPrice; }
        public void setProductPrice(double productPrice) { this.productPrice = productPrice; }
        
        public String getProductImg() { return productImg; }
        public void setProductImg(String productImg) { this.productImg = productImg; }
    }
}