import { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants';
import '../styles/Form.css';

function Form({ route, method }) {
  // the route is the route we want to go to when we submit the form
  // the method is either login or register

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const name = method === 'login' ? 'Login' : 'Register';

  const handleSubmit = async (event) => {
    setLoading(true);
    event.preventDefault(); // the default would be reloading the page, we suppress that
    try {
      const res = await api.post(route, { username, password });
      if (method === 'login') {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
        navigate('/');
      } else {
        navigate('/login');
      }
    } catch (error) {
      alert(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='form-container'>
      <h1>{name}</h1>
      <input
        type='text'
        className='form-input'
        value={username}
        onChange={(event) => setUsername(event.target.value)}
        placeholder='Username'
      />

      <input
        type='password'
        className='form-input'
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        placeholder='Password'
      />

      <button className='form-button' type='submit'>
        {name}
      </button>
    </form>
  );
}

export default Form;
