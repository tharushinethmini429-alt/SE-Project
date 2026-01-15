package myPackage.admin;

import java.io.File;
import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import myPackage.db.DbUtil;

@WebServlet("/DeleteProductServlet")
public class DeleteProductServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        String proIdStr = request.getParameter("proId");
        if (proIdStr == null) {
            response.getWriter().println("Invalid product ID");
            return;
        }

        int proId = Integer.parseInt(proIdStr);

        try (Connection conn = DbUtil.getConnection()) {
            String imgName = null;
            try (PreparedStatement ps = conn.prepareStatement("SELECT pro_img FROM products WHERE pro_id=?")) {
                ps.setInt(1, proId);
                ResultSet rs = ps.executeQuery();
                if (rs.next()) {
                    imgName = rs.getString("pro_img");
                }
            }

            try (PreparedStatement ps = conn.prepareStatement("DELETE FROM products WHERE pro_id=?")) {
                ps.setInt(1, proId);
                int rows = ps.executeUpdate();
                if (rows > 0) {
                    if (imgName != null && !imgName.isEmpty()) {
                        String uploadDir = request.getServletContext().getRealPath("/assets/images/uploads");
                        File file = new File(uploadDir, imgName);
                        if (file.exists()) file.delete();
                    }
                    response.getWriter().println("Product deleted successfully");
                } else {
                    response.getWriter().println("Product not found");
                }
            }

        } catch (Exception e) {
            e.printStackTrace();
            response.getWriter().println("Error: " + e.getMessage());
        }
    }
}
