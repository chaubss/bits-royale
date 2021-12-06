import React from 'react'
import logo from '../../resources/logo.png'
import open from '../../resources/open.png'
import './navbar.css'

function Navbar(props) {
    return (
        <div className="navbar-container">
            <div className="navbar-logo">
                <img src={logo} className="bits-royale-image" />
                <div>
                    <h2>BITS Royale</h2>
                    <img src={open} className="bits-royale-open-image" />
                </div>

            </div>
            <div className="navbar-tokens">
                <h4>{"Your Balance: " + props.balance + " BRC"}</h4>
                <h4>Connected Account: <span className="blue">{props.connectedAccount == null ? "None" : props.connectedAccount}</span></h4>
            </div>
        </div>
    )
}

export default Navbar
