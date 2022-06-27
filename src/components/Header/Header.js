import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useToken } from '../../TokenContext';

import './Header.css';

const Header = () => {
    const [token, setToken] = useToken();
    const [username, setUsername] = useState();

    const userData = async () => {
        try {
            const res = await fetch('http://localhost:4000/users', {
                headers: {
                    Authorization: token,
                },
            });

            const body = await res.json();

            if (body.status === 'ok') {
                setUsername(body.data.user.username);
            }
        } catch (err) {
            console.error(err);
        }
    };

    if (token) userData();

    return (
        <header>
            <h1>
                <NavLink to='/'>Mini Twitter</NavLink>
            </h1>
            <div className='Buttons'>
                {token && <p>@{username}</p>}
                {!token && (
                    <div className='Button'>
                        <NavLink to='/login'>Log In</NavLink>
                    </div>
                )}
                {!token && (
                    <div className='Button'>
                        <NavLink to='/signup'>Sign Up</NavLink>
                    </div>
                )}
                {token && (
                    <div className='Button'>
                        <NavLink to='/new'>Nuevo</NavLink>
                    </div>
                )}
                {token && (
                    <div className='Button' onClick={() => setToken(null)}>
                        <p>Logout</p>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
