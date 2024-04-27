import { Button, Grid, TextField } from "@mui/material";
import {
  Form,
  useNavigate,
  useOutletContext,
  useParams,
} from "@remix-run/react";
import { useState } from "react";

const SegmentRoute = () => {
  const navigate = useNavigate();
  const data = useOutletContext<{
    segments: Segment[];
    onSubmitDecision: (newDecision: Decision) => void;
  }>();
  const [decisionNumber, setDecisionNumber] = useState<number | null>(null);
  const { segmentId = "0", episodeId = "" } = useParams();
  const numberSegmentId = Number(segmentId);
  const segment = data?.segments[numberSegmentId];
  const nextSegmentLink = `/episode/${episodeId}/segment/${numberSegmentId + 1}`;

  if (!segment) {
    return <h1>This segment does not exist</h1>;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = (e: any) => {
    e.preventDefault();
    data.onSubmitDecision({
      segment,
      decision: decisionNumber?.toString() ?? "-",
    });
    navigate(nextSegmentLink);
  };

  return (
    <Grid container flexDirection="column" gap={2}>
      {segment.text}

      <Grid item xs={3}>
        <Form onSubmit={handleSubmit} style={{ display: "flex", gap: "8px" }}>
          <TextField
            label="Decision"
            size="small"
            type="number"
            onChange={(e) => setDecisionNumber(Number(e.target.value))}
            inputProps={{
              min: 0,
            }}
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
          />

          <Button
            type="submit"
            variant="contained"
            onClick={() =>
              data.onSubmitDecision({
                segment,
                decision: decisionNumber?.toString() ?? "-",
              })
            }
          >
            submit
          </Button>
        </Form>
      </Grid>
    </Grid>
  );
};

export default SegmentRoute;
