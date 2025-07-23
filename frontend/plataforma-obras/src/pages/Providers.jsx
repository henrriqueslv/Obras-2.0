import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert } from '@/components/ui/Alert';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ProviderCard } from '@/components/cards/ProviderCard';
import { 
  Search,
  Users,
  Star,
  MapPin,
  Phone,
  Mail
} from 'lucide-react';
import axios from 'axios';
import '../App.css';

export const Providers = () => {
  const [loading, setLoading] = useState(true);
  const [providers, setProviders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [error, setError] = useState('');
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [showContactModal, setShowContactModal] = useState(false);

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
    setShowContactModal(true);
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
          <h1 className="text-3xl font-bold text-foreground">
            Prestadores de Serviços
          </h1>
          <p className="text-muted-foreground mt-2">
            Encontre prestadores qualificados para os seus projetos.
          </p>
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
                  placeholder="Pesquisar prestadores..."
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
            {filteredProviders.length} prestador(es) encontrado(s)
          </p>
        </div>

        {filteredProviders.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProviders.map((provider) => (
              <ProviderCard
                key={provider.id}
                provider={provider}
                onContact={handleContactProvider}
              />
            ))}
          </div>
        ) : (
          <div className="construction-card p-8 text-center">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              Nenhum prestador encontrado
            </h3>
            <p className="text-muted-foreground">
              {providers.length === 0 
                ? 'Não há prestadores cadastrados no momento.'
                : 'Tente ajustar os filtros de pesquisa.'
              }
            </p>
          </div>
        )}

        {/* Modal de Contato */}
        {showContactModal && selectedProvider && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-card rounded-lg shadow-xl max-w-md w-full">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Informações de Contato
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

                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <a 
                          href={`mailto:${selectedProvider.email}`}
                          className="text-primary hover:underline"
                        >
                          {selectedProvider.email}
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Phone className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Telefone</p>
                        <a 
                          href={`tel:${selectedProvider.phone}`}
                          className="text-primary hover:underline"
                        >
                          {selectedProvider.phone}
                        </a>
                      </div>
                    </div>

                    {selectedProvider.website && (
                      <div className="flex items-center space-x-3">
                        <MapPin className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Website</p>
                          <a 
                            href={selectedProvider.website.startsWith('http') ? selectedProvider.website : `https://${selectedProvider.website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            {selectedProvider.website}
                          </a>
                        </div>
                      </div>
                    )}

                    {selectedProvider.instagram && (
                      <div className="flex items-center space-x-3">
                        <div className="w-5 h-5 text-muted-foreground">📷</div>
                        <div>
                          <p className="text-sm text-muted-foreground">Instagram</p>
                          <a 
                            href={`https://instagram.com/${selectedProvider.instagram.replace('@', '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            @{selectedProvider.instagram.replace('@', '')}
                          </a>
                        </div>
                      </div>
                    )}
                  </div>

                  {selectedProvider.description && (
                    <div className="mt-4 p-4 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Sobre</p>
                      <p className="text-sm text-foreground">
                        {selectedProvider.description}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setShowContactModal(false)}
                  >
                    Fechar
                  </Button>
                  <Button
                    onClick={() => window.location.href = `mailto:${selectedProvider.email}`}
                    className="construction-gradient text-white"
                  >
                    Enviar Email
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

