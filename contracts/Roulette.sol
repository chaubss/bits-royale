pragma solidity 0.8.10;

import "./BRC.sol";

//contract that tells if the player is going to win or not with probability 1/36
contract Roulette {
    address admin; // The address of the admin
    BitsRoyaleChip public tokenContract; // The contract of the token

    event Spin(uint256 slot);

    mapping(address => uint256) pendingWinners;

    constructor(BitsRoyaleChip _tokenContract) {
        admin = msg.sender; // The admin is the creator of the contract
        tokenContract = _tokenContract; // Set the chip contract
    }

    uint256 randNonce = 0;

    // Defining a function to generate a random number
    function randMod() internal returns (uint256) {
        // increase nonce
        randNonce++;
        uint256 temp = uint256(
            keccak256(abi.encodePacked(block.timestamp, msg.sender, randNonce))
        ) % 37;
        return temp;
    }

    function spin(uint256 _number) public returns (uint256 slot) {
        require(tokenContract.balanceOf(msg.sender) >= 1, "Not enough chips");
        require(
            tokenContract.transferFrom(msg.sender, address(this), 1),
            "BRC Transaction failed."
        );
        uint256 slotRet;
        slotRet = randMod();
        if (_number == slotRet) {
            pendingWinners[msg.sender] = 1;
        }
        emit Spin(slotRet);
        return slotRet;
    }

    function claim(address _winner) public payable returns (bool success) {
        require(pendingWinners[msg.sender] != 1, "Nothing to claim.");
        require(
            tokenContract.transferFrom(address(this), _winner, 20),
            "Transfer failed"
        );
        pendingWinners[msg.sender] = 0;
        return true;
    }
}
