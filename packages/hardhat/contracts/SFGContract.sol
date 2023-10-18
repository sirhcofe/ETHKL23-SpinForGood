//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

// Use openzeppelin to inherit battle-tested implementations (ERC20, ERC721, etc)
// import "@openzeppelin/contracts/access/Ownable.sol";

contract SFGContract {
	uint256 public prizePool;
	uint256 public donationPool;
	address public lastNPOWinner;
	address public lastUserWinner;
	address public immutable owner;

	struct Donation {
		address user;
		string name;
		uint256 amount;
		uint256 timestamp;
	}

	struct NPO {
		address payable addr;
		string name;
	}

	Donation[] public donations;
	NPO[] public registeredNPOs;

	constructor(address _owner) {
		owner = _owner;
		prizePool = 0;
		donationPool = 0;
		lastNPOWinner = owner;
		lastUserWinner = owner;
	}

	function strEqual(string memory str1, string memory str2) private pure returns (bool) {
		// check if two strings are equal by comparing there hash
		return keccak256(abi.encodePacked((str1))) == keccak256(abi.encodePacked((str2)));
	}

	function combineNames(
		string memory a,
		string memory b,
		string memory separator
	) private pure returns (string memory) {
		bytes memory byteArr1 = bytes(a);
		bytes memory byteArr2 = bytes(b);
		bytes memory separatorBytes = bytes(separator);
		uint totalLength = byteArr1.length + byteArr2.length + separatorBytes.length;

		bytes memory result = new bytes(totalLength);
        // Loop through the first input string and copy its bytes to the result array
        uint i;
        uint j = 0;
        for (i = 0; i < byteArr1.length; i++) {
            result[j++] = byteArr1[i];
        }

		// Insert the separator string into the result byte array
		for (i = 0; i < separatorBytes.length; i++) {
			result[j++] = separatorBytes[i];
		}

        // Loop through the second input string and copy its bytes to the result array
        for (i = 0; i < byteArr2.length; i++) {
            result[j++] = byteArr2[i];
        }

        // Convert the result byte array back to a string and return it
        return string(result);
	}

	function addDonationRecord(string memory _name) private {
		uint i = 0;
		for (; i < donations.length; i++) {
			if (donations[i].user == msg.sender) {
				break;
			}
		}

		// donator exists
		if (i != donations.length) {
			donations[i].amount += msg.value;
			donations[i].timestamp = block.timestamp;

			// if prev donation name was anonymous
			if (bytes(donations[i].name).length == 0 || strEqual(donations[i].name, "Anonymous")) {
				donations[i].name = _name;
			} else if (!strEqual(_name, "Anonymous")) {
				donations[i].name = combineNames(donations[i].name, _name, "/");
			}
		} else {
			// if first donation then just push a new donation record
			donations.push(Donation(msg.sender, _name, msg.value, block.timestamp));
		}
	}

	function donate(string memory _name) external payable {
		uint donationPoolInc = (msg.value * 75) / 100;
		donationPool += donationPoolInc;
		prizePool += msg.value - donationPoolInc;
		addDonationRecord(_name);
	}

	function registerNPO(
		address payable _npoAddr,
		string memory name
	) external {
		for (uint256 i = 0; i < registeredNPOs.length; i++) {
			require(
				registeredNPOs[i].addr != _npoAddr,
				"NPO already registered."
			);
		}
		registeredNPOs.push(NPO(_npoAddr, name));
	}

	function endOfDuration() external {
		require(registeredNPOs.length > 0, "No registered NPOs.");

		// get random NPO winner
		uint256 NPOwinnerIndex = getRandomWinnerIndex(registeredNPOs.length);
		lastNPOWinner = registeredNPOs[NPOwinnerIndex].addr;

		// transfer to winningNPO
		uint256 donationSplit = donationPool / 2;
		uint256 donationRoulette = donationPool - donationSplit;
		(bool NPOSent, ) = lastNPOWinner.call{ value: donationRoulette }("");
		require(NPOSent, "Transfer failed.");

		// transfer to all NPOs the average
		uint256 donationPerUser = donationSplit / registeredNPOs.length;
		for (uint256 i = 0; i < registeredNPOs.length; i++) {
			registeredNPOs[i].addr.transfer(donationPerUser);
		}

		// get random User winner
		uint256 userWinnerIndex = getRandomWinnerIndex(donations.length);
		lastUserWinner = donations[userWinnerIndex].user;

		// transfer to winningUser
		uint256 userWinAmount = (prizePool * 75) / 100;
		(bool UserSent, ) = lastUserWinner.call{ value: userWinAmount }("");
		require(UserSent, "Transfer failed.");

		// reset pools
		prizePool -= userWinAmount;
		donationPool = 0;
	}

	function getContractBalance() external view returns (uint256) {
		return address(this).balance;
	}

	function getListOfDonors() external view returns (Donation[] memory) {
		return donations;
	}

	function getListOfNPOs() external view returns (NPO[] memory) {
		return registeredNPOs;
	}

	function getPrizePool() external view returns (uint256) {
		return prizePool;
	}

	function getDonationPool() external view returns (uint256) {
		return donationPool;
	}

	function getRandomWinnerIndex(
		uint numCandidates
	) internal view returns (uint) {
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
