import Router from "@/router";

import useNetwork from "@/hooks/useNetwork";

import { Layout } from "antd";
import Navigation from "@/app/Navigation";

import { useSelector } from "react-redux";
import { selectAuth } from "@/redux/auth/selectors";
import HeaderContent from "@/app/HeaderContent";

function App() {
  const { isOnline: isNetwork } = useNetwork();

  // if (!isNetwork)
  //   return (
  //     <>
  //       <Result
  //         status="404"
  //         title="No Internet Connection"
  //         subTitle="Check your Internet Connection or your network."
  //         extra={
  //           <Button href="/" type="primary">
  //             Try Again
  //           </Button>
  //         }
  //       />
  //     </>
  //   );
  // else {

  // }
  const { isLoggedIn } = useSelector(selectAuth);

  if (!isLoggedIn) return <Router />;
  else {
    return (
      <Layout style={{ minHeight: "100vh" }}>
        <Navigation />
        <Layout style={{ minHeight: "100vh" }}>
          <HeaderContent />
          <Router isLoggedIn={true} />
        </Layout>
      </Layout>
    );
  }
}

export default App;
