import react, { useState, useEffect } from "react";
import './App.css';
import Navbar from './components/navbar/navbar';
import Selector from './components/selector/selector';
import Roulette from "./pages/Roulette/Roulette";
import SlotMachine from "./pages/SlotMachine/SlotMachine";
import Blackjack from "./pages/Blackjack/Blackjack";
import { brcContractAbi, brcSaleContractAbi, slotMachineContractAbi, brcContractAddress, brcSaleContractAddress, slotMachineContractAddress } from './pages/SlotMachine/Web3ABI'
import Web3 from 'web3';

function App() {
  const [selected, setSelected] = useState(0)
  const [connectedAccount, setConnectedAccount] = useState(null)
  const [balance, setBalance] = useState(0)
  const [brcContract, setBrcContract] = useState(null)
  const [brcSaleContract, setBrcSaleContract] = useState(null)
  const [slotMachineContract, setSlotMachineContract] = useState(null)

  useEffect(() => {
    initWeb3()
  }, [])

  useEffect(() => {
    if (connectedAccount == null) {
      setBalance(0)
    }
    if (connectedAccount != null && brcContract != null && brcSaleContract != null) {
      getBRCBalance()
    }
  }, [connectedAccount, brcContract, brcSaleContract, slotMachineContract])

  const initWeb3 = async () => {
    try {
      let provider = window.ethereum
      if (typeof provider === 'undefined') {
        alert('Please install the MetaMask extension to buy and sell BRC using ETH.')
        return
      }
      const accounts = await provider.request({ method: 'eth_requestAccounts' })
      setConnectedAccount(accounts[0])
      provider.on('accountsChanged', (accounts) => {
        setConnectedAccount(accounts[0])
      })

      const web3 = new Web3(provider)
      setBrcContract(new web3.eth.Contract(
        brcContractAbi,
        brcContractAddress
      ))
      setBrcSaleContract(new web3.eth.Contract(
        brcSaleContractAbi,
        brcSaleContractAddress
      ))
      setSlotMachineContract(new web3.eth.Contract(
        slotMachineContractAbi,
        slotMachineContractAddress
      ))

    } catch (error) {
      console.log(error)
    }
  }

  const getBRCBalance = async () => {
    brcContract.methods.balanceOf(connectedAccount).call()
      .then(balance => {
        setBalance(balance)
      })
      .catch(error => {
        console.log(error)
      })
  }

  return (
    <div className="App">
      <Navbar connectedAccount={connectedAccount} balance={balance} />
      <Selector setSelected={setSelected} />
      {selected == 0 ? <Blackjack /> : selected == 1 ? <SlotMachine tokenContract={brcContract} smContract={slotMachineContract} connectedAccount={connectedAccount} updateBalance={getBRCBalance} /> : <Roulette />}
    </div>
  );
}

export default App;
