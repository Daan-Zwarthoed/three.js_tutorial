import Document, { Html, Head, Main, NextScript } from "next/document";
class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link
            href="https://fonts.googleapis.com/css2?family=Bangers&family=Quicksand&display=swap"
            rel="stylesheet"
          />
          <meta
            name="google-site-verification"
            content="LSTs8QeH8NN_53baxbUawo7HnGOOnKY0vcYj8GHZLDA"
          />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <body className="overflow-x-hidden w-screen min-h-screen">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
