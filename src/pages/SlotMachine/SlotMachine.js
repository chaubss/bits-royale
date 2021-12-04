import { React, useState, useEffect } from 'react'
import './SlotMachine.css'
import { App as SMApp } from './SMApp'
import Slot from 'react-slot-machine';
import Web3 from 'web3';


function SlotMachine(props) {
    const [finalIndex1, setfinalIndex1] = useState(0);
    const [finalIndex2, setfinalIndex2] = useState(1);
    const [finalIndex3, setfinalIndex3] = useState(8);

    const spin = async () => {
        console.log(props.contract)
        const txApproval = await props.tokenContract.methods.approve(props.smContract.options.address, 1).send({ from: props.connectedAccount });
        console.log(txApproval);
        const tx = await props.smContract.methods.spin().send({ from: props.connectedAccount });
        props.updateBalance()
        const slotsString = tx.events.Spin.returnValues.slots
        // Get the character array of slotsString
        const slots = slotsString.split('')
        // Convert each element in slots to a number
        const slotsNumbers = slots.map(slot => (parseInt(slot) - 1))
        console.log(slotsNumbers)
        setfinalIndex1(slotsNumbers[0]);
        setfinalIndex2(slotsNumbers[1]);
        setfinalIndex3(slotsNumbers[2]);
    }

    const callClaim = async () => {
        const tx = await props.smContract.methods.claim().send({ from: props.connectedAccount });
        alert('You have won 20 BRC!!!')
        console.log(tx)
    }

    return (
        <div>
            <SMApp final1={finalIndex1} final2={finalIndex2} final3={finalIndex3} spinFn={spin} callClaim={callClaim} updateBalance={props.updateBalance} />
        </div >
    )
}

export default SlotMachine
