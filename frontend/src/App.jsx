import { useEffect, useState } from 'react';
import { Link, Route, Routes } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

const getApiUrl = (path) => `${API_BASE_URL}${path}`;

const formatDate = (value) => {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
};

function HomePage() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadTodos = async () => {
    try {
      setError('');
      const response = await fetch(getApiUrl('/api/todos'));
      if (!response.ok) {
        throw new Error('Unable to load data from the API.');
      }
      const data = await response.json();
      setTodos(data);
    } catch (fetchError) {
      setError(fetchError.message || 'Something went wrong while loading tasks.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!title.trim()) {
      setError('Task title is required.');
      return;
    }

    try {
      const response = await fetch(getApiUrl('/api/todos'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, isComplete: false })
      });

      if (!response.ok) {
        const payload = await response.json();
        throw new Error(payload.message || 'Unable to create a task.');
      }

      setTitle('');
      setDescription('');
      await loadTodos();
    } catch (fetchError) {
      setError(fetchError.message || 'Something went wrong while creating a task.');
    }
  };

  const toggleComplete = async (id, isComplete) => {
    try {
      const getResponse = await fetch(getApiUrl(`/api/todos/${id}`));
      if (!getResponse.ok) {
        throw new Error('Unable to load the task for update.');
      }

      const item = await getResponse.json();
      const response = await fetch(getApiUrl(`/api/todos/${id}`), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, title: item.title, description: item.description, isComplete: !isComplete })
      });

      if (!response.ok) {
        throw new Error('Unable to update the task.');
      }

      await loadTodos();
    } catch (fetchError) {
      setError(fetchError.message || 'Unable to update the task.');
    }
  };

  const deleteTodo = async (id) => {
    try {
      const response = await fetch(getApiUrl(`/api/todos/${id}`), {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Unable to delete the task.');
      }

      await loadTodos();
    } catch (fetchError) {
      setError(fetchError.message || 'Unable to delete the task.');
    }
  };

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Full-stack EC2 deployment</p>
          <h1>Task Dashboard</h1>
        </div>
        <nav>
          <Link to="/">Home</Link>
        </nav>
      </header>

      <section className="panel">
        <h2>Add a task</h2>
        <form onSubmit={handleSubmit} className="task-form">
          <input
            type="text"
            placeholder="Task title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
          <button type="submit">Create task</button>
        </form>
      </section>

      <section className="panel">
        <h2>Tasks</h2>
        {error ? <div className="alert">{error}</div> : null}
        {loading ? (
          <p>Loading tasks...</p>
        ) : todos.length === 0 ? (
          <p>No tasks yet. Add the first one above.</p>
        ) : (
          <ul className="todo-list">
            {todos.map((todo) => (
              <li key={todo.id} className={todo.isComplete ? 'todo-item complete' : 'todo-item'}>
                <div>
                  <h3>{todo.title}</h3>
                  <p>{todo.description || 'No description provided.'}</p>
                  <small>Created: {formatDate(todo.createdAt)}</small>
                </div>
                <div className="todo-actions">
                  <button type="button" onClick={() => toggleComplete(todo.id, todo.isComplete)}>
                    {todo.isComplete ? 'Mark active' : 'Mark complete'}
                  </button>
                  <button type="button" className="danger" onClick={() => deleteTodo(todo.id)}>
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

function NotFoundPage() {
  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Full-stack EC2 deployment</p>
          <h1>Page not found</h1>
        </div>
        <nav>
          <Link to="/">Home</Link>
        </nav>
      </header>
      <section className="panel">
        <p>The page you requested does not exist.</p>
      </section>
    </main>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
