import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert } from '@/components/ui/Alert';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ProjectCard } from '@/components/cards/ProjectCard';
import { 
  Search,
  Filter,
  FolderOpen,
  MapPin,
  Tag
} from 'lucide-react';
import axios from 'axios';
import '../App.css';

const CATEGORIES = [
  'Elétrica',
  'Hidráulica', 
  'Pintura',
  'Alvenaria',
  'Marcenaria',
  'Jardinagem',
  'Limpeza',
  'Outros'
];

export const Projects = () => {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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

  const handleCreateQuote = (project) => {
    // Implementar modal ou navegação para criar orçamento
    setSelectedProject(project);
    setShowQuoteModal(true);
  };

  const [selectedProject, setSelectedProject] = useState(null);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [quoteData, setQuoteData] = useState({
    price: '',
    description: '',
    estimated_duration: ''
  });
  const [quoteLoading, setQuoteLoading] = useState(false);

  const handleQuoteSubmit = async (e) => {
    e.preventDefault();
    setQuoteLoading(true);
    setError('');

    try {
      const quotePayload = {
        project_id: selectedProject.id,
        price: parseFloat(quoteData.price),
        description: quoteData.description,
        estimated_duration: quoteData.estimated_duration
      };

      await axios.post('/api/quotes', quotePayload);
      
      setSuccess('Orçamento enviado com sucesso!');
      setShowQuoteModal(false);
      setQuoteData({ price: '', description: '', estimated_duration: '' });
      
      // Recarregar projetos para atualizar contadores
      await loadProjects();
      
    } catch (error) {
      console.error('Erro ao enviar orçamento:', error);
      setError(error.response?.data?.message || 'Erro ao enviar orçamento');
    } finally {
      setQuoteLoading(false);
    }
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.client_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || project.category === categoryFilter;
    const matchesLocation = !locationFilter || 
                           project.location.toLowerCase().includes(locationFilter.toLowerCase());
    
    return matchesSearch && matchesCategory && matchesLocation;
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            Projetos Disponíveis
          </h1>
          <p className="text-muted-foreground mt-2">
            Encontre oportunidades de trabalho e envie os seus orçamentos.
          </p>
        </div>

        {error && (
          <Alert
            type="error"
            message={error}
            className="mb-6"
          />
        )}

        {success && (
          <Alert
            type="success"
            message={success}
            className="mb-6"
          />
        )}

        {/* Filtros */}
        <div className="construction-card p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
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
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="all">Todas as Categorias</option>
                  {CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Filtrar por localização..."
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Lista de Projetos */}
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            {filteredProjects.length} projeto(s) encontrado(s)
          </p>
        </div>

        {filteredProjects.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onCreateQuote={handleCreateQuote}
                userType="provider"
              />
            ))}
          </div>
        ) : (
          <div className="construction-card p-8 text-center">
            <FolderOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              Nenhum projeto encontrado
            </h3>
            <p className="text-muted-foreground">
              {projects.length === 0 
                ? 'Não há projetos disponíveis no momento.'
                : 'Tente ajustar os filtros de pesquisa.'
              }
            </p>
          </div>
        )}

        {/* Modal de Orçamento */}
        {showQuoteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-card rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Enviar Orçamento
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Projeto: <strong>{selectedProject?.title}</strong>
                </p>

                <form onSubmit={handleQuoteSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Preço (€) *
                    </label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      required
                      placeholder="0.00"
                      value={quoteData.price}
                      onChange={(e) => setQuoteData(prev => ({ ...prev, price: e.target.value }))}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Prazo Estimado
                    </label>
                    <Input
                      type="text"
                      placeholder="Ex: 2 semanas, 1 mês..."
                      value={quoteData.estimated_duration}
                      onChange={(e) => setQuoteData(prev => ({ ...prev, estimated_duration: e.target.value }))}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Descrição do Serviço *
                    </label>
                    <textarea
                      required
                      rows={4}
                      className="w-full px-3 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                      placeholder="Descreva como irá executar o projeto, materiais incluídos, etc..."
                      value={quoteData.description}
                      onChange={(e) => setQuoteData(prev => ({ ...prev, description: e.target.value }))}
                    />
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowQuoteModal(false)}
                      disabled={quoteLoading}
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      className="construction-gradient text-white"
                      disabled={quoteLoading}
                    >
                      {quoteLoading ? (
                        <div className="flex items-center">
                          <LoadingSpinner size="sm" className="mr-2" />
                          Enviando...
                        </div>
                      ) : (
                        'Enviar Orçamento'
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

