export {};

declare global {
  interface WebAudioFontPreset {
    zones?: unknown[];
  }

  interface WebAudioFontLoader {
    decodeAfterLoading(audioContext: AudioContext, variableName: string): void;
    waitLoad(callback: () => void): void;
  }

  interface WebAudioFontPlayerInstance {
    loader: WebAudioFontLoader;
    queueWaveTable(
      audioContext: AudioContext,
      target: AudioNode,
      preset: WebAudioFontPreset,
      when: number,
      pitch: number,
      duration: number,
      volume?: number,
      slides?: unknown[]
    ): unknown;
  }

  interface Window {
    WebAudioFontPlayer?: new () => WebAudioFontPlayerInstance;
    _tone_0000_JCLive_sf2_file?: WebAudioFontPreset;
  }
}