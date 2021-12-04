// Declaring version of solidity that we are using
pragma solidity 0.8.10;

// Defining the contract
contract BitsRoyaleChip {
    string public name = "Bits Royale Chip"; // Name of the token
    string public symbol = "BRC"; // Symbol of the token
    string public standard = "Bits Royale Chip v1.0"; // Standard of the token
    uint256 public totalSupply; // Total supply of the token

    event Transfer(address indexed _from, address indexed _to, uint256 _value); // Event for when a transfer is made

    event Approval(
        address indexed _owner,
        address indexed _spender,
        uint256 _value
    ); // Event for when a user approves a spender

    mapping(address => uint256) public balanceOf; // Mapping of address to balance
    mapping(address => mapping(address => uint256)) public allowance; // Mapping of address to mapping of address to allowance, stores the allowance of a user to spend tokens on behalf of another user

    // Constructor for the token contract that sets the total supply
    constructor(uint256 _initialSupply) {
        totalSupply = _initialSupply; // Setting the total supply
        balanceOf[msg.sender] = _initialSupply; // Setting the balance of the creator to the total supply
    }

    // Function to transfer tokens to an address (done by msg.sender)
    function transfer(address _to, uint256 _value)
        public
        returns (bool success)
    {
        require(balanceOf[msg.sender] >= _value); // Ensuring the sender has enough tokens to transfer
        balanceOf[msg.sender] -= _value; // Subtracting the value from the sender's balance
        balanceOf[_to] += _value; // Adding the value to the receiver's balance

        emit Transfer(msg.sender, _to, _value); // Emitting the transfer event with the sender, receiver, and value

        return true; // Returning true to indicate the transfer was successful
    }

    // Function to let a user approve a spender to spend a certain amount of tokens on their behalf
    function approve(address _spender, uint256 _value)
        public
        returns (bool success)
    {
        allowance[msg.sender][_spender] = _value; // Setting the allowance of another spender to spend on behalf of msg.sender

        emit Approval(msg.sender, _spender, _value); // Emitting the approval event with the sender, spender, and value

        return true; // Returning true to indicate the approval was successful
    }

    // Function to let a user spend a certain amount of tokens on behalf of another user
    function transferFrom(
        address _from,
        address _to,
        uint256 _value
    ) public returns (bool success) {
        require(balanceOf[_from] >= _value); // Ensuring the sender has enough tokens to transfer
        require(_value <= allowance[_from][msg.sender]); // Ensuring the the spender has been authorized to spend the tokens on behalf of the user

        balanceOf[_from] -= _value; // Subtracting the value from the sender's balance
        balanceOf[_to] += _value; // Adding the value to the receiver's balance

        allowance[_from][msg.sender] -= _value; // Subtracting the value from the allowance of the spender to spend on behalf of the user

        emit Transfer(_from, _to, _value); // Emitting the transfer event with the sender, receiver, and value

        return true; // Returning true to indicate the transfer was successful
    }
}
