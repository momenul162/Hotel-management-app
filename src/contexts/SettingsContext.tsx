import { createContext, useContext, useEffect, ReactNode } from "react";
import {
  getSettings,
  saveSettingsAsync,
  setAnimations,
  setCompactView,
  setTheme,
  SettingsState,
  updateSetting,
} from "../redux/slices/settingsSlice";
import { useAppDispatch, useAppSelector } from "../redux/hooks";

type SettingsContextType = {
  settings: SettingsState;
  loading: boolean;
  error: string | null;
  updateSetting: <K extends keyof Omit<SettingsState, "loading" | "error">>(
    key: K,
    value: SettingsState[K]
  ) => void;
  saveSettings: () => Promise<void>;
  setTheme: (theme: "light" | "dark") => void;
  setAnimations: (enabled: boolean) => void;
  setCompactView: (enabled: boolean) => void;
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const dispatch = useAppDispatch();
  const settings = useAppSelector((state) => state.settings);
  const { loading, error } = settings;

  useEffect(() => {
    dispatch(getSettings());
  }, [dispatch]);

  const handleUpdateSetting = <K extends keyof Omit<SettingsState, "loading" | "error">>(
    key: K,
    value: SettingsState[K]
  ) => {
    dispatch(updateSetting({ key, value }));
  };

  const handleSaveSettings = async () => {
    // Create a new object without loading and error properties
    const { loading, error, ...settingsToSave } = settings;
    await dispatch(saveSettingsAsync(settingsToSave));
  };

  const handleSetTheme = (theme: "light" | "dark") => {
    dispatch(setTheme(theme));
  };

  const handleSetAnimations = (enabled: boolean) => {
    dispatch(setAnimations(enabled));
  };

  const handleSetCompactView = (enabled: boolean) => {
    dispatch(setCompactView(enabled));
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        loading,
        error,
        updateSetting: handleUpdateSetting,
        saveSettings: handleSaveSettings,
        setTheme: handleSetTheme,
        setAnimations: handleSetAnimations,
        setCompactView: handleSetCompactView,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};
