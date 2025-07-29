import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const Protected = () => {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = Cookies.get('token');

    axios.get('http://localhost:5000/protected', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(res => setMessage(res.data.message))
    .catch(err => setMessage('Unauthorized or token expired'));
  }, []);

  return <h1>{message}</h1>;
};

export default Protected;