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

public class GetUserOrdersServlet extends HttpServlet {
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
        
        int userId = (Integer) session.getAttribute("userId");
        ArrayList<Order> orders = getUserOrdersFromDb(userId);
        
        String json = new Gson().toJson(orders);
        response.getWriter().write(json);
    }
    
    private ArrayList<Order> getUserOrdersFromDb(int userId) {
        ArrayList<Order> orders = new ArrayList<>();
        
        try (Connection conn = DbUtil.getConnection()) {
            String query = "SELECT o.*, u.user_fname, u.user_lname FROM orders o " +
                          "JOIN users u ON o.user_id = u.user_id " +
                          "WHERE o.user_id = ? " +
                          "ORDER BY o.ordered_date DESC";
            PreparedStatement stmt = conn.prepareStatement(query);
            stmt.setInt(1, userId);
            
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    int orderId = rs.getInt("order_id");
                    String orderCode = rs.getString("order_code");
                    String firstName = rs.getString("user_fname");
                    String lastName = rs.getString("user_lname");
                    double total = rs.getDouble("total");
                    String status = rs.getString("status");
                    String orderDate = rs.getString("ordered_date");
                    
                    String userName = firstName + " " + lastName;
                    orders.add(new Order(orderId, orderCode, userName, total, status, orderDate));
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return orders;
    }
}