export function LoadingState({ message = 'Loading...' }) {
  return (
    <div className="status-box" role="status">
      <span className="loader" aria-hidden="true" />
      <p>{message}</p>
    </div>
  );
}

export function EmptyState({ title = 'Nothing found', message, action }) {
  return (
    <div className="status-box empty-state">
      <h2>{title}</h2>
      {message ? <p>{message}</p> : null}
      {action}
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="status-box error-state" role="alert">
      <h2>Something went wrong</h2>
      <p>{message}</p>
      {onRetry ? (
        <button className="button button-secondary" type="button" onClick={onRetry}>
          Try again
        </button>
      ) : null}
    </div>
  );
}
