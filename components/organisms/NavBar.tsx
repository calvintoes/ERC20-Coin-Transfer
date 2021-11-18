import React, { FC } from "react";
import { Box, Container, Stack, Typography, Button } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { setWallet, setAddress } from "../../redux/connectWalletSlice";
import Web3 from "web3";

interface Prop {
  handleSetWeb3: (w3: Web3) => void;
}

const NavBar: FC<Prop> = ({ handleSetWeb3 }) => {
  const dispatch = useDispatch();
  const address = useSelector(
    (state: RootState) => state.connectWallet.address
  );
  const formattedAddy = `${address?.slice(0, 7)}...${address?.slice(-4)}`;

  const connectWallet = () => {
    if (window.ethereum) {
      ethereum
        .request({ method: "eth_requestAccounts" })
        .then((accounts) => {
          let w3 = new Web3(ethereum);
          // dispatch(setWallet(w3));
          handleSetWeb3(w3);
          dispatch(setAddress(accounts[0]));
        })
        .catch((err) => console.log(err));
    } else {
      console.log("Please install Metamask");
    }
  };

  return (
    <Container maxWidth="lg" sx={{ my: 2 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h4">CoinX</Typography>
        </Box>
        <Box>
          <Stack direction="row" gap={2}>
            {address ? (
              <Typography variant="button">{formattedAddy}</Typography>
            ) : (
              <Button
                variant="contained"
                onClick={() => connectWallet()}
                autoFocus
                size="large"
              >
                Connect Wallet
              </Button>
            )}
          </Stack>
        </Box>
      </Stack>
    </Container>
  );
};

export default NavBar;
