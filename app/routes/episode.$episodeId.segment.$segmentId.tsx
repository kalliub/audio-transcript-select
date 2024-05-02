import { Alert, Box, Button, Grid } from "@mui/material";
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
} from "@remix-run/node";
import {
  Link,
  useLoaderData,
  useNavigate,
  useOutletContext,
  useParams,
} from "@remix-run/react";
import { DecisionService } from "~/api/DecisionService";
import DecisionForm from "~/components/DecisionForm";
import { extractSpeakersArrayFromString } from "~/utils/formatters";
import { getJSONActionData } from "~/utils/remix";
import CustomIcon from "~/components/CustomIcon";
import { useState } from "react";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { episodeId = "", segmentId = "" } = params;
  const decisionService = new DecisionService();
  const decisionFromDatabase = await decisionService.getDecision({
    episodeId,
    segmentId,
  });

  return json(decisionFromDatabase);
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const { episodeId = "", segmentId = "" } = params;

  switch (request.method) {
    case "POST": {
      const { speakers, isLastSegment } = await getJSONActionData(request);
      const parsedSpeakers = String(speakers)
        .split(",")
        .filter((s) => s && s.length > 0);
      const decisionService = new DecisionService();
      await decisionService.upsertDecision({
        episodeId,
        segmentId,
        speakers: parsedSpeakers,
      });

      if (isLastSegment) {
        return redirect(`/episode/${episodeId}/check`);
      }
      return redirect(`/episode/${episodeId}/segment/${Number(segmentId) + 1}`);
    }
    default:
      return new Response("Method not allowed.", { status: 405 });
  }
};

const SegmentRoute = () => {
  const navigate = useNavigate();
  const [audioError, setAudioError] = useState<string | null>(null);
  const decisionFromDatabase = useLoaderData<typeof loader>();
  const data = useOutletContext<{ segments: Segment[] }>();
  const { segmentId = "0", episodeId = "" } = useParams();
  const numberSegmentId = Number(segmentId);
  const segment = data?.segments[numberSegmentId];
  const isLastSegment =
    segment.id === data.segments[data.segments.length - 1].id;

  if (!segment) {
    return (
      <Grid container flexDirection="column" gap={2}>
        <h1>Segment not found</h1>
        <Button onClick={() => navigate(-1)} variant="contained">
          Go back
        </Button>
      </Grid>
    );
  }

  return (
    <Grid container flexDirection="column" gap={2}>
      <Box
        display="flex"
        alignItems="flex-start"
        flexDirection="column"
        gap={1}
        border={`1px solid lightgray`}
        p={2}
      >
        <Grid container alignItems="center" gap={2}>
          {segmentId !== "0" && (
            <Link to={`/episode/${episodeId}/segment/${numberSegmentId - 1}`}>
              <Button
                variant="text"
                size="small"
                color="info"
                sx={{ px: 1, minWidth: 0 }}
              >
                <CustomIcon name="angle-left" />
              </Button>
            </Link>
          )}
          <h3 style={{ fontSize: 22, margin: 0 }}>
            {`# ${numberSegmentId} `}
            <span style={{ fontSize: 14, fontWeight: "normal" }}>
              of {data.segments.length - 1} segments
            </span>
          </h3>
        </Grid>

        {audioError && <Alert severity="error">{audioError}</Alert>}
        <audio
          controls
          src={`/audios/${episodeId}?start=${segment.start}&end=${segment.end}`}
          autoPlay
          onError={() => setAudioError("Error while loading audio")}
          onLoadedData={() => setAudioError(null)}
        >
          <track kind="captions" />
          Your browser does not support the
          <code>audio</code> element.
        </audio>

        <span>
          Timestamp: {segment.start} ~ {segment.end}
        </span>
        <span style={{ backgroundColor: "whitesmoke", padding: "8px 8px" }}>
          {segment.text}
        </span>
      </Box>

      <DecisionForm
        {...{ isLastSegment }}
        defaultSpeaker={
          decisionFromDatabase?.speakers ||
          extractSpeakersArrayFromString(segment.speakers)
        }
      />
    </Grid>
  );
};

export default SegmentRoute;
