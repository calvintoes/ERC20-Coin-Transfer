import { createTheme } from "@mui/material/styles";
import { red } from "@mui/material/colors";

// Create a theme instance.
const theme = createTheme({
  palette: {
    primary: {
      main: "#212121",
    },
    secondary: {
      main: "#ebebeb",
    },
    error: {
      main: red.A400,
    },
  },
  typography: {
    fontFamily: ["Poppins"].join(),
  },
});

export default theme;
