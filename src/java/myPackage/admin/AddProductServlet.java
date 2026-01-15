package myPackage.admin;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;
import myPackage.db.DbUtil;
import java.awt.Graphics2D;
import java.awt.image.BufferedImage;
import javax.imageio.ImageIO;

@MultipartConfig 
public class AddProductServlet extends HttpServlet {

@Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("text/plain");
        
        try {
      
            String proName = request.getParameter("pro_name");
            String proDesc = request.getParameter("pro_desc");
            String proCatStr = request.getParameter("pro_cat");
            String proPriceStr = request.getParameter("pro_price");

            if (proName == null || proDesc == null || proCatStr == null || proPriceStr == null) {
                response.getWriter().println("Missing required fields.");
                return;
            }

            int proCat;
            double proPrice;
            try {
                proCat = Integer.parseInt(proCatStr);
                proPrice = Double.parseDouble(proPriceStr);
            } catch (NumberFormatException e) {
                response.getWriter().println("Invalid category ID or price.");
                return;
            }

            Part filePart = request.getPart("pro_img");
            String imgName = null;
            if (filePart != null && filePart.getSize() > 0) {
                imgName = generateUniqueFileName(filePart);
                boolean saved = saveFile(filePart, imgName, request);
                if (!saved) {
                    response.getWriter().println("Failed to save product image.");
                    return;
                }
            }

            boolean inserted = insertProduct(proName, proDesc, proPrice, proCat, imgName);
            if (inserted) {
                response.getWriter().println("Product added successfully.");
            } else {
                response.getWriter().println("Failed to add product.");
            }

        } catch (Exception e) {
            e.printStackTrace();
            response.getWriter().println("Error: " + e.getMessage());
        }
    }

    private boolean insertProduct(String proName, String proDesc, double proPrice, int proCat, String imgName) {
        String sql = "INSERT INTO products (cat_id, pro_name, pro_price, pro_img, pro_desc, reviews, date) VALUES (?, ?, ?, ?, ?, ?, ?)";
        try (Connection conn = DbUtil.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setInt(1, proCat);
            stmt.setString(2, proName);
            stmt.setDouble(3, proPrice);
            stmt.setString(4, imgName);
            stmt.setString(5, proDesc);
            stmt.setInt(6, 0);
            stmt.setTimestamp(7, new java.sql.Timestamp(System.currentTimeMillis()));

            int rows = stmt.executeUpdate();
            return rows > 0;

        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    private String generateUniqueFileName(Part filePart) {
        String fileName = getFileName(filePart);
        if (fileName == null) return null;
        String[] tokens = fileName.split("\\.");
        String extension = tokens[tokens.length - 1];
        return System.currentTimeMillis() + "_" + (int) (Math.random() * 1000) + "." + extension;
    }

    private String getFileName(Part part) {
        for (String content : part.getHeader("content-disposition").split(";")) {
            if (content.trim().startsWith("filename")) {
                return content.substring(content.indexOf('=') + 1).trim().replace("\"", "");
            }
        }
        return null;
    }

    private boolean saveFile(Part filePart, String fileName, HttpServletRequest request) {
    try {
        String projectPath = request.getServletContext().getRealPath("/");
        String uploadDir = projectPath + "assets" + File.separator + "images" + File.separator + "uploads";
        File uploadDirFile = new File(uploadDir);
        if (!uploadDirFile.exists() && !uploadDirFile.mkdirs()) return false;

        BufferedImage originalImage = ImageIO.read(filePart.getInputStream());

        int width = 300;  
        int height = 300; 
        BufferedImage resizedImage = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);

        Graphics2D g = resizedImage.createGraphics();
        g.drawImage(originalImage, 0, 0, width, height, null);
        g.dispose();

        File outputFile = new File(uploadDir, fileName);
        ImageIO.write(resizedImage, "png", outputFile); 
        return true;

    } catch (Exception e) {
        e.printStackTrace();
        return false;
    }
}


}
   