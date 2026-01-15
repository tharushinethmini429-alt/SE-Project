package myPackage.admin;

import com.google.gson.Gson;
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

public class GetCurrentUserServlet extends HttpServlet {
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
        UserData userData = getUserFromDb(userId);
        
        if (userData != null) {
            String json = new Gson().toJson(userData);
            response.getWriter().write(json);
        } else {
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
            response.getWriter().write("{\"error\": \"User not found\"}");
        }
    }
    
    private UserData getUserFromDb(int userId) {
        UserData userData = null;
        try (Connection conn = DbUtil.getConnection()) {
            // Add user_pno to the SELECT statement
            String query = "SELECT user_id, user_fname, user_lname, user_email, user_pno, user_status FROM users WHERE user_id = ?";
            PreparedStatement stmt = conn.prepareStatement(query);
            stmt.setInt(1, userId);
            
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    String firstName = rs.getString("user_fname");
                    String lastName = rs.getString("user_lname");
                    String email = rs.getString("user_email");
                    String phone = rs.getString("user_pno");
                    String status = rs.getString("user_status");
                    
                    userData = new UserData(userId, firstName, lastName, email, phone, status);
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return userData;
    }
    
    private static class UserData {
        private final int userId;
        private final String firstName;
        private final String lastName;
        private final String email;
        private final String phone;
        private final String status;
        private final String fullName;
        private final String initial;
        
        public UserData(int userId, String firstName, String lastName, String email, String phone, String status) {
            this.userId = userId;
            this.firstName = firstName != null ? firstName : "";
            this.lastName = lastName != null ? lastName : "";
            this.email = email != null ? email : "";
            this.phone = phone != null ? phone : "";
            this.status = status != null ? status : "";
            this.fullName = this.firstName + " " + this.lastName;
            this.initial = !this.firstName.isEmpty() ? this.firstName.substring(0, 1).toUpperCase() : "U";
        }
    }
}