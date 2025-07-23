import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Calendar, 
  DollarSign, 
  User, 
  MessageSquare,
  Clock
} from 'lucide-react';

export const ProjectCard = ({ project, onViewDetails, onCreateQuote, showActions = true, userType }) => {
  const getStatusBadge = (status) => {
    const statusConfig = {
      open: { label: 'Aberto', variant: 'default', className: 'construction-badge-open' },
      in_progress: { label: 'Em Andamento', variant: 'secondary', className: 'construction-badge-progress' },
      completed: { label: 'Concluído', variant: 'outline', className: 'construction-badge-completed' }
    };

    const config = statusConfig[status] || statusConfig.open;
    
    return (
      <Badge variant={config.variant} className={`construction-badge ${config.className}`}>
        {config.label}
      </Badge>
    );
  };

  const formatBudget = (min, max) => {
    if (!min && !max) return 'Orçamento a combinar';
    if (min && max) return `€${min} - €${max}`;
    if (min) return `A partir de €${min}`;
    if (max) return `Até €${max}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-PT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="construction-card p-6">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground mb-2">
            {project.title}
          </h3>
          {getStatusBadge(project.status)}
        </div>
        <div className="text-right text-sm text-muted-foreground">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            {formatDate(project.created_at)}
          </div>
        </div>
      </div>

      <p className="text-muted-foreground mb-4 line-clamp-3">
        {project.description}
      </p>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-muted-foreground">
          <MapPin className="w-4 h-4 mr-2" />
          <span>{project.location}</span>
        </div>
        
        <div className="flex items-center text-sm text-muted-foreground">
          <DollarSign className="w-4 h-4 mr-2" />
          <span>{formatBudget(project.budget_min, project.budget_max)}</span>
        </div>

        <div className="flex items-center text-sm text-muted-foreground">
          <User className="w-4 h-4 mr-2" />
          <span>{project.client_name}</span>
        </div>

        {project.quotes_count > 0 && (
          <div className="flex items-center text-sm text-muted-foreground">
            <MessageSquare className="w-4 h-4 mr-2" />
            <span>{project.quotes_count} orçamento(s) recebido(s)</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <Badge variant="secondary" className="text-xs">
          {project.category}
        </Badge>

        {showActions && (
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetails?.(project)}
            >
              Ver Detalhes
            </Button>
            
            {userType === 'provider' && project.status === 'open' && (
              <Button
                size="sm"
                onClick={() => onCreateQuote?.(project)}
              >
                Enviar Orçamento
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

