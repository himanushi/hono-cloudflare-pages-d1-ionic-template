import { Preferences } from "@capacitor/preferences";
import type {
  PersistedClient,
  Persister,
} from "@tanstack/react-query-persist-client";

export const createPreferencesPersister = (key = "reactQuery") =>
  ({
    persistClient: async (client: PersistedClient) => {
      const jsonClient = JSON.stringify(client);
      await Preferences.set({ key, value: jsonClient });
    },
    restoreClient: async () => {
      const result = await Preferences.get({ key });
      return result.value
        ? (JSON.parse(result.value) as PersistedClient)
        : null;
    },
    removeClient: async () => {
      await Preferences.remove({ key });
    },
  }) as Persister;
