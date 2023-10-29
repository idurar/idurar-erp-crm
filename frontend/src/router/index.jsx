import AuthRouter from './AuthRouter';
import AppRouter from './AppRouter';
import { Layout, Menu, theme } from 'antd';

export default function Router({ isLoggedIn = false }) {
  const { Header, Content, Footer, Sider } = Layout;
  if (!isLoggedIn) return <AuthRouter />;
  else return <AppRouter />;
}
