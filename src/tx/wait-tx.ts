import { type APIOptions } from "toncenter-v3-api";
import { sleep } from "../common/utils";
import { getTxByMessage } from "./get-tx";

export type WaitTxByMessageParams = {
  in: boolean;
} & (
  | {
      msg_hash: string;
    }
  | {
      body_hash: string;
    }
);

export const waitTxByMessage = async ({
  params,
  options,
}: {
  params: WaitTxByMessageParams;
  options?: APIOptions;
}) => {
  while (true) {
    const tx = await getTxByMessage({ params, options });
    if (tx) {
      return tx;
    }
    await sleep(2000);
  }
};
