import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert } from '@/components/ui/Alert';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { 
  ArrowLeft,
  MapPin,
  DollarSign,
  FileText,
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

export const CreateProject = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    budget_min: '',
    budget_max: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const projectData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        location: formData.location,
        budget_min: formData.budget_min ? parseFloat(formData.budget_min) : null,
        budget_max: formData.budget_max ? parseFloat(formData.budget_max) : null
      };

      const response = await axios.post('/api/projects', projectData);
      
      setSuccess('Projeto criado com sucesso!');
      
      // Redirecionar após 2 segundos
      setTimeout(() => {
        navigate('/meus-projetos');
      }, 2000);

    } catch (error) {
      console.error('Erro ao criar projeto:', error);
      setError(error.response?.data?.message || 'Erro ao criar projeto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            className="mb-4 flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar ao Dashboard</span>
          </Button>
          
          <h1 className="text-3xl font-bold text-foreground">
            Criar Novo Projeto
          </h1>
          <p className="text-muted-foreground mt-2">
            Descreva o seu projeto para receber orçamentos de prestadores qualificados.
          </p>
        </div>

        <div className="construction-card p-8">
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

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Título */}
            <div>
              <Label htmlFor="title" className="block text-sm font-medium text-foreground">
                Título do Projeto *
              </Label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                </div>
                <Input
                  id="title"
                  name="title"
                  type="text"
                  required
                  className="pl-10"
                  placeholder="Ex: Renovação da cozinha"
                  value={formData.title}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Categoria */}
            <div>
              <Label htmlFor="category" className="block text-sm font-medium text-foreground">
                Categoria *
              </Label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Tag className="h-5 w-5 text-muted-foreground" />
                </div>
                <select
                  id="category"
                  name="category"
                  required
                  className="w-full pl-10 pr-3 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option value="">Selecione uma categoria</option>
                  {CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Localização */}
            <div>
              <Label htmlFor="location" className="block text-sm font-medium text-foreground">
                Localização *
              </Label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                </div>
                <Input
                  id="location"
                  name="location"
                  type="text"
                  required
                  className="pl-10"
                  placeholder="Ex: Lisboa, Porto, Coimbra..."
                  value={formData.location}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Orçamento */}
            <div>
              <Label className="block text-sm font-medium text-foreground mb-3">
                Orçamento Estimado (€)
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="budget_min" className="block text-xs text-muted-foreground mb-1">
                    Valor mínimo
                  </Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <DollarSign className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <Input
                      id="budget_min"
                      name="budget_min"
                      type="number"
                      min="0"
                      step="0.01"
                      className="pl-10"
                      placeholder="0.00"
                      value={formData.budget_min}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="budget_max" className="block text-xs text-muted-foreground mb-1">
                    Valor máximo
                  </Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <DollarSign className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <Input
                      id="budget_max"
                      name="budget_max"
                      type="number"
                      min="0"
                      step="0.01"
                      className="pl-10"
                      placeholder="0.00"
                      value={formData.budget_max}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Deixe em branco se preferir receber propostas sem limite de orçamento.
              </p>
            </div>

            {/* Descrição */}
            <div>
              <Label htmlFor="description" className="block text-sm font-medium text-foreground">
                Descrição Detalhada *
              </Label>
              <div className="mt-1">
                <Textarea
                  id="description"
                  name="description"
                  rows={6}
                  required
                  placeholder="Descreva detalhadamente o que precisa ser feito, materiais necessários, prazos, e qualquer informação relevante para os prestadores..."
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Quanto mais detalhada a descrição, melhores serão os orçamentos que receberá.
              </p>
            </div>

            {/* Botões */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-border">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/dashboard')}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="construction-gradient text-white"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center">
                    <LoadingSpinner size="sm" className="mr-2" />
                    Criando...
                  </div>
                ) : (
                  'Criar Projeto'
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

