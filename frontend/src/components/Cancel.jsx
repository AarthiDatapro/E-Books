import React from 'react';
import '../styles/Cancel.css'; // Assuming you have a CSS file for styling

const Cancel = () => {
  return (
    <div className="policy-container">
      <h1>Cancellation and Refund Policy</h1>
      <p className="effective-date"><strong>Effective Date:</strong> May 24, 2025</p>

      <p>All purchases made on <strong>mahicommunity.com</strong> for digital products such as eBooks are <em>final and non-refundable</em>.</p>

      <p>Since these are instant digital downloads, we do <em>not offer cancellations, refunds, or exchanges</em> once the order is confirmed and the eBook is delivered.</p>

      <p>Please make sure to review all product details and information carefully before making a purchase.</p>

      <p>If you face any issues or have questions, you can reach us at:</p>
      <ul>
        <li><strong>📞 Phone:</strong> 7989611470</li>
        <li><strong>📧 Email:</strong> mahi@mahicommunity.com</li>
      </ul>
    </div>
  );
};

export default Cancel;
