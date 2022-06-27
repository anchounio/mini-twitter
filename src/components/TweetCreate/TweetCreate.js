import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useToken } from '../../TokenContext';
import './TweetCreate.css';

const TweetCreate = () => {
    const [token] = useToken();

    const [text, setText] = useState();
    const [selectedFile, setSelectedFile] = useState(null);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError(null);
        setLoading(true);

        try {
            // Si queremos enviar un body con formato "form/data" es necesario
            // crear un objeto de tipo FormData y "pushear" los elementos que queramos
            // enviar.
            const formData = new FormData();

            // Pusheamos las propiedades con append.
            formData.append('text', text);
            formData.append('image', selectedFile);

            const res = await fetch('http://localhost:4000/tweets', {
                method: 'POST',
                headers: {
                    Authorization: token,
                },
                body: formData,
            });

            const body = await res.json();

            if (body.status === 'error') {
                setError(body.message);
            } else {
                setSuccess(true);
            }
        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Si no tenemos token o la petición ha ido bien redireccionamos
    // a la página principal.
    if (!token || success) return <Navigate to='/' />;

    return (
        <main className='TweetCreate'>
            <form onSubmit={handleSubmit}>
                <input
                    type='file'
                    onChange={(e) => {
                        setSelectedFile(e.target.files[0]);
                    }}
                />
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />

                <button disabled={loading}>Enviar</button>
            </form>
            {error && <p className='Error'>{error}</p>}
        </main>
    );
};

export default TweetCreate;
