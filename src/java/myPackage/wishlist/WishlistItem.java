package myPackage.wishlist;

public class WishlistItem {
    int wishlistId;
    int proId;
    String proName;
    String proImage;
    double price;
    
    public WishlistItem(int wishlistId, int proId, String proName, String proImage, double price){
        this.wishlistId = wishlistId;
        this.proId = proId;
        this.proName = proName;
        this.proImage = proImage;
        this.price = price;
    }
    
    public int getWishlistId(){
        return wishlistId;
    }
    
    public void setWishlistId(int wishlistId){
        this.wishlistId = wishlistId;
    }
    
    public int getProId(){
        return proId;
    }
    
    public void setProId(int proId){
        this.proId = proId;
    }
    
    public String getProName(){
        return proName;
    }
    
    public void setProName(String proName){
        this.proName = proName;
    }
    
    public String getProImage(){
        return proImage;
    }
    
    public void setProImage(String proImage){
        this.proImage = proImage;
    }

    public double getPrice(){
        return price;
    }
    
    public void setPrice(double price){
        this.price = price;
    }
}
