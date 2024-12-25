// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

contract FutureFund {
    address public owner;

    struct Player {
        uint8 choice; 
        uint256 amount;
    }

    mapping(address => Player) public players; 
    mapping(address => bool) public winners; 
    mapping (address => uint256) public moneyOfWiners; 
    address[] public participants; 
    uint256 public totalAmount; 
    uint256 public currentTurn; 

    event LogSent(address indexed recipient, uint256 amount, bool success); 
    event PlayerJoined(address indexed player, uint8 choice, uint256 amount);
    event WinnerDeclared(address indexed player);

    constructor() {
        owner = msg.sender; 
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action");
        _;
    }

    function joinGame(uint8 _choice) public payable {
        require(_choice == 0 || _choice == 1, "Choice must be 0 (decrease) or 1 (increase)");
        require(msg.value > 0, "Must send some ether");
        require(players[msg.sender].amount == 0, "Player already joined this turn");

        players[msg.sender] = Player(_choice, msg.value);
        participants.push(msg.sender); 
        totalAmount += msg.value;

        emit PlayerJoined(msg.sender, _choice, msg.value); 
    }

    function resultFuture(uint256 _turnNumber, uint8 _result) public onlyOwner {
        require(_turnNumber == currentTurn, "Invalid turn number");
        require(_result == 0 || _result == 1, "Result must be 0 (decrease) or 1 (increase)");

        for (uint256 i = 0; i < participants.length; i++) {
            address playerAddress = participants[i];
            if (players[playerAddress].choice == _result) {
                winners[playerAddress] = true;
                moneyOfWiners[playerAddress] = players[playerAddress].amount * 2;
                emit WinnerDeclared(playerAddress); 
            }
        }


        for (uint256 i = 0; i < participants.length; i++) {
            delete players[participants[i]];
        }
        delete participants;

        currentTurn++; 
    }

    function getMoneyWinner() public {
    require(winners[msg.sender], "You are not a winner");

    uint256 prize = moneyOfWiners[msg.sender];
    require(address(this).balance >= prize, "Not enough funds in the contract");

   
    winners[msg.sender] = false;
    totalAmount -= players[msg.sender].amount; 
    delete players[msg.sender];

    (bool sent, ) = msg.sender.call{value: prize}("");
    require(sent, "Failed to send Ether");

    emit LogSent(msg.sender, prize, sent);
}


    function OwnerContractGetMoney() public onlyOwner {
        require(totalAmount > 0, "No funds available");
        uint256 contractBalance = totalAmount;
        totalAmount = 0; 
        (bool sent, ) = owner.call{value: contractBalance}("");
        require(sent, "Failed to send Ether");
    }

    function OwnerFundContract() public payable {
        require(msg.value > 0, "Must send some ether to fund the contract");
        totalAmount += msg.value; 
    }
}
