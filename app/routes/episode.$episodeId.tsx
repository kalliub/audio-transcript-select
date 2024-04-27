import { Button, Grid } from "@mui/material";
import { LoaderFunction, json } from "@remix-run/node";
import {
  Link,
  Outlet,
  ShouldRevalidateFunction,
  useLoaderData,
  useParams,
} from "@remix-run/react";
import { useCallback, useState } from "react";
import CustomIcon from "~/components/CustomIcon";

export const loader: LoaderFunction = async ({ params }) => {
  try {
    const { episodeId } = params;

    const jsonFile = await import(`../data/${episodeId}/data.json`);

    return json(jsonFile.default);
  } catch {
    throw new Error("Episode file not found");
  }
};

export const shouldRevalidate: ShouldRevalidateFunction = () => false;

const Episode = () => {
  const { episodeId } = useParams();
  const data = useLoaderData<EpisodeData>();
  const [decisions, setDecisions] = useState<Decision[]>([]);

  const setNewDecision = useCallback((newDecision: Decision) => {
    setDecisions((prev) => [...prev, newDecision]);
  }, []);

  return (
    <Grid container flexDirection="column">
      <Grid item display="flex" gap={2} alignItems="center">
        <Link to="/">
          <Button variant="text">
            <CustomIcon name="angle-left" size="large" />
          </Button>
        </Link>
        <h1>Episode #{episodeId}</h1>
      </Grid>

      <Grid container flexDirection={"column"} gap={2}>
        <Outlet
          context={{
            segments: data.segments,
            onSubmitDecision: setNewDecision,
          }}
        />
      </Grid>

      <pre>{JSON.stringify(decisions, null, 2)}</pre>
    </Grid>
  );
};

export default Episode;
