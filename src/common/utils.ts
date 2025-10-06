export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const shortenAddress = (address: string, charsBefore = 4, charsAfter = 4): string => {
  if (address.length < charsBefore + charsAfter + 1) {
    throw new Error("Invalid length");
  }
  return `${address.slice(0, charsBefore)}...${address.slice(-charsAfter)}`;
};
