import { useEffect, useState } from 'react';
import { useToken } from '../../TokenContext';
import './ExerciseSearch.css';

const ExerciseSearch = () => {
  const [token] = useToken();

  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const [exercises, setExercises] = useState(null);
  const [update, setUpdate] = useState(false);
  const [error, setError] = useState(null);

  const getExercises = async () => {
    setLoading(true);

    // Vaciamos el error.
    setError(null);

    // Si hay token nos interesa mandarlo para comprobar los exercises de los que somos dueños.
    const params = token
      ? {
          headers: {
            Authorization: token,
          },
        }
      : {};

    try {
      const res = await fetch(
        `http://localhost:4000/exercises?typology=${keyword1}&muscular=${keyword2}`,
        {
          method: 'GET',
          headers: {
            Authorization: token,
          },
        }
      );

      const body = await res.json();

      console.log(body);

      if (body.status === 'error') {
        setExercises(null);
        setError(body.message);
        console.log(error);
      } else {
        setExercises(body.data.exercises);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    getExercises();
  };

  const handleLike = async (e) => {
    setLoading(true);
    setError(null);

    e.target.classList.toggle('IsAnimating');

    const li = e.target.closest('li');

    const idExercise = li.getAttribute('data-id');

    try {
      const res = await fetch(
        `http://localhost:4000/exercises/${idExercise}/likes`,
        {
          method: 'PUT',
          headers: {
            Authorization: token,
          },
        }
      );

      const body = await res.json();

      if (body.status === 'error') {
        setError(body.message);
      } else {
        setUpdate(!update);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteExercise = async (e) => {
    setLoading(true);
    setError(null);

    if (window.confirm('¿Deseas eliminar el tweet?')) {
      const li = e.target.closest('li');

      const idExercise = li.getAttribute('data-id');

      try {
        const res = await fetch(
          `http://localhost:4000/exercises/${idExercise}`,
          {
            method: 'DELETE',
            headers: {
              Authorization: token,
            },
          }
        );

        const body = await res.json();

        if (body.status === 'error') {
          setError(body.message);
        } else {
          setUpdate(!update);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  // Mediante "useEffect" hacemos que la primera vez que se monta el componente se
  // cargue de forma automática la lista de exercises.
  useEffect(() => {
    getExercises();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [update]);

  return (
    <main className='ExerciseSearch'>
      <form onSubmit={handleSubmit}>
        <input
          type='text'
          name='keyword'
          onChange={(e) => setKeyword(e.target.value)}
        />
        {/* <select name='typology'>
          <option value='value1' selected></option>
          <option value='value2'>aerobico</option>
          <option value='value3'>anaerobico</option>
          <option value='value4'>flexibilidad</option>
          <option value='value5'>resistencia</option>
        </select>

        <select name='muscular'>
          <option value='value1' selected></option>
          <option value='value2'>Brazos</option>
          <option value='value3'>Piernas</option>
          <option value='value4'>Espalda</option>
          <option value='value5'>Pecho</option>
        </select> */}

        <label for='cars'>Choose a car:</label>
        <select name='cars' id='cars' multiple>
          <optgroup label='Swedish Cars'>
            <option value='volvo'>Volvo</option>
            <option value='saab'>Saab</option>
          </optgroup>
          <optgroup label='German Cars'>
            <option value='mercedes'>Mercedes</option>
            <option value='audi'>Audi</option>
          </optgroup>
        </select>

        <button disabled={loading}>Buscar</button>
      </form>

      {error && <p className='Error'>{error}</p>}

      {exercises && (
        <ul className='ExerciseList'>
          {exercises.map((tweet) => {
            return (
              <li key={tweet.id} data-id={tweet.id}>
                <header>
                  <p>@{tweet.username}</p>
                </header>
                <div>
                  <p>{tweet.text}</p>
                  {tweet.image && (
                    <img
                      src={`http://localhost:4000/${tweet.image}`}
                      alt='Imagen adjunta'
                    />
                  )}
                </div>
                <footer>
                  <div>
                    <div
                      className={`heart ${
                        token && tweet.likedByMe && 'IsAnimating'
                      }`}
                      onClick={token && handleLike}
                    ></div>
                    <p>{tweet.likes} likes</p>
                  </div>
                  {token && tweet.owner === 1 && (
                    <button onClick={handleDeleteExercise}>Eliminar</button>
                  )}
                </footer>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
};

export default ExerciseSearch;
