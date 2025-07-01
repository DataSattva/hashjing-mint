import React, { useState } from "react";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "./constants";
import { ethers } from "ethers";
import "./App.css";

// Add this line at the top of App.tsx, before function App()
declare global {
  interface Window {
    ethereum?: any;
  }
}

function App() {
  const [status, setStatus] = useState("");

  const handleMint = async () => {
    try {
      if (!window.ethereum) {
        setStatus("No wallet found. Please install MetaMask.");
        return;
      }

      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      const tx = await contract.mint({ value: ethers.parseEther("0.002") });
      setStatus("Minting… please wait.");
      await tx.wait();
      setStatus("✅ Mint successful!");
    } catch (err: any) {
      setStatus(`❌ Error: ${err.message}`);
    }
  };

  return (
    <>
      <div id="title">HashJing – Mint</div>
      <main id="mandala-section">
        <div className="section-title">Mint your unique mandala</div>
        <p className="status">Each token is fully on-chain and costs 0.002 ETH to mint.</p>
        <button className="wide-button green-button" onClick={handleMint}>
          Mint now
        </button>
        {status && <p className="status">{status}</p>}
      </main>
    </>
  );
}

export default App;
