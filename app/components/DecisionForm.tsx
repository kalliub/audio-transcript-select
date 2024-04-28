import { Button, CircularProgress, Grid, TextField } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useFetcher } from "react-router-dom";
import { cleanSpeakersString } from "~/utils/formatters";

interface DefaultFormProps {
  defaultSpeaker?: string[];
}

const DecisionForm = ({ defaultSpeaker = [] }: DefaultFormProps) => {
  const textFieldRef = useRef<HTMLInputElement>(null);
  const decisionFetcher = useFetcher();
  const isLoading = decisionFetcher.state !== "idle";
  const [speakers, setSpeakers] = useState<string>("");

  useEffect(() => {
    const joinedDefaultSpeaker = defaultSpeaker.join(",");
    setSpeakers(cleanSpeakersString(joinedDefaultSpeaker));
  }, [defaultSpeaker]);

  useEffect(() => {
    if (decisionFetcher.state === "idle" && textFieldRef.current) {
      textFieldRef.current.focus();
    }
  }, [decisionFetcher, defaultSpeaker]);

  const handleSubmit = () => {
    decisionFetcher.submit(
      {
        speakers: speakers || "",
      },
      {
        method: "POST",
      },
    );
  };
  return (
    <Grid container flexDirection={"column"}>
      <Grid item xs={3} display="flex" gap={2}>
        <TextField
          inputRef={textFieldRef}
          label="Speaker(s)"
          size="small"
          inputProps={{
            min: 0,
            autoFocus: true,
          }}
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus
          disabled={isLoading}
          onChange={(e) => {
            const {
              target: { value },
            } = e;
            setSpeakers(cleanSpeakersString(value));
          }}
          onKeyDown={
            isLoading
              ? undefined
              : (e) => {
                  if (e.key === "Enter") {
                    handleSubmit();
                  }
                }
          }
          value={speakers}
        />

        <Button
          variant="contained"
          disabled={isLoading || speakers.length === 0}
          onClick={handleSubmit}
          size="small"
          sx={{ height: 40 }}
        >
          {isLoading ? (
            <CircularProgress size={24} sx={{ color: "white" }} />
          ) : (
            "Submit"
          )}
        </Button>
      </Grid>

      <span
        style={{ color: "rgba(0,0,0,0.5)", fontSize: "12px", marginLeft: 4 }}
      >
        Only numbers and commas are accepted
      </span>
    </Grid>
  );
};

export default DecisionForm;
