import { ethers } from "ethers";
import StablecoinMerchantABI from "../abi/StablecoinMerchant.json";

import { MetaMaskInpageProvider } from "@metamask/providers";

declare global {
  interface Window {
    ethereum?: MetaMaskInpageProvider;
  }
}

export async function payStablecoin(
  paymentId: string,          // Unique payment ID
  merchantAddress: string,    // Merchant contract address
  tokenAddress: string,       // USDC token contract address
  amount: string,             // Amount as string (e.g., "10.5")
  decimals: number = 6        // Token decimals (default 6 for USDC)
) {
  if (!window.ethereum) throw new Error("Metamask not detected");

  // 1️⃣ Request accounts
  await window.ethereum.request({ method: "eth_requestAccounts" });

  // 2️⃣ Create ethers provider from Metamask
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  // 3️⃣ Create contract instance with signer
  const contract = new ethers.Contract(merchantAddress, StablecoinMerchantABI, signer) as any;

  // 4️⃣ Convert payment ID → bytes32
  const bytes32Id = ethers.encodeBytes32String(paymentId);

  // 5️⃣ Parse amount to BigNumber
  const amountBN = ethers.parseUnits(amount, decimals);

  // 6️⃣ Build the transaction
  const txData = await contract.populateTransaction.pay(bytes32Id, tokenAddress, amountBN);

  // 7️⃣ Show confirmation popup
  const confirmed = window.confirm(
    `Confirm sending payment:\n\nMerchant: ${merchantAddress}\nAmount: ${amount} USDC\nToken: ${tokenAddress}\nPayment ID: ${paymentId}`
  );
  if (!confirmed) throw new Error("Transaction cancelled by user");

  // 8️⃣ Send the transaction via Metamask
  const txResponse = await signer.sendTransaction(txData);

  // 9️⃣ Wait for the transaction to be mined
  const receipt = await txResponse.wait();

  return receipt;
}
