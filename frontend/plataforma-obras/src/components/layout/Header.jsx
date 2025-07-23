import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Building2, 
  User, 
  LogOut, 
  Menu,
  Home,
  Users,
  FolderOpen,
  Plus,
  FileText,
  Network
} from 'lucide-react';

export const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getNavigationItems = () => {
    if (!isAuthenticated) return [];

    if (user?.user_type === 'client') {
      return [
        { path: '/dashboard', label: 'Dashboard', icon: Home },
        { path: '/prestadores', label: 'Prestadores', icon: Users },
        { path: '/meus-projetos', label: 'Meus Projetos', icon: FolderOpen },
        { path: '/criar-projeto', label: 'Criar Projeto', icon: Plus }
      ];
    } else if (user?.user_type === 'provider') {
      return [
        { path: '/dashboard', label: 'Dashboard', icon: Home },
        { path: '/projetos', label: 'Projetos', icon: FolderOpen },
        { path: '/meus-orcamentos', label: 'Meus Orçamentos', icon: FileText },
        { path: '/b2b', label: 'B2B', icon: Network }
      ];
    }

    return [];
  };

  const navigationItems = getNavigationItems();

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Building2 className="w-8 h-8 text-primary" />
            <span className="text-xl font-bold text-foreground">
              Plataforma de Obras
            </span>
          </Link>

          {/* Navigation */}
          {isAuthenticated && (
            <nav className="hidden md:flex items-center space-x-4">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`
                      flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors
                      ${isActive 
                        ? 'bg-primary text-primary-foreground' 
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                      }
                    `}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          )}

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium text-foreground">
                    {user?.name}
                  </p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {user?.user_type === 'client' ? 'Cliente' : 'Prestador'}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center space-x-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Sair</span>
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/login')}
                >
                  Entrar
                </Button>
                <Button
                  size="sm"
                  onClick={() => navigate('/register')}
                >
                  Cadastrar
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        {isAuthenticated && (
          <div className="md:hidden border-t border-border py-2">
            <nav className="flex space-x-1 overflow-x-auto">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`
                      flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors
                      ${isActive 
                        ? 'bg-primary text-primary-foreground' 
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                      }
                    `}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

