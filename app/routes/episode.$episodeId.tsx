import { Button, Grid, Tooltip } from "@mui/material";
import { LoaderFunctionArgs, json } from "@remix-run/node";
import {
  Link,
  Outlet,
  ShouldRevalidateFunction,
  useFetcher,
  useLoaderData,
  useLocation,
  useNavigate,
  useParams,
} from "@remix-run/react";
import { useEffect } from "react";
import CustomIcon from "~/components/CustomIcon";
import { getJsonEpisodeFile } from "~/utils/jsonFile";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { episodeId = "" } = params;

  const parsedJsonFile = await getJsonEpisodeFile(episodeId);

  if (!parsedJsonFile) throw new Error("Episode file not found.");

  return json(parsedJsonFile, {
    headers: {
      "Cache-Control": "public, max-age=3600",
      "Content-Type": "application/json",
    },
  });
};

export const shouldRevalidate: ShouldRevalidateFunction = () => false;

const Episode = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { episodeId } = useParams();
  const segments = useLoaderData<typeof loader>();
  const downloadFetcher = useFetcher();

  useEffect(() => {
    if (RegExp(`^/episode/${episodeId}/?$`).test(location.pathname)) {
      navigate("segment/0");
    }
  }, [episodeId, location, navigate]);

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
            <Button variant="outlined" id="check-episode">
              Check Episode
            </Button>
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
