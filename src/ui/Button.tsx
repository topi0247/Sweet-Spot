export default function Button({
  content,
  onClickEvent = null,
}: {
  content: string;
  onClickEvent: (() => void) | null;
}) {
  return (
    <button
      className="btn btn-sm p-2 bg-orange-500 hover:bg-orange-700 border-none text-white rounded-2xl"
      onClick={onClickEvent ?? (() => {})}
    >
      {content}
    </button>
  );
}
