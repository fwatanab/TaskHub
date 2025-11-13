type Props = {
  onClick: () => void;
};

const InlineCreateButton = ({ onClick }: Props) => (
  <button
    type="button"
    onClick={onClick}
    className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/40"
  >
    <span className="inline-block h-5 w-5 rounded-full border border-white/40 text-white">+</span>
    タスクを作成
  </button>
);

export default InlineCreateButton;

