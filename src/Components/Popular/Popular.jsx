// import React from 'react'
// import './Popular.css'
// import data_product from '../Assets/data' 
// import Item from '../Item/Item'

// const Popular = () => {
//   return (
//     <div className='popular'>
//         <h1>POPULAR IN WOMEN</h1>
//         <hr/>
//         <div className="popular-item">
//             {data_product.map((item, i) => {
//                 return <Item key={i} id={item.id} name={item.name} image={item.image} new_price = {item.new_price} old_price={item.old_price} />
//             })}
//         </div>
//     </div>
//   )
// }

// export default Popular



import React, { useEffect, useState } from 'react';
import './Popular.css';
import Item from '../Item/Item';
import API_BASE_URL from '../../config';

const Popular = () => {
  const [popularProducts, setPopularProducts] = useState([]);

  useEffect(() => {
    const fetchPopular = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/products/category/2`); // women category
        const data = await res.json();
        const enriched = await Promise.all(data.slice(0, 4).map(async (product) => {
          const imgRes = await fetch(`${API_BASE_URL}/api/products/images/${product.Product_ID}`);
          const imgData = await imgRes.json();
          return {
            ...product,
            image: imgData.images?.[0] || null,
          };
        }));
        setPopularProducts(enriched);
      } catch (err) {
        console.error("Error fetching popular products:", err);
      }
    };
    fetchPopular();
  }, []);

  return (
    <div className='popular'>
      <h1>POPULAR IN WOMEN</h1>
      <hr />
      <div className="popular-item">
        {popularProducts.map((item, i) => (
          <Item
            key={i}
            id={item.Product_ID}
            name={item.Name}
            image={item.image}
            new_price={item.Price}
            old_price={Math.round(item.Price * 1.2)}
          />
        ))}
      </div>
    </div>
  );
};

export default Popular;
