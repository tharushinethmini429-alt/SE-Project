package myPackage.admin;

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
import myPackage.db.DbUtil;

public class GetTotalsServlet extends HttpServlet {

    private static class TotalInfo {
        int totalProducts;
        int totalCategories;
        int totalUsers;
        int totalOrders;

        TotalInfo(int totalProducts, int totalCategories, int totalUsers, int totalOrders) {
            this.totalProducts = totalProducts;
            this.totalCategories = totalCategories;
            this.totalUsers = totalUsers;
            this.totalOrders = totalOrders;
        }
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        int totalProducts = getTotalProducts();
        int totalCategories = getTotalCategories();
        int totalUsers = getTotalUsers();
        int totalOrders = getTotalOrders();
        
        TotalInfo totalInfo = new TotalInfo(totalProducts, totalCategories, totalUsers, totalOrders);
        
        String json = new Gson().toJson(totalInfo);
        
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        
        response.getWriter().write(json);

    }

    private int getTotalProducts(){
        try(Connection conn = DbUtil.getConnection()){
            String query = "SELECT COUNT(*) FROM products";
            
            try(PreparedStatement statement = conn.prepareStatement(query)){
               
                try(ResultSet result = statement.executeQuery()){
                    if(result.next()){
                        int count = result.getInt(1);
                        return count;
                    }
                }
            }
        } catch (SQLException e) {
            e.getMessage();
        }
         return -1;
    }

    private int getTotalCategories(){
        try(Connection conn = DbUtil.getConnection()){
            String query = "SELECT COUNT(*) FROM categories";
            
            try(PreparedStatement statement = conn.prepareStatement(query)){
               
                try(ResultSet result = statement.executeQuery()){
                    if(result.next()){
                        int count = result.getInt(1);
                        return count;
                    }
                }
            }
        } catch (SQLException e) {
            e.getMessage();
        }
         return -1;
    }

    private int getTotalUsers(){
        try(Connection conn = DbUtil.getConnection()){
            String query = "SELECT COUNT(*) FROM users";
            
            try(PreparedStatement statement = conn.prepareStatement(query)){
               
                try(ResultSet result = statement.executeQuery()){
                    if(result.next()){
                        int count = result.getInt(1);
                        return count;
                    }
                }
            }
        } catch (SQLException e) {
            e.getMessage();
        }
         return -1;
    }
    
    private int getTotalOrders(){
        try(Connection conn = DbUtil.getConnection()){
            String query = "SELECT COUNT(*) FROM orders";
            
            try(PreparedStatement statement = conn.prepareStatement(query)){
               
                try(ResultSet result = statement.executeQuery()){
                    if(result.next()){
                        int count = result.getInt(1);
                        return count;
                    }
                }
            }
        } catch (SQLException e) {
            e.getMessage();
        }
         return -1;
    }


}
