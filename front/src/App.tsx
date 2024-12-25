import { createWeb3Modal, defaultConfig,  useWeb3ModalAccount, useWeb3ModalProvider } from "@web3modal/ethers/react";
import { BrowserProvider, Contract, formatEther, parseEther} from 'ethers'
import PriceTracker from "./components/PriceTracker.tsx"
import { shortenAddress } from './lib/utils'
import { useWeb3Modal } from '@web3modal/ethers/react'
import {contractABI, contractAdr} from "./contract/contractData.tsx"

const projectId = import.meta.env.VITE_PROJECT_ID;

const sepolia = {
  chainId: 11155111,
  name: "Sepolia",
  currency: "ETH",
  explorerUrl: "https://sepolia.etherscan.io/",
  rpcUrl: import.meta.env.VITE_SEPOLIA_RPC_URL,
};


const metadata = {
  name: "Crowfunding",
  description: "Website help people donation for me",
  url: "https://mywebsite.com", // custom your domain here
  icons: ["https://avatars.mywebsite.com/"], //custom your logo here
};

const ethersConfig = defaultConfig({
  metadata,
  enableEIP6963: true,
  enableInjected: true,
  enableCoinbase: true,
});

createWeb3Modal({
  ethersConfig,
  chains: [sepolia],
  projectId,
  enableAnalytics: true,
});
function App() {
  const { address, isConnected } = useWeb3ModalAccount();
  const { open } = useWeb3Modal();
  const { walletProvider } = useWeb3ModalProvider();
  const joinGame = async (input: number) => {
    if(walletProvider) {
      try {
        const browserProvider = new BrowserProvider(walletProvider);
        const signerProvider = browserProvider.getSigner();
        const contract = new Contract(contractAdr, contractABI, await signerProvider);
        const transaction = await contract.joinGame(input);
        await transaction.wait();
      } catch (error) {
        console.error("Error confirming deal:", error);
        alert("Error confirming deal, please try again!");
      }
    }
  }
  const returnResult = async(input: number) => {
    if(walletProvider) {
      try {
        const signerProvider = (import.meta.env.VITE_PROJECT_ID).getSigner();
        const contract = new Contract(contractAdr, contractABI, await signerProvider);
        const transaction = await contract.resultFuture(input);
        await transaction.wait();
      } catch (error) {
        console.error("Error confirming deal:", error);
        alert("Error confirming deal, please try again!");
      }
    }

  }
  return (
    <div>
      <header className="mx-auto px-2 p-4 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">Future</h1>
              </div>
              <div className="flex gap-4">
              <button
                onClick={() => joinGame(1)}
                className="bg-green-900 text-white py-2 px-3 rounded-lg hover:bg-slate-800 transition-colors">
                MOON
              </button>
              <button
                onClick={() => joinGame(0)}
                className="bg-red-900 text-white py-2 px-3 rounded-lg hover:bg-slate-800 transition-colors"
              >
                DOOM
              </button>
                <button 
                  onClick={() => open()} 
                  className="bg-slate-900 text-white py-2 px-3 rounded-lg hover:bg-slate-800 transition-colors"
                >
                  {isConnected ? `${shortenAddress(address)}` : "Connect Wallet"}
                </button>
              </div>
            </div>
          </header>
      <PriceTracker/>
    </div>
  )
}

export default App
