import { getTraces, type APIOptions } from "toncenter-v3-api";

export type GetTraceByTxHashParams = {
  txHash: string;
};

export const getTraceByTxHash = async (
  { txHash }: GetTraceByTxHashParams,
  options?: APIOptions
) => {
  const res = await getTraces({ tx_hash: [txHash] }, options);
  if (res && res.traces?.length && !res.traces[0].is_incomplete) {
    return res.traces[0];
  }
};
