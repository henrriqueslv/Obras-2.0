import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert } from '@/components/ui/Alert';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Building2, 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Globe,
  Instagram,
  FileText
} from 'lucide-react';
import '../App.css';

export const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    user_type: 'client',
    description: '',
    website: '',
    instagram: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      setLoading(false);
      return;
    }

    const userData = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      user_type: formData.user_type,
      description: formData.description,
      website: formData.website,
      instagram: formData.instagram
    };

    const result = await register(userData);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <Building2 className="w-12 h-12 text-primary" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-foreground">
            Criar nova conta
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Ou{' '}
            <Link
              to="/login"
              className="font-medium text-primary hover:text-primary/80 transition-colors"
            >
              entrar na sua conta existente
            </Link>
          </p>
        </div>

        <div className="bg-card rounded-lg shadow-lg p-8">
          {error && (
            <Alert
              type="error"
              message={error}
              className="mb-6"
            />
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Tipo de usuário */}
            <div>
              <Label className="block text-sm font-medium text-foreground mb-3">
                Tipo de conta
              </Label>
              <div className="grid grid-cols-2 gap-3">
                <label className="relative">
                  <input
                    type="radio"
                    name="user_type"
                    value="client"
                    checked={formData.user_type === 'client'}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className={`
                    border-2 rounded-lg p-3 text-center cursor-pointer transition-colors
                    ${formData.user_type === 'client' 
                      ? 'border-primary bg-primary/5 text-primary' 
                      : 'border-border hover:border-primary/50'
                    }
                  `}>
                    <User className="w-6 h-6 mx-auto mb-1" />
                    <span className="text-sm font-medium">Cliente</span>
                  </div>
                </label>
                <label className="relative">
                  <input
                    type="radio"
                    name="user_type"
                    value="provider"
                    checked={formData.user_type === 'provider'}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className={`
                    border-2 rounded-lg p-3 text-center cursor-pointer transition-colors
                    ${formData.user_type === 'provider' 
                      ? 'border-primary bg-primary/5 text-primary' 
                      : 'border-border hover:border-primary/50'
                    }
                  `}>
                    <Building2 className="w-6 h-6 mx-auto mb-1" />
                    <span className="text-sm font-medium">Prestador</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Dados básicos */}
            <div>
              <Label htmlFor="name" className="block text-sm font-medium text-foreground">
                Nome completo
              </Label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-muted-foreground" />
                </div>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="pl-10"
                  placeholder="Seu nome completo"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email" className="block text-sm font-medium text-foreground">
                Email
              </Label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                </div>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="pl-10"
                  placeholder="seu@email.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="phone" className="block text-sm font-medium text-foreground">
                Telefone
              </Label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                </div>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  className="pl-10"
                  placeholder="+351 912 345 678"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password" className="block text-sm font-medium text-foreground">
                Senha
              </Label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-muted-foreground" />
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="pl-10"
                  placeholder="Mínimo 6 caracteres"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground">
                Confirmar senha
              </Label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-muted-foreground" />
                </div>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  className="pl-10"
                  placeholder="Confirme sua senha"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Campos específicos para prestadores */}
            {formData.user_type === 'provider' && (
              <>
                <div>
                  <Label htmlFor="description" className="block text-sm font-medium text-foreground">
                    Descrição dos serviços
                  </Label>
                  <div className="mt-1 relative">
                    <Textarea
                      id="description"
                      name="description"
                      rows={3}
                      placeholder="Descreva os serviços que oferece..."
                      value={formData.description}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="website" className="block text-sm font-medium text-foreground">
                    Website (opcional)
                  </Label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Globe className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <Input
                      id="website"
                      name="website"
                      type="url"
                      className="pl-10"
                      placeholder="www.seusite.com"
                      value={formData.website}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="instagram" className="block text-sm font-medium text-foreground">
                    Instagram (opcional)
                  </Label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Instagram className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <Input
                      id="instagram"
                      name="instagram"
                      type="text"
                      className="pl-10"
                      placeholder="@seuinstagram"
                      value={formData.instagram}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <Button
                type="submit"
                className="w-full construction-gradient text-white"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <LoadingSpinner size="sm" className="mr-2" />
                    Criando conta...
                  </div>
                ) : (
                  'Criar conta'
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

