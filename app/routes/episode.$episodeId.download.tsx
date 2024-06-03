import { LoaderFunction } from "@remix-run/node";
import { DecisionService } from "~/api/DecisionService";

export const loader: LoaderFunction = async ({ params }) => {
  const { episodeId } = params;
  const decisions = await DecisionService.getDecisionsByEpisode(
    episodeId || "0",
  );

  // Download json file with all the decisions
  const json = JSON.stringify(decisions);
  const blob = new Blob([json], { type: "application/json" });
  return new Response(blob, {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename=episode-${episodeId}-segments.json`,
    },
  });
};
