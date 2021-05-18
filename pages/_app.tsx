import { AppProps } from "next/app";
import { Provider } from "next-auth/client";
import Layout from "../components/layout/layout";
import "../styles/globals.css";

const MyApp = ({ Component, pageProps }: AppProps) => {
  /* #TA07
    - if the page being loaded already setup a session
      property the provider can take advantage of that
      and improve the performance by skipping some
      checks
      - #REF03
  */

  return (
    <Provider session={pageProps.session}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Provider>
  );
};

export default MyApp;
