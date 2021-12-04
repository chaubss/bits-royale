import React from 'react'
import './navbar.css'

function Navbar(props) {
    return (
        <div className="navbar-container">
            <div className="navbar-logo">
                <h2>BITS Royale</h2>
            </div>
            <div className="navbar-tokens">
                <h4>{"Your Balance: " + props.balance + " BRC"}</h4>
                <h4>Connected Account: <span className="blue">{props.connectedAccount == null ? "None" : props.connectedAccount}</span></h4>
            </div>
        </div>
    )
}

export default Navbar
