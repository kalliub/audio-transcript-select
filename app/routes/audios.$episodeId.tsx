import { LoaderFunctionArgs, json } from "@remix-run/node";
import fs from "fs/promises";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const { episodeId } = params;
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.searchParams);
  const startTimestamp = searchParams.get("start");
  const endTimestamp = searchParams.get("end");

  if (!episodeId || !startTimestamp || !endTimestamp) {
    throw new Error("Missing required parameters.");
  }

  const audioPath =
    process.cwd() +
    `/app/data/${episodeId}/fragments/${startTimestamp}_${endTimestamp}.mp3`;

  try {
    const audioBuffer = await fs.readFile(audioPath);

    return new Response(audioBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
      },
    });
  } catch (error) {
    console.log("Error while loading audio file", error);
    return json({ error: "File not found." }, { status: 404 });
  }
};
