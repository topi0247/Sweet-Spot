export default function Button({
  content,
  onClickEvent = null,
}: {
  content: string;
  onClickEvent: (() => void) | null;
}) {
  return (
    <button
      className="btn btn-sm bg-orange-300 hover:bg-orange-600 border-none text-white rounded-2xl"
      onClick={onClickEvent ?? (() => {})}
    >
      {content}
    </button>
  );
}
