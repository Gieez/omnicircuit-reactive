# Design Direction: OmniCircuit

## Project
**OmniCircuit**: Autonomous Sub-Second DeFi Circuit Breaker & Liquidity Sentinel on Base Sepolia powered by Reactive Omni (~1s Instant Finality).

## Purpose
Prove the speed advantage of Reactive Omni over legacy cross-chain keepers in time-critical DeFi failure modes (flash-crash / oracle depeg / pool drainage). Provide a real-time on-chain telemetry interface with millisecond accuracy, event dispatch simulation, and live block tracking.

## Audience
Hackathon judges (Reactive Network core team), DeFi quantitative researchers, liquidity providers, and smart contract engineers.

## Brand Character
- Surgical precision
- Sub-second telemetry
- Tactical avionics monitor
- High-contrast readability
- Zero marketing fluff

## Visual Concept
**Avionics Flight Recorder & Real-Time Defense Grid**.
The interface mirrors a mission-critical financial defense console: continuous pulse indicators, live block height synchronizers across Base Sepolia (200ms) and Reactive Lasna (1s), live execution timeline with microsecond stopwatch precision, and explicit state indicators (ARMED, ACTIVE, TRIGGERED, SAFE).

## Art Direction
High-frequency tactical dark mode with monospaced data streams, amber/crimson alert signals, emerald operational status, and carbon-slate framing. No generic AI purple gradients, no floating decorative blobs.

## Typography
- **Display & Monospace**: `JetBrains Mono`, `Fira Code`, or native monospace stack (`ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`). Used for tx hashes, block numbers, latency benchmarks, and gas metrics.
- **Body & Labels**: `Inter` / Clean Grotesque sans (`-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif`).
- Hierarchy: Strict tabular numerical alignment (`tabular-nums`), high contrast headers, micro-labels (9px-11px tracking-wider uppercase).

## Color System
- **Background**: `#08090C` (Deep void carbon)
- **Surface / Card**: `#0F1117` (Bordered avionics module)
- **Border**: `#1E222D` (Precise 1px technical divider)
- **Primary Accent**: `#3B82F6` (Reactive Blue / Signal Frequency)
- **Safety / Arm State**: `#10B981` (Sentinel Active)
- **Hazard / Circuit Trip**: `#EF4444` (Emergency Stop Triggered)
- **Warning / Pending**: `#F59E0B` (Awaiting Callback Settlement)
- **Text Primary**: `#F3F4F6` (High-visibility bone white)
- **Text Muted**: `#9CA3AF` (Secondary telemetry specs)

## Composition & Layout
- **Canvas Width**: Modern wide canvas (1280px to 1440px / `max-w-7xl`). Full viewport width utilization without narrow island gutters.
- **Top Bar**: Live network telemetry ticker (Base Sepolia 200ms block pace vs Reactive Lasna 1s CometBFT pace).
- **Split Layout (Grid 7:5)**:
  - Left (Telemetry & Circuit State): Real-time pool reserves, trigger sensitivity controls, trigger simulation panel, and interactive trigger fire.
  - Right (Loop Execution Stopwatch & Audit Ledger): Step-by-step verified execution waterfall ($T_0$ Origin Swap Event -> $T_1$ Reactive Omni Processing -> $T_2$ Base Sepolia Callback Execution), real tx hashes, and end-to-end latency benchmark comparison vs Ethereum/Legacy bot (12s+).

## Shape Language
- 4px to 6px subtle corner radius (tactical instrument console, no bubbly roundings).
- 1px crisp borders (`border border-[#1E222D]`).
- Subtly recessed dark data wells.

## Motion
- High-efficiency pulse blinks on newly mined blocks and verified callbacks.
- Stopwatch counter updating in real-time during simulated and on-chain runs.
- Respects `prefers-reduced-motion`.

## Anti-Slop Rules
- Zero em-dashes used as lazy bullet dividers.
- No generic SaaS marketing cards or pricing tables.
- No floating 3D spheres or glassmorphic blur blobs.
- No fabricated logs: live contracts and real chain data.
