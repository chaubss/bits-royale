import { React, useState } from 'react'
import './Roulette.css'
import { Wheel } from 'react-custom-roulette'

function Roulette(props) {
    const [mustSpin, setMustSpin] = useState(false)
    const [prizeNumber, setPrizeNumber] = useState(0) // one we get from contract
    const [betNumber, setBetNumber] = useState(0) // the number user bets on

    const wheelNos = {
        0: 0,
        32: 1,
        15: 2,
        19: 3,
        4: 4,
        21: 5,
        2: 6,
        25: 7,
        17: 8,
        34: 9,
        6: 10,
        27: 11,
        13: 12,
        36: 13,
        11: 14,
        30: 15,
        8: 16,
        23: 17,
        10: 18,
        5: 19,
        24: 20,
        16: 21,
        33: 22,
        1: 23,
        20: 24,
        14: 25,
        31: 26,
        9: 27,
        22: 28,
        29: 29,
        18: 30,
        7: 31,
        28: 32,
        12: 33,
        35: 34,
        3: 35,
        26: 36,
    }
    const data = [
        { option: '0', style: { backgroundColor: 'green', textColor: 'white' } },
        { option: '32', style: { backgroundColor: 'brown', textColor: 'white' } },
        { option: '15', style: { backgroundColor: 'black', textColor: 'white' } },
        { option: '19', style: { backgroundColor: 'brown', textColor: 'white' } },
        { option: '4', style: { backgroundColor: 'black', textColor: 'white' } },
        { option: '21', style: { backgroundColor: 'brown', textColor: 'white' } },
        { option: '2', style: { backgroundColor: 'black', textColor: 'white' } },
        { option: '25', style: { backgroundColor: 'brown', textColor: 'white' } },
        { option: '17', style: { backgroundColor: 'black', textColor: 'white' } },
        { option: '34', style: { backgroundColor: 'brown', textColor: 'white' } },
        { option: '6', style: { backgroundColor: 'black', textColor: 'white' } },
        { option: '27', style: { backgroundColor: 'brown', textColor: 'white' } },
        { option: '13', style: { backgroundColor: 'black', textColor: 'white' } },
        { option: '36', style: { backgroundColor: 'brown', textColor: 'white' } },
        { option: '11', style: { backgroundColor: 'black', textColor: 'white' } },
        { option: '30', style: { backgroundColor: 'brown', textColor: 'white' } },
        { option: '8', style: { backgroundColor: 'black', textColor: 'white' } },
        { option: '23', style: { backgroundColor: 'brown', textColor: 'white' } },
        { option: '10', style: { backgroundColor: 'black', textColor: 'white' } },
        { option: '5', style: { backgroundColor: 'brown', textColor: 'white' } },
        { option: '24', style: { backgroundColor: 'black', textColor: 'white' } },
        { option: '16', style: { backgroundColor: 'brown', textColor: 'white' } },
        { option: '33', style: { backgroundColor: 'black', textColor: 'white' } },
        { option: '1', style: { backgroundColor: 'brown', textColor: 'white' } },
        { option: '20', style: { backgroundColor: 'black', textColor: 'white' } },
        { option: '14', style: { backgroundColor: 'brown', textColor: 'white' } },
        { option: '31', style: { backgroundColor: 'black', textColor: 'white' } },
        { option: '9', style: { backgroundColor: 'brown', textColor: 'white' } },
        { option: '22', style: { backgroundColor: 'black', textColor: 'white' } },
        { option: '29', style: { backgroundColor: 'brown', textColor: 'white' } },
        { option: '18', style: { backgroundColor: 'black', textColor: 'white' } },
        { option: '7', style: { backgroundColor: 'brown', textColor: 'white' } },
        { option: '28', style: { backgroundColor: 'black', textColor: 'white' } },
        { option: '12', style: { backgroundColor: 'brown', textColor: 'white' } },
        { option: '35', style: { backgroundColor: 'black', textColor: 'white' } },
        { option: '3', style: { backgroundColor: 'brown', textColor: 'white' } },
        { option: '26', style: { backgroundColor: 'black', textColor: 'white' } },
    ]

    const updateBetNumber = (e) => {
        setBetNumber(e.target.value)
    }

    const spin = async (e) => {
        e.preventDefault()
        if (betNumber < 0 || betNumber > 36) {
            alert('Please enter a valid number')
            return
        }
        const txApproval = await props.tokenContract.methods.approve(props.rouletteContract.options.address, 1).send({ from: props.connectedAccount })
        console.log(txApproval)
        const tx = await props.rouletteContract.methods.spin(betNumber).send({ from: props.connectedAccount })
        console.log(tx)
        props.updateBalance()
        const target = tx.events.Spin.returnValues.slot
        console.log(target)
        setPrizeNumber(wheelNos[target])
        // setPrizeNumber(wheelNos[betNumber])
        setMustSpin(true)
    }

    const claim = async () => {
        console.log('Attempting to claim')
        const tx = await props.rouletteContract.methods.claim(props.connectedAccount).send({ from: props.connectedAccount });
        console.log(tx)
        props.updateBalance()
    }

    return (
        <div className="main-roulette-container">
            <div className="roulette-wheel">
                <div >
                    <Wheel
                        mustStartSpinning={mustSpin}
                        prizeNumber={prizeNumber}
                        data={data}
                        outerBorderColor={'#000'}
                        outerBorderWidth={15}
                        innerRadius={35}
                        innerBorderColor={'#000'}
                        innerBorderWidth={25}
                        radiusLineColor={'#ea0'}
                        radiusLineWidth={2}
                        textDistance={75}
                        onStopSpinning={() => {
                            setMustSpin(false)
                            if (prizeNumber === betNumber) {
                                props.setShowConfetti(true)
                                alert('You won 20 BRC!')
                                claim()
                            } else {
                                alert('You lost!')
                            }
                        }
                        }
                    />
                </div>
                <div className="bet-container">
                    <div className="bet-container-inner">
                        Place your bet (0...36):
                        <input className="bet-input-roulette" name="betNumber" value={betNumber} onChange={updateBetNumber}></input>
                    </div>
                </div>
            </div>
            <div className="spin-button-container">
                <button className="spin-button-roulette" onClick={spin}>Spin! (1 BRC)</button>
            </div>




        </div>
    )
}

export default Roulette
