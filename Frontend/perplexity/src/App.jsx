import { useEffect, useState } from 'react';
import AnswerView from './components/AnswerView/AnswerView';
import Navbar from './components/Navbar/Navbar';
import SearchBar from './components/SearchBar/SearchBar';
import Sidebar from './components/Sidebar/Sidebar';
import Home from './pages/Home';
import './index.css';

const initialHistory = [
  { id: 1, title: 'The future of personal knowledge', time: 'Today' },
  { id: 2, title: 'How to build a calm morning routine', time: 'Yesterday' },
  { id: 3, title: 'Guide to sustainable travel', time: 'Oct 24' },
];

export default function App() {
  const [query, setQuery] = useState('');
  const [submitted, setSubmitted] = useState('');
  const [loading, setLoading] = useState(false);
  const [dark, setDark] = useState(
    () => localStorage.getItem('lumina-theme') === 'dark',
  );
  const [drawer, setDrawer] = useState(false);
  const [history, setHistory] = useState(initialHistory);

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
    localStorage.setItem('lumina-theme', dark ? 'dark' : 'light');
  }, [dark]);

  const submit = (next = query) => {
    const clean = next.trim();

    if (!clean) return;

    setQuery(clean);
    setSubmitted(clean);
    setLoading(true);
    setDrawer(false);
    setHistory((items) => [
      { id: Date.now(), title: clean, time: 'Just now' },
      ...items.filter((item) => item.title !== clean),
    ].slice(0, 5));
    setTimeout(() => setLoading(false), 850);
  };

  const reset = () => {
    setQuery('');
    setSubmitted('');
  };

  return (
    <div className="app">
      <Sidebar
        history={history}
        open={drawer}
        onClose={() => setDrawer(false)}
        onNewSearch={reset}
        onSelect={(item) => submit(item.title)}
      />

      <main>
        <Navbar
          dark={dark}
          onToggleTheme={() => setDark(!dark)}
          onOpenMenu={() => setDrawer(true)}
        />

        {!submitted ? (
          <Home
            query={query}
            onQueryChange={setQuery}
            onSearch={submit}
          />
        ) : (
          <section className="results">
            <div className="result-header">
              <p className="eyebrow">● Answer</p>
              <h2>{submitted}</h2>
              <SearchBar
                compact
                value={query}
                onChange={setQuery}
                onSubmit={() => submit()}
              />
            </div>

            <AnswerView
              query={submitted}
              loading={loading}
              onRegenerate={() => submit(submitted)}
              onFollowUp={submit}
            />
          </section>
        )}

        <footer>
          lumina · A quieter way to search <span>© 2026</span>
        </footer>
      </main>
    </div>
  );
}
