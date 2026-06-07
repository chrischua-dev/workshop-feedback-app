import { FormEvent, useMemo, useState } from 'react';
import './styles.css';

type Feedback = {
  id: string;
  name: string;
  rating: number;
  comment: string;
  createdAt: string;
};

const ratingOptions = [1, 2, 3, 4, 5];

function App() {
  const [name, setName] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [feedbackList, setFeedbackList] = useState<Feedback[]>([]);

  const averageRating = useMemo(() => {
    if (feedbackList.length === 0) return 'No ratings yet';

    const total = feedbackList.reduce((sum, feedback) => sum + feedback.rating, 0);
    return `${(total / feedbackList.length).toFixed(1)} / 5`;
  }, [feedbackList]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedName = name.trim();
    const trimmedComment = comment.trim();

    if (!trimmedName || !trimmedComment) {
      return;
    }

    const newFeedback: Feedback = {
      id: crypto.randomUUID(),
      name: trimmedName,
      rating,
      comment: trimmedComment,
      createdAt: new Date().toLocaleString(),
    };

    setFeedbackList((currentList) => [newFeedback, ...currentList]);
    setName('');
    setRating(5);
    setComment('');
  }

  return (
    <main className="app-shell">
      <section className="hero-card">
        <p className="eyebrow">90-minute AWS Amplify workshop</p>
        <h1>Workshop Feedback App</h1>
        <p className="intro">
          Collect simple feedback from participants, then display each response on the same page.
        </p>
      </section>

      <section className="content-grid">
        <form className="feedback-form" onSubmit={handleSubmit}>
          <h2>Leave feedback</h2>

          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            placeholder="e.g. Alex"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />

          <label htmlFor="rating">Rating</label>
          <select
            id="rating"
            value={rating}
            onChange={(event) => setRating(Number(event.target.value))}
          >
            {ratingOptions.map((option) => (
              <option key={option} value={option}>
                {option} star{option === 1 ? '' : 's'}
              </option>
            ))}
          </select>

          <label htmlFor="comment">Short comment</label>
          <textarea
            id="comment"
            placeholder="What was useful or could be improved?"
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            rows={4}
            maxLength={180}
            required
          />
          <p className="hint">{comment.length}/180 characters</p>

          <button type="submit">Submit feedback</button>
        </form>

        <section className="feedback-panel" aria-live="polite">
          <div className="panel-header">
            <div>
              <h2>Submitted feedback</h2>
              <p>{feedbackList.length} response(s)</p>
            </div>
            <div className="rating-summary">
              <span>Average</span>
              <strong>{averageRating}</strong>
            </div>
          </div>

          {feedbackList.length === 0 ? (
            <div className="empty-state">
              <span aria-hidden="true">💬</span>
              <p>No feedback yet. Submit the first response.</p>
            </div>
          ) : (
            <ul className="feedback-list">
              {feedbackList.map((feedback) => (
                <li key={feedback.id} className="feedback-item">
                  <div className="feedback-topline">
                    <strong>{feedback.name}</strong>
                    <span>{'⭐'.repeat(feedback.rating)}</span>
                  </div>
                  <p>{feedback.comment}</p>
                  <small>{feedback.createdAt}</small>
                </li>
              ))}
            </ul>
          )}
        </section>
      </section>
    </main>
  );
}

export default App;
