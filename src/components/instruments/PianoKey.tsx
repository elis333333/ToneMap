export default function PianoKeyboard() {
  const whiteKeys = Array.from({ length: 28 });

  return (
    <div className="w-full rounded-2xl bg-[#111111] p-5">
      <div className="relative overflow-hidden rounded-xl bg-[#202020] px-4 py-4">
        <div className="flex gap-[2px]">
          {whiteKeys.map((_, index) => (
            <div
              key={index}
              className="relative h-[230px] flex-1 rounded-b-lg border border-black/25 bg-[#F3F3F3]"
            >
              {index % 7 !== 2 && index % 7 !== 6 && (
                <div className="absolute left-[68%] top-0 h-[118px] w-[56%] -translate-x-1/2 rounded-b-md bg-black" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}