import AuthRouter from './AuthRouter';
import AppRouter from './AppRouter';

export default function Router({ isLoggedIn = false }) {
  if (!isLoggedIn) return <AuthRouter />;
  else return <AppRouter />;
}
