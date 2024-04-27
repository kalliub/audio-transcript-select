import { Button, Grid, TextField } from "@mui/material";
import type { MetaFunction } from "@remix-run/node";
import { Link, useNavigate } from "@remix-run/react";
import { useState } from "react";
import Icon from "~/components/CustomIcon";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

const Index = () => {
  const navigate = useNavigate();
  const [goto, setGoto] = useState(1);
  const startEpisodeLink = `/episode/${goto}/segment/0`;

  return (
    <Grid container flexDirection="column" gap={1}>
      <h1>Episodes</h1>

      <Grid container alignItems="center" gap={2}>
        <TextField
          size="small"
          placeholder="Go to episode..."
          type="number"
          inputProps={{ min: 1 }}
          onChange={(e) => setGoto(Number(e.target.value ?? 1))}
          error={goto < 1 || goto > 200}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              if (goto >= 1 && goto <= 200) {
                navigate(startEpisodeLink);
              }
            }
          }}
        />
        <Link to={startEpisodeLink}>
          <Button variant="contained" disabled={goto < 1 || goto > 200}>
            <Icon name="angle-right" />
          </Button>
        </Link>
      </Grid>
    </Grid>
  );
};

export default Index;
