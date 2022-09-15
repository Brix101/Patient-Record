import * as React from "react";
import AppAppBar from "../components/modules/views/AppBar";
import AppFooter from "../components/modules/views/AppFootBar";
import ProductCategories from "../components/modules/views/ProductCategories";
import ProductCTA from "../components/modules/views/ProductCTA";
import ProductHero from "../components/modules/views/ProductHero";
import ProductHowItWorks from "../components/modules/views/ProductHowItWorks";
import ProductSmokingHero from "../components/modules/views/ProductSmokingHero";
import ProductValues from "../components/modules/views/ProductValues";
import withRoot from "../components/modules/withRoot";

function Home() {
  return (
    <React.Fragment>
      <AppAppBar />
      <ProductHero />
      <ProductValues />
      <ProductCategories />
      <ProductHowItWorks />
      <ProductCTA />
      <ProductSmokingHero />
      <AppFooter />
    </React.Fragment>
  );
}

export default withRoot(Home);
