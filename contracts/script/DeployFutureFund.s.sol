// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {FutureFund} from "../src/FutureFund.sol";
contract DeployFutureFund is Script {
    FutureFund public futureFund;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        futureFund = new FutureFund();

        vm.stopBroadcast();
    }
}