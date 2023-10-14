//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

// Useful for debugging. Remove when deploying to a live network.
import "hardhat/console.sol";

// Use openzeppelin to inherit battle-tested implementations (ERC20, ERC721, etc)
// import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * A smart contract that allows changing a state variable of the contract and tracking the changes
 * It also allows the owner to withdraw the Ether in the contract
 * @author BuidlGuidl
 */
contract YourContract {
    uint256 public prizePool;
    uint256 public donationPool;
    address public lastWinner;
    address public immutable owner;

    struct Donation {
        address user;
        uint256 amount;
        uint256 timestamp;
    }

    Donation[] public donations;
    address[] public registeredNPOs;

    constructor(address _owner) {
        owner = _owner;
        prizePool = 0;
        donationPool = 0;
    }

    function donate() external payable {
		uint donationPoolInc = (msg.value * 75) / 100;
        donationPool += donationPoolInc;
        prizePool += msg.value - donationPoolInc;
        donations.push(Donation(msg.sender, msg.value, block.timestamp));
    }

    function registerNPO(address _npoAddr) external {
        registeredNPOs.push(_npoAddr);
    }

    function endOfDuration() external payable {
        require(registeredNPOs.length > 0, "No registered NPOs.");

        uint256 donationSplit = donationPool / 2;
        uint256 donationPerUser = donationSplit / registeredNPOs.length;
        uint256 donationRoulette = donationPool - donationSplit;
        // uint256 winnerIndex = getRandomWinnerIndex(donations.length);
        uint256 NPOwinnerIndex = getRandomWinnerIndex(registeredNPOs.length);
        lastWinner = registeredNPOs[NPOwinnerIndex];

        prizePool -= (prizePool * 75) / 100;
        donationPool = 0;

        // address winningNPO = registeredNPOs[random() % registeredNPOs.length];
        address winningNPO = registeredNPOs[NPOwinnerIndex];

		// transfer to winningNPO
		payable(winningNPO).transfer(donationRoulette);

		// transfer to all NPOs the average
		for (uint256 i = 0; i < registeredNPOs.length; i++) {
            payable(registeredNPOs[i]).transfer(donationPerUser);
        }
    }

    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }

	function getRandomWinnerIndex(uint numCandidates) internal view returns(uint) {
		return
            uint(
                keccak256(
                    abi.encodePacked(
                        block.timestamp,
                        block.difficulty,
                        msg.sender
                    )
                )
            ) % numCandidates;
	}
}

