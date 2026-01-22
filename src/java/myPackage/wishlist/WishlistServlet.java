package myPackage.wishlist;
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

public class WishlistServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        
        int userId = getUserIdFromSession(request);
        
        if (userId == -1) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("[]");
            return;
        }
        
        ArrayList<WishlistItem> wishlistItems = getWishlistItemsFromDb(userId);
        String json = new Gson().toJson(wishlistItems);
        
        response.getWriter().write(json);
    }
    
    private ArrayList<WishlistItem> getWishlistItemsFromDb(int userId){
        ArrayList<WishlistItem> wishlistItems = new ArrayList<>();
        String query = "SELECT w.wishlist_id, w.pro_id, w.price, p.pro_name, p.pro_img " +
                       "FROM wishlist w " +
                       "INNER JOIN products p ON w.pro_id = p.pro_id " +
                       "WHERE w.user_id = ? " +
                       "ORDER BY w.date DESC";
        
        try (Connection conn = DbUtil.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {
            stmt.setInt(1, userId);
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    int wishlistId = rs.getInt("wishlist_id");
                    int productId = rs.getInt("pro_id");
                    double price = rs.getDouble("price");
                    String productName = rs.getString("pro_name");
                    String productImage = rs.getString("pro_img");
                    wishlistItems.add(new WishlistItem(wishlistId, productId, productName, productImage, price));
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return wishlistItems;
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
}