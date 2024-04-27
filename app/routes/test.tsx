import { Button, Grid } from "@mui/material";
import { Link } from "@remix-run/react";

const Test = () => {
  return (
    <Grid container flexDirection={"column"}>
      <h1>test</h1>
      <Link to="/">
        <Button variant="contained">HOME</Button>
      </Link>
    </Grid>
  );
};

export default Test;
