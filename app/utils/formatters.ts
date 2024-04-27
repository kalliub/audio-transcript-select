export const extractSpeakersArrayFromString = (rawSpeakers: string) => {
  return (rawSpeakers.match(new RegExp(/\d*/g)) ?? []).filter((s) => s.length);
};

export const cleanSpeakersString = (rawSpeakers: string) => {
  return rawSpeakers.replaceAll(/[^\d,]|,0|^0/g, "");
};
