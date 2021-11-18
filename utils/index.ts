export const validateAddress = (address: string) => {
  return address.match(/^0x[a-fA-F0-9]{40}$/);
};
