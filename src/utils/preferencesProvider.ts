import { Preferences } from "@capacitor/preferences";

export const preferencesProvider = (value: string | null) => () => {
  const map = new Map<any, any>(value ? JSON.parse(value) : []);

  window.addEventListener("beforeunload", () => {
    const appCache = JSON.stringify(Array.from(map.entries()));
    Preferences.set({
      key: "app-cache",
      value: appCache,
    });
  });

  return map;
};
