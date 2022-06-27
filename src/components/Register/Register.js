import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useToken } from '../../TokenContext';

import './Register.css';

const Register = () => {
  const [token] = useToken();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError(null);
    setLoading(true);

    try {
      const res = await fetch('http://localhost:4000/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const body = await res.json();

      if (body.status === 'error') {
        setError(body.message);
      } else {
        setMessage(body.message);
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const successP = document.querySelector('p.Success');

    if (successP) {
      const t = setTimeout(() => {
        document.querySelector('p.Success').remove();
      }, 5000);

      return () => clearTimeout(t);
    }
  });

  // Si estamos logueados redireccionamos a la página principal.
  if (token) return <Navigate to='/' />;

  return (
    <main className='Register'>
      <form onSubmit={handleSubmit}>
        <label htmlFor='name'>Usuario:</label>
        <input
          type='text'
          name='name'
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label htmlFor='email'>Email:</label>
        <input
          type='email'
          name='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label htmlFor='pass'>Contraseña:</label>
        <input
          type='password'
          name='pass'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button disabled={loading}>Sign Up</button>
      </form>
      {error && <p className='Error'>{error}</p>}
      {message && <p className='Success'>{message}</p>}
    </main>
  );
};

export default Register;
