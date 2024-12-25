// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../contracts/src/FutureFund.sol";

contract FutureFundTest is Test {
    FutureFund futureFund;
    address owner;
    address player1;
    address player2;

    function setUp() public {
        futureFund = new FutureFund();
        owner = address(this);
        player1 = address(0x1);
        player2 = address(0x2);
    }

    function testJoinGame() public {
        vm.deal(player1, 1 ether);
        vm.prank(player1);
        futureFund.joinGame{value: 1 ether}(1);
        
        (, uint256 amount) = futureFund.players(player1);
        assertEq(amount, 1 ether);
    }

    function testResultFuture() public {
        vm.deal(player1, 1 ether);
        vm.prank(player1);
        futureFund.joinGame{value: 1 ether}(1);
        
        vm.deal(player2, 1 ether);
        vm.prank(player2);
        futureFund.joinGame{value: 1 ether}(0);

        vm.prank(owner);
        futureFund.resultFuture(0, 1); // player1 wins

        assertTrue(futureFund.winners(player1));
        assertFalse(futureFund.winners(player2));
    }

    function testGetMoneyWinner() public {
        vm.deal(player1, 1 ether);
        vm.prank(player1);
        futureFund.joinGame{value: 1 ether}(1);
        
        vm.deal(player2, 1 ether);
        vm.prank(player2);
        futureFund.joinGame{value: 1 ether}(0);

        vm.prank(owner);
        futureFund.resultFuture(0, 1); // player1 wins

        uint256 initialBalance = player1.balance;
        vm.prank(player1);
        futureFund.getMoneyWinner();

        assertEq(player1.balance, initialBalance + 2 ether);
    }

    function testOwnerContractGetMoney() public {
        vm.deal(player1, 1 ether);
        vm.prank(player1);
        futureFund.joinGame{value: 1 ether}(1);
        
        vm.deal(player2, 1 ether);
        vm.prank(player2);
        futureFund.joinGame{value: 1 ether}(0);

        vm.prank(owner);
        futureFund.resultFuture(0, 1); // player1 wins

        uint256 initialOwnerBalance = owner.balance;
        vm.prank(owner);
        futureFund.OwnerContractGetMoney();

        assertEq(owner.balance, initialOwnerBalance + 2 ether);
    }

    function testOwnerFundContract() public {
        uint256 initialBalance = address(futureFund).balance;
        vm.prank(owner);
        futureFund.OwnerFundContract{value: 1 ether}();

        assertEq(address(futureFund).balance, initialBalance + 1 ether);
    }
} 