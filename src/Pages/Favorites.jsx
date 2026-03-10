// import React from 'react'
// import { useContext } from 'react'
// import '../Styles/Favorites.css'
// import FavItem from '../Components/FavItem/FavItem'
// import { ShopContext } from '../Context/ShopContext'


// const Favorites = () => {

//   const { all_product, favorites, removeFromFavorites } = useContext(ShopContext);
//   console.log('FAV: ',favorites)
//   return (
//     <div className='favorites-list'>
//         <h1>Favorites</h1>
//         <hr />
//         <div className="favorites">
//             {favorites.map((item, i)=>{
//                 return <FavItem key={i} id={item.id} name={item.name} image={item.image} new_price = {item.new_price} old_price={item.old_price} fav_icon={item.fav_icon}/>

//             })}
//         </div>

//     </div>
//   )
// }

// export default Favorites



import React, { useContext, useEffect, useState } from 'react';
import '../Styles/Favorites.css';
import FavItem from '../Components/FavItem/FavItem';
import { ShopContext } from '../Context/ShopContext';
import API_BASE_URL from '../config';

const Favorites = () => {
  const { favorites } = useContext(ShopContext);
  const [favoritesWithImages, setFavoritesWithImages] = useState([]);

  useEffect(() => {
    const fetchImagesForFavorites = async () => {
      const enriched = await Promise.all(
        favorites.map(async (item) => {
          try {
            const res = await fetch(`${API_BASE_URL}/api/products/images/${item.Product_ID}`);
            const data = await res.json();
            const firstImage = data.images?.[0] || null;

            return {
              ...item,
              image: firstImage,
            };
          } catch (err) {
            console.error(`Error loading image for product ${item.Product_ID}`, err);
            return { ...item, image: null };
          }
        })
      );

      setFavoritesWithImages(enriched);
    };

    if (favorites.length > 0) {
      fetchImagesForFavorites();
    }
  }, [favorites]);

  return (
    <div className='favorites-list'>
      <h1>Favorites</h1>
      <hr />
      <div className="favorites">
        {favoritesWithImages.length === 0 ? (
          <p>No favorite items yet.</p>
        ) : (
          favoritesWithImages.map((item, i) => (
            <FavItem
              key={i}
              id={item.Product_ID}
              name={item.Name}
              image={item.image}
              new_price={item.Price}
              old_price={Math.round(item.Price * 1.2)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Favorites;
