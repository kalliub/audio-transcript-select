import { LoaderFunction } from "@remix-run/node";
import { DecisionService } from "~/api/DecisionService";

export const loader: LoaderFunction = async () => {
  const decisions = await DecisionService.getDecisionsGroupedByEpisode();

  // Download json file with all the decisions
  const json = JSON.stringify(decisions);
  const blob = new Blob([json], { type: "application/json" });
  return new Response(blob, {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename=all-segments.json`,
    },
  });
};
