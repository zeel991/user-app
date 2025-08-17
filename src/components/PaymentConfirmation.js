import React from 'react';

const PaymentConfirmation = ({ 
  paymentData, 
  onConfirm, 
  onCancel, 
  isProcessing 
}) => {
  if (!paymentData) return null;

  return (
    <div className="payment-confirmation">
      <h2>💰 Confirm Payment</h2>
      
      <div className="payment-details">
        <div className="detail-row">
          <span className="label">Merchant:</span>
          <span className="value">{paymentData.merchantAddress}</span>
        </div>
        
        <div className="detail-row">
          <span className="label">Amount:</span>
          <span className="value amount">{paymentData.amount} USDC</span>
        </div>
        
        <div className="detail-row">
          <span className="label">Description:</span>
          <span className="value">{paymentData.description}</span>
        </div>
        
        {paymentData.paymentId && (
          <div className="detail-row">
            <span className="label">Payment ID:</span>
            <span className="value payment-id">
              {paymentData.paymentId.slice(0, 16)}...
            </span>
          </div>
        )}
      </div>
      
      <div className="confirmation-actions">
        <button 
          onClick={onConfirm}
          disabled={isProcessing}
          className="btn-primary"
        >
          {isProcessing ? 'Processing Payment...' : 'Confirm Payment'}
        </button>
        
        <button 
          onClick={onCancel}
          disabled={isProcessing}
          className="btn-secondary"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default PaymentConfirmation;
