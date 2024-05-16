import { Button, Grid, TextField, Tooltip } from "@mui/material";
import type { MetaFunction } from "@remix-run/node";
import { Link, useFetcher, useNavigate } from "@remix-run/react";
import { useState } from "react";
import CustomIcon from "~/components/CustomIcon";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

const Index = () => {
  const navigate = useNavigate();
  const [goto, setGoto] = useState(1);
  const downloadEverythingFetcher = useFetcher();
  const startEpisodeLink = `/episode/${goto}/segment/0`;

  return (
    <Grid container flexDirection="column" gap={1}>
      <Grid container alignItems="center" gap={2}>
        <h1>Episodes</h1>
        <Tooltip
          title="Download JSON file with EVERY EPISODE submitted to the database"
          placement="right"
          arrow
        >
          <Link
            to={`/episodes/download`}
            download={`all-segments.json`}
            reloadDocument
          >
            <Button
              id="download-episodes"
              variant="text"
              onClick={() => {
                downloadEverythingFetcher.submit(
                  {},
                  {
                    action: `/episodes/download`,
                    method: "GET",
                  },
                );
              }}
            >
              <CustomIcon name="download-alt" size="large" />
            </Button>
          </Link>
        </Tooltip>
      </Grid>

      <Grid container alignItems="center" gap={2}>
        <TextField
          label="Episode Number"
          size="small"
          placeholder="Go to episode..."
          type="number"
          defaultValue={1}
          inputProps={{ min: 1, id: "episode-number" }}
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
          <Button
            variant="contained"
            id="goto-episode"
            disabled={goto < 1 || goto > 200}
          >
            <CustomIcon name="angle-right" />
          </Button>
        </Link>
      </Grid>
    </Grid>
  );
};

export default Index;
