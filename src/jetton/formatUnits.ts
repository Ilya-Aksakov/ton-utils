import { getJettonMasters, type APIOptions } from "toncenter-v3-api";
import { getJettonWallets } from "toncenter-v3-api";
import { sleep } from "../common/utils";

export const formatUnits = (value: bigint | string, decimals: number = 9) => {
  let display = value.toString();

  const negative = display.startsWith("-");
  if (negative) display = display.slice(1);

  display = display.padStart(decimals, "0");

  // eslint-disable-next-line prefer-const
  let [integer, fraction] = [
    display.slice(0, display.length - decimals),
    display.slice(display.length - decimals),
  ];
  fraction = fraction.replace(/(0+)$/, "");
  return `${negative ? "-" : ""}${integer || "0"}${fraction ? `.${fraction}` : ""}`;
};

export const formatUnitsByJettonMaster = async (
  value: bigint | string,
  jettonMaster: string,
  options?: APIOptions
) => {
  const dec = (await getJettonMasters({ address: [jettonMaster] }, options))?.jetton_masters?.[0]
    ?.jetton_content?.decimals as string | undefined;

  if (dec) {
    return formatUnits(value, parseInt(dec));
  } else {
    throw new Error("jetton master decimals not found");
  }
};

export const formatUnitsByJettonWallet = async (
  value: bigint | string,
  jettonWallet: string,
  options?: APIOptions
) => {
  const res = await getJettonWallets({ address: [jettonWallet] }, options);
  const master = res?.jetton_wallets?.[0]?.jetton as string | undefined;
  if (!master) {
    throw new Error("jetton master not found by wallet");
  }
  if (!options?.apiKey) {
    await sleep(1000);
  }
  return formatUnitsByJettonMaster(value, master, options);
};
