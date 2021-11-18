import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Web3 from "web3";

interface Wallet {
  wallet: Web3 | null;
  address: string | "";
  error: string;
}

const initialState: Wallet = {
  wallet: null,
  address: "",
  error: "",
};

export const connectWalletSlice = createSlice({
  name: "Wallet",
  initialState,
  reducers: {
    setWallet: (state, action: PayloadAction<Web3>) => {
      return {
        ...state,
        wallet: action.payload,
      };
    },
    setAddress: (state, action: PayloadAction<string>) => {
      return {
        ...state,
        address: action.payload,
      };
    },
  },
});

export const { setWallet, setAddress } = connectWalletSlice.actions;

export default connectWalletSlice.reducer;
