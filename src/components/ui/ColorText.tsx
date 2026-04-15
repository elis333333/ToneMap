export function ColorText({ children, color }: any) {
  return (
    <span style={{ color }} className="font-medium">
      {children}
    </span>
  );
}