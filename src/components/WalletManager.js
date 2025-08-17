import React, { useState } from 'react';
import { copyToClipboard } from '../utils/constants';

const WalletManager = ({ 
  isConnected, 
  account, 
  balance, 
  usdcBalance,
  onCreateWallet, 
  onImportWallet, 
  onDisconnect,
  onRefreshBalances // New prop for refreshing balances
}) => {
  const [showImport, setShowImport] = useState(false);
  const [privateKeyInput, setPrivateKeyInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copyMessage, setCopyMessage] = useState('');

  const handleCreateWallet = async () => {
    setIsLoading(true);
    try {
      await onCreateWallet();
    } catch (error) {
      alert('Failed to create wallet: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImportWallet = async () => {
    if (!privateKeyInput.trim()) {
      alert('Please enter a private key');
      return;
    }
    
    setIsLoading(true);
    try {
      await onImportWallet(privateKeyInput);
      setPrivateKeyInput('');
      setShowImport(false);
    } catch (error) {
      alert('Failed to import wallet: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyAddress = async () => {
    const success = await copyToClipboard(account);
    if (success) {
      setCopyMessage('Address copied!');
      setTimeout(() => setCopyMessage(''), 2000);
    } else {
      setCopyMessage('Failed to copy');
      setTimeout(() => setCopyMessage(''), 2000);
    }
  };

  if (isConnected) {
    return (
      <div className="wallet-connected">
        <h2>🔐 Your Wallet</h2>
        <div className="wallet-info">
          <div className="info-row">
            <span className="label">Address:</span>
            <div className="address-section">
              <span className="value address-display">
                {account.slice(0, 6)}...{account.slice(-4)}
              </span>
              <button 
                onClick={handleCopyAddress}
                className="copy-btn"
                title="Copy full address"
              >
                📋
              </button>
            </div>
          </div>
          
          {copyMessage && (
            <div className={`copy-message ${copyMessage.includes('Failed') ? 'error' : 'success'}`}>
              {copyMessage}
            </div>
          )}
          
          <div className="info-row">
            <span className="label">AVAX Balance:</span>
            <span className="value">{parseFloat(balance).toFixed(4)} AVAX</span>
            <button 
              onClick={onRefreshBalances} 
              className="btn-refresh"
              title="Refresh balances"
            >
              🔄
            </button>
          </div>
          
          <div className="info-row">
            <span className="label">USDC Balance:</span>
            <span className="value">{parseFloat(usdcBalance).toFixed(2)} USDC</span>
            <button 
              onClick={onRefreshBalances} 
              className="btn-refresh"
              title="Refresh balances"
            >
              🔄
            </button>
          </div>
        </div>
        
        <div className="wallet-actions">
          <button 
            onClick={handleCopyAddress}
            className="btn-copy"
          >
            📋 Copy Full Address
          </button>
          
          <button onClick={onDisconnect} className="btn-secondary">
            Disconnect Wallet
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="wallet-setup">
      <h2>🔐 Setup Your Wallet</h2>
      <p>Create a new wallet or import an existing one to start making payments</p>
      
      <div className="wallet-actions">
        <button 
          onClick={handleCreateWallet} 
          disabled={isLoading}
          className="btn-primary"
        >
          {isLoading ? 'Creating...' : 'Create New Wallet'}
        </button>
        
        <button 
          onClick={() => setShowImport(!showImport)}
          className="btn-secondary"
        >
          Import Existing Wallet
        </button>
      </div>

      {showImport && (
        <div className="import-wallet">
          <h3>Import Wallet</h3>
          <input
            type="password"
            placeholder="Enter your private key"
            value={privateKeyInput}
            onChange={(e) => setPrivateKeyInput(e.target.value)}
            className="private-key-input"
          />
          <button 
            onClick={handleImportWallet}
            disabled={isLoading}
            className="btn-primary"
          >
            {isLoading ? 'Importing...' : 'Import Wallet'}
          </button>
        </div>
      )}
    </div>
  );
};

export default WalletManager;
