import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  buyAllRoute,
  buyNowRoute,
  paymentRoute,
  razorpayKey,
  razorpayRoute,
} from "../utils/APIRoutes";

const Payments = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [referal, setReferal] = useState("hero");
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    contact: "",
  });


  const razorpayLoaded = useRef(false);

  useEffect(() => {
    const cartItems = JSON.parse(localStorage.getItem("bookCartItems")) || [];
    const refCode = localStorage.getItem("refCode") || "hero";
    setCart(cartItems);
    setReferal(refCode);
    if (!state?.price) {
      alert("Invalid payment details.");
      navigate("/userHome");
    }
  }, [navigate, state]);

  const handleInputChange = (e) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!razorpayLoaded.current) {
      razorpayLoaded.current = true;
      loadRazorpay(state.price, userInfo);
    }
  };

  const loadRazorpay = async (amount, userInfo) => {
    try {
      const res = await fetch(paymentRoute, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });

      const data = await res.json();
      const { id: order_id, amount: orderAmount } = data.order;

      const script = document.createElement("script");
      script.src = razorpayRoute;
      script.onload = () => {
        const options = {
          key: razorpayKey,
          amount: orderAmount,
          currency: "INR",
          name: "My Book Store",
          description: state.setAll ? "Full Cart Checkout" : "Buy Single Item",
          order_id,
          handler: async (response) => {
            const commonPayload = {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              amount: orderAmount / 100,
              description: state.setAll ? "Full Cart Checkout" : "Buy Single Item",
              referal: referal,
            };

            try {
              if (state.setAll) {
                const res = await fetch(buyAllRoute, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ ...commonPayload, cart, email: userInfo.email }),
                });
                const result = await res.json();
                if (result.status === true) {
                  localStorage.removeItem("bookCartItems");
                  navigate("/userHome", { state: { response } });
                  alert("Order placed successfully!\n Book will be delivered soon.");
                }
              } else {
                const product = cart.find((item) => item._id === state.productId);
                const res = await fetch(buyNowRoute, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ ...commonPayload, product, email: userInfo.email }),
                });
                const result = await res.json();
                if (result.status === true) {
                  const updatedCart = cart.filter((item) => item._id !== state.productId);
                  localStorage.setItem("bookCartItems", JSON.stringify(updatedCart));
                  setCart(updatedCart);
                  navigate("/userHome", { state: { response } });
                  alert("Order placed successfully!\n Book will be delivered soon.");
                }
              }
            } catch (err) {
              console.error("Backend error:", err);
              alert("Something went wrong while saving your order.");
            }
          },
          modal: {
            ondismiss: () => {
              alert("Payment was cancelled.");
              navigate("/userHome", { replace: true });
            },
          },
          prefill: {
            name: userInfo.name,
            email: userInfo.email,
            contact: userInfo.contact,
          },
          theme: { color: "#3399cc" },
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
      };
      document.body.appendChild(script);
    } catch (err) {
      console.error("Payment initialization failed:", err);
      alert("Failed to start payment.");
    }
  };



  // const handleTesting = () => {
  //   const product = cart.find((item) => item._id === state.productId);
  //   axios.post(testRoute, {
  //     product, email: userInfo.email
  //   })
  // }

  return (
    <div style={{
      maxWidth: '500px',
      margin: '2rem auto',
      padding: '2rem',
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h2 style={{
        textAlign: 'center',
        color: '#2c3e50',
        marginBottom: '2rem',
        fontSize: '1.8rem',
        fontWeight: '600'
      }}>Enter Your Details</h2>
      <form onSubmit={handleSubmit} style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.2rem'
      }}>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={userInfo.name}
          onChange={handleInputChange}
          required
          style={{
            padding: '12px 16px',
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            fontSize: '1rem',
            transition: 'border-color 0.3s ease',
            outline: 'none'
          }}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={userInfo.email}
          onChange={handleInputChange}
          required
          style={{
            padding: '12px 16px',
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            fontSize: '1rem',
            transition: 'border-color 0.3s ease',
            outline: 'none'
          }}
        />
        <input
          type="tel"
          name="contact"
          placeholder="Contact Number"
          value={userInfo.contact}
          onChange={handleInputChange}
          required
          pattern="[0-9]{10}"
          style={{
            padding: '12px 16px',
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            fontSize: '1rem',
            transition: 'border-color 0.3s ease',
            outline: 'none'
          }}
        />
        <button
          type="submit"
          style={{
            backgroundColor: '#3399cc',
            color: 'white',
            padding: '14px 20px',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1.1rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease',
            marginTop: '1rem'
          }}
        >
          Proceed to Pay {state.price}
        </button>
      </form>
    </div>
  );
};

export default Payments;
