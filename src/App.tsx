import { useEffect } from 'react';
import AppRouter from './router/AppRouter';
import { useAuthStore } from './store/authStore';

function App() {
  const { hydrateFromStorage } = useAuthStore();

  useEffect(() => {
    hydrateFromStorage();
  }, []);

  return <AppRouter />;
}

export default App;
