import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingPage } from '@/components/ui/LoadingSpinner';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/button';
import { ProjectCard } from '@/components/cards/ProjectCard';
import { QuoteCard } from '@/components/cards/QuoteCard';
import { ProviderCard } from '@/components/cards/ProviderCard';
import { 
  Plus, 
  FolderOpen, 
  Users, 
  FileText,
  TrendingUp,
  Clock,
  CheckCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

export const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    projects: [],
    quotes: [],
    providers: []
  });
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    totalQuotes: 0
  });

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      if (user?.user_type === 'client') {
        // Carregar projetos do cliente
        const projectsResponse = await axios.get('/api/projects');
        const projects = projectsResponse.data.projects || [];
        
        setData(prev => ({ ...prev, projects }));
        setStats({
          totalProjects: projects.length,
          activeProjects: projects.filter(p => p.status === 'in_progress').length,
          completedProjects: projects.filter(p => p.status === 'completed').length,
          totalQuotes: projects.reduce((sum, p) => sum + (p.quotes_count || 0), 0)
        });
      } else if (user?.user_type === 'provider') {
        // Carregar projetos disponíveis e orçamentos do prestador
        const [projectsResponse, quotesResponse] = await Promise.all([
          axios.get('/api/projects'),
          axios.get('/api/quotes/my-quotes')
        ]);
        
        const projects = projectsResponse.data.projects || [];
        const quotes = quotesResponse.data.quotes || [];
        
        setData(prev => ({ ...prev, projects, quotes }));
        setStats({
          totalProjects: projects.length,
          activeProjects: quotes.filter(q => q.is_accepted).length,
          completedProjects: 0, // Será calculado quando implementarmos reviews
          totalQuotes: quotes.length
        });
      }
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = () => {
    navigate('/criar-projeto');
  };

  const handleViewProject = (project) => {
    navigate(`/projeto/${project.id}`);
  };

  const handleCreateQuote = (project) => {
    navigate(`/projeto/${project.id}/orcamento`);
  };

  if (loading) {
    return <LoadingPage message="Carregando dashboard..." />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            Bem-vindo, {user?.name}!
          </h1>
          <p className="text-muted-foreground mt-2">
            {user?.user_type === 'client' 
              ? 'Gerencie os seus projetos e encontre prestadores qualificados.'
              : 'Encontre oportunidades de trabalho e gerencie os seus orçamentos.'
            }
          </p>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="construction-card p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <FolderOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">
                  {user?.user_type === 'client' ? 'Total de Projetos' : 'Projetos Disponíveis'}
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {stats.totalProjects}
                </p>
              </div>
            </div>
          </div>

          <div className="construction-card p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">
                  {user?.user_type === 'client' ? 'Em Andamento' : 'Projetos Aceitos'}
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {stats.activeProjects}
                </p>
              </div>
            </div>
          </div>

          <div className="construction-card p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">
                  Concluídos
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {stats.completedProjects}
                </p>
              </div>
            </div>
          </div>

          <div className="construction-card p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <FileText className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">
                  {user?.user_type === 'client' ? 'Orçamentos Recebidos' : 'Orçamentos Enviados'}
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {stats.totalQuotes}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Conteúdo específico por tipo de usuário */}
        {user?.user_type === 'client' ? (
          <ClientDashboard 
            projects={data.projects}
            onCreateProject={handleCreateProject}
            onViewProject={handleViewProject}
          />
        ) : (
          <ProviderDashboard 
            projects={data.projects}
            quotes={data.quotes}
            onCreateQuote={handleCreateQuote}
            onViewProject={handleViewProject}
          />
        )}
      </div>
    </div>
  );
};

const ClientDashboard = ({ projects, onCreateProject, onViewProject }) => {
  const recentProjects = projects.slice(0, 3);

  return (
    <div className="space-y-8">
      {/* Ações rápidas */}
      <div className="construction-card p-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">
          Ações Rápidas
        </h2>
        <div className="flex flex-wrap gap-4">
          <Button onClick={onCreateProject} className="flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Criar Novo Projeto</span>
          </Button>
          <Button variant="outline" onClick={() => window.location.href = '/prestadores'}>
            <Users className="w-4 h-4 mr-2" />
            <span>Encontrar Prestadores</span>
          </Button>
        </div>
      </div>

      {/* Projetos recentes */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-foreground">
            Projetos Recentes
          </h2>
          <Button variant="outline" onClick={() => window.location.href = '/meus-projetos'}>
            Ver Todos
          </Button>
        </div>

        {recentProjects.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {recentProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onViewDetails={onViewProject}
                userType="client"
              />
            ))}
          </div>
        ) : (
          <div className="construction-card p-8 text-center">
            <FolderOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              Nenhum projeto ainda
            </h3>
            <p className="text-muted-foreground mb-4">
              Crie o seu primeiro projeto para começar a receber orçamentos.
            </p>
            <Button onClick={onCreateProject}>
              <Plus className="w-4 h-4 mr-2" />
              Criar Primeiro Projeto
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

const ProviderDashboard = ({ projects, quotes, onCreateQuote, onViewProject }) => {
  const recentProjects = projects.slice(0, 3);
  const recentQuotes = quotes.slice(0, 3);

  return (
    <div className="space-y-8">
      {/* Projetos disponíveis */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-foreground">
            Projetos Disponíveis
          </h2>
          <Button variant="outline" onClick={() => window.location.href = '/projetos'}>
            Ver Todos
          </Button>
        </div>

        {recentProjects.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {recentProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onViewDetails={onViewProject}
                onCreateQuote={onCreateQuote}
                userType="provider"
              />
            ))}
          </div>
        ) : (
          <div className="construction-card p-8 text-center">
            <FolderOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              Nenhum projeto disponível
            </h3>
            <p className="text-muted-foreground">
              Não há projetos abertos no momento. Volte mais tarde.
            </p>
          </div>
        )}
      </div>

      {/* Orçamentos recentes */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-foreground">
            Meus Orçamentos Recentes
          </h2>
          <Button variant="outline" onClick={() => window.location.href = '/meus-orcamentos'}>
            Ver Todos
          </Button>
        </div>

        {recentQuotes.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {recentQuotes.map((quote) => (
              <QuoteCard
                key={quote.id}
                quote={quote}
                showActions={false}
                userType="provider"
              />
            ))}
          </div>
        ) : (
          <div className="construction-card p-8 text-center">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              Nenhum orçamento enviado
            </h3>
            <p className="text-muted-foreground">
              Comece a enviar orçamentos para projetos interessantes.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

