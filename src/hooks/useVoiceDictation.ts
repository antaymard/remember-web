import { useCallback, useEffect, useRef } from "react";
import { api } from "../../convex/_generated/api";
import { useAuthenticatedQueryWithStatus } from "./useQueryWithStatus";
import {
  useRealtimeTranscription,
  type TranscriptionStatus,
} from "@/lib/voice-server/useRealtimeTranscription";

export type UseVoiceDictationResult = {
  /** Config loaded, user authenticated, and the browser supports mic capture. */
  isAvailable: boolean;
  status: TranscriptionStatus;
  error: string | null;
  /** Starts dictation if idle/error, stops it if listening. */
  toggle: () => void;
};

/**
 * Wires the vendored voice-server realtime hook to Convex (for the
 * url/token) and reports each transcript update via `onTranscriptUpdate`,
 * leaving composition with any existing field value to the caller.
 */
export function useVoiceDictation(
  onTranscriptUpdate: (sessionText: string) => void,
): UseVoiceDictationResult {
  const config = useAuthenticatedQueryWithStatus(api.voiceServer.realtimeConfig, {});
  const serverUrl = config.data?.url ?? "";
  const token = config.data?.token ?? "";

  const { status, text, error, start, stop } = useRealtimeTranscription({
    serverUrl,
    token,
  });

  const onTranscriptUpdateRef = useRef(onTranscriptUpdate);
  // eslint-disable-next-line react-hooks/refs -- latest-ref pattern, read only in the effect below
  onTranscriptUpdateRef.current = onTranscriptUpdate;

  useEffect(() => {
    if (status === "listening" || status === "stopping") {
      onTranscriptUpdateRef.current(text);
    }
  }, [text, status]);

  const isAvailable =
    config.isSuccess &&
    config.data !== null &&
    typeof navigator !== "undefined" &&
    !!navigator.mediaDevices?.getUserMedia;

  const toggle = useCallback(() => {
    if (!isAvailable) return;
    if (status === "idle" || status === "error") {
      void start();
    } else if (status === "listening") {
      void stop();
    }
  }, [isAvailable, status, start, stop]);

  return {
    isAvailable,
    status,
    error: error?.message ?? null,
    toggle,
  };
}
