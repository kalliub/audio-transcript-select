import { Button, Grid, Tooltip } from "@mui/material";
import { LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import {
  Link,
  Outlet,
  ShouldRevalidateFunction,
  useFetcher,
  useLoaderData,
  useLocation,
  useParams,
} from "@remix-run/react";
import CustomIcon from "~/components/CustomIcon";
import { getJsonEpisodeFile } from "~/utils/jsonFile";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  try {
    const { episodeId = "", segmentId = "" } = params;
    if (segmentId.length === 0) {
      return redirect(`/episode/${params.episodeId}/check`);
    }

    const parsedJsonFile = getJsonEpisodeFile(episodeId);

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
  const location = useLocation();
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
          title="Download JSON file with all speakers from this episode on the database"
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

        {!location.pathname.includes("/check") && (
          <Link to={`/episode/${episodeId}/check`}>
            <Button variant="outlined">Check Episode</Button>
          </Link>
        )}
      </Grid>

      <Grid container flexDirection={"column"} gap={2}>
        <Outlet context={{ segments }} />
      </Grid>
    </Grid>
  );
};

export default Episode;
