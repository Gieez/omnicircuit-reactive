// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.29;

import { ISystemContract } from "./lib/reactive/interfaces/ISystemContract.sol";
import { IReactive } from "./lib/reactive/interfaces/IReactive.sol";
import { AbstractReactive } from "./lib/reactive/base/AbstractReactive.sol";

/**
 * @title OmniCircuitReactive
 * @notice Sub-second Reactive Contract deployed on Reactive Lasna (Chain ID 5318007).
 * Listens for high-priority EmergencyAnomalyDetected events on Base Sepolia (Chain ID 84532),
 * and instantly dispatches an authenticated emergency callback to the destination circuit breaker.
 */
contract OmniCircuitReactive is AbstractReactive {
    uint256 private immutable _originChainId;
    address private immutable _originContract;
    uint256 private immutable _topic0;

    uint256 private immutable _destinationChainId;
    address private immutable _destinationCallback;

    uint64 private constant CALLBACK_GAS_LIMIT = 500000;

    address public owner;
    uint256 public dispatchCount;
    uint256 public lastDispatchedOriginBlock;
    uint256 public lastDispatchedPriceDropBps;

    event Subscribed(uint256 indexed chainId, address indexed origin, uint256 topic0);
    event ReactiveCircuitDispatched(
        uint256 indexed originChainId,
        address indexed destinationCallback,
        uint256 originBlock,
        uint256 priceDropBps,
        uint256 timestamp
    );

    error NotOwner();

    modifier onlyOwner() {
        if (msg.sender != owner) revert NotOwner();
        _;
    }

    constructor(
        uint256 originChainId_,
        address originContract_,
        uint256 topic0_,
        uint256 destinationChainId_,
        address destinationCallback_
    ) payable {
        owner = msg.sender;
        _originChainId = originChainId_;
        _originContract = originContract_;
        _topic0 = topic0_;
        _destinationChainId = destinationChainId_;
        _destinationCallback = destinationCallback_;

        // Subscribe to emergency anomaly logs from the target pool on origin chain
        SYSTEM.subscribe(
            originChainId_,
            originContract_,
            topic0_,
            REACTIVE_IGNORE,
            REACTIVE_IGNORE,
            REACTIVE_IGNORE
        );

        emit Subscribed(originChainId_, originContract_, topic0_);
    }

    /// @inheritdoc IReactive
    function react(LogRecord memory log_) external onlySystem {
        // Filter by origin contract and topic
        if (log_.chainId != _originChainId || log_.contractAddress != _originContract) {
            return;
        }

        if (log_.topic0 == _topic0) {
            // Decode event payload: priceDropBps, currentReserveA, currentReserveB, timestamp
            (uint256 priceDropBps, , , ) = abi.decode(log_.data, (uint256, uint256, uint256, uint256));

            dispatchCount++;
            lastDispatchedOriginBlock = log_.blockNumber;
            lastDispatchedPriceDropBps = priceDropBps;

            // Reserve first argument (address(0)) which Reactive Network overwrites with address(this)
            bytes memory payload = abi.encodeWithSignature(
                "emergencyTrip(address,uint256,uint256)",
                address(0),
                priceDropBps,
                log_.blockNumber
            );

            SYSTEM.requestCallbackV_1_0(
                ISystemContract.CallbackConfiguration_V_1_0({
                    chainId: _destinationChainId,
                    recipient: _destinationCallback,
                    gasLimit: CALLBACK_GAS_LIMIT,
                    payload: payload
                })
            );

            emit ReactiveCircuitDispatched(
                _originChainId,
                _destinationCallback,
                log_.blockNumber,
                priceDropBps,
                block.timestamp
            );
        }
    }

    function getTelemetry() external view returns (
        uint256 originChainId,
        address originContract,
        uint256 destinationChainId,
        address destinationCallback,
        uint256 totalDispatches,
        uint256 lastOriginBlock,
        uint256 lastPriceDropBps
    ) {
        return (
            _originChainId,
            _originContract,
            _destinationChainId,
            _destinationCallback,
            dispatchCount,
            lastDispatchedOriginBlock,
            lastDispatchedPriceDropBps
        );
    }
}
