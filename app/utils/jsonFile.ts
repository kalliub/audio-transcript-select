import fs from "fs/promises";

export const getJsonEpisodeFile = async (
  episodeId: string,
): Promise<Segment[]> => {
  const jsonFile = await fs.readFile(
    `${process.cwd()}${ENV.EPISODES_FILES_PATH}/${episodeId}/data.json`,
  );

  return JSON.parse(jsonFile.toString());
};
