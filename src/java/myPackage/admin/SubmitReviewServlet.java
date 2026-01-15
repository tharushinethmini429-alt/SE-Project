package myPackage.admin;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import java.io.BufferedReader;
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

public class SubmitReviewServlet extends HttpServlet {
    
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("userId") == null) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("{\"success\": false, \"message\": \"No user logged in\"}");
            return;
        }
        
        int userId = (Integer) session.getAttribute("userId");
        
        StringBuilder sb = new StringBuilder();
        BufferedReader reader = request.getReader();
        String line;
        while ((line = reader.readLine()) != null) {
            sb.append(line);
        }
        
        try {
            Gson gson = new Gson();
            JsonObject jsonObject = gson.fromJson(sb.toString(), JsonObject.class);
            
            int productId = jsonObject.get("productId").getAsInt();
            int orderId = jsonObject.get("orderId").getAsInt();
            int rating = jsonObject.get("rating").getAsInt();
            String message = jsonObject.has("message") && !jsonObject.get("message").isJsonNull() 
                           ? jsonObject.get("message").getAsString() : null;
            
            if (rating < 1 || rating > 5) {
                response.getWriter().write("{\"success\": false, \"message\": \"Rating must be between 1 and 5\"}");
                return;
            }
            
            boolean success = saveReview(productId, userId, orderId, rating, message);
            
            if (success) {

                updateProductAverageRating(productId);
                response.getWriter().write("{\"success\": true, \"message\": \"Review submitted successfully\"}");
            } else {
                response.getWriter().write("{\"success\": false, \"message\": \"Failed to submit review\"}");
            }
            
        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("{\"success\": false, \"message\": \"Error: " + e.getMessage() + "\"}");
        }
    }
    
    private boolean saveReview(int productId, int userId, int orderId, int rating, String message) {
        try (Connection conn = DbUtil.getConnection()) {
            String query = "INSERT INTO product_reviews (pro_id, user_id, order_id, rating, review_message) " +
                          "VALUES (?, ?, ?, ?, ?)";
            PreparedStatement stmt = conn.prepareStatement(query);
            stmt.setInt(1, productId);
            stmt.setInt(2, userId);
            stmt.setInt(3, orderId);
            stmt.setInt(4, rating);
            stmt.setString(5, message);
            
            int rowsAffected = stmt.executeUpdate();
            return rowsAffected > 0;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }
    
    private void updateProductAverageRating(int productId) {
        try (Connection conn = DbUtil.getConnection()) {

            String avgQuery = "SELECT AVG(rating) as avg_rating FROM product_reviews WHERE pro_id = ?";
            PreparedStatement avgStmt = conn.prepareStatement(avgQuery);
            avgStmt.setInt(1, productId);
            
            try (ResultSet rs = avgStmt.executeQuery()) {
                if (rs.next()) {
                    double avgRating = rs.getDouble("avg_rating");
                    

                    String updateQuery = "UPDATE products SET reviews = ? WHERE pro_id = ?";
                    PreparedStatement updateStmt = conn.prepareStatement(updateQuery);
                    updateStmt.setDouble(1, avgRating);
                    updateStmt.setInt(2, productId);
                    updateStmt.executeUpdate();
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}