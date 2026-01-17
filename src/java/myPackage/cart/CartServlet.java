package myPackage.cart;

import com.google.gson.Gson;
import java.io.IOException;
import java.io.PrintWriter;
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

public class CartServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        int userId = getUserIdFromSession(request);
        
        if (userId == -1) {
            response.getWriter().write("User Not Authenticated");
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            return;
        }
        
        ArrayList<CartItem> cartItems = getCartItemsFromDb(userId);
        String json = new Gson().toJson(cartItems);
        
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        
        response.getWriter().write(json);
    }
    
    private ArrayList<CartItem> getCartItemsFromDb(int userId) {
        ArrayList<CartItem> cartItems = new ArrayList<>();
        String query = "SELECT c.cart_id, c.pro_id, c.quantity, c.sub_total, p.pro_name, p.pro_img, p.pro_price " +
                       "FROM cart c " +
                       "INNER JOIN products p ON c.pro_id = p.pro_id " +
                       "WHERE c.user_id = ?";
        try (Connection conn = DbUtil.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {
            stmt.setInt(1, userId);
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    int cartId = rs.getInt("cart_id");
                    int productId = rs.getInt("pro_id");
                    int quantity = rs.getInt("quantity");
                    double subTotal = rs.getDouble("sub_total");
                    String productName = rs.getString("pro_name");
                    String productImage = rs.getString("pro_img");
                    double price = rs.getDouble("pro_price");
                    cartItems.add(new CartItem(cartId, productId, productName, productImage, quantity, price, subTotal));
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return cartItems;
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
