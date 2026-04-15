export function ColorBar({ value, color }: any) {
  return (
    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
      <div
        className="h-full rounded-full transition-all"
        style={{
          width: `${value}%`,
          background: `linear-gradient(to right, ${color}, ${color}aa)`,
        }}
      />
    </div>
  );
}