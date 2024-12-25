// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

contract FutureFund {
    address public owner;
    struct Player{
        uint8 choice;
        uint256 amount;
    }
    mapping(address => Player) public players;
    uint256 public totalAmount;
    constructor() {
         owner = 0xcc495384bEC3A342387A0E0490a60C8f14F1bfE7;
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }
    

    function joinGame(uint8 _choice) public payable {
        require(_choice == 0 || _choice == 1, "Choice must be 0 (decrease) or 1 (increase)");
        require(msg.value > 0, "Must send some ether");
        players[msg.sender] = Player(_choice, msg.value);
        totalAmount += msg.value;
    }   

    function getMoneyWinner() public payable {
        //Người chiến thắng có trong danh sách có thể rút số tiền của họ
    }

    function resultFuture(uint256 _turnNumber, bool _result) public onlyOwner {
        //Lưu người chiến thắng vào 1 mapping mới
        //Xóa mapping cũ để lượt chơi mới bắt đầu
    } 

    function OwnerContractGetMoney() public payable onlyOwner{
        
    }
    
}