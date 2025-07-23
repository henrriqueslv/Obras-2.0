import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { Layout } from '@/components/layout/Layout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { LoadingPage } from '@/components/ui/LoadingSpinner';

// Páginas
import { Login } from '@/pages/Login';
import { Register } from '@/pages/Register';
import { Dashboard } from '@/pages/Dashboard';
import { CreateProject } from '@/pages/CreateProject';
import { MyProjects } from '@/pages/MyProjects';
import { Projects } from '@/pages/Projects';
import { Providers } from '@/pages/Providers';
import { MyQuotes } from '@/pages/MyQuotes';
import { B2B } from '@/pages/B2B';

import './App.css';

// Configurar a URL base do axios
import axios from 'axios';
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const AppRoutes = () => {
  const { loading, isAuthenticated } = useAuth();

  if (loading) {
    return <LoadingPage message="Carregando aplicação..." />;
  }

  return (
    <Routes>
      {/* Rotas públicas */}
      <Route 
        path="/login" 
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} 
      />
      <Route 
        path="/register" 
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />} 
      />

      {/* Rotas protegidas */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />

      {/* Rotas específicas para clientes */}
      <Route 
        path="/criar-projeto" 
        element={
          <ProtectedRoute requiredUserType="client">
            <CreateProject />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/meus-projetos" 
        element={
          <ProtectedRoute requiredUserType="client">
            <MyProjects />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/prestadores" 
        element={
          <ProtectedRoute requiredUserType="client">
            <Providers />
          </ProtectedRoute>
        } 
      />

      {/* Rotas específicas para prestadores */}
      <Route 
        path="/projetos" 
        element={
          <ProtectedRoute requiredUserType="provider">
            <Projects />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/meus-orcamentos" 
        element={
          <ProtectedRoute requiredUserType="provider">
            <MyQuotes />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/b2b" 
        element={
          <ProtectedRoute requiredUserType="provider">
            <B2B />
          </ProtectedRoute>
        } 
      />

      {/* Rota padrão */}
      <Route 
        path="/" 
        element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
        } 
      />

      {/* Rota 404 */}
      <Route 
        path="*" 
        element={
          <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-foreground mb-4">404</h1>
              <p className="text-muted-foreground mb-4">Página não encontrada</p>
              <button 
                onClick={() => window.history.back()}
                className="text-primary hover:underline"
              >
                Voltar
              </button>
            </div>
          </div>
        } 
      />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <AppRoutes />
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;

