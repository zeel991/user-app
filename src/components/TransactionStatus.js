import React from 'react';

const TransactionStatus = ({ status, transactionHash, error, onReset }) => {
  if (status === 'success') {
    return (
      <div className="transaction-status success">
        <h2>✅ Payment Successful!</h2>
        <p>Your payment has been processed successfully.</p>
        
        {transactionHash && (
          <div className="transaction-details">
            <p><strong>Transaction Hash:</strong></p>
            <a 
              href={`https://testnet.snowtrace.io/tx/${transactionHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="transaction-link"
            >
              {transactionHash.slice(0, 10)}...{transactionHash.slice(-10)}
            </a>
          </div>
        )}
        
        <button onClick={onReset} className="btn-primary">
          Make Another Payment
        </button>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="transaction-status error">
        <h2>❌ Payment Failed</h2>
        <p>{error || 'An error occurred while processing your payment.'}</p>
        
        <button onClick={onReset} className="btn-primary">
          Try Again
        </button>
      </div>
    );
  }

  if (status === 'processing') {
    return (
      <div className="transaction-status processing">
        <div className="spinner"></div>
        <h2>⏳ Processing Payment</h2>
        <p>Please wait while we process your payment...</p>
      </div>
    );
  }

  return null;
};

export default TransactionStatus;
