import Icon from '../Icon/Icon';
import './Navbar.css';

export default function Navbar({ dark, onToggleTheme, onOpenMenu }) {
  return (
    <header className="navbar">
      <button
        className="mobile-only menu"
        onClick={onOpenMenu}
        aria-label="Open navigation"
      >
        <Icon name="menu" />
      </button>
      <span className="grow" />
      <a href="#about">About</a>
      <a href="#how">How it works</a>
      <button className="theme" onClick={onToggleTheme} aria-label="Toggle theme">
        <Icon name="sun" /> <span>{dark ? 'Dark' : 'Light'}</span>
      </button>
      <button className="sign-in">Sign in</button>
    </header>
  );
}
