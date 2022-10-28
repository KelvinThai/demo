import "../../styles/fonts.css";
import "../../styles/globals.css";
import "react-datepicker/dist/react-datepicker.css";
import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "../themes/theme";
import MainLayout from "../layouts";
import { Provider } from "react-redux";
import store from "../reduxs/store";

function MyApp({ Component, pageProps }: AppProps) {
  const AnyComponent = Component as any;

  return (
    <Provider store={store}>
      <ChakraProvider theme={theme}>
        <MainLayout>
          <AnyComponent {...pageProps} />
        </MainLayout>
      </ChakraProvider>
    </Provider>
  );
}

export default MyApp;
