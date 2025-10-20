# ton-helper

Small utility helpers for TON blockchain built on top of `toncenter-v3-api`.

- **Node**: >= 18
- **License**: MIT
- **Repo**: https://github.com/Ilya-Aksakov/ton-utils

## Install

```bash
npm install ton-helper
```

## Quick start

```ts
import {
  // jetton
  formatUnits,
  parseUnits,
  formatUnitsByJettonMaster,
  parseUnitsByJettonMaster,
  // traces
  getTraceByTxHash,
  waitTraceByTxHash,
  // transactions
  getTxByMessage,
  waitTxByMessage,
  // common
  sleep,
  shortenAddress,
} from "ton-helper";
```

If you use functions that call Toncenter (`*ByJettonMaster`, traces, tx), you can pass `APIOptions` (see `toncenter-v3-api` docs) to configure base URL and API key.

```ts
import type { APIOptions } from "toncenter-v3-api";

const options: APIOptions = {
  chain: "mainnet",
  apiKey: process.env.TONCENTER_API_KEY,
};
```

Notes:

- **options**: optional; you may omit it entirely.
- **apiKey**: optional; without an API key Toncenter enforces a rate limit of 1 request per second.
- **chain**: defaults to "mainnet".

## Jetton utils

- `formatUnits(value: bigint | string, decimals = 9): string`
- `parseUnits(value: string, decimals: number): bigint`
- `formatUnitsByJettonMaster(value: bigint | string, jettonMaster: string, options?: APIOptions): Promise<string>`
- `parseUnitsByJettonMaster(value: number | string, jettonMaster: string, options?: APIOptions): Promise<bigint>`

```ts
const amount = parseUnits("1.2345", 9); // -> 1234500000n
const display = formatUnits(amount, 9); // -> "1.2345"

// Resolve decimals from jetton master via Toncenter
const pretty = await formatUnitsByJettonMaster(123456789n, "EQ...master", options);
const onChain = await parseUnitsByJettonMaster("1.5", "EQ...master", options);
```

Wallet-based helpers (resolve jetton master by wallet first):

```ts
const prettyW = await formatUnitsByJettonWallet(123456789n, "EQ...wallet", options);
const onChainW = await parseUnitsByJettonWallet("1.5", "EQ...wallet", options);
```

## Traces

- `getTraceByTxHash({ txHash }, options?)`
- `waitTraceByTxHash({ txHash }, options?)`

```ts
const trace = await getTraceByTxHash({ txHash: "<boc-hash>" }, options);
const ensuredTrace = await waitTraceByTxHash({ txHash: "<boc-hash>" }, options);
```

## Transactions

- `getTxByMessage({ params, options? })`
- `waitTxByMessage({ params, options? })`

`params` shape:

```ts
// in: true -> input message; false -> output message
// choose either msg_hash or body_hash
const params = { in: true, msg_hash: "<hash>" } as const;

const tx = await getTxByMessage({ params, options });
const waited = await waitTxByMessage({ params, options });
```

## Common utils

```ts
await sleep(2000);
shortenAddress("EQDx...abcd", 4, 4); // -> "EQDx...abcd"
```

## API surface

- `common`
  - `sleep(ms: number): Promise<void>`
  - `shortenAddress(address: string, charsBefore = 4, charsAfter = 4): string`
- `jetton`
  - `formatUnits`, `parseUnits`, `formatUnitsByJettonMaster`, `parseUnitsByJettonMaster`,
  - `formatUnitsByJettonWallet`, `parseUnitsByJettonWallet`
- `traces`
  - `getTraceByTxHash`, `waitTraceByTxHash`
- `tx`
  - `getTxByMessage`, `waitTxByMessage`

## License

MIT © Ilya Aksakov

## Links

- GitHub: https://github.com/Ilya-Aksakov/ton-utils
- Issues: https://github.com/Ilya-Aksakov/ton-utils/issues
