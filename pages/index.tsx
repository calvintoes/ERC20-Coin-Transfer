import Web3 from "web3";
import { Contract } from "web3-eth-contract";
import { BaseSyntheticEvent, useState } from "react";
import { NavBar } from "../components/organisms";
import {
  FormControl,
  TextField,
  Typography,
  Container,
  Box,
  Stack,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { ERC20_ABI } from "../constants";
import { Error } from "../enums/errors";
import { validateAddress } from "../utils";

export default function Index() {
  const address = useSelector(
    (state: RootState) => state.connectWallet.address
  );
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [contract, setContract] = useState<Contract | null>(null);

  // Input fields
  const [contractName, setContractName] = useState<string>("");
  const [contractAddress, setContractAddress] = useState<string>("");
  const [recipient, setRecipient] = useState<string>("");
  const [transferAmount, setTransferAmount] = useState<string>("");
  const [walletBalance, setWalletBalance] = useState<string[]>(["", ""]);

  // Bool states
  const [transferIsLoading, setTransferIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState({
    contractAddress: "",
    recipient: "",
    transferAmount: "",
  });
  const [isTransferDisabled, setIsTransferDisabled] = useState<boolean>(true);

  const connectToContract = async (e: BaseSyntheticEvent) => {
    if (validateAddress(e.target.value)) {
      const inputContract =
        web3 && new web3.eth.Contract(ERC20_ABI, e.target.value);
      setContract(inputContract);
      setContractAddress(e.target.value);

      const name = await inputContract?.methods.name().call();
      setContractName(name);

      const symbol = await inputContract?.methods.symbol().call();
      const balance = await inputContract?.methods.balanceOf(address).call();
      setWalletBalance([balance, symbol]);
      setErrors({ ...errors, contractAddress: "" });
      validateDisableBtn();
    } else {
      setErrors({ ...errors, contractAddress: Error.address });
      setIsTransferDisabled(true);
    }
  };

  const transferTokens = async () => {
    setTransferIsLoading(true);

    await contract?.methods
      .transfer(recipient, web3?.utils.toWei(transferAmount))
      .send({ from: address });

    setTransferIsLoading(false);
  };

  const handleRecipientInput = (e: BaseSyntheticEvent) => {
    if (validateAddress(e.target.value)) {
      setRecipient(e.target.value);
      setErrors({ ...errors, recipient: "" });
      validateDisableBtn();
    } else {
      setErrors({ ...errors, recipient: Error.address });
      setIsTransferDisabled(true);
    }
  };

  const handleTransferAmountInput = (e: BaseSyntheticEvent) => {
    if (parseInt(transferAmount) > 0) {
      setTransferAmount(e.target.value);
      setErrors({ ...errors, transferAmount: "" });
      validateDisableBtn();
    } else {
      setErrors({ ...errors, transferAmount: Error.transferAmount });
      setIsTransferDisabled(true);
    }
  };

  const validateDisableBtn = () => {
    const isContractFieldValid = !!contractAddress.length;
    const isRecipientFieldValid = !!recipient.length;
    const isTransferAmtFieldValid = !!(parseInt(transferAmount) > 0);

    if (
      isContractFieldValid &&
      isRecipientFieldValid &&
      isTransferAmtFieldValid
    ) {
      setIsTransferDisabled(false);
    } else {
      setIsTransferDisabled(true);
    }
  };

  return (
    <>
      <NavBar handleSetWeb3={(w3: Web3) => setWeb3(w3)} />
      <Container
        maxWidth="lg"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Box
          sx={{
            p: 5,
            maxWidth: "md",
            width: "100%",
            border: "1px solid #ebebeb",
            boxShadow: 1,
            borderRadius: 2,
          }}
        >
          <Typography variant="h4" sx={{ textAlign: "center" }}>
            {!web3 ? "Connect your wallet" : "Send tokens"}
          </Typography>
          <FormControl margin="normal" sx={{ width: "100%" }}>
            <Stack gap={4}>
              <Box>
                <TextField
                  sx={{ width: "100%" }}
                  required
                  name="tokenAddress"
                  label="ERC20 Token Address"
                  onBlur={(e) => connectToContract(e)}
                  error={!!errors.contractAddress}
                  disabled={!web3}
                  value={contractAddress}
                  onChange={(e) => setContractAddress(e.target.value)}
                />
                {errors.contractAddress && (
                  <Typography variant="body1" sx={{ color: "#AA0000" }}>
                    {errors.contractAddress}
                  </Typography>
                )}
                {contract && (
                  <Stack direction="row">
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        width: "100%",
                      }}
                    >
                      <Typography variant="body1">
                        Token: <b>{contractName}</b>
                      </Typography>
                      <Typography variant="body1">
                        Balance:{" "}
                        <b>
                          {web3?.utils.fromWei(walletBalance[0])}{" "}
                          {walletBalance[1]}
                        </b>
                      </Typography>
                    </Box>
                  </Stack>
                )}
              </Box>
              <Box>
                <TextField
                  required
                  sx={{ width: "100%" }}
                  name="recipientAddress"
                  label="Recipient Address"
                  onBlur={(e) => handleRecipientInput(e)}
                  error={!!errors.recipient}
                  disabled={!web3}
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                />
                {errors.recipient && (
                  <Typography variant="body1" sx={{ color: "#AA0000" }}>
                    {errors.recipient}
                  </Typography>
                )}
              </Box>
              <Box>
                <TextField
                  required
                  name="tokenAmount"
                  label="Amount to transfer"
                  sx={{ width: "33%" }}
                  type="number"
                  inputProps={{
                    inputMode: "numeric",
                    pattern: /^[+]?([.]d+|d+([.]d+)?)$/,
                    min: 0,
                  }}
                  error={!!errors.transferAmount}
                  placeholder={transferAmount}
                  onBlur={(e) => handleTransferAmountInput(e)}
                  disabled={!web3}
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                />
                {errors.transferAmount && (
                  <Typography variant="body1" sx={{ color: "#AA0000" }}>
                    {errors.transferAmount}
                  </Typography>
                )}
              </Box>
              <LoadingButton
                variant="contained"
                disabled={isTransferDisabled}
                size="large"
                onClick={() => transferTokens()}
                loading={transferIsLoading}
              >
                Transfer
              </LoadingButton>
            </Stack>
          </FormControl>
        </Box>
      </Container>
    </>
  );
}
