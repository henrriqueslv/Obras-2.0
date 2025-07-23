import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert } from '@/components/ui/Alert';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { QuoteCard } from '@/components/cards/QuoteCard';
import { 
  Search,
  FileText,
  TrendingUp,
  Clock,
  CheckCircle
} from 'lucide-react';
import axios from 'axios';
import '../App.css';

export const MyQuotes = () => {
  const [loading, setLoading] = useState(true);
  const [quotes, setQuotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    accepted: 0,
    pending: 0,
    totalValue: 0
  });

  useEffect(() => {
    loadQuotes();
  }, []);

  const loadQuotes = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/quotes/my-quotes');
      const quotesData = response.data.quotes || [];
      setQuotes(quotesData);
      
      // Calcular estatísticas
      const accepted = quotesData.filter(q => q.is_accepted);
      const pending = quotesData.filter(q => !q.is_accepted);
      const totalValue = accepted.reduce((sum, q) => sum + q.price, 0);
      
      setStats({
        total: quotesData.length,
        accepted: accepted.length,
        pending: pending.length,
        totalValue
      });
      
    } catch (error) {
      console.error('Erro ao carregar orçamentos:', error);
      setError('Erro ao carregar orçamentos');
    } finally {
      setLoading(false);
    }
  };

  const filteredQuotes = quotes.filter(quote => {
    const matchesSearch = quote.project_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quote.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesStatus = true;
    if (statusFilter === 'accepted') {
      matchesStatus = quote.is_accepted;
    } else if (statusFilter === 'pending') {
      matchesStatus = !quote.is_accepted;
    }
    
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            Meus Orçamentos
          </h1>
          <p className="text-muted-foreground mt-2">
            Acompanhe os orçamentos enviados e o status dos projetos.
          </p>
        </div>

        {error && (
          <Alert
            type="error"
            message={error}
            className="mb-6"
          />
        )}

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="construction-card p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">
                  Total de Orçamentos
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {stats.total}
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
                  Aceitos
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {stats.accepted}
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
                  Pendentes
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {stats.pending}
                </p>
              </div>
            </div>
          </div>

          <div className="construction-card p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">
                  Valor Total Aceito
                </p>
                <p className="text-2xl font-bold text-foreground">
                  €{stats.totalValue.toFixed(2)}
                </p>
              </div>
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
                  placeholder="Pesquisar orçamentos..."
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
                <option value="pending">Pendentes</option>
                <option value="accepted">Aceitos</option>
              </select>
            </div>
          </div>
        </div>

        {/* Lista de Orçamentos */}
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            {filteredQuotes.length} orçamento(s) encontrado(s)
          </p>
        </div>

        {filteredQuotes.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredQuotes.map((quote) => (
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
              Nenhum orçamento encontrado
            </h3>
            <p className="text-muted-foreground mb-4">
              {quotes.length === 0 
                ? 'Você ainda não enviou nenhum orçamento.'
                : 'Tente ajustar os filtros de pesquisa.'
              }
            </p>
            {quotes.length === 0 && (
              <Button
                onClick={() => window.location.href = '/projetos'}
                className="construction-gradient text-white"
              >
                Ver Projetos Disponíveis
              </Button>
            )}
          </div>
        )}

        {/* Taxa de Aceitação */}
        {quotes.length > 0 && (
          <div className="construction-card p-6 mt-8">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Estatísticas de Desempenho
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">
                  {stats.total > 0 ? Math.round((stats.accepted / stats.total) * 100) : 0}%
                </p>
                <p className="text-sm text-muted-foreground">Taxa de Aceitação</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">
                  €{stats.total > 0 ? (stats.totalValue / stats.total).toFixed(2) : '0.00'}
                </p>
                <p className="text-sm text-muted-foreground">Valor Médio por Orçamento</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">
                  {stats.accepted}
                </p>
                <p className="text-sm text-muted-foreground">Projetos Conquistados</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

