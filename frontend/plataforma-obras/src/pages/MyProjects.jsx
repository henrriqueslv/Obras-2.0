import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert } from '@/components/ui/Alert';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ProjectCard } from '@/components/cards/ProjectCard';
import { QuoteCard } from '@/components/cards/QuoteCard';
import { 
  Plus,
  Search,
  Filter,
  FolderOpen
} from 'lucide-react';
import axios from 'axios';
import '../App.css';

export const MyProjects = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectQuotes, setProjectQuotes] = useState([]);
  const [quotesLoading, setQuotesLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [error, setError] = useState('');

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/projects');
      setProjects(response.data.projects || []);
    } catch (error) {
      console.error('Erro ao carregar projetos:', error);
      setError('Erro ao carregar projetos');
    } finally {
      setLoading(false);
    }
  };

  const loadProjectQuotes = async (projectId) => {
    try {
      setQuotesLoading(true);
      const response = await axios.get(`/api/projects/${projectId}/quotes`);
      setProjectQuotes(response.data.quotes || []);
    } catch (error) {
      console.error('Erro ao carregar orçamentos:', error);
      setError('Erro ao carregar orçamentos');
    } finally {
      setQuotesLoading(false);
    }
  };

  const handleViewProject = (project) => {
    setSelectedProject(project);
    loadProjectQuotes(project.id);
  };

  const handleAcceptQuote = async (quote) => {
    try {
      await axios.post(`/api/quotes/${quote.id}/accept`);
      
      // Recarregar dados
      await loadProjects();
      if (selectedProject) {
        await loadProjectQuotes(selectedProject.id);
      }
      
      setError('');
      // Mostrar mensagem de sucesso
    } catch (error) {
      console.error('Erro ao aceitar orçamento:', error);
      setError('Erro ao aceitar orçamento');
    }
  };

  const handleCompleteProject = async (projectId) => {
    try {
      await axios.post(`/api/projects/${projectId}/complete`);
      await loadProjects();
      setError('');
    } catch (error) {
      console.error('Erro ao marcar projeto como concluído:', error);
      setError('Erro ao marcar projeto como concluído');
    }
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <LoadingSpinner size="lg" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Meus Projetos
            </h1>
            <p className="text-muted-foreground mt-2">
              Gerencie os seus projetos e orçamentos recebidos.
            </p>
          </div>
          <Button
            onClick={() => navigate('/criar-projeto')}
            className="construction-gradient text-white flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Projeto</span>
          </Button>
        </div>

        {error && (
          <Alert
            type="error"
            message={error}
            className="mb-6"
          />
        )}

        {/* Filtros */}
        <div className="construction-card p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Pesquisar projetos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full md:w-auto px-3 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="all">Todos os Status</option>
                <option value="open">Aberto</option>
                <option value="in_progress">Em Andamento</option>
                <option value="completed">Concluído</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Lista de Projetos */}
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Projetos ({filteredProjects.length})
            </h2>
            
            {filteredProjects.length > 0 ? (
              <div className="space-y-4">
                {filteredProjects.map((project) => (
                  <div
                    key={project.id}
                    className={`
                      cursor-pointer transition-all
                      ${selectedProject?.id === project.id ? 'ring-2 ring-primary' : ''}
                    `}
                    onClick={() => handleViewProject(project)}
                  >
                    <ProjectCard
                      project={project}
                      onViewDetails={handleViewProject}
                      showActions={false}
                      userType="client"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="construction-card p-8 text-center">
                <FolderOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  Nenhum projeto encontrado
                </h3>
                <p className="text-muted-foreground mb-4">
                  {projects.length === 0 
                    ? 'Crie o seu primeiro projeto para começar.'
                    : 'Tente ajustar os filtros de pesquisa.'
                  }
                </p>
                {projects.length === 0 && (
                  <Button
                    onClick={() => navigate('/criar-projeto')}
                    className="construction-gradient text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Criar Primeiro Projeto
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Detalhes do Projeto e Orçamentos */}
          <div>
            {selectedProject ? (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-foreground">
                    Orçamentos Recebidos
                  </h2>
                  {selectedProject.status === 'in_progress' && (
                    <Button
                      size="sm"
                      onClick={() => handleCompleteProject(selectedProject.id)}
                      className="construction-gradient text-white"
                    >
                      Marcar como Concluído
                    </Button>
                  )}
                </div>

                {quotesLoading ? (
                  <div className="construction-card p-8 text-center">
                    <LoadingSpinner size="lg" />
                  </div>
                ) : projectQuotes.length > 0 ? (
                  <div className="space-y-4">
                    {projectQuotes.map((quote) => (
                      <QuoteCard
                        key={quote.id}
                        quote={quote}
                        onAccept={handleAcceptQuote}
                        showActions={selectedProject.status === 'open'}
                        userType="client"
                      />
                    ))}
                  </div>
                ) : (
                  <div className="construction-card p-8 text-center">
                    <div className="text-muted-foreground">
                      <p className="mb-2">Nenhum orçamento recebido ainda.</p>
                      <p className="text-sm">
                        Os prestadores interessados enviarão orçamentos em breve.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="construction-card p-8 text-center">
                <div className="text-muted-foreground">
                  <p>Selecione um projeto para ver os orçamentos recebidos.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

