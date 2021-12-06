import React from 'react'
import './SMApp.css'
const rootElement = document.getElementById('root')


const TOTAL = 9
function WinningSound() {
    return (
        <audio autoPlay="autoplay" className="player" preload="false">
            <source src="https://andyhoffman.codes/random-assets/img/slots/winning_slot.wav" />

        </audio>
    );
}

export class App extends React.Component {
    constructor(props) {
        super(props);
        this.winCount = 0
        this.lossCount = 0
        this.winningSound = null
        this.state = {
            winner: null
        }
        this.finishHandler = this.finishHandler.bind(this)
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick = async () => {
        await this.props.spinFn()
        this.setState({ winner: null });
        this.emptyArray();
        this._child1.forceUpdateHandler();
        this._child2.forceUpdateHandler();
        this._child3.forceUpdateHandler();
    }



    static matches = [];

    delay = (time) => {
        return new Promise(resolve => setTimeout(resolve, time));
    }


    finishHandler(value) {
        console.log('asdfasdf')
        var winningSound = null

        if (this.props.final1 == this.props.final2 && this.props.final2 == this.props.final3) {
            const { winner } = this.state;
            const first = App.matches[0];
            let results = App.matches.every(match => match === first)
            this.setState({ winner: results });
            this.winCount += 1;
            if (this.winCount == 3) {

                this.winCount = 0
                this.delay(1000).then(() => {
                    this.props.setShowConfetti(true)
                    alert('You have won 20 BRC!!!')
                    this.props.callClaim()
                    this.props.updateBalance()
                })
            }
        } else {
            this.lossCount += 1;
            if (this.lossCount == 3) {
                this.delay(1000).then(() => {
                    this.lossCount = 0
                    if (this.props.final1 != 0 || this.props.final2 != 1 || this.props.final3 != 8) {
                        alert('You lost!')
                    }
                });
            }
        }
    }

    emptyArray() {
        App.matches = [];
    }

    render() {
        const { winner } = this.state;

        // if (winner) {
        //     this.winCount += 1;
        //     if (this.winCount == 4) {
        //         // winningSound = <WinningSound />
        //         this.winCount = 0
        //         this.props.callClaim()
        //         this.props.updateBalance()
        //     }

        // }

        return (
            <div>
                {this.winningSound}

                <div className="spinner-container">
                    <Spinner onFinish={this.finishHandler} final={this.props.final1} ref={(child) => { this._child1 = child; }} timer="1000" />
                    <Spinner onFinish={this.finishHandler} final={this.props.final2} ref={(child) => { this._child2 = child; }} timer="1400" />
                    <Spinner onFinish={this.finishHandler} final={this.props.final3} ref={(child) => { this._child3 = child; }} timer="2200" />
                    <div className="gradient-fade"></div>
                </div>
                <button className="spin-again-button" onClick={this.handleClick}>{this.props.label}</button>
            </div>
        );
    }
}

class Spinner extends React.Component {
    constructor(props) {
        super(props);
        this.forceUpdateHandler = this.forceUpdateHandler.bind(this);
    };

    forceUpdateHandler() {
        this.reset();
    };

    reset() {
        if (this.timer) {
            clearInterval(this.timer);
        }

        this.start = this.setStartPosition();

        this.setState({
            position: this.start,
            timeRemaining: this.props.timer
        });

        this.timer = setInterval(() => {
            this.tick()
        }, 100);
    }

    state = {
        position: 0,
        lastPosition: null
    }
    static iconHeight = 188;


    start = this.setStartPosition();
    speed = 1 * Spinner.iconHeight;

    setStartPosition() {
        var rand = -1;
        if (this.props.timer == "1000") {
            rand = this.props.final + 7;
        } else if (this.props.timer == "1400") {
            rand = this.props.final + 3;
        } else {
            rand = this.props.final + 4;
        }
        console.log(rand)
        return rand * Spinner.iconHeight * -1;
        // get the start position from the value we need to obtain given in props
        console.log('Setting start position', this.props)
        return -1 * Spinner.iconHeight
    }

    moveBackground() {
        this.setState({
            position: this.state.position - this.speed,
            timeRemaining: this.state.timeRemaining - 100
        })
    }

    getSymbolFromPosition() {
        let { position } = this.state;
        const totalSymbols = TOTAL;
        const maxPosition = (Spinner.iconHeight * (totalSymbols - 1) * -1);
        let moved = (this.props.timer / 100)
        let startPosition = this.start;
        let currentPosition = startPosition;

        for (let i = 0; i < moved; i++) {
            currentPosition -= Spinner.iconHeight;

            if (currentPosition < maxPosition) {
                currentPosition = 0;
            }
        }

        this.props.onFinish(currentPosition);
    }

    tick() {
        if (this.state.timeRemaining <= 0) {
            clearInterval(this.timer);
            this.getSymbolFromPosition();

        } else {
            this.moveBackground();
        }
    }

    componentDidMount() {
        clearInterval(this.timer);

        this.setState({
            position: this.start,
            timeRemaining: this.props.timer
        });

        this.timer = setInterval(() => {
            this.tick()
        }, 100);
    }

    render() {
        let { position, current } = this.state;

        return (
            <div
                style={{ backgroundPosition: '0px ' + position + 'px' }}
                className={`icons`}
            />
        )
    }
}
