import { Box, Button, Grid } from "@mui/material";
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
} from "@remix-run/node";
import {
  useLoaderData,
  useNavigate,
  useOutletContext,
  useParams,
} from "@remix-run/react";
import { useEffect } from "react";
import { DecisionService } from "~/api/DecisionService";
import DecisionForm from "~/components/DecisionForm";
import { extractSpeakersArrayFromString } from "~/utils/formatters";
import { getJSONActionData } from "~/utils/remix";

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
      const { speakers } = await getJSONActionData(request);
      const parsedSpeakers = String(speakers)
        .split(",")
        .filter((s) => s && s.length > 0);
      const decisionService = new DecisionService();
      await decisionService.upsertDecision({
        episodeId,
        segmentId,
        speakers: parsedSpeakers,
      });
      return redirect(`/episode/${episodeId}/segment/${Number(segmentId) + 1}`);
    }
    default:
      return new Response("Method not allowed.", { status: 405 });
  }
};

const audioPool: HTMLAudioElement[] = [];

const SegmentRoute = () => {
  const navigate = useNavigate();
  const decisionFromDatabase = useLoaderData<typeof loader>();
  const data = useOutletContext<{ segments: Segment[] }>();
  const { segmentId = "0", episodeId = "" } = useParams();
  const numberSegmentId = Number(segmentId);
  const segment = data?.segments[numberSegmentId];

  useEffect(() => {
    function playAudio(url: string) {
      // Stop all playing audios first
      audioPool.forEach((audio) => {
        if (!audio.paused) {
          audio.pause();
          audio.currentTime = 0;
        }
      });

      // Find or create an Audio object for the new URL
      let audio = audioPool.find((a) => a.src === url);
      if (!audio) {
        audio = new Audio(url);
        audioPool.push(audio);
      }

      audio.play();
    }

    playAudio(
      `${ENV.ASSETS_URL}/data/${episodeId}/fragments/${segment.start}_${segment.end}.mp3`,
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [segmentId]);

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
        flexDirection="column"
        gap={1}
        border={`1px solid rgba(0,0,0,0.2)`}
        p={2}
      >
        <h3 style={{ fontSize: 22, margin: 0 }}>
          {`# ${numberSegmentId} `}
          <span style={{ fontSize: 14, fontWeight: "normal" }}>
            of {data.segments.length - 1} segments
          </span>
        </h3>

        <span>
          Timestamp: {segment.start} ~ {segment.end}
        </span>
      </Box>
      <span style={{ backgroundColor: "rgba(0,0,0,0.1)", padding: "8px 8px" }}>
        {segment.text}
      </span>

      <DecisionForm
        defaultSpeaker={
          decisionFromDatabase?.speakers ||
          extractSpeakersArrayFromString(segment.speakers)
        }
      />
    </Grid>
  );
};

export default SegmentRoute;
