import "../styles/globals.css";
import type { AppProps } from "next/app";
import { AppContextProvider } from "../contexts/AppContextProvider";
import Robot from "../components/robot/Robot";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <AppContextProvider>
        <Robot></Robot>
        <Component {...pageProps} />
      </AppContextProvider>
    </>
  );
}

export default MyApp;
