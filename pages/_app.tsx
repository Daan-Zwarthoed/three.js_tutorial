import "../styles/globals.css";
import "../styles/codeEditor.css";

import type { AppProps } from "next/app";
import { AppContextProvider } from "../contexts/AppContextProvider";
import { useEffect, useState } from "react";

function MyApp({ Component, pageProps }: AppProps) {
  const [desktop, setDesktop] = useState(true);
  useEffect(() => {
    if (
      navigator.userAgent.match(/Android/i) ||
      navigator.userAgent.match(/webOS/i) ||
      navigator.userAgent.match(/iPhone/i) ||
      navigator.userAgent.match(/iPad/i) ||
      navigator.userAgent.match(/iPod/i) ||
      navigator.userAgent.match(/BlackBerry/i) ||
      navigator.userAgent.match(/Windows Phone/i)
    )
      setDesktop(false);
  }, []);

  if (!desktop) return <p className="p-5">This app is only made for desktop</p>;
  return (
    <>
      <AppContextProvider>
        <Component {...pageProps} />
      </AppContextProvider>
    </>
  );
}

export default MyApp;
