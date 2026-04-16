export type WebAudioFontInstrument = "keyboard" | "bass" | "guitar";

export type WebAudioFontPresetVariant = {
  label: string;
  presetScriptUrl: string;
  globalVariableName: string;
};

export type WebAudioFontPresetEntry = {
  instrument: WebAudioFontInstrument;
  playerScriptUrl: string;
  variants: WebAudioFontPresetVariant[];
};

const PLAYER_SCRIPT_URL =
  "https://surikov.github.io/webaudiofont/npm/dist/WebAudioFontPlayer.js";

export const WEB_AUDIO_FONT_PRESETS: Record<
  WebAudioFontInstrument,
  WebAudioFontPresetEntry
> = {
  keyboard: {
    instrument: "keyboard",
    playerScriptUrl: PLAYER_SCRIPT_URL,
    variants: [
      {
        label: "Acoustic Grand Piano",
        presetScriptUrl:
          "https://surikov.github.io/webaudiofontdata/sound/0000_JCLive_sf2_file.js",
        globalVariableName: "_tone_0000_JCLive_sf2_file",
      },
    ],
  },

  bass: {
    instrument: "bass",
    playerScriptUrl: PLAYER_SCRIPT_URL,
    variants: [
      {
        label: "Electric Bass Finger",
        presetScriptUrl:
          "https://surikov.github.io/webaudiofontdata/sound/0330_Aspirin_sf2_file.js",
        globalVariableName: "_tone_0330_Aspirin_sf2_file",
      },
    ],
  },

  guitar: {
    instrument: "guitar",
    playerScriptUrl: PLAYER_SCRIPT_URL,
    variants: [
      {
        label: "Acoustic Guitar Nylon",
        presetScriptUrl:
          "https://surikov.github.io/webaudiofontdata/sound/0240_Aspirin_sf2_file.js",
        globalVariableName: "_tone_0240_Aspirin_sf2_file",
      },
      {
        label: "Acoustic Guitar Steel",
        presetScriptUrl:
          "https://surikov.github.io/webaudiofontdata/sound/0250_Aspirin_sf2_file.js",
        globalVariableName: "_tone_0250_Aspirin_sf2_file",
      },
    ],
  },
};