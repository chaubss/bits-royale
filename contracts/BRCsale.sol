// Declaring version of solidity that we are using
pragma solidity 0.8.10;

// Importing the chip contract file
import "./BRC.sol";

// Defining the contract
contract BRCSale {
    address admin; // The address of the admin
    BitsRoyaleChip public tokenContract; // The contract of the token
    uint256 public tokenPrice; // Price of the token in wei: 1000000000000000 wei = 0.001 Ether
    uint256 public tokensSold; // Number of tokens sold

    event Sell(address _buyer, uint256 _amount); // Event that is emitted when someone buys tokens

    //event Entry(address _enterer, uint256 _amount); // Event that is emitted when someone enters the casino

    // Constructor of the contract that initializes with the address of the token contract and sets the chip price
    constructor(BitsRoyaleChip _tokenContract, uint256 _tokenPrice) {
        admin = msg.sender; // The admin is the creator of the contract
        tokenContract = _tokenContract; // Set the chip contract
        tokenPrice = _tokenPrice; // Set the chip price
    }

    // Since direct multiplication can sometimes create unintended results, we use safe multiplication
    function safeMultiply(uint256 x, uint256 y)
        internal
        pure
        returns (uint256 z)
    {
        require(y == 0 || (z = x * y) / y == x);
    }

    // Function that sells the chips to the player
    function buyTokens(uint256 _noOfTokens) public payable {
        require(
            msg.value == safeMultiply(_noOfTokens, tokenPrice),
            "Chip price incorrect"
        ); // Check if the price is set correctly
        require(
            tokenContract.balanceOf(address(this)) >= _noOfTokens,
            "Insufficient Balance"
        ); // Check if the contract has enough tokens to sell to the buyer
        require(
            tokenContract.transfer(msg.sender, _noOfTokens),
            "Transaction failed"
        ); // Transfer the tokens to the buyer

        tokensSold += _noOfTokens; // Add the number of tokens sold to the total number of tokens sold

        emit Sell(msg.sender, _noOfTokens); // Emit the event that the buyer bought the tokens
    }

    // Function that allows a user to sell chips  for ETH
    function sellTokens(uint256 _noOfTokens)
        public
        payable
        returns (bool success)
    {
        require(
            tokenContract.balanceOf(msg.sender) >= _noOfTokens,
            "Insufficient wallet balance."
        ); // Check if the user has enough tokens to sell
        require(
            tokenContract.transferFrom(msg.sender, address(this), _noOfTokens),
            "Transfer failed, check approval."
        ); // Transfer the tokens to the contract
        require(
            payable(msg.sender).send(safeMultiply(_noOfTokens, tokenPrice))
        ); // Send the correct amount of ETH to the user
        return true; // Return true if the transaction was successful
    }

    // // Function that allows the person to enter the coffee shop by paying the entry fee
    // function customerEntry(uint256 _noOfTokens) public returns (bool success) {
    //     require(
    //         _noOfTokens >= 1,
    //         "A minimum of 1 RET is required to enter Dexter's Coffee."
    //     ); // The user must have at least 1 RET to enter
    //     require(
    //         tokenContract.balanceOf(msg.sender) >= _noOfTokens,
    //         "Insufficient balance."
    //     ); // Check if the user has enough tokens to enter
    //     require(
    //         tokenContract.transferFrom(msg.sender, address(this), _noOfTokens),
    //         "Transfer Failed."
    //     ); // Transfer the tokens to the contract from the user
    //     emit Entry(msg.sender, _noOfTokens); // Emit the event that the user entered the coffee shop
    //     return true; // Return true if the transaction was successful
    // }

    // Function that allows the admin to end the sale of tokens
    function endSale() public {
        require(msg.sender == admin); // Only the admin can end the sale
        require(
            tokenContract.transfer(
                admin,
                tokenContract.balanceOf(address(this))
            )
        ); // Transfer all the tokens to the admin from the contract
        selfdestruct(payable(msg.sender)); // Destroy the contract
    }
}
