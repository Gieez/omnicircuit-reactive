// SPDX-License-Identifier: MIT
pragma solidity ^0.8.29;

/**
 * @title OriginPool
 * @notice High-speed DEX Liquidity Pool & Vault on Base Sepolia.
 * Emits telemetry events on swaps and price anomalies for Reactive Omni to detect.
 */
contract OriginPool {
    string public name = "OmniCircuit Base Pool";
    address public owner;
    address public authorizedCallback;

    uint256 public reserveA; // e.g. Base ETH / Token A
    uint256 public reserveB; // e.g. USDC / Token B
    bool public isCircuitTripped;
    uint256 public lastTripTimestamp;
    uint256 public lastTripPriceDropBps;

    // Default emergency threshold: 300 bps (3%)
    uint256 public thresholdBps = 300;

    event LiquidityAdded(address indexed provider, uint256 amountA, uint256 amountB);
    event SwapExecuted(
        address indexed sender,
        bool isBuyA,
        uint256 amountIn,
        uint256 amountOut,
        uint256 priceDropBps,
        uint256 timestamp
    );
    event EmergencyAnomalyDetected(
        address indexed pool,
        uint256 priceDropBps,
        uint256 currentReserveA,
        uint256 currentReserveB,
        uint256 timestamp
    );
    event CircuitBreakerActivated(
        address indexed caller,
        uint256 priceDropBps,
        uint256 blockNumber,
        uint256 timestamp
    );
    event CircuitBreakerReset(address indexed owner);

    error CircuitBreakerActive();
    error NotAuthorized();
    error InsufficientReserves();

    modifier onlyOwner() {
        if (msg.sender != owner) revert NotAuthorized();
        _;
    }

    modifier notTripped() {
        if (isCircuitTripped) revert CircuitBreakerActive();
        _;
    }

    constructor() {
        owner = msg.sender;
        // Seed initial reserves for testing
        reserveA = 100 ether;       // 100 Token A
        reserveB = 300_000 * 1e6;   // 300,000 USDC (initial ratio $3,000/Token A)
    }

    function setAuthorizedCallback(address callback_) external onlyOwner {
        authorizedCallback = callback_;
    }

    function setThresholdBps(uint256 newThresholdBps_) external onlyOwner {
        thresholdBps = newThresholdBps_;
    }

    function addLiquidity(uint256 amountA, uint256 amountB) external notTripped {
        reserveA += amountA;
        reserveB += amountB;
        emit LiquidityAdded(msg.sender, amountA, amountB);
    }

    /**
     * @notice Simulates a spot swap against pool reserves.
     * If price impact exceeds thresholdBps, emits EmergencyAnomalyDetected.
     */
    function swap(bool isBuyA, uint256 amountIn) external notTripped returns (uint256 amountOut) {
        if (amountIn == 0) revert InsufficientReserves();

        uint256 oldRatio;
        uint256 newRatio;
        uint256 dropBps = 0;

        if (isBuyA) {
            // In: Token B (USDC), Out: Token A
            amountOut = (reserveA * amountIn) / (reserveB + amountIn);
            reserveB += amountIn;
            reserveA -= amountOut;
        } else {
            // In: Token A, Out: Token B (USDC) -> dump Token A
            oldRatio = (reserveB * 1e18) / reserveA;
            amountOut = (reserveB * amountIn) / (reserveA + amountIn);
            reserveA += amountIn;
            reserveB -= amountOut;
            newRatio = (reserveB * 1e18) / reserveA;

            if (oldRatio > newRatio) {
                dropBps = ((oldRatio - newRatio) * 10000) / oldRatio;
            }
        }

        emit SwapExecuted(msg.sender, isBuyA, amountIn, amountOut, dropBps, block.timestamp);

        // If price dumped heavily, emit the high-priority event that Reactive Omni watches
        if (dropBps >= thresholdBps) {
            emit EmergencyAnomalyDetected(address(this), dropBps, reserveA, reserveB, block.timestamp);
        }
    }

    /**
     * @notice Emergency trigger called by OmniCircuitCallback on Base Sepolia.
     */
    function tripCircuitBreaker(uint256 priceDropBps_) external {
        if (msg.sender != authorizedCallback && msg.sender != owner) {
            revert NotAuthorized();
        }
        isCircuitTripped = true;
        lastTripTimestamp = block.timestamp;
        lastTripPriceDropBps = priceDropBps_;

        emit CircuitBreakerActivated(msg.sender, priceDropBps_, block.number, block.timestamp);
    }

    function resetCircuitBreaker() external onlyOwner {
        isCircuitTripped = false;
        emit CircuitBreakerReset(msg.sender);
    }

    function getPoolState() external view returns (
        uint256 _resA,
        uint256 _resB,
        bool _tripped,
        uint256 _lastTripTs,
        uint256 _lastTripBps,
        uint256 _threshold
    ) {
        return (reserveA, reserveB, isCircuitTripped, lastTripTimestamp, lastTripPriceDropBps, thresholdBps);
    }
}
