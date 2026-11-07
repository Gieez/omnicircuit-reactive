// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.29;

import { IPayable } from "./lib/reactive/interfaces/IPayable.sol";
import { AbstractCallback } from "./lib/reactive/base/AbstractCallback.sol";

interface IOriginPool {
    function tripCircuitBreaker(uint256 priceDropBps_) external;
}

/**
 * @title OmniCircuitCallback
 * @notice Destination Circuit Breaker Callback Receiver deployed on Base Sepolia (Chain ID 84532).
 * Authenticates incoming reactive callback from Reactive Signer proxy and executes immediate freeze.
 */
contract OmniCircuitCallback is AbstractCallback {
    IOriginPool public originPool;
    address public owner;

    uint256 public tripCount;
    uint256 public lastTripBlock;
    uint256 public lastTripTimestamp;
    uint256 public lastTripPriceDropBps;
    uint256 public lastTripOriginBlock;

    event CircuitTrippedVerified(
        address indexed reactiveContract,
        uint256 priceDropBps,
        uint256 originBlock,
        uint256 callbackBlock,
        uint256 timestamp
    );
    event PoolUpdated(address indexed newPool);

    error NotOwner();

    modifier onlyOwner() {
        if (msg.sender != owner) revert NotOwner();
        _;
    }

    constructor(
        IPayable callbackProxy_,
        address callbackSender_,
        address pool_
    ) payable AbstractCallback(callbackProxy_, callbackSender_) {
        owner = msg.sender;
        originPool = IOriginPool(pool_);
    }

    function setPool(address pool_) external onlyOwner {
        originPool = IOriginPool(pool_);
        emit PoolUpdated(pool_);
    }

    /**
     * @notice Callback entrypoint triggered strictly by Reactive Network Proxy.
     * @param reactiveSender_ Address injected into first argument by Reactive Signer proxy.
     * @param priceDropBps_ Drop in basis points that triggered the anomaly.
     * @param originBlock_ Block number on origin chain when anomaly was logged.
     */
    function emergencyTrip(
        address reactiveSender_,
        uint256 priceDropBps_,
        uint256 originBlock_
    ) external onlyServiceProvider onlyCallbackSender(reactiveSender_) {
        tripCount++;
        lastTripBlock = block.number;
        lastTripTimestamp = block.timestamp;
        lastTripPriceDropBps = priceDropBps_;
        lastTripOriginBlock = originBlock_;

        // Execute pool emergency protection
        if (address(originPool) != address(0)) {
            originPool.tripCircuitBreaker(priceDropBps_);
        }

        emit CircuitTrippedVerified(
            reactiveSender_,
            priceDropBps_,
            originBlock_,
            block.number,
            block.timestamp
        );
    }

    function getTelemetry() external view returns (
        address poolAddress,
        address reactiveSender,
        uint256 totalTrips,
        uint256 latestTripBlock,
        uint256 latestTripTimestamp,
        uint256 latestPriceDropBps,
        uint256 latestOriginBlock
    ) {
        return (
            address(originPool),
            _CALLBACK_SENDER,
            tripCount,
            lastTripBlock,
            lastTripTimestamp,
            lastTripPriceDropBps,
            lastTripOriginBlock
        );
    }
}
