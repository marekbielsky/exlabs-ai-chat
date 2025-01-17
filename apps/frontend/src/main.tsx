import { createRoot } from 'react-dom/client';
import './index.css';
import Chat from './pages/chat/Chat.tsx';
import { BrowserRouter, Routes, Route } from 'react-router';
import Layout from './Layout.tsx';
import Home from './pages/home/Home.tsx';
import Start from './pages/chat/Start.tsx';
import Login from './pages/auth/Login.tsx';
import ProtectedLayout from './pages/auth/ProtectedLayout.tsx';
import { AuthProvider } from './hooks/useAuth.tsx';
import Config from "./pages/chat/Config.tsx";
import Final from "./pages/chat/Final.tsx";

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <AuthProvider>
      <Routes>
        <Route path="login" element={<Login />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="chat" element={<ProtectedLayout />}>
            <Route index element={<Start />} />
            <Route path="config" element={<Config />} />
            <Route path=":chatId" element={<Chat />} />
            <Route path=":chatId/final" element={<Final />} />
          </Route>
        </Route>
      </Routes>
    </AuthProvider>
  </BrowserRouter>
);
