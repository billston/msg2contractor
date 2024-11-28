import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';
import ReceptoresPage from './pages/ReceptoresPage';
import GruposPage from './pages/GruposPage';
import ComunicadosPage from './pages/ComunicadosPage';
import NotificacionesPage from './pages/NotificacionesPage';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/receptores" element={<ReceptoresPage />} />
            <Route path="/grupos" element={<GruposPage />} />
            <Route path="/comunicados" element={<ComunicadosPage />} />
            <Route path="/notificaciones" element={<NotificacionesPage />} />
            <Route path="/" element={<ComunicadosPage />} />
          </Routes>
        </Layout>
      </Router>
      <Toaster position="top-right" />
    </QueryClientProvider>
  );
}

export default App;