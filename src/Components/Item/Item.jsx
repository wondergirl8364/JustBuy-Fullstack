import React, { useContext, useEffect, useState } from 'react';
import './Item.css';
import { Link } from 'react-router-dom';
import favoriteIcon from "../Assets/unfilled-favIcon.svg";
import favoriteFilledIcon from "../Assets/filled-heart.svg";
import { ShopContext } from '../../Context/ShopContext';
import { jwtDecode } from 'jwt-decode';
import API_BASE_URL from '../../config';

const Item = ({ id, name, image, new_price, old_price }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  const {
    favorites = [],
    addToFavorites,
    removeFromFavorites
  } = useContext(ShopContext);

  // const userId = 1; // 🔒 Replace later with dynamic user
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
  
  const isFavorited = favorites.some(product => product.Product_ID === Number(id));

  const toggleFavorite = async () => {
    if (isFavorited) {
      removeFromFavorites(id);
      try {
                await fetch(`${API_BASE_URL}/api/favourites`, {
                  method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ User_ID: userId, Product_ID: id }),
        });
      } catch (err) {
        console.error("Error removing favorite:", err);
      }
    } else {
      addToFavorites(id);
      try {
                await fetch(`${API_BASE_URL}/api/favourites`, {
                  method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ User_ID: userId, Product_ID: id }),
        });
      } catch (err) {
        console.error("Error adding favorite:", err);
      }
    }
  };

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("userToken"));
  }, []);

  return (
    <div className='item'>
      {isLoggedIn && (
        <div className="favorite-button" onClick={toggleFavorite}>
          <img
            src={isFavorited ? favoriteFilledIcon : favoriteIcon}
            alt="Favorite"
            className="favorite-icon"
          />
        </div>
      )}
      <Link to={isLoggedIn ? `/product/${id}` : '/login'}>
        <img src={image} alt={name} className="item-image" />
      </Link>
      <p>{name}</p>
      <div className="item-prices">
        <div className="item-price-old">${old_price}</div>
        <div className="item-price-new">${new_price}</div>
      </div>
    </div>
  );
};

export default Item;



