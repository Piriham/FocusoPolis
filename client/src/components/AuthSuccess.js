import { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

const AuthSuccess = () => {
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    if (token) {
      localStorage.setItem('token', token);
      history.push('/');
    }
  }, [location, history]);

  return <div>Logging you in...</div>;
};

export default AuthSuccess; 