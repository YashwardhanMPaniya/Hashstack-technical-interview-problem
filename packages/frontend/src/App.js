import React, { useState } from "react";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      infuraId: "YOUR_INFURA_ID",
    },
  },
};

const web3Modal = new Web3Modal({
  cacheProvider: false,
  providerOptions,
});

function App() {
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [value, setValue] = useState("");
  const [currentValue, setCurrentValue] = useState(null);

  const connectWallet = async () => {
    const instance = await web3Modal.connect();
    const ethersProvider = new ethers.providers.Web3Provider(instance);
    setProvider(ethersProvider);
  };

  const loadContract = async () => {
    const address = "YOUR_CONTRACT_A_PROXY_ADDRESS";
    const abi = [
      "function getValue() view returns (uint256)",
      "function setValue(uint256) nonpayable",
    ];
    const signer = provider.getSigner();
    const contract = new ethers.Contract(address, abi, signer);
    setContract(contract);
  };

  const getValue = async () => {
    const value = await contract.getValue();
    setCurrentValue(value.toString());
  };

  const setValueFunction = async () => {
    await contract.setValue(ethers.BigNumber.from(value));
    await getValue();
  };

  return (
    <div>
      <button onClick={connectWallet}>Connect Wallet</button>
      <button onClick={loadContract}>Load Contract</button>
      <button onClick={getValue}>Get Value</button>
      <input
        type="number"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button onClick={setValueFunction}>Set Value</button>
      <div>Current Value: {currentValue}</div>
    </div>
  );
}

export default App;
