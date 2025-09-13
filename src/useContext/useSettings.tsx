"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { toast } from "sonner";
import { useAuth } from "./AppState";

// --- Types ---
export type Preferences = {
  Theme: string;
  FontSize: string;
  twoFactor: boolean;
  FontFamily: string;
  signatures: { id: string; signature: string }[];
  InboxLayout: string;
  AutoSaveDraft?: boolean;
  ApplyToAddress?: string;
  SpamFilters?: {
    SpamProtectionLevel?: string;
    AutomaticallyDeleteSpam?: boolean;
    ShowSpamNotification?: boolean;
  };
  KeySettings: {
    keyserver: string;
    SignAllOutgoingMessage: boolean;
    AutoDownloadPublicKeyas: boolean;
    AttachPublicKeyToMessage: boolean;
  };
  ComposerMode: string;
  HideSenderIP?: boolean;
  HideSenderIp?: boolean;
  UndoSendTime: string;
  E2EEncryption: boolean;
  Notifications: {
    NewEmailNotifications: boolean;
    NewsLetterNotifications: boolean;
    CalendarEventNotifications: boolean;
    ImportantEmailNotifications: boolean;
  };
  EncryptionKeys: {
    user: string;
    Created: string;
    Expires: string;
    KeySize: number;
    user_id: number;
    FingerPrint: string;
  }[];
  AttachPublicKey: boolean;
  MailReadMarking: string;
  SignAllMessages: boolean;
  SendReadReceipts: string;
  AttachmentReminder: boolean;
  FixedAutoResponder: {
    status: boolean;
    EndDate: string;
    Message: string;
    Subject: string;
    StartDate: string;
    SendOncePerSender: boolean;
    SendToContactsOnly: boolean;
    SendOncePerDay?: boolean;
  };
  MobileNotification: {
    QuietHours: boolean;
    QuietHoursEnd: string;
    QuietHoursStart: string;
    PushNotification: boolean;
    EmailPreviewInNotification: boolean;
  };
  CrashReportsEnabled: boolean;
  DefaultComposerSize: string;
  DefaultSendBehavior: string;
  RequestReadReceipts: boolean;
  UsageDataCollection: boolean;
  AutoLoadRemoteContent: boolean;
  VacationAutoResponder: {
    status: boolean;
    EndDate: string;
    Message: string;
    Subject: string;
    StartDate: string;
    SendOncePerSender: boolean;
    SendToContactsOnly: boolean;
  };
  NotificationPreference: {
    SoundAlerts: boolean;
    DesktopNotifications: boolean;
    NotificationDuration: string;
    BrowserTabNotifications: boolean;
  };
  RequestLinkConfirmation: boolean;
  includeSignatureByDefault: boolean;
};

interface SettingsContextType {
  preferences: Preferences | null;
  profile: any | null;
  setPreferences: React.Dispatch<React.SetStateAction<Preferences | null>>;
  updatePreferences: (name: string, value: any) => void;
  submitUpdatedPreferences: (
    updatedPrefObj?: Partial<Preferences>
  ) => Promise<void>;
  toggleAndUpdatePreference: (name: string, value: any) => Promise<void>;
  fetchPreferences: () => Promise<void>;
  getPreferenceOptions: <K extends keyof Preferences>(
    ...keys: K[]
  ) => Pick<Preferences, K>;
  settingOpen: boolean;
  setSettingOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const baseUrl = import.meta.env.VITE_API_BASE_URL as string;

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [preferences, setPreferences] = useState<Preferences | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [settingOpen, setSettingOpen] = useState(false);
  const { token } = useAuth();

  const formatPreferenceName = (key: string) => {
    return key
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  };

  const formatPreferenceValue = (value: any) => {
    if (typeof value === "boolean") return value ? "Enabled" : "Disabled";
    if (typeof value === "string") {
      return value
        .replace(/_/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
    }
    return String(value);
  };

  const fetchPreferences = async () => {
    if (!token) return;

    try {
      const res = await fetch(`${baseUrl}/users/profile`, {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      const data: { preferences: Preferences } = await res.json();
      setPreferences(data.preferences);
      setProfile(data);
    } catch (err) {
      console.error("❌ Failed to load preferences:", err);
      // toast.error("Failed to load preferences");
    }
  };

  const updatePreferences = (name: string, value: any) => {
    setPreferences((prev) => {
      if (!prev) return null;
      const updated = { ...prev, [name]: value };
      toast.success(
        `${formatPreferenceName(name)} changed to  ${formatPreferenceValue(
          value
        )}`
      );
      return updated;
    });
  };

  const submitUpdatedPreferences = async (
    updatedPrefObj?: Partial<Preferences>
  ) => {
    const finalPayload = updatedPrefObj || preferences;
    if (!finalPayload || !preferences) return;

    const changedPrefs = Object.entries(finalPayload).filter(([key, value]) => {
      return preferences[key as keyof Preferences] !== value;
    });

    if (changedPrefs.length === 0) {
      toast.info("No preferences changed.");
      return;
    }

    const payloadToSend = Object.fromEntries(changedPrefs);

    try {
      const response = await fetch(`${baseUrl}/users/update-preference`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify(payloadToSend),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Update locally
      setPreferences((prev) =>
        prev ? { ...prev, ...payloadToSend } : prev
      );

      // Toast each change
      changedPrefs.forEach(([key, value]) => {
        
        
        toast.success(
          `UB ${formatPreferenceName(key)} updated to ${formatPreferenceValue(
            value
          )}`
        );
      });
    } catch (err) {
      console.error("❌ Failed to update preferences:", err);
      toast.error("Error updating preferences");
    }
  };

  const toggleAndUpdatePreference = async (name: string, value: any) => {
    if (!preferences) return;
    const updated = { ...preferences, [name]: value };
    
    setPreferences(updated);
    await submitUpdatedPreferences({ [name]: value });
  };

  const getPreferenceOptions = <K extends keyof Preferences>(
    ...keys: K[]
  ): Pick<Preferences, K> => {
    if (!preferences) return {} as Pick<Preferences, K>;
    const result: Partial<Preferences> = {};
    keys.forEach((key) => {
      result[key] = preferences[key];
    });
    return result as Pick<Preferences, K>;
  };

  useEffect(() => {
    fetchPreferences();
  }, [token]);

  return (
    <SettingsContext.Provider
      value={{
        preferences,
        setPreferences,
        profile,
        updatePreferences,
        submitUpdatedPreferences,
        toggleAndUpdatePreference,
        fetchPreferences,
        getPreferenceOptions,
        settingOpen,
        setSettingOpen,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};
