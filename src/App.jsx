// App.jsx
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Home from './pages/Home';
import Course from './pages/Course';
import OtherCourse from './pages/OtherCourse';
import Contact from './pages/Contact';
import Register from './pages/Register';
import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import AdminDashboard from './pages/AdminDashboard';
import GenericPage from './pages/GenericPage';
import SearchResults from './pages/SearchResults';
import { mockFiles } from './data/mockData';
import { obtenerUsuarioLogueado } from './utils/localStorage';
import './index.css';

function App() {
  const [currentView, setCurrentView] = useState('Inicio');
  const [currentPeriod, setCurrentPeriod] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [usuarioLogueado, setUsuarioLogueado] = useState(null);
  const [tipoUsuario, setTipoUsuario] = useState(null);

  // Verificar si hay usuario logueado al cargar
  useEffect(() => {
    const usuario = obtenerUsuarioLogueado();
    if (usuario) {
      setUsuarioLogueado(usuario);
      setTipoUsuario(usuario.tipo);
      
      // Redirigir al dashboard correspondiente
      if (usuario.tipo === 'estudiante') {
        setCurrentView('StudentDashboard');
      } else if (usuario.tipo === 'profesor') {
        setCurrentView('TeacherDashboard');
      } else if (usuario.tipo === 'admin') {
        setCurrentView('AdminDashboard');
      }
    }
  }, []);

  useEffect(() => {
    const contentArea = document.getElementById('contentArea');
    if (contentArea) {
      contentArea.scrollTop = 0;
    }
  }, [currentView]);

  useEffect(() => {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }, [currentView]);

  const handleLoginSuccess = (usuario) => {
    setUsuarioLogueado(usuario);
    setTipoUsuario(usuario.tipo);

    // Redirigir según tipo
    if (usuario.tipo === 'estudiante') {
      setCurrentView('StudentDashboard');
    } else if (usuario.tipo === 'profesor') {
      setCurrentView('TeacherDashboard');
    } else if (usuario.tipo === 'admin') {
      setCurrentView('AdminDashboard');
    }
  };

  const handleLogout = () => {
    setUsuarioLogueado(null);
    setTipoUsuario(null);
    setCurrentView('Inicio');
  };

  const renderContent = () => {
    switch (currentView) {
      case 'Inicio':
        return <Home onNavigate={setCurrentView} />;

      case 'Teoría de la Computación.':
        return <OtherCourse courseName={currentView} />;
        

      // Las demás materias usan el componente genérico
      case 'Ambientes de Programacion.':
      case 'Compiladores':
        return (
          <Course
            courseName={currentView}
            currentPeriod={currentPeriod}
            onPeriodChange={setCurrentPeriod}
          />
        );
      case 'Contexto Nacional III':
      case 'Sistemas Operativos':
      case 'SO en Red':
      case 'Teoría de Lenguajes':
        return (
          <Course
            courseName={currentView}
            currentPeriod={currentPeriod}
            onPeriodChange={setCurrentPeriod}
          />
        );
      case 'UDF Maestria':
        return <OtherCourse courseName={currentView} />;

      case 'Contacto':
        return <Contact />;

      case 'Registrarse':
        return <Register onNavigate={setCurrentView} />;

      case 'Iniciar Sesión':
        return <Login onNavigate={setCurrentView} onLoginSuccess={handleLoginSuccess} />;

      case 'StudentDashboard':
        return usuarioLogueado ? (
          <StudentDashboard usuario={usuarioLogueado} onNavigate={setCurrentView} onLogout={handleLogout} />
        ) : (
          <Login onNavigate={setCurrentView} onLoginSuccess={handleLoginSuccess} />
        );

      case 'TeacherDashboard':
        return usuarioLogueado && usuarioLogueado.tipo === 'profesor' ? (
          <TeacherDashboard usuario={usuarioLogueado} onNavigate={setCurrentView} onLogout={handleLogout} />
        ) : (
          <Login onNavigate={setCurrentView} onLoginSuccess={handleLoginSuccess} />
        );

      case 'AdminDashboard':
        return usuarioLogueado && usuarioLogueado.tipo === 'admin' ? (
          <AdminDashboard usuario={usuarioLogueado} onNavigate={setCurrentView} onLogout={handleLogout} />
        ) : (
          <Login onNavigate={setCurrentView} onLoginSuccess={handleLoginSuccess} />
        );

      case 'Presentaciones':
      case 'Sobre Mi':
      case 'Tesis':
        return <GenericPage pageName={currentView} />;

      case 'Resultados':
        return <SearchResults query={searchQuery} files={mockFiles} />;

      default:
        return <Home onNavigate={setCurrentView} />;
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentView('Resultados');
  };

  return (
    <div className="flex h-screen overflow-hidden text-gray-800 bg-gray-50">
      <Sidebar
        currentView={currentView}
        onNavigate={setCurrentView}
        isMobileOpen={isMobileMenuOpen}
        onMobileClose={() => setIsMobileMenuOpen(false)}
        usuarioLogueado={usuarioLogueado}
        onLogout={handleLogout}
      />

      <main className="flex-1 flex flex-col relative min-w-0 bg-gray-50">
        <Header
          title={currentView}
          onSearch={handleSearch}
          onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          usuarioLogueado={usuarioLogueado}
        />

        <div id="contentArea" className="flex-1 overflow-y-auto p-6 md:p-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default App;
