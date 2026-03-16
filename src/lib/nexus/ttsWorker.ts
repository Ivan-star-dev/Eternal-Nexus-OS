/**
 * ElevenLabs TTS Web Worker bridge.
 * Keeps voice synthesis off the main thread to preserve 60fps.
 */

const ELEVENLABS_VOICES = {
  grok: "pNInz6obpgDQGcFmaJgB", // Adam - confident, humorous
  zeta9: "21m00Tcm4TlvDq8ikWAM", // Rachel - analytical
  kronos: "AZnzlk1XvdvUeBnXmlld", // Domi - deep, temporal
  nanobanana: "EXAVITQu4vr4xnSDxMaL", // Bella - chaotic energy
} as const;

export interface TTSRequest {
  type: "speak";
  text: string;
  voiceId: keyof typeof ELEVENLABS_VOICES;
  apiKey?: string;
}

export interface TTSResponse {
  type: "audio" | "error" | "lip-sync";
  data?: ArrayBuffer;
  visemes?: Array<{ time: number; value: string }>;
  error?: string;
}

/**
 * Synthesize speech via ElevenLabs API.
 * Returns audio buffer and estimated lip-sync viseme data.
 */
export async function synthesizeSpeech(
  text: string,
  voiceKey: keyof typeof ELEVENLABS_VOICES,
  apiKey?: string
): Promise<TTSResponse> {
  if (!apiKey) {
    return {
      type: "error",
      error: "ElevenLabs API key not configured. Voice synthesis disabled.",
    };
  }

  const voiceId = ELEVENLABS_VOICES[voiceKey];

  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "xi-api-key": apiKey,
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_monolingual_v1",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.status}`);
    }

    const audioBuffer = await response.arrayBuffer();

    // Generate estimated visemes from text timing
    const visemes = generateVisemes(text);

    return { type: "audio", data: audioBuffer, visemes };
  } catch (err) {
    return {
      type: "error",
      error: err instanceof Error ? err.message : "TTS synthesis failed",
    };
  }
}

/** Simple viseme estimation from text for lip-sync */
function generateVisemes(
  text: string
): Array<{ time: number; value: string }> {
  const visemeMap: Record<string, string> = {
    a: "aa",
    e: "ee",
    i: "ih",
    o: "oh",
    u: "ou",
    m: "PP",
    b: "PP",
    p: "PP",
    f: "FF",
    v: "FF",
    s: "SS",
    z: "SS",
    t: "TH",
    d: "TH",
    n: "nn",
    l: "nn",
    r: "RR",
    k: "kk",
    g: "kk",
  };

  const result: Array<{ time: number; value: string }> = [];
  const msPerChar = 60; // ~60ms per character average

  for (let i = 0; i < text.length; i++) {
    const ch = text[i].toLowerCase();
    if (visemeMap[ch]) {
      result.push({ time: i * msPerChar, value: visemeMap[ch] });
    }
  }

  return result;
}

/**
 * Hook-friendly wrapper: creates an audio context and plays TTS.
 */
export function createTTSPlayer() {
  let audioContext: AudioContext | null = null;
  let currentSource: AudioBufferSourceNode | null = null;

  return {
    async play(audioData: ArrayBuffer) {
      if (!audioContext) {
        audioContext = new AudioContext();
      }
      // Stop any currently playing audio
      if (currentSource) {
        try { currentSource.stop(); } catch { /* already stopped */ }
      }
      const buffer = await audioContext.decodeAudioData(audioData.slice(0));
      currentSource = audioContext.createBufferSource();
      currentSource.buffer = buffer;
      currentSource.connect(audioContext.destination);
      currentSource.start();
    },
    stop() {
      if (currentSource) {
        try { currentSource.stop(); } catch { /* ok */ }
        currentSource = null;
      }
    },
    dispose() {
      this.stop();
      if (audioContext) {
        audioContext.close();
        audioContext = null;
      }
    },
  };
}
