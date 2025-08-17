import React, { useState } from "react";
import { ethers } from "ethers";
import QRScanner from "./components/QRScanner";
import PaymentConfirmation from "./components/PaymentConfirmation";
import TransactionStatus from "./components/TransactionStatus";
import { payStablecoin } from "./utils/pay.ts";
import "./App.css";

function App() {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedData, setScannedData] = useState(null);
  const [paymentData, setPaymentData] = useState(null);
  const [transactionStatus, setTransactionStatus] = useState(null);
  const [transactionHash, setTransactionHash] = useState("");
  const [error, setError] = useState("");

  const handleStartScan = () => {
    setIsScanning(true);
    setError("");
  };

  const handleStopScan = () => {
    setIsScanning(false);
  };

  const handleScanResult = (scannedString) => {
    setIsScanning(false);
    setScannedData(scannedString);

    try {
      const decoded = JSON.parse(atob(scannedString));
      const paymentInfo = {
        paymentId: decoded.p || decoded.paymentId,
        merchantAddress: decoded.m || decoded.merchantAddress,
        amount: decoded.a || decoded.amount,
        tokenAddress: decoded.t || decoded.tokenAddress,
        description: decoded.d || decoded.description,
      };
      setPaymentData(paymentInfo);
    } catch (err) {
      setError("Invalid QR code format");
      console.error("QR decode error:", err);
    }
  };

  const handleConfirmPayment = async () => {
    if (!paymentData || !window.ethereum) {
      alert("Please install MetaMask!");
      return;
    }

    setTransactionStatus("processing");

    try {
      const metamaskProvider = new ethers.BrowserProvider(window.ethereum);
      await metamaskProvider.send("eth_requestAccounts", []);
      const signer = await metamaskProvider.getSigner();

      const confirmed = window.confirm(
        `Confirm sending payment:\n\nMerchant: ${paymentData.merchantAddress}\nAmount: ${paymentData.amount} USDC\nToken: ${paymentData.tokenAddress}\nPayment ID: ${paymentData.paymentId}`
      );
      if (!confirmed) throw new Error("Transaction cancelled by user");

      const receipt = await payStablecoin(
        signer,
        paymentData.merchantAddress,
        paymentData.paymentId,
        paymentData.tokenAddress,
        paymentData.amount
      );

      setTransactionStatus("success");
      setTransactionHash(receipt.transactionHash || "");
    } catch (err) {
      console.error("Payment error:", err);
      setTransactionStatus("error");
      setError(err.message || "Transaction failed");
    }
  };

  const handleCancelPayment = () => {
    setPaymentData(null);
    setScannedData(null);
  };

  const handleReset = () => {
    setPaymentData(null);
    setScannedData(null);
    setTransactionStatus(null);
    setTransactionHash("");
    setError("");
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>💳 Crypto Payment Scanner</h1>
        <p>Scan QR codes and pay with USDC on Avalanche</p>
      </header>

      <main className="app-main">
        {!paymentData && !transactionStatus && (
          <QRScanner
            onScanResult={handleScanResult}
            isScanning={isScanning}
            onStartScan={handleStartScan}
            onStopScan={handleStopScan}
          />
        )}

        {paymentData && !transactionStatus && (
          <PaymentConfirmation
            paymentData={paymentData}
            onConfirm={handleConfirmPayment}
            onCancel={handleCancelPayment}
            isProcessing={transactionStatus === "processing"}
          />
        )}

        <TransactionStatus
          status={transactionStatus}
          transactionHash={transactionHash}
          error={error}
          onReset={handleReset}
        />
      </main>
    </div>
  );
}

export default App;
