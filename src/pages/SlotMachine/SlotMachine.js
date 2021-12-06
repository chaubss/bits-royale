import { React, useState, useEffect } from 'react'
import './SlotMachine.css'
import { App as SMApp } from './SMApp'
import Web3 from 'web3';


function SlotMachine(props) {
    const [finalIndex1, setfinalIndex1] = useState(0);
    const [finalIndex2, setfinalIndex2] = useState(1);
    const [finalIndex3, setfinalIndex3] = useState(8);
    const [label, setLabel] = useState('Spin! (1 BRC)');

    const spin = async () => {
        if (label != 'Spin! (1 BRC)') {
            return;
        }
        console.log(props.contract)
        setLabel('Waiting for approval...');
        const txApproval = await props.tokenContract.methods.approve(props.smContract.options.address, 1).send({ from: props.connectedAccount });
        console.log(txApproval);
        setLabel('Performing transaction...');
        const tx = await props.smContract.methods.spin().send({ from: props.connectedAccount });
        setLabel('Spinning...');
        props.updateBalance()
        const slotsString = tx.events.Spin.returnValues.slots
        // Get the character array of slotsString
        const slots = slotsString.split('')
        // Convert each element in slots to a number
        const slotsNumbers = slots.map(slot => (parseInt(slot) - 1))
        console.log(slotsNumbers)
        // setfinalIndex1(slotsNumbers[0])
        // setfinalIndex2(slotsNumbers[1])
        // setfinalIndex3(slotsNumbers[2])
        setfinalIndex1(8)
        setfinalIndex2(8)
        setfinalIndex3(8)
        setLabel('Spin! (1 BRC)')
    }

    const callClaim = async () => {
        console.log('Attempting to claim')
        const tx = await props.smContract.methods.claim(props.connectedAccount).send({ from: props.connectedAccount });
        console.log(tx)
        props.updateBalance()
    }

    return (
        <div>
            <SMApp final1={finalIndex1} final2={finalIndex2} final3={finalIndex3} spinFn={spin} callClaim={callClaim} updateBalance={props.updateBalance} label={label} setShowConfetti={props.setShowConfetti} />
        </div >
    )
}

export default SlotMachine
