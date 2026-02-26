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

public class GetOrderReviewsServlet extends HttpServlet {
    
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
        
        if (orderIdStr == null || orderIdStr.isEmpty()) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write("{\"error\": \"Order ID is required\"}");
            return;
        }
        
        try {
            int orderId = Integer.parseInt(orderIdStr);
            int userId = (Integer) session.getAttribute("userId");
            
            ArrayList<ProductReview> reviews = getOrderReviewsFromDb(orderId, userId);
            
            String json = new Gson().toJson(reviews);
            response.getWriter().write(json);
        } catch (NumberFormatException e) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write("{\"error\": \"Invalid order ID\"}");
        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
    
    private ArrayList<ProductReview> getOrderReviewsFromDb(int orderId, int userId) {
        ArrayList<ProductReview> reviews = new ArrayList<>();
        
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        
        try {
            conn = DbUtil.getConnection();
            
            String query = "SELECT pr.review_id, pr.pro_id, pr.rating, pr.review_message, " +
                          "pr.created_at, p.pro_name, p.pro_img " +
                          "FROM product_reviews pr " +
                          "JOIN products p ON pr.pro_id = p.pro_id " +
                          "WHERE pr.order_id = ? AND pr.user_id = ? " +
                          "ORDER BY pr.created_at DESC";
            
            stmt = conn.prepareStatement(query);
            stmt.setInt(1, orderId);
            stmt.setInt(2, userId);
            
            rs = stmt.executeQuery();
            
            while (rs.next()) {
                int reviewId = rs.getInt("review_id");
                int productId = rs.getInt("pro_id");
                int rating = rs.getInt("rating");
                String message = rs.getString("review_message");
                String reviewDate = rs.getString("created_at");
                String productName = rs.getString("pro_name");
                String productImage = rs.getString("pro_img");
                
                reviews.add(new ProductReview(reviewId, productId, productName, 
                                             productImage, rating, message, reviewDate));
            }
            
        } catch (SQLException e) {
            System.err.println("SQL Error in getOrderReviewsFromDb: " + e.getMessage());
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
        
        return reviews;
    }
}

class ProductReview {
    private int reviewId;
    private int productId;
    private String productName;
    private String productImage;
    private int rating;
    private String message;
    private String reviewDate;
    
    public ProductReview(int reviewId, int productId, String productName, 
                        String productImage, int rating, String message, String reviewDate) {
        this.reviewId = reviewId;
        this.productId = productId;
        this.productName = productName;
        this.productImage = productImage;
        this.rating = rating;
        this.message = message;
        this.reviewDate = reviewDate;
    }
    
    public int getReviewId() { return reviewId; }
    public int getProductId() { return productId; }
    public String getProductName() { return productName; }
    public String getProductImage() { return productImage; }
    public int getRating() { return rating; }
    public String getMessage() { return message; }
    public String getReviewDate() { return reviewDate; }
}