package myPackage.cart;

import com.google.gson.Gson;
import java.io.IOException;
import java.io.PrintWriter;
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

public class GetCartTotalServlet extends HttpServlet {


    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        int userId = getUserIdFromSession(request);
        
        if (userId == -1) {
            response.getWriter().write("User Not Authenticated");
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            return;
        }
        
        int cartTotal = getCartTotal(userId);
        String json = new Gson().toJson(cartTotal);
        
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");       
        response.getWriter().write(json);
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
    
    private int getCartTotal(int userId){
        try(Connection conn = DbUtil.getConnection()){
            String query = "SELECT COUNT(*) FROM cart WHERE user_id = ?";
            try(PreparedStatement stmt = conn.prepareStatement(query)){
                stmt.setInt(1, userId);
                
                try(ResultSet rs = stmt.executeQuery()){
                    if(rs.next()){
                        int count = rs.getInt(1);
                        return count;
                    }
                }
            }
        }catch(SQLException e){
            e.getMessage();
        }
        return -1;
    }


}
