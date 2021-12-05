import React, { useEffect, useState } from 'react'
import './selector.css'
import Web3 from 'web3';

function Selector(props) {
    const [selected, setSelected] = useState(0)
    const [amount, setAmount] = useState(0)
    const getSelectedClassName = (s) => {
        return "selector-item " + (s == selected ? "selected" : "")
    }
    const setSelectedSlotMachine = () => {
        setSelected(0)
        props.setSelected(0)
    }
    const setSelectedRoulette = () => {
        setSelected(1)
        props.setSelected(1)
    }

    const buy = async (e) => {
        e.preventDefault()
        console.log(amount)
        const val = 1000000000000000 * amount
        console.log(amount)
        const tx = await props.saleContract.methods.buyTokens(amount.toString()).send({ from: props.connectedAccount, value: val })
        console.log(tx)
        props.updateBalance()
    }

    const sell = async (e) => {
        e.preventDefault()
        const txApproval = await props.contract.methods.approve(props.saleContract.options.address, amount).send({ from: props.connectedAccount })
        const val = 1000000000000000 * amount
        const tx = await props.saleContract.methods.sellTokens(amount).send({ from: props.connectedAccount })
        console.log(tx)
        props.updateBalance()
    }

    const changeAmount = (e) => {
        setAmount(e.target.value)
    }

    return (
        <div className="selector-main-container">
            <div className="selector-container">
                <div className={getSelectedClassName(0)} onClick={setSelectedSlotMachine}>
                    Slot Machine
                </div>
                <div className={getSelectedClassName(1)} onClick={setSelectedRoulette}>
                    Roulette
                </div>
            </div>
            <div className="buynsell-container">
                <input className="buynsell-input" name="amount" value={amount} onChange={changeAmount}></input>
                <button className="buynsell-button" onClick={buy}>Buy</button>
                <button className="buynsell-button" onClick={sell}>Sell</button>
            </div>
        </div>
    )
}

export default Selector
