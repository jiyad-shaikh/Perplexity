import SearchBar from '../components/SearchBar/SearchBar';
import './Home.css';

const prompts = [
  'How do solar panels work?',
  'Best books on creative thinking',
  'Explain quantum computing simply',
];

export default function Home({ query, onQueryChange, onSearch }) {
  return (
    <section className="hero">
      <div className="hero-mark">✦</div>
      <p className="eyebrow">Search, think, discover</p>
      <h1>
        Curiosity, <em>clarified.</em>
      </h1>
      <p className="subtitle">
        Ask complex questions. Get clear, thoughtful answers with sources you can
        trust.
      </p>
      <SearchBar
        value={query}
        onChange={onQueryChange}
        onSubmit={() => onSearch()}
      />
      <div className="prompts">
        {prompts.map((prompt) => (
          <button key={prompt} onClick={() => onSearch(prompt)}>
            {prompt}
            <span className="icon">→</span>
          </button>
        ))}
      </div>
      <div className="hero-note">
        <span>● Built for better questions</span>
        <span>Free to explore</span>
      </div>
    </section>
  );
}
