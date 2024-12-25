// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../src/FutureFund.sol";

contract FutureFundTest is Test {
    FutureFund private futureFund;

    address private owner = address(this);
    address private player1 = address(0x1);
    address private player2 = address(0x2);

    function setUp() public {
        futureFund = new FutureFund();
    }

    function testOwnerInitialization() public {
        assertEq(futureFund.owner(), owner, "Owner should be the deployer");
    }

    function testJoinGame() public {
        vm.deal(player1, 10 ether);
        vm.prank(player1); // Simulate player1 calling the function
        futureFund.joinGame{value: 1 ether}(1); // Player1 chooses "increase"

        (uint8 choice, uint256 amount) = futureFund.players(player1);
        assertEq(choice, 1, "Player1's choice should be 1");
        assertEq(amount, 1 ether, "Player1's amount should be 1 ether");
        assertEq(futureFund.totalAmount(), 1 ether, "Total amount should be 1 ether");
    }

    function testResultFuture() public {
        vm.deal(player1, 10 ether);
        vm.prank(player1);
        futureFund.joinGame{value: 1 ether}(1); // Player1 chooses "increase"

        vm.deal(player2, 10 ether);
        vm.prank(player2);
        futureFund.joinGame{value: 2 ether}(0); // Player2 chooses "decrease"

        uint256 initialTurn = futureFund.currentTurn();

        vm.prank(owner);
        futureFund.resultFuture(initialTurn, 1); // Declare "increase" as the result

        assertTrue(futureFund.winners(player1), "Player1 should be a winner");
        assertFalse(futureFund.winners(player2), "Player2 should not be a winner");
    }

    function testGetMoneyWinner() public {
        // Simulate a game turn
        vm.deal(player1, 10 ether);
        vm.prank(player1);
        futureFund.joinGame{value: 1 ether}(1);

        vm.prank(owner);
        futureFund.resultFuture(0, 1); // Declare "increase" as the result

        // Winner claims prize
        uint256 initialBalance = player1.balance;
        vm.prank(player1);
        futureFund.getMoneyWinner();

        assertEq(player1.balance, initialBalance + 2 ether, "Winner should receive double the amount");
    }

    function testOwnerFundContract() public {
        uint256 initialTotalAmount = futureFund.totalAmount();
        uint256 fundAmount = 5 ether;

        vm.prank(owner);
        futureFund.OwnerFundContract{value: fundAmount}();

        assertEq(futureFund.totalAmount(), initialTotalAmount + fundAmount, "Total amount should increase");
    }

    function testOwnerWithdrawFunds() public {
        // Fund the contract
        vm.prank(owner);
        futureFund.OwnerFundContract{value: 10 ether}();

        uint256 initialOwnerBalance = owner.balance;
        uint256 contractBalance = address(futureFund).balance;

        vm.prank(owner);
        futureFund.OwnerContractGetMoney();

        assertEq(owner.balance, initialOwnerBalance + contractBalance, "Owner should withdraw all funds");
    }
}
