const symbols = {
  search: '⌕',
  arrow: '→',
  sun: '☼',
  menu: '☰',
  plus: '+',
  copy: '▣',
  refresh: '↻',
  bookmark: '☆',
};

export default function Icon({ name }) {
  return (
    <span className="icon" aria-hidden="true">
      {symbols[name]}
    </span>
  );
}
