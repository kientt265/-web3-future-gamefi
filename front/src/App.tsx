import { createWeb3Modal, defaultConfig,  useWeb3ModalAccount, useWeb3ModalProvider } from "@web3modal/ethers/react";
import { BrowserProvider, Contract, ethers, parseEther} from 'ethers'
import PriceTracker from "./components/PriceTracker.tsx"
import { shortenAddress } from './lib/utils'
import { useWeb3Modal } from '@web3modal/ethers/react'
import {contractABI, contractAdr} from "./contract/contractData.tsx"
import { useState, useEffect } from "react";

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
  const [isLoading, setIsLoading] = useState(false);
  const { walletProvider } = useWeb3ModalProvider();
  const [currentTurn, setCurrentTurn] = useState<number | null>(null);
  const [inputValue, setInputValue] = useState<string>("");
  useEffect(() => {
    const intervalId = setInterval(() => {
      getCurrentTurn();
      console.log("This is call function")
    }, 10000); // 10 seconds

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, [walletProvider]);
  
  const getCurrentTurn = async () => {
    setIsLoading(true);
    if (walletProvider) {
      try {
        const browserProvider = new BrowserProvider(walletProvider);
        const signerProvider = await browserProvider.getSigner();
        const contract = new Contract(contractAdr, contractABI, signerProvider);
        
        const turn = await contract.currentTurn();
        // console.log("Current Turn:", turn.toString());
        console.log("Type of Current Turn:", typeof turn);
        setCurrentTurn(Number(turn));

      } catch (error) {
        
      } finally {
        setIsLoading(false);
      }
    }
  }

  const winnerGetMoney = async () => {
    setIsLoading(true);
    if (walletProvider) {
      try {
        const browserProvider = new BrowserProvider(walletProvider);
        const signerProvider = await browserProvider.getSigner();
        const contract = new Contract(contractAdr, contractABI, signerProvider);
        
        await contract.getMoneyWinner();

      } catch (error) {
        console.error("Error confirming deal:", error);
        alert("Error confirming deal, please try again!");
      } finally {
        setIsLoading(false);
      }
    }
  }

  const joinGame = async (input: number) => {

    const totalPrice = parseFloat(inputValue); // Tính toán giá trị tổng
    setIsLoading(true);
    if (walletProvider) {
      try {
        const browserProvider = new BrowserProvider(walletProvider);
        const signerProvider = await browserProvider.getSigner();
        const contract = new Contract(contractAdr, contractABI, signerProvider);
        
        await contract.joinGame(input, { value: parseEther(totalPrice.toString()) });

      } catch (error) {
        console.error("Error confirming deal:", error);
        alert("Error confirming deal, please try again!");
      } finally {
        setIsLoading(false);
      }
    }
  }

  const returnResult = async (turnNumber: number, result: number ) => {
    setIsLoading(true);
    if (walletProvider) {
      try {
        const provider = new ethers.JsonRpcProvider(import.meta.env.VITE_SEPOLIA_RPC_URL)
        const signer = new ethers.Wallet(import.meta.env.VITE_PRIVATE_KEY_ADMIN, provider);
        const contract = new Contract(contractAdr, contractABI, signer);

        
        await contract.resultFuture(turnNumber, result);

      } catch (error) {
        console.error("Lỗi của admin", error);

      } finally {
        setIsLoading(false);
      }
    }
    
  }

  return (
    <div>
      {isLoading && <div>Processing...</div>}
      <header className="mx-auto px-2 p-4 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">Future</h1>
                {(
              <span className="text-sm text-gray-600">
                Current Turn: <span className="font-bold">{currentTurn}</span>
              </span>
            )}
              </div>
              <div className="flex gap-4">
                
                
                <button
                  onClick={winnerGetMoney}
                  className="bg-blue-900 text-white py-2 px-3 rounded-lg hover:bg-slate-800 transition-colors">
                  GetMoneyWin
                </button>
                <div className="">
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
                <input 
                  type="text" 
                  value={inputValue} 
                  onChange={(e) => setInputValue(e.target.value)}
                  className="border rounded-lg p-2"
                  placeholder="Nhập giá trị"
                />
                </div>
                <button 
                  onClick={() => open()} 
                  className="bg-slate-900 text-white py-2 px-3 rounded-lg hover:bg-slate-800 transition-colors"
                >
                  {isConnected ? `${shortenAddress(address)}` : "Connect Wallet"}
                </button>
              </div>
            </div>
          </header>
      <PriceTracker returnResult={returnResult} currentTurn={currentTurn}/>
    </div>
  )
}

export default App
