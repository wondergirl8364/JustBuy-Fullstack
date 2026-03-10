import React, { useContext, useEffect, useState } from "react";
import './ProductDisplay.css';
import star_icon from '../Assets/star_icon.png';
import star_dull_icon from '../Assets/star_dull_icon.png';
import { ShopContext } from "../../Context/ShopContext";
import { useParams } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import favorite_filled from '../Assets/filled-heart.svg';
import favorite_outline from '../Assets/unfilled-favIcon.svg';
import { jwtDecode } from 'jwt-decode';
import API_BASE_URL from '../../config';

const ProductDisplay = () => {
  const { addToCart, addToFavorites, removeFromFavorites, favorites = [] } = useContext(ShopContext);
  const { productId } = useParams();

  const [product, setProduct] = useState(null);
  const [images, setImages] = useState([]);
  const [mainImage, setMainImage] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);

  // ✅ Get user ID from token
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

  const isFavorited = favorites.find((item) => item.id === parseInt(productId));

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchProduct = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/products/${productId}`);
        const data = await res.json();
        console.log(data);
        setProduct(data);

        const sizes = data.Size ? data.Size.split(",").map(s => s.trim()) : [];
        const colors = data.Color ? data.Color.split(",").map(c => c.trim()) : [];

        if (sizes.length) setSelectedSize(sizes[0]);
        if (colors.length) setSelectedColor(colors[0]);

        const imgRes = await fetch(`${API_BASE_URL}/api/products/images/${productId}`);
        const imgData = await imgRes.json();
        if (imgData.images && imgData.images.length > 0) {
          setImages(imgData.images);
          setMainImage(imgData.images[0]);
        }
      } catch (err) {
        console.error("Error loading product:", err);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleAddToCart = async () => {
    if (!selectedSize || !selectedColor) {
      alert("Please select both size and color.");
      return;
    }

    const payload = {
      User_ID: userId,
      Product_ID: parseInt(productId),
      Quantity: 1,
      Size: selectedSize,
      Color: selectedColor
    };

    try {
      const res = await fetch(`${API_BASE_URL}/api/cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        alert('Item added to cart!');
      } else {
        const error = await res.json();
        alert(`Error: ${error.message || "Add to cart failed"}`);
      }
    } catch (err) {
      alert("Server error. Try again.");
      console.error(err);
    }
  };

  if (!product) return <div>Loading product...</div>;

  const sizes = product.Size ? product.Size.split(",").map(s => s.trim()) : [];
  const colors = product.Color ? product.Color.split(",").map(c => c.trim()) : [];

  return (
    <div className="productdisplay">
      <div className="productdisplay-left">
        <div className="productdisplay-img-list">
          {images.map((imgUrl, index) => (
            <img
              key={index}
              src={imgUrl}
              alt={`thumb-${index}`}
              onClick={() => setMainImage(imgUrl)}
            />
          ))}
        </div>
        <div className="productdisplay-img">
          <div
            className="favorite-button"
            onClick={() =>
              isFavorited
                ? removeFromFavorites(parseInt(productId))
                : addToFavorites({ id: parseInt(productId), name: product.Name })
            }
          >
            <img
              src={isFavorited ? favorite_filled : favorite_outline}
              alt="Favorite Icon"
              className="favorite-icon"
            />
          </div>
          <img className="productdisplay-main-img" src={mainImage} alt="main" />
        </div>
      </div>

      <div className="productdisplay-right">
        <h1>{product.Name}</h1>

        <div className="productdisplay-right-star">
          {[...Array(5)].map((_, i) => (
            <img
              key={i}
              src={i < Math.floor(product.Rating || 0) ? star_icon : star_dull_icon}
              alt="star"
            />
          ))}
          <p>({Math.floor(product.Rating || 0)})</p>
        </div>

        <div className="productdisplay-right-prices">
          <div className="productdisplay-right-price-old">
            ${Math.round(product.Price * 1.25)}
          </div>
          <div className="productdisplay-right-price-new">${product.Price}</div>
        </div>

        <div className="productdisplay-right-description">
          {product.Description}
        </div>

        {/* Sizes */}
        <div className="productdisplay-right-size">
          <h1>Select Size</h1>
          <div className="productdisplay-right-sizes">
            {sizes.map((size) => (
              <div
                key={size}
                className={`size-option ${selectedSize === size ? "selected" : ""}`}
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </div>
            ))}
          </div>
        </div>

        {/* Colors */}
        <div className="productdisplay-right-size">
          <h1>Select Color</h1>
          <div className="productdisplay-right-sizes">
            {colors.map((color) => (
              <div
                key={color}
                className={`size-option ${selectedColor === color ? "selected" : ""}`}
                onClick={() => {
                  setSelectedColor(color);
                  const matchedImage = images.find(img =>
                    img.includes(`color=${encodeURIComponent(color)}`)
                  );
                  if (matchedImage) setMainImage(matchedImage);
                }}
              >
                {color}
              </div>
            ))}
          </div>
        </div>

        <button onClick={handleAddToCart}>ADD TO CART</button>

        <ToastContainer toastClassName="cart-toast" />

        <p className="productdisplay-right-category">
          <span>Category :</span> {product.Category_ID}
        </p>
        <p className="productdisplay-right-category">
          <span>Tags :</span>{" "}
          {(() => {
            try {
              const tagObj = JSON.parse(product.AI_Tagging);
              return tagObj.tags?.join(", ");
            } catch {
              return "N/A";
            }
          })()}
        </p>
      </div>
    </div>
  );
};

export default ProductDisplay;



