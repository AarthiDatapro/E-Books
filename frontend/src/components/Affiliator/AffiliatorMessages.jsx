import React, { useEffect, useState } from 'react';
import { getMessagesByRefRoute, secretKey } from '../../utils/APIRoutes';
import "../../styles/AffiliatorMessages.css";
import axios from 'axios';

function AffiliatorMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("bookShopCurrentUser"));
  const shortUrl = user?.shortUrl; // Get the current URL

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.post(getMessagesByRefRoute, {
          referal: shortUrl.split('/r/')[1],
        }, {
          headers: {
            "api-key": secretKey
          }
        });
        if (response.data.status) {
          setMessages(response.data.messages);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  if (loading) return <div className="loading">Loading messages...</div>;

  return (
    <section className="messages-container" aria-labelledby="affiliate-messages-title">
      {loading ? (
        <div className="loading" role="status" aria-live="polite">Loading messages...</div>
      ) : messages.length === 0 ? (
        <p className="no-messages">No messages found.</p>
      ) : (
        <ul className="message-list">
          {messages.map((msg, index) => (
            <li key={index} className="message-card" tabIndex={0} aria-label={`Message for order ${msg.orderId}`}>
              <div className="message-header">
                <span className="order-id"><strong>Order ID:</strong> {msg.orderId}</span>
                <span className="referal"><strong>Referal:</strong> {msg.referal}</span>
              </div>
              <div className="message-body">
                <span className="book-name"><strong>Book:</strong> {msg.bookName}</span>
                <span className="price"><strong>Price:</strong> ₹{msg.price}</span>
              </div>
              <div className="message-text">
                <span><strong>Message:</strong> {msg.text}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default AffiliatorMessages;
