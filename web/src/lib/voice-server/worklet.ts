/**
 * Vendored from antaymard/voice-server (client/src/worklet.ts) at commit
 * 1fcca23c4209ee7f9db9bbd8e6cdd84589abbdb0. Re-sync manually if upstream
 * changes the worklet processor.
 *
 * Locally patched (not upstream yet): no client-side resampling. The
 * AudioContext is still asked for 16 kHz (cheap, handled by the browser's
 * audio engine), but if it's ignored we send the PCM as captured instead of
 * running a per-sample interpolation loop on the audio thread — mirrors
 * antaymard/nolenor's useLiveTranscription worklet. The actual rate is
 * reported to the server in the `start` message (see useRealtimeTranscription).
 *
 * Inline AudioWorklet processor source, loaded via a Blob URL so consuming
 * apps need no extra static asset.
 */
export const PCM_PROCESSOR_SOURCE = String.raw`
class PcmProcessor extends AudioWorkletProcessor {
  constructor(options) {
    super();
    const opts = (options && options.processorOptions) || {};
    // sampleRate is the AudioWorkletGlobalScope rate (the context's actual rate).
    this.chunkSamples = Math.max(1, Math.round((sampleRate * (opts.chunkMs || 100)) / 1000));
    this.out = new Int16Array(this.chunkSamples);
    this.outOffset = 0;
    this.stopped = false;
    this.port.onmessage = (e) => {
      if (e.data && e.data.type === "flush") {
        this.flush();
        this.port.postMessage({ type: "flushed" });
        this.stopped = true;
      }
    };
  }

  flush() {
    if (this.outOffset > 0) {
      const tail = this.out.slice(0, this.outOffset);
      this.port.postMessage(tail.buffer, [tail.buffer]);
      this.outOffset = 0;
    }
  }

  pushSample(value) {
    const v = Math.max(-1, Math.min(1, value));
    this.out[this.outOffset++] = v < 0 ? v * 0x8000 : v * 0x7fff;
    if (this.outOffset === this.chunkSamples) {
      const full = this.out;
      this.port.postMessage(full.buffer, [full.buffer]);
      this.out = new Int16Array(this.chunkSamples);
      this.outOffset = 0;
    }
  }

  process(inputs) {
    if (this.stopped) return false;
    const input = inputs[0];
    if (!input || input.length === 0 || !input[0] || input[0].length === 0) return true;

    const frames = input[0].length;
    if (input.length === 1) {
      const mono = input[0];
      for (let i = 0; i < frames; i++) this.pushSample(mono[i]);
      return true;
    }

    for (let i = 0; i < frames; i++) {
      let sum = 0;
      for (let ch = 0; ch < input.length; ch++) sum += input[ch][i];
      this.pushSample(sum / input.length);
    }
    return true;
  }
}

registerProcessor("pcm-processor", PcmProcessor);
`;

let cachedUrl: string | null = null;

/** Blob URL for the worklet module. Pass `workletUrl` to the hook instead if your CSP forbids blob: workers. */
export function createPcmWorkletUrl(): string {
  if (!cachedUrl) {
    cachedUrl = URL.createObjectURL(
      new Blob([PCM_PROCESSOR_SOURCE], { type: "application/javascript" }),
    );
  }
  return cachedUrl;
}
