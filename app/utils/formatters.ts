export const extractSpeakersArrayFromString = (rawSpeakers = "") => {
  return (RegExp(/\d*/g).exec(rawSpeakers) ?? []).filter((s) => s.length);
};

export const cleanSpeakersString = (rawSpeakers: string) => {
  return rawSpeakers.replaceAll(/[^\d,]/g, "");
};
