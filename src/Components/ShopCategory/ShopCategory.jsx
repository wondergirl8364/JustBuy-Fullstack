import React, { useEffect, useState } from "react";
import "./ShopCategory.css";
import Item from "../Item/Item";
import { ToastContainer } from "react-toastify";
import API_BASE_URL from '../../config';

const ShopCategory = ({ category, banner, searchQuery }) => {
  const [products, setProducts] = useState([]);
  const [sortOption, setSortOption] = useState("default");
  const [showAll, setShowAll] = useState(false);

  // ✅ Category name to ID mapping with safe trimming
  const getCategoryId = (categoryName) => {
    const mapping = {
      men: 1,
      women: 2,
      kids: 3,
    };

    if (!categoryName) return 1;

    const cleaned = categoryName.trim().toLowerCase();
    console.log("Here",cleaned);
    // return mapping[cleaned] || 1;
    return mapping[cleaned];
  };

  // ✅ Fetch products and their images
  const fetchProductsByCategory = async (categoryId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/products/category/${categoryId}`);
      const data = await res.json();

      const enriched = await Promise.all(
        data.map(async (product) => {
          try {
            const imgRes = await fetch(`${API_BASE_URL}/api/products/images/${product.Product_ID}`);
            const imgData = await imgRes.json();
            const firstImage = imgData.images?.[0] || null;

            return {
              ...product,
              image: firstImage,
            };
          } catch (err) {
            console.error(`Error fetching image for product ${product.Product_ID}`, err);
            return { ...product, image: null };
          }
        })
      );

      return enriched;
    } catch (err) {
      console.error("Error fetching products by category:", err);
      return [];
    }
  };

  // ✅ Load products on category change
  useEffect(() => {
    const loadProducts = async () => {
      const categoryId = getCategoryId(category);
      const fetched = await fetchProductsByCategory(categoryId);
      setProducts(fetched);
      setShowAll(false);
    };

    loadProducts();
  }, [category]);

  // ✅ Filter by search query
  let filteredProducts = [...products].filter((item) =>
    !searchQuery || item.Name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ✅ Sort logic
  switch (sortOption) {
    case "price-low":
      filteredProducts.sort((a, b) => a.Price - b.Price);
      break;
    case "price-high":
      filteredProducts.sort((a, b) => b.Price - a.Price);
      break;
    case "name":
      filteredProducts.sort((a, b) => a.Name.localeCompare(b.Name));
      break;
    default:
      break;
  }

  const initialProducts = filteredProducts.slice(0, 9);
  const remainingProducts = filteredProducts.slice(9);

  return (
    <div className="shop-category">
      <ToastContainer toastClassName="cart-toast" />
      <img className="shopcategory-banner" src={banner} alt="Category Banner" />

      {/* Sort & Filter Header */}
      <div className="shopcategory-indexSort">
        <p>
          <strong>
            Showing {showAll ? filteredProducts.length : initialProducts.length}
          </strong>{" "}
          out of <strong>{filteredProducts.length}</strong> products
        </p>
        <div className="shopcategory-sort">
          <label>Sort by:</label>
          <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
            <option value="default">Default</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name">Alphabetical (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Product Grid */}
      <div className="shopcategory-products">
        {[...(showAll ? filteredProducts : initialProducts)].map((item, i) => (
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

      {/* Load More Button */}
      {!showAll && remainingProducts.length > 0 && (
        <button className="shopcategory-loadmore" onClick={() => setShowAll(true)}>
          Explore More
        </button>
      )}
    </div>
  );
};

export default ShopCategory;

