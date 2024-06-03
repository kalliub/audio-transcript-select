import { Grid } from "@mui/material";
import { LoaderFunctionArgs, json } from "@remix-run/node";
import { Link, useLoaderData, useParams } from "@remix-run/react";
import { DecisionService } from "~/api/DecisionService";
import { getJsonEpisodeFile } from "~/utils/jsonFile";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { episodeId = "" } = params;

  const everyEpisodeDecision =
    await DecisionService.getDecisionsByEpisode(episodeId);

  const episodeJson = await getJsonEpisodeFile(episodeId);

  const missingEpisodesOnDatabase: number[] = [];
  episodeJson.forEach((jsonSegment) => {
    const isSegmentOnDatabase = everyEpisodeDecision.some(
      (decision) => decision.segmentId === jsonSegment.id,
    );

    if (!isSegmentOnDatabase) {
      missingEpisodesOnDatabase.push(jsonSegment.id);
    }
  });

  return json({
    missingEpisodesOnDatabase,
    jsonSegmentsLength: episodeJson.length,
  });
};

const EpisodeCheck = () => {
  const { episodeId } = useParams();
  const { missingEpisodesOnDatabase, jsonSegmentsLength } =
    useLoaderData<typeof loader>();
  return (
    <Grid container flexDirection="column" gap={2}>
      {missingEpisodesOnDatabase.length > 0 ? (
        <>
          <h1>Missing segments</h1>
          <span>
            There are
            <b> {missingEpisodesOnDatabase.length} segments missing </b>
            in the database from a total of {jsonSegmentsLength} segments on the
            raw JSON.
          </span>
          <span>
            The missing Segment IDs are:
            <ul>
              {missingEpisodesOnDatabase.map((segmentId) => (
                <Link
                  key={segmentId}
                  to={`/episode/${episodeId}/segment/${segmentId}`}
                >
                  <li>{segmentId}</li>
                </Link>
              ))}
            </ul>
          </span>
        </>
      ) : (
        <>
          <h1>This episode is done.</h1>
          <span>All the segments were checked in the database.</span>
        </>
      )}
    </Grid>
  );
};

export default EpisodeCheck;
