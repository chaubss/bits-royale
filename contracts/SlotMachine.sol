pragma solidity 0.8.10;

//contract that tells if the player is going to win or not with probability 1/36
contract SlotMachine {
    uint256[3] slot;
    uint256 coin;

    event Jackpot();

    uint256 randNonce = 0;

    uint256 modulus = 100000;

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

    function spin() public returns (uint256 slot) {
        slot = randMod();
        slot = getOtherNumber(slot);
    }

    function claim() public {}
}
