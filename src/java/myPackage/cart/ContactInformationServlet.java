package myPackage.cart;

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

public class ContactInformationServlet extends HttpServlet {


   @Override
   protected void doGet(HttpServletRequest request, HttpServletResponse response)
           throws ServletException, IOException {
       
       int userId = getUserIdFromSession(request);
       
       if (userId == -1) {
           response.getWriter().write("User Not Authenticated");
           response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
           return;
       }
       
       ArrayList<ContactItem> contactItem = getContactInfoFromDb(userId);
       String json = new Gson().toJson(contactItem);
       
       response.setContentType("application/json");
       response.setCharacterEncoding("UTF-8");       
       response.getWriter().write(json);
   }
   
       private ArrayList<ContactItem> getContactInfoFromDb(int userId){
           ArrayList<ContactItem> contactItem = new ArrayList<>();

           try (Connection conn = DbUtil.getConnection();
                PreparedStatement stmt = conn.prepareStatement("SELECT * FROM users WHERE user_id = ?")){
                   stmt.setInt(1, userId);
                   try(ResultSet result = stmt.executeQuery()){
                       while(result.next()){
                           String firstName = result.getString("user_fname");
                           String lastName = result.getString("user_lname");
                           String email = result.getString("user_email");
                           String phoneNo = result.getString("user_pno");

                           contactItem.add(new ContactItem(firstName, lastName, email, phoneNo));
                       }
                   }
           }catch (SQLException e) {
              e.getMessage();
           }
           return contactItem;
   }
       
   private int getUserIdFromSession(HttpServletRequest request) {
    HttpSession session = request.getSession(false);
    if (session != null) {
        Object userIdObj = session.getAttribute("userId");
        if (userIdObj != null) {
            try {
                return Integer.parseInt(userIdObj.toString());
            } catch (NumberFormatException e) {
                return -1;
            }
        }
    }
    return -1;
}



}
