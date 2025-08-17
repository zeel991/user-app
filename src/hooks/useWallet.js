import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

export const useWallet = () => {
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [balance, setBalance] = useState('0');
  const [isConnected, setIsConnected] = useState(false);

  // Create a new wallet
  const createWallet = async () => {
    try {
      // Create random wallet
      const wallet = ethers.Wallet.createRandom();
      
      // Connect to Avalanche Fuji testnet
      const web3Provider = new ethers.JsonRpcProvider('https://api.avax-test.network/ext/bc/C/rpc');
      const connectedWallet = wallet.connect(web3Provider);
      
      setProvider(web3Provider);
      setAccount(wallet.address);
      setPrivateKey(wallet.privateKey);
      setIsConnected(true);
      
      // Get balance
      await updateBalance(wallet.address, web3Provider);
      
      return wallet;
    } catch (error) {
      console.error('Error creating wallet:', error);
      throw error;
    }
  };

  // Import existing wallet
  const importWallet = async (privateKeyInput) => {
    try {
      const wallet = new ethers.Wallet(privateKeyInput);
      
      const web3Provider = new ethers.JsonRpcProvider('https://api.avax-test.network/ext/bc/C/rpc');
      const connectedWallet = wallet.connect(web3Provider);
      
      setProvider(web3Provider);
      setAccount(wallet.address);
      setPrivateKey(privateKeyInput);
      setIsConnected(true);
      
      await updateBalance(wallet.address, web3Provider);
      
      return wallet;
    } catch (error) {
      console.error('Error importing wallet:', error);
      throw error;
    }
  };

  // Update balance
  const updateBalance = async (address, provider) => {
    try {
      const balance = await provider.getBalance(address);
      setBalance(ethers.formatEther(balance));
    } catch (error) {
      console.error('Error getting balance:', error);
    }
  };

  // Get USDC balance
  const getUSDCBalance = async () => {
    if (!provider || !account) return '0';
    
    try {
      const usdcContract = new ethers.Contract(
        '0x0eb7B36996Ff2c55D1376D3E85287935Cc8CD617', // USDC on Avalanche Fuji
        ['function balanceOf(address) view returns (uint256)'],
        provider
      );
      
      const balance = await usdcContract.balanceOf(account);
      return ethers.formatUnits(balance,18); // USDC has 6 decimals
    } catch (error) {
      console.error('Error getting USDC balance:', error);
      return '0';
    }
  };

  const disconnectWallet = () => {
    setProvider(null);
    setAccount('');
    setPrivateKey('');
    setBalance('0');
    setIsConnected(false);
  };

  return {
    provider,
    account,
    privateKey,
    balance,
    isConnected,
    createWallet,
    importWallet,
    updateBalance,
    getUSDCBalance,
    disconnectWallet
  };
};
