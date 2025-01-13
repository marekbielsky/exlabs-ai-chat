import {Navigate, useOutlet} from 'react-router';
import {useAuth} from '../../hooks/useAuth.tsx';

const ProtectedLayout = () => {
  const { user } = useAuth();
  const outlet = useOutlet();

  if (!user) {
    return <Navigate to="/login" />;
  }

  return outlet;
};

export default ProtectedLayout;