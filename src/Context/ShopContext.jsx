import React, { useState, useEffect, createContext } from "react";
import axios from "axios";
import all_product from "../Components/Assets/all_product";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./ShopContext.css";
import { jwtDecode } from 'jwt-decode';
import API_BASE_URL from '../config';

export const ShopContext = createContext(null);

// const userId = 1; // 🔒 Hardcoded user

const ShopContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const [favorites, setFavorites] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  const [promoCode, setPromoCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0); // discount in dollars
  const [promo, setPromo] = useState({
    applied: false,
    code: "",
    discount: 0,
  });
  


  useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
          try {
            const decoded = jwtDecode(token);
            setUserId(decoded.userId || decoded.id || decoded.sub);
            setIsLoggedIn(true);
          } catch (err) {
            console.error("Invalid token:", err);
          }
        }
      }, []);

  const applyPromoCode = async (code) => {
    if (!code || !userId) return;
  
    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/validate-promo`, { promoCode:code });
      console.log('RES:',res)
      if (res.data.success) {        
        const { discountPercentage } = res.data;
        toast.success(`Promo applied! Discount: $${discountPercentage.toFixed(2)}`, {
          position: "top-right",
          autoClose: 1500,
        });
  
        setPromo({
          applied: true,
          code,
          discount: discountPercentage,
        });
      } else {
        console.log('Entering else')
        setPromo({ applied: false, code: "", discount: 0 });
      }      
    } catch (error) {
      console.log('err:',error)
      toast.error(`Promo error: ${error.response?.data?.message || error.message}`, {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };
      
  
  const clearPromoCode = () => {
    setPromoCode('');
    setDiscountAmount(0);
  };
      
  // 🛒 Fetch cart items
  const fetchCartItems = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/cart/${userId}`);
      const formatted = {};
      res.data.forEach((item) => {
        const key = `${item.Product_ID}_${item.Size}`;
        formatted[key] = {
          ...item,
          quantity: item.Quantity,
        };
      });
      setCartItems(formatted);
    } catch (err) {
      console.error("Error fetching cart items:", err.message);
    }
  };

  // ❤️ Fetch favorites
  const fetchFavorites = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/favourites/${userId}`);
      setFavorites(res.data); // expects array of full product objects
    } catch (err) {
      console.error("Error fetching favorites:", err.message);
    }
  };

  // useEffect(() => {
  //   fetchCartItems();
  //   fetchFavorites();
  // }, []);

  useEffect(() => {
    if (userId) {
      fetchCartItems();
      fetchFavorites();
    }
  }, [userId]);
  

  // ➕ Add to cart
  const addToCart = async (productId, size, color = "Default") => {
    try {
            await axios.post(`${API_BASE_URL}/api/cart`, {
              User_ID: userId,
              Product_ID: productId,
              Quantity: 1,
              Size: size,
              Color: color,
            });
      toast.success("Item added to cart!", {
        position: "top-right",
        autoClose: 1000,
        style: { width: "450px", height: "50px", marginRight: "-100px" },
      });
      fetchCartItems();
    } catch (err) {
      console.error("Error adding to cart:", err.message);
    }
  };

  const addProduct = async (productId, size) => {
    const cartKey = `${productId}_${size}`;
    const existing = cartItems[cartKey] || { quantity: 0, Color: "Default" };
        await axios.post(`${API_BASE_URL}/api/cart`, {
          User_ID: userId,
          Product_ID: productId,
          Quantity: 1,
          Size: size,
          Color: existing.Color,
        });
    fetchCartItems();
  };

  const removeFromCart = async (productId, size) => {
    const cartKey = `${productId}_${size}`;
    const existing = cartItems[cartKey];
    if (!existing) return;

    if (existing.quantity === 1) {
      await axios.delete(`${API_BASE_URL}/api/cart/${existing.Cart_ID}`);
    } else {
      await axios.put(`${API_BASE_URL}/api/cart/${existing.Cart_ID}`, {
        Quantity: existing.quantity - 1,
        Size: existing.Size,
        Color: existing.Color,
      });
    }
    fetchCartItems();
  };

  // 💰 Total cart price
  // const getTotalCartAmount = async () => {
  //   try {
  //     const res = await axios.get(`${API_BASE_URL}/api/cart/${userId}/total`);
  //     return parseFloat(res.data.total).toFixed(2);
  //   } catch (err) {
  //     console.error("Error getting total cart amount:", err.message);
  //     return "0.00";
  //   }
  // };

  const getTotalCartAmountBeforeDiscount = async () => {
    if (!userId) return "0.00";
    try {
      const res = await axios.get(`${API_BASE_URL}/api/cart/${userId}/total`);
      return parseFloat(res.data.total);
    } catch (err) {
      console.error("Error getting total cart amount:", err.message);
      return "0.00";
    }
  };

  const getTotalCartAmount = async () => {
    if (!userId) return "0.00";
    try {
      const res = await axios.get(`${API_BASE_URL}/api/cart/${userId}/total`);
      let total = parseFloat(res.data.total);
  
      if (promo.applied) {
        total -= (total * promo.discount / 100).toFixed(2);
      }
  
      return total.toFixed(2);
    } catch (err) {
      console.error("Error getting total cart amount:", err.message);
      return "0.00";
    }
  };
  
  
  

  // 🧮 Total items
  const getTotalCartItems = () => {
    return Object.values(cartItems).reduce((acc, item) => acc + item.quantity, 0);
  };

  // ---------------- FAVORITES ----------------

  const addToFavorites = async (productId) => {
    try {
      // Prevent duplicate add
      const alreadyExists = favorites.some((fav) => fav.Product_ID === productId);
      if (alreadyExists) return;

      await axios.post(`${API_BASE_URL}/api/favourites`, {
        User_ID: userId,
        Product_ID: productId,
      });

      toast.success("Added to favorites!", {
        position: "top-right",
        autoClose: 1000,
        style: { width: "450px", height: "50px", marginRight: "-100px" },
      });

      fetchFavorites();
    } catch (err) {
      console.error("Error adding to favorites:", err.message);
    }
  };

  const removeFromFavorites = async (productId) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/favourites`, {
        data: {
          User_ID: userId,
          Product_ID: productId,
        },
      });

      toast.info("Removed from favorites.", {
        position: "top-right",
        autoClose: 1000,
        style: { width: "450px", height: "50px", marginRight: "-100px" },
      });

      fetchFavorites();
    } catch (err) {
      console.error("Error removing from favorites:", err.message);
    }
  };

  const getTotalFavoriteItems = () => favorites.length;

  // ------------------------------------------------------

  const contextValue = {
    cartItems,
    addToCart,
    addProduct,
    removeFromCart,
    getTotalCartAmount,
    getTotalCartItems,
    all_product,
    favorites,
    addToFavorites,
    removeFromFavorites,
    getTotalFavoriteItems,
    fetchCartItems,
    applyPromoCode,
    clearPromoCode,
    promoCode,
    discountAmount,
    isLoggedIn,
    promo,
    getTotalCartAmountBeforeDiscount
  };

  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
