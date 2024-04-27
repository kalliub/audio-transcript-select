export const isJsonString = (value: unknown) => {
  try {
    if (typeof value !== "string") throw new Error();
    JSON.parse(value);
    return true;
  } catch {
    return false;
  }
};

/**
 * Converts the action FormData into an JSON.
 * In addition, converts all string values that are parseable JSON.
 *
 * @param request The request parameter from the Action.
 * @returns The converted object.
 */
export const getJSONActionData = async (
  request: Request,
): Promise<Record<string, unknown>> => {
  const formData = await request.formData();

  try {
    // Yes, this double JSON parsing is needed.
    // Otherwise, the object values are going to have FormDataEntryValues type.
    const jsonData = JSON.parse(JSON.stringify(Object.fromEntries(formData)));
    return Object.fromEntries(
      Object.entries(jsonData).map(([key, value]) => [
        key,
        isJsonString(value) ? JSON.parse(value as string) : value,
      ]),
    );
  } catch {
    return Object.fromEntries(formData);
  }
};
