import { getJettonMasters, type APIOptions } from "toncenter-v3-api";
import { getJettonWallets } from "toncenter-v3-api";
import { sleep } from "../common/utils";

export const parseUnits = (value: string, decimals: number) => {
  if (!/^(-?)([0-9]*)\.?([0-9]*)$/.test(value))
    throw new Error(`Number \`${value}\` is not a valid decimal number.`);

  let [integer, fraction = "0"] = value.split(".");

  const negative = integer.startsWith("-");
  if (negative) integer = integer.slice(1);

  // trim trailing zeros.
  fraction = fraction.replace(/(0+)$/, "");

  // round off if the fraction is larger than the number of decimals.
  if (decimals === 0) {
    if (Math.round(Number(`.${fraction}`)) === 1) integer = `${BigInt(integer) + 1n}`;
    fraction = "";
  } else if (fraction.length > decimals) {
    const [left, unit, right] = [
      fraction.slice(0, decimals - 1),
      fraction.slice(decimals - 1, decimals),
      fraction.slice(decimals),
    ];

    const rounded = Math.round(Number(`${unit}.${right}`));
    if (rounded > 9) fraction = `${BigInt(left) + BigInt(1)}0`.padStart(left.length + 1, "0");
    else fraction = `${left}${rounded}`;

    if (fraction.length > decimals) {
      fraction = fraction.slice(1);
      integer = `${BigInt(integer) + 1n}`;
    }

    fraction = fraction.slice(0, decimals);
  } else {
    fraction = fraction.padEnd(decimals, "0");
  }

  return BigInt(`${negative ? "-" : ""}${integer}${fraction}`);
};

export const parseUnitsByJettonMaster = async (
  value: number | string,
  jettonMaster: string,
  options?: APIOptions
) => {
  const dec = (await getJettonMasters({ address: [jettonMaster] }, options))?.jetton_masters?.[0]
    ?.jetton_content?.decimals as string | undefined;

  if (dec) {
    return parseUnits(value.toString(), parseInt(dec));
  } else {
    throw new Error("jetton master decimals not found");
  }
};

export const parseUnitsByJettonWallet = async (
  value: number | string,
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
  return parseUnitsByJettonMaster(value, master, options);
};
