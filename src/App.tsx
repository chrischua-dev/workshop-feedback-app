import { FormEvent, useEffect, useMemo, useState } from 'react';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../amplify/data/resource';
import './styles.css';

type Feedback = {
  id: string;
  name: string;
  rating: number;
  comment: string;
  createdAt: string;
};

const client = generateClient<Schema>();
const ratingOptions = [1, 2, 3, 4, 5];

function sortNewestFirst(feedback: Feedback[]) {
  return [...feedback].sort(
    (first, second) => new Date(second.createdAt).getTime() - new Date(first.createdAt).getTime(),
  );
}

function formatDate(dateText: string) {
  return new Date(dateText).toLocaleString();
}

function App() {
  const [name, setName] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [feedbackList, setFeedbackList] = useState<Feedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('Loading saved feedback...');
  const [error, setError] = useState('');

  async function loadFeedback() {
    setIsLoading(true);
    setError('');

    const { data, errors } = await client.models.Feedback.list();

    if (errors?.length) {
      setError('Could not load saved feedback. Please try again.');
      setMessage('');
      setIsLoading(false);
      return;
    }

    const savedFeedback = data.map((feedback) => ({
      id: feedback.id,
      name: feedback.name,
      rating: feedback.rating,
      comment: feedback.comment,
      createdAt: feedback.createdAt,
    }));

    setFeedbackList(sortNewestFirst(savedFeedback));
    setMessage(savedFeedback.length === 0 ? 'No saved feedback yet.' : 'Saved feedback loaded.');
    setIsLoading(false);
  }

  useEffect(() => {
    loadFeedback().catch(() => {
      setError('Could not load saved feedback. Please try again.');
      setMessage('');
      setIsLoading(false);
    });
  }, []);

  const averageRating = useMemo(() => {
    if (feedbackList.length === 0) return 'No ratings yet';

    const total = feedbackList.reduce((sum, feedback) => sum + feedback.rating, 0);
    return `${(total / feedbackList.length).toFixed(1)} / 5`;
  }, [feedbackList]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedName = name.trim();
    const trimmedComment = comment.trim();

    if (!trimmedName || !trimmedComment) {
      return;
    }

    setIsSaving(true);
    setError('');
    setMessage('Saving feedback...');

    const { data, errors } = await client.models.Feedback.create({
      name: trimmedName,
      rating,
      comment: trimmedComment,
    });

    if (errors?.length || !data) {
      setError('Could not save feedback. Please try again.');
      setMessage('');
      setIsSaving(false);
      return;
    }

    const newFeedback: Feedback = {
      id: data.id,
      name: data.name,
      rating: data.rating,
      comment: data.comment,
      createdAt: data.createdAt,
    };

    setFeedbackList((currentList) => sortNewestFirst([newFeedback, ...currentList]));
    setName('');
    setRating(5);
    setComment('');
    setMessage('Feedback saved to Amplify Data. It will still be here after refresh.');
    setIsSaving(false);
  }

  return (
    <main className="app-shell">
      <section className="hero-card">
        <p className="eyebrow">90-minute AWS Amplify workshop</p>
        <h1>Workshop Feedback App</h1>
        <p className="intro">
          Collect simple feedback from participants, save it with Amplify Data, and reload it after
          refresh.
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

          <button type="submit" disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Submit feedback'}
          </button>

          {message && <p className="status-message">{message}</p>}
          {error && <p className="error-message">{error}</p>}
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

          {isLoading ? (
            <div className="empty-state">
              <span aria-hidden="true">⏳</span>
              <p>Loading saved feedback...</p>
            </div>
          ) : feedbackList.length === 0 ? (
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
                  <small>{formatDate(feedback.createdAt)}</small>
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
