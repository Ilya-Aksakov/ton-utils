import test from "node:test";
import assert from "node:assert/strict";
import { parseUnitsByJettonWallet, formatUnitsByJettonWallet, sleep } from "../dist/index.js";

const WALLET = "kQBuUbp-DAT98477nfv86uYrR7lpG-8QVATRqDde484SoA5-"; // testnet jetton wallet
const options = {
  chain: "testnet",
  apiKey: process.env.TONCENTER_API_KEY,
};

test(
  "parseUnitsByJettonWallet/formatUnitsByJettonWallet roundtrip",
  { timeout: 90_000 },
  async () => {
    const value = await parseUnitsByJettonWallet("1", WALLET, options);
    assert.equal(typeof value, "bigint");

    await sleep(1200);

    const back = await formatUnitsByJettonWallet(value, WALLET, options);
    assert.equal(back, "1");
  }
);
