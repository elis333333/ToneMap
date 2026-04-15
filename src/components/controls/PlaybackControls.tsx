import { useExplorerStore } from "@/features/explorer/explorerStore";

export default function PlaybackControls() {
  const progressionBpm = useExplorerStore((state) => state.progressionBpm);
  const progressionChordBeats = useExplorerStore(
    (state) => state.progressionChordBeats
  );
  const playbackStyle = useExplorerStore((state) => state.playbackStyle);

  const setProgressionBpm = useExplorerStore((state) => state.setProgressionBpm);
  const setProgressionChordBeats = useExplorerStore(
    (state) => state.setProgressionChordBeats
  );
  const setPlaybackStyle = useExplorerStore((state) => state.setPlaybackStyle);

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="rounded-full border border-white/10 bg-[#111111] px-4 py-3 text-sm text-white/88">
        BPM
        <input
          type="number"
          min={40}
          max={220}
          value={progressionBpm}
          onChange={(e) => setProgressionBpm(Number(e.target.value))}
          className="ml-3 w-16 bg-transparent text-white outline-none"
        />
      </div>

      <div className="rounded-full border border-white/10 bg-[#111111] px-4 py-3 text-sm text-white/88">
        pulsos por acorde
        <input
          type="number"
          min={1}
          max={8}
          value={progressionChordBeats}
          onChange={(e) => setProgressionChordBeats(Number(e.target.value))}
          className="ml-3 w-12 bg-transparent text-white outline-none"
        />
      </div>

      <div className="relative min-w-[200px]">
        <select
          value={playbackStyle}
          onChange={(e) =>
            setPlaybackStyle(e.target.value as "block" | "strum")
          }
          className="h-full w-full appearance-none rounded-full border border-[#8338EC] bg-[#111111] px-5 py-3 text-left text-[0.98rem] text-white shadow-[0_0_0_1px_rgba(131,56,236,0.14)] outline-none transition hover:bg-[#161616] focus:border-[#8338EC] focus:ring-2 focus:ring-[#8338EC]/20"
        >
          <option value="block" className="bg-[#111111] text-white">
            reproducción: block
          </option>
          <option value="strum" className="bg-[#111111] text-white">
            reproducción: strum
          </option>
        </select>
      </div>
    </div>
  );
}