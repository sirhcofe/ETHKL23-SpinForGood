export const formattedAddress = (address: string) => {
  const formattedAddress = `${address.slice(0, 4)}...${address.slice(-4)}`;
  return formattedAddress;
};
