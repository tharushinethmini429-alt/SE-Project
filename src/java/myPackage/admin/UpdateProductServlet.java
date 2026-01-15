package myPackage.admin;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import static java.lang.Double.parseDouble;
import static java.lang.Integer.parseInt;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;
import myPackage.db.DbUtil;

@MultipartConfig
public class UpdateProductServlet extends HttpServlet {
    
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        try {
            int proId = parseInt(request.getParameter("pro_id"));
            String proName = request.getParameter("pro_name");
            String proDesc = request.getParameter("pro_desc");
            double proPrice = parseDouble(request.getParameter("pro_price"));
            int catId = parseInt(request.getParameter("pro_cat"));
            

            String oldImage = request.getParameter("img_input");
            System.out.println("Old image from form: " + oldImage);
            
            String isImageChanged = request.getParameter("isImageChanged");
            System.out.println("Image changed flag: " + isImageChanged);
            
            String imgName = oldImage; 
            
            if ("yes".equals(isImageChanged)) {
                Part filePart = request.getPart("pro_img");
                
                if (filePart != null && filePart.getSize() > 0) {
                    imgName = generateUniqueFileName(filePart);
                    
                    if (imgName != null) {
                        saveFile(filePart, imgName, request);
                        System.out.println("New image uploaded: " + imgName);
                        
                        if (oldImage != null && !oldImage.trim().isEmpty() && !oldImage.equals(imgName)) {
                            deleteOldImage(oldImage, request);
                        }
                    } else {
                        imgName = oldImage;
                        System.out.println("Failed to generate new filename, keeping old image");
                    }
                } else {
                    System.out.println("No file uploaded, keeping old image: " + oldImage);
                }
            } else {
                System.out.println("Image not changed, using existing: " + oldImage);
            }
            
            if (imgName == null || imgName.trim().isEmpty()) {
                System.err.println("WARNING: imgName is empty! Using old image: " + oldImage);
                imgName = oldImage;
            }
            
            System.out.println("Final image name for DB: " + imgName);
            
            updateProduct(proId, catId, proName, proDesc, imgName, proPrice);
            
            response.setContentType("text/plain");
            response.getWriter().write("Product Updated Successfully");
            
        } catch (NumberFormatException e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write("Invalid input: " + e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("Error updating product: " + e.getMessage());
        }
    }
    
    private void updateProduct(int proId, int catId, String proName, String proDesc, 
                               String proImg, double proPrice) {
        try (Connection conn = DbUtil.getConnection()) {
            String query = "UPDATE products SET cat_id = ?, pro_name = ?, pro_price = ?, " +
                          "pro_img = ?, pro_desc = ?, reviews = ?, date = ? WHERE pro_id = ?";
            
            try (PreparedStatement stmt = conn.prepareStatement(query)) {
                stmt.setInt(1, catId);
                stmt.setString(2, proName);
                stmt.setDouble(3, proPrice);
                stmt.setString(4, proImg);
                stmt.setString(5, proDesc);
                stmt.setDouble(6, 0.0);
                stmt.setDate(7, new java.sql.Date(System.currentTimeMillis()));
                stmt.setInt(8, proId);
                
                int rowsAffected = stmt.executeUpdate();
                System.out.println("Product updated. Rows affected: " + rowsAffected);
                System.out.println("Updated with image: " + proImg);
            }
        } catch (SQLException e) {
            e.printStackTrace();
            throw new RuntimeException("Database error: " + e.getMessage());
        }
    }
    
    private void deleteOldImage(String oldImageName, HttpServletRequest request) {
        try {
            String uploadDir = request.getServletContext().getRealPath("/") + "assets/images/uploads";
            String oldFilePath = uploadDir + File.separator + oldImageName;
            File oldFile = new File(oldFilePath);
            
            if (oldFile.exists()) {
                boolean deleted = oldFile.delete();
                if (deleted) {
                    System.out.println("Successfully deleted old image: " + oldImageName);
                } else {
                    System.err.println("Failed to delete old image: " + oldImageName);
                }
            } else {
                System.out.println("Old image file not found: " + oldImageName);
            }
        } catch (Exception e) {
            System.err.println("Error deleting old image: " + e.getMessage());
        }
    }
    
    private String getFileName(Part part) {
        if (part == null) return null;
        
        String contentDisposition = part.getHeader("content-disposition");
        if (contentDisposition == null) return null;
        
        for (String content : contentDisposition.split(";")) {
            if (content.trim().startsWith("filename")) {
                String filename = content.substring(content.indexOf('=') + 1)
                                        .trim()
                                        .replace("\"", "");
                return filename.isEmpty() ? null : filename;
            }
        }
        return null;
    }
    
    private String generateUniqueFileName(Part filePart) {
        String fileName = getFileName(filePart);
        if (fileName == null || fileName.isEmpty()) {
            System.out.println("No filename found in part");
            return null;
        }
        
        String extension = "";
        int lastDotIndex = fileName.lastIndexOf('.');
        if (lastDotIndex > 0) {
            extension = fileName.substring(lastDotIndex);
        }
        
        return System.currentTimeMillis() + "_" + 
               (int) (Math.random() * 10000) + extension;
    }
    
    private void saveFile(Part filePart, String fileName, HttpServletRequest request) 
            throws IOException {
        
        String uploadDir = request.getServletContext().getRealPath("/") + "assets/images/uploads";
        File dir = new File(uploadDir);
        
        if (!dir.exists()) {
            boolean created = dir.mkdirs();
            if (!created) {
                throw new IOException("Failed to create upload directory: " + uploadDir);
            }
        }
        
        String filePath = uploadDir + File.separator + fileName;
        
        try (InputStream inputStream = filePart.getInputStream()) {
            Files.copy(inputStream, Paths.get(filePath));
            System.out.println("File saved successfully: " + filePath);
        } catch (IOException e) {
            System.err.println("Error saving file: " + e.getMessage());
            throw e;
        }
    }
}