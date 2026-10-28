import Icon from '../Icon/Icon';
import SourceList from '../SourceList/SourceList';
import './AnswerView.css';

export default function AnswerView({ query, loading, onRegenerate, onFollowUp }) {
  if (loading) {
    return (
      <div className="answer">
        <div className="skeleton" />
        <div className="skeleton wide" />
        <div className="skeleton" />
        <div className="skeleton short" />
      </div>
    );
  }

  return (
    <div className="answer-layout">
      <article className="answer">
        <p className="eyebrow">A useful starting point</p>
        <h1>A thoughtful answer to “{query}”</h1>
        <p>
          This is a development preview for your search. Connect the request in{' '}
          <code>src/services/searchService.js</code> to your AI backend to replace
          this mock response with live, cited answers.
        </p>
        <p>
          The answer surface is structured for readable long-form content, with
          room for citations, follow-up questions, and source previews.
        </p>
        <ul>
          <li>Connect your server-side search endpoint.</li>
          <li>Return structured answer content and source metadata.</li>
          <li>Keep secrets and provider keys outside the frontend.</li>
        </ul>
        <div className="answer-actions">
          <button onClick={() => navigator.clipboard?.writeText('Answer for ' + query)}>
            <Icon name="copy" /> Copy answer
          </button>
          <button onClick={onRegenerate}>
            <Icon name="refresh" /> Regenerate
          </button>
        </div>
        <div className="follow-up">
          <small>Continue exploring</small>
          <button onClick={() => onFollowUp('What are the environmental benefits?')}>
            What are the environmental benefits? <Icon name="arrow" />
          </button>
          <button onClick={() => onFollowUp('How much does it cost?')}>
            How much does it cost? <Icon name="arrow" />
          </button>
        </div>
      </article>
      <SourceList />
    </div>
  );
}
