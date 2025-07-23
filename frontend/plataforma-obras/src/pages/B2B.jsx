import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert } from '@/components/ui/Alert';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ProviderCard } from '@/components/cards/ProviderCard';
import { 
  Search,
  Network,
  Users,
  Handshake,
  Star,
  Building2
} from 'lucide-react';
import axios from 'axios';
import '../App.css';

export const B2B = () => {
  const [loading, setLoading] = useState(true);
  const [providers, setProviders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [error, setError] = useState('');
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [showPartnershipModal, setShowPartnershipModal] = useState(false);

  useEffect(() => {
    loadProviders();
  }, []);

  const loadProviders = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/users/providers');
      setProviders(response.data.providers || []);
    } catch (error) {
      console.error('Erro ao carregar prestadores:', error);
      setError('Erro ao carregar prestadores');
    } finally {
      setLoading(false);
    }
  };

  const handleContactProvider = (provider) => {
    setSelectedProvider(provider);
    setShowPartnershipModal(true);
  };

  const filteredProviders = providers.filter(provider => {
    const matchesSearch = provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (provider.description && provider.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    let matchesRating = true;
    if (ratingFilter !== 'all') {
      const minRating = parseInt(ratingFilter);
      matchesRating = provider.average_rating >= minRating;
    }
    
    return matchesSearch && matchesRating;
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
          <div className="flex items-center space-x-3 mb-4">
            <Network className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">
              Rede B2B de Prestadores
            </h1>
          </div>
          <p className="text-muted-foreground">
            Conecte-se com outros prestadores para formar parcerias e trabalhar em projetos maiores.
          </p>
        </div>

        {error && (
          <Alert
            type="error"
            message={error}
            className="mb-6"
          />
        )}

        {/* Informações sobre B2B */}
        <div className="construction-card p-6 mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Handshake className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Como funciona a Rede B2B?
              </h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Encontre prestadores complementares aos seus serviços</li>
                <li>• Forme equipes para projetos de maior complexidade</li>
                <li>• Troque experiências e conhecimentos técnicos</li>
                <li>• Expanda a sua rede de contactos profissionais</li>
                <li>• Participe em projetos que exigem múltiplas especialidades</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="construction-card p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Pesquisar prestadores por nome ou especialidade..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <div className="relative">
                <Star className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <select
                  value={ratingFilter}
                  onChange={(e) => setRatingFilter(e.target.value)}
                  className="w-full md:w-auto pl-10 pr-3 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="all">Todas as Avaliações</option>
                  <option value="4">4+ Estrelas</option>
                  <option value="3">3+ Estrelas</option>
                  <option value="2">2+ Estrelas</option>
                  <option value="1">1+ Estrelas</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de Prestadores */}
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            {filteredProviders.length} prestador(es) na rede B2B
          </p>
        </div>

        {filteredProviders.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProviders.map((provider) => (
              <div key={provider.id} className="relative">
                <ProviderCard
                  provider={provider}
                  onContact={handleContactProvider}
                />
                <div className="absolute top-4 right-4">
                  <div className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                    <Network className="w-3 h-3" />
                    <span>B2B</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="construction-card p-8 text-center">
            <Network className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              Nenhum prestador encontrado
            </h3>
            <p className="text-muted-foreground">
              {providers.length === 0 
                ? 'Não há outros prestadores na rede B2B no momento.'
                : 'Tente ajustar os filtros de pesquisa.'
              }
            </p>
          </div>
        )}

        {/* Dicas para Networking */}
        <div className="construction-card p-6 mt-8">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center space-x-2">
            <Building2 className="w-5 h-5" />
            <span>Dicas para Networking B2B</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-foreground mb-2">Construa Parcerias Sólidas</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Seja transparente sobre as suas capacidades</li>
                <li>• Mantenha a qualidade dos seus serviços</li>
                <li>• Cumpra sempre os prazos acordados</li>
                <li>• Comunique-se de forma clara e profissional</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-2">Expanda o Seu Negócio</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Participe em projetos multidisciplinares</li>
                <li>• Aprenda com outros profissionais</li>
                <li>• Ofereça serviços complementares</li>
                <li>• Construa uma reputação sólida na rede</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Modal de Parceria */}
        {showPartnershipModal && selectedProvider && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-card rounded-lg shadow-xl max-w-md w-full">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center space-x-2">
                  <Handshake className="w-5 h-5" />
                  <span>Proposta de Parceria B2B</span>
                </h3>
                
                <div className="space-y-4">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Users className="w-8 h-8 text-primary" />
                    </div>
                    <h4 className="text-xl font-semibold text-foreground">
                      {selectedProvider.name}
                    </h4>
                    {selectedProvider.average_rating > 0 && (
                      <div className="flex items-center justify-center mt-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < selectedProvider.average_rating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                          <span className="ml-2 text-sm text-muted-foreground">
                            ({selectedProvider.total_reviews} avaliações)
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {selectedProvider.description && (
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Especialidades</p>
                      <p className="text-sm text-foreground">
                        {selectedProvider.description}
                      </p>
                    </div>
                  )}

                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <p className="text-sm text-foreground">
                      <strong>Sugestão:</strong> Entre em contacto para discutir oportunidades de parceria, 
                      projetos conjuntos ou troca de referências de clientes.
                    </p>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setShowPartnershipModal(false)}
                  >
                    Fechar
                  </Button>
                  <Button
                    onClick={() => {
                      const subject = encodeURIComponent('Proposta de Parceria B2B - Plataforma de Obras');
                      const body = encodeURIComponent(`Olá ${selectedProvider.name},\n\nVi o seu perfil na rede B2B da Plataforma de Obras e gostaria de discutir oportunidades de parceria.\n\nCumprimentos,`);
                      window.location.href = `mailto:${selectedProvider.email}?subject=${subject}&body=${body}`;
                    }}
                    className="construction-gradient text-white"
                  >
                    Propor Parceria
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

