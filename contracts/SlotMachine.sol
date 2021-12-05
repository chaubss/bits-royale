pragma solidity 0.8.10;

import "./BRC.sol";

//contract that tells if the player is going to win or not with probability 1/36
contract SlotMachine {
    address admin; // The address of the admin
    BitsRoyaleChip public tokenContract; // The contract of the token

    event Spin(uint256 slots);

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
        ) % 10;
        return temp;
    }

    function getOtherNumber(uint256 current) internal returns (uint256 number) {
        if (current != 9) {
            return current;
        } else {
            number = randMod();
            while (number == 9) {
                number = randMod();
            }
            return number;
        }
    }

    // Since direct multiplication can sometimes create unintended results, we use safe multiplication
    function safeMultiply(uint256 x, uint256 y)
        internal
        pure
        returns (uint256 z)
    {
        require(y == 0 || (z = x * y) / y == x);
    }

    function spin() public returns (uint256 slots) {
        require(tokenContract.balanceOf(msg.sender) >= 1, "Not enough chips");
        require(
            tokenContract.transferFrom(msg.sender, address(this), 1),
            "BRC Transaction failed."
        );
        uint256[3] memory slot;
        slot[0] = randMod();
        slot[0] = getOtherNumber(slot[0]);
        slot[1] = randMod();
        slot[1] = getOtherNumber(slot[1]);
        slot[2] = randMod();
        slot[2] = getOtherNumber(slot[2]);
        uint256 slotsRet = safeMultiply(slot[0] + 1, 100) +
            safeMultiply(slot[1] + 1, 10) +
            safeMultiply(slot[2] + 1, 1);
        if (slot[0] == slot[1] && slot[1] == slot[2]) {
            pendingWinners[msg.sender] = 1;
        }
        emit Spin(slotsRet);
        return slotsRet;
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
