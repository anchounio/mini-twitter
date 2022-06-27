import { Routes, Route } from 'react-router-dom';

import Header from './components/Header/Header';
import ExerciseSearch from './components/ExerciseSearch/ExerciseSearch';
import TweetCreate from './components/TweetCreate/TweetCreate';
import Register from './components/Register/Register';
import Login from './components/Login/Login';
import Footer from './components/Footer/Footer';

import './App.css';

function App() {
  return (
    <div className='App'>
      <Header />
      <Routes>
        <Route path='/' element={<ExerciseSearch />} />
        <Route path='/signup' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/new' element={<TweetCreate />} />
        <Route path='*' element={<ExerciseSearch />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
