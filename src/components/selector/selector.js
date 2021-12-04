import React, { useState } from 'react'
import './selector.css'

function Selector(props) {
    const [selected, setSelected] = useState(0)
    const getSelectedClassName = (s) => {
        return "selector-item " + (s == selected ? "selected" : "")
    }
    const setSelectedBlackjack = () => {
        setSelected(0)
        props.setSelected(0)
    }
    const setSelectedSlotMachine = () => {
        setSelected(1)
        props.setSelected(1)
    }
    const setSelectedRoulette = () => {
        setSelected(2)
        props.setSelected(2)
    }

    return (
        <div className="selector-container">
            <div className={getSelectedClassName(0)} onClick={setSelectedBlackjack}>
                Blackjack
            </div>
            <div className={getSelectedClassName(1)} onClick={setSelectedSlotMachine}>
                Slot Machine
            </div>
            <div className={getSelectedClassName(2)} onClick={setSelectedRoulette}>
                Roulette
            </div>
        </div>
    )
}

export default Selector
