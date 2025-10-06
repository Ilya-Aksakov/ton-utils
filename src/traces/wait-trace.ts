import { type APIOptions } from "toncenter-v3-api";
import { sleep } from "../common/utils";
import { getTraceByTxHash } from "./get-trace";

export type WaitTraceByTxHashParams = {
  txHash: string;
};

export const waitTraceByTxHash = async (
  { txHash }: WaitTraceByTxHashParams,
  options?: APIOptions
) => {
  while (true) {
    const trace = await getTraceByTxHash({ txHash }, options);
    if (trace) {
      return trace;
    }
    await sleep(2000);
  }
};
