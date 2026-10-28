import Icon from '../Icon/Icon';
import './SourceList.css';

const sources = [
  ['U.S. Department of Energy', 'energy.gov', 'https://www.energy.gov/'],
  ['National Renewable Energy Laboratory', 'nrel.gov', 'https://www.nrel.gov/'],
  ['Encyclopaedia Britannica', 'britannica.com', 'https://www.britannica.com/'],
];

export default function SourceList() {
  return (
    <aside className="sources">
      <b>Sources <span>3</span></b>
      {sources.map(([label, domain, url], index) => (
        <a href={url} target="_blank" rel="noreferrer" key={domain}>
          <i>{index + 1}</i>
          <span>
            <strong>{label}</strong>
            <small>{domain}</small>
          </span>
          <Icon name="arrow" />
        </a>
      ))}
    </aside>
  );
}
