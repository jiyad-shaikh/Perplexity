import Icon from '../Icon/Icon';
import './SearchBar.css';

export default function SearchBar({
  value,
  onChange,
  onSubmit,
  compact = false,
}) {
  return (
    <form
      className={'search-box ' + (compact ? 'compact' : '')}
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <label
        className="sr-only"
        htmlFor={compact ? 'answer-search' : 'hero-search'}
      >
        Ask anything
      </label>
      <Icon name="search" />
      <input
        id={compact ? 'answer-search' : 'hero-search'}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Ask anything..."
      />
      <button
        className="submit-button"
        type="submit"
        aria-label="Submit search"
        disabled={!value.trim()}
      >
        <Icon name="arrow" />
      </button>
    </form>
  );
}
