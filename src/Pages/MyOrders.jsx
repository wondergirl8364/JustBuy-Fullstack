import React, { useEffect, useState } from "react";
import "./CSS/MyOrders.css";
import { jwtDecode } from 'jwt-decode';
import API_BASE_URL from '../config';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [orderItemsMap, setOrderItemsMap] = useState({});
  // const userId = 1; // TODO: Replace with dynamic logged-in user ID
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);

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

  useEffect(() => {
    if (!userId) return;
    const fetchOrders = async () => {
      try {
        const ordersRes = await fetch(`${API_BASE_URL}/api/orders/user/${userId}`);
        const ordersData = await ordersRes.json();
        setOrders(ordersData);

        // Fetch items for each order
        const itemsMap = {};
        for (const order of ordersData) {
          const itemsRes = await fetch(`${API_BASE_URL}/api/orders/${order.Order_ID}/items`);
          const itemsData = await itemsRes.json();
          itemsMap[order.Order_ID] = itemsData;
        }

        setOrderItemsMap(itemsMap);
      } catch (err) {
        console.error("Error fetching orders:", err);
      }
    };

    fetchOrders();
  }, [userId]);

  return (
    <div className="orders-container">
      <h1>Your Orders</h1>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        orders.map((order) => (
          <div key={order.Order_ID} className="order-block">
            <h2>Order ID: {order.Order_ID}</h2>
            <p><strong>Status:</strong> {order.Order_Status}</p>
            <p><strong>Date:</strong> {new Date(order.Order_Date).toLocaleString()}</p>
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Size</th>
                  <th>Color</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {orderItemsMap[order.Order_ID]?.map((item) => (
                  <tr key={item.Order_Item_ID}>
                    <td>{item.Name}</td>
                    <td>{item.Size}</td>
                    <td>{item.Color}</td>
                    <td>{item.Quantity}</td>
                    <td>${parseFloat(item.Price).toFixed(2)}</td>
                    <td>${parseFloat(item.Subtotal || 0).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <hr />
          </div>
        ))
      )}
    </div>
  );
};

export default MyOrders;

