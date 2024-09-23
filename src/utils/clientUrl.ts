export const clientUrl =
  import.meta.env.MODE === "development"
    ? `${location.protocol}//${location.hostname}:3000`
    : location.origin;
