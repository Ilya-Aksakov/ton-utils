import { getTransactionsByMessage, type APIOptions } from "toncenter-v3-api";

export type GetTxByMessageParams = {
  in: boolean;
} & (
  | {
      msg_hash: string;
    }
  | {
      body_hash: string;
    }
);

export const getTxByMessage = async ({
  params,
  options,
}: {
  params: GetTxByMessageParams;
  options?: APIOptions;
}) => {
  const txs = await getTransactionsByMessage(params, options);
  if (txs && txs.transactions?.length) {
    const tx = txs.transactions.find((tx) => {
      if (params.in) {
        if ("msg_hash" in params) {
          return tx.in_msg?.hash === params.msg_hash;
        }
        if ("body_hash" in params) {
          return tx.in_msg?.message_content?.hash === params.body_hash;
        }
      } else {
        if ("msg_hash" in params) {
          return tx.out_msgs?.some((msg) => msg?.hash === params.msg_hash);
        }
        if ("body_hash" in params) {
          return tx.out_msgs?.some((msg) => msg.message_content?.hash === params.body_hash);
        }
      }
    });
    if (tx) {
      return tx;
    }
  }
};
