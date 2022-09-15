import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import { Theme } from "@mui/material/styles";
import { SxProps } from "@mui/system";
import * as React from "react";
import productCurvyLines from "../../../assets/images/productCurvyLines.png";
import productHowItWorks1 from "../../../assets/images/productHowItWorks1.svg";
import productHowItWorks2 from "../../../assets/images/productHowItWorks2.svg";
import productHowItWorks3 from "../../../assets/images/productHowItWorks3.svg";
import Button from "../components/Button";
import Typography from "../components/Typography";

const item: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  px: 5,
};

const number = {
  fontSize: 24,
  fontFamily: "default",
  color: "secondary.main",
  fontWeight: "medium",
};

const image = {
  height: 55,
  my: 4,
};

function ProductHowItWorks() {
  return (
    <Box
      component="section"
      sx={{ display: "flex", bgcolor: "secondary.light", overflow: "hidden" }}
    >
      <Container
        sx={{
          mt: 10,
          mb: 15,
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box
          component="img"
          src={productCurvyLines}
          alt="curvy lines"
          sx={{
            pointerEvents: "none",
            position: "absolute",
            top: -180,
            opacity: 0.7,
          }}
        />
        <Typography variant="h4" marked="center" component="h2" sx={{ mb: 14 }}>
          How it works
        </Typography>
        <div>
          <Grid container spacing={5}>
            <Grid item xs={12} md={4}>
              <Box sx={item}>
                <Box sx={number}>1.</Box>
                <Box
                  component="img"
                  src={productHowItWorks1}
                  alt="suitcase"
                  sx={image}
                />
                <Typography variant="h5" align="center">
                  Appointment every Wednesday 9am.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={item}>
                <Box sx={number}>2.</Box>
                <Box
                  component="img"
                  src={productHowItWorks2}
                  alt="graph"
                  sx={image}
                />
                <Typography variant="h5" align="center">
                  First come, first served. Our offers are in limited
                  quantities, so be quick.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={item}>
                <Box sx={number}>3.</Box>
                <Box
                  component="img"
                  src={productHowItWorks3}
                  alt="clock"
                  sx={image}
                />
                <Typography variant="h5" align="center">
                  {"New offers every week. New experiences, new surprises. "}
                  {"Your Sundays will no longer be alike."}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </div>
      </Container>
    </Box>
  );
}

export default ProductHowItWorks;
