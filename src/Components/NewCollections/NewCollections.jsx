// import React from 'react'
// import './NewCollections.css'
// import new_collection from '../Assets/new_collections'
// import Item from '../Item/Item'


// const NewCollections = () => {
//   return (
//     <div className='new-collections'>
//         <h1>NEW COLLECTIONS</h1>
//         <hr />
//         <div className="collections">
//             {new_collection.map((item, i)=>{
//                 return <Item key={i} id={item.id} name={item.name} image={item.image} old_price={item.old_price} new_price = {item.new_price} />

//             })}
//         </div>

//     </div>
//   )
// }

// export default NewCollections




import React, { useEffect, useState } from 'react';
import './NewCollections.css';
import Item from '../Item/Item';
import API_BASE_URL from '../../config';

const NewCollections = () => {
  const [newCollection, setNewCollection] = useState([]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const categories = [1, 2, 3]; // men, women, kids
        const allProducts = [];

        for (const catId of categories) {
          const res = await fetch(`${API_BASE_URL}/api/products/category/${catId}`);
          const data = await res.json();
          allProducts.push(...data);
        }

        const top8 = allProducts.slice(0, 8);

        const enriched = await Promise.all(top8.map(async (product) => {
          const imgRes = await fetch(`${API_BASE_URL}/api/products/images/${product.Product_ID}`);
          const imgData = await imgRes.json();
          return {
            ...product,
            image: imgData.images?.[0] || null,
          };
        }));

        setNewCollection(enriched);
      } catch (err) {
        console.error("New collection error:", err);
      }
    };
    fetchAll();
  }, []);

  return (
    <div className='new-collections'>
      <h1>NEW COLLECTIONS</h1>
      <hr />
      <div className="collections">
        {newCollection.map((item, i) => (
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

export default NewCollections;
