import { Button, Grid, Tooltip } from "@mui/material";
import { LoaderFunctionArgs, json } from "@remix-run/node";
import {
  Link,
  Outlet,
  ShouldRevalidateFunction,
  useFetcher,
  useLoaderData,
  useParams,
} from "@remix-run/react";
import fs from "fs/promises";
import CustomIcon from "~/components/CustomIcon";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  try {
    const { episodeId } = params;

    const jsonFileBuffer = await fs.readFile(
      `${process.cwd()}/app/data/${episodeId}/data.json`,
    );

    const parsedJsonFile = JSON.parse(jsonFileBuffer.toString());

    return json(parsedJsonFile, {
      headers: {
        "Cache-Control": "public, max-age=3600",
        "Content-Type": "application/json",
      },
    });
  } catch {
    throw new Error("Episode file not found");
  }
};

export const shouldRevalidate: ShouldRevalidateFunction = () => false;

const Episode = () => {
  const { episodeId } = useParams();
  const segments = useLoaderData<typeof loader>();
  const downloadFetcher = useFetcher();

  return (
    <Grid container flexDirection="column">
      <Grid item display="flex" gap={2} alignItems="center">
        <Link to="/">
          <Button variant="text">
            <CustomIcon name="angle-left" size="large" />
          </Button>
        </Link>
        <h1>Episode {episodeId}</h1>
        <Tooltip
          title="Download JSON with all submitted speakers"
          placement="right"
          arrow
        >
          <Link
            to={`/episode/${episodeId}/download`}
            download={`episode-${episodeId}-segments.json`}
            reloadDocument
          >
            <Button
              variant="text"
              onClick={() => {
                downloadFetcher.submit(
                  {},
                  {
                    action: `/episode/${episodeId}/download`,
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

      <Grid container flexDirection={"column"} gap={2}>
        <Outlet context={{ segments }} />
      </Grid>
    </Grid>
  );
};

export default Episode;
