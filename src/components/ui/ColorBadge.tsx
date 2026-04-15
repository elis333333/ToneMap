export function ColorBadge({ label, color }: any) {
  return (
    <span
      className="px-3 py-1 rounded-full text-sm"
      style={{
        backgroundColor: color + "20",
        color,
        border: `1px solid ${color}40`,
      }}
    >
      {label}
    </span>
  );
}