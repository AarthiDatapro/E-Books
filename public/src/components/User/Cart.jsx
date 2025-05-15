import React, { useEffect, useState } from "react";
import { host } from "../../utils/APIRoutes";
import "../../styles/Cart.css";
import { useNavigate } from "react-router-dom";
function Cart() {
  const [cart, setCart] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const cartItems = JSON.parse(localStorage.getItem("bookCartItems")) || [];
    setCart(cartItems);
    calculateTotal(cartItems);
  }, []);

  const calculateTotal = (items) => {
    const total = items.reduce(
      (sum, item) => sum + item.price,
      0
    );
    setTotalPrice(total);
  };

  const handleRemoveFromCart = (productId) => {
    const updatedCart = cart.filter((item) => item._id !== productId);
    localStorage.setItem("bookCartItems", JSON.stringify(updatedCart));
    setCart(updatedCart);
    calculateTotal(updatedCart);
  };

  const handleIncreaseQuantity = (productId) => {
    const updatedCart = cart.map((item) =>
      item._id === productId && item.total_quantity + 1 <= item.quantity
        ? {
            ...item,
            total_quantity: item.total_quantity + 1,
            total_price: item.price * (item.total_quantity + 1),
          }
        : item
    );
    localStorage.setItem("bookCartItems", JSON.stringify(updatedCart));
    setCart(updatedCart);
    calculateTotal(updatedCart);
  };

  const handleDecreaseQuantity = (productId) => {
    const updatedCart = cart
      .map((item) =>
        item._id === productId
          ? {
              ...item,
              total_price: item.price * (item.total_quantity - 1),
              total_quantity: Math.max(0, item.total_quantity - 1),
            }
          : item
      )
      .filter((item) => item.total_quantity > 0);

    localStorage.setItem("bookCartItems", JSON.stringify(updatedCart));
    setCart(updatedCart);
    calculateTotal(updatedCart);
  };

  const handleBuyNow = (productId, price) => {
    navigate("/payments", { state: { productId, price , setAll: false } });
  };

  const handleCheckout = (price) => {
    navigate("/payments", {
      state: { price, setAll: true },
    });
  };

  return (
    <div className="cart-page">
      <div className="cart-header">
        <h2>Your Shopping Cart</h2>
        <p>Review and manage your selected items</p>
      </div>

      {cart.length > 0 ? (
        <>
          <div className="cart-items">
            {cart.map((item) => (
              <div key={item._id} className="cart-item">
                <div className="cart-item-image">
                  <img
                    src={`${host}/uploads/images/${item.category}/${item.subCategory}/${item.bookImage}`}
                    alt={item.bookName}
                  />
                </div>
                <div className="cart-item-details">
                  <h3 className="cart-item-name">{item.bookName}</h3>
                  <p className="cart-item-description">{item.description}</p>
                  <div className="cart-item-price">
                    {item.price}
                  </div>
                </div>
                <div className="cart-item-actions">
                  <div className="cart-item-buttons">
                    <button
                      className="cart-btn remove-btn"
                      onClick={() => handleRemoveFromCart(item._id)}
                    >
                      Remove
                    </button>
                    <button
                      className="cart-btn buy-now-btn"
                      onClick={() =>
                        handleBuyNow(
                          item._id,
                          item.total_price
                        )
                      }
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="cart-summary">
            <div className="total-price">
              <span>Total Amount:</span>
              <span className="price">{totalPrice}</span>
            </div>
            <button
              className="cart-btn buy-now-btn checkout-btn"
              onClick={() => handleCheckout(totalPrice)}
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      ) : (
        <div className="empty-cart">
          <div className="empty-cart-icon">🛒</div>
          <p>Your cart is empty. Add some products to get started!</p>
        </div>
      )}
    </div>
  );
}

export default Cart;
