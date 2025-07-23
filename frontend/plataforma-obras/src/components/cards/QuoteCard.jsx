import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StarRating } from '@/components/ui/StarRating';
import { 
  DollarSign, 
  Clock, 
  User, 
  Calendar,
  CheckCircle,
  XCircle
} from 'lucide-react';

export const QuoteCard = ({ quote, onAccept, onReject, showActions = true, userType }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-PT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="construction-card p-6">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Orçamento para: {quote.project_title}
          </h3>
          {quote.is_accepted && (
            <Badge className="construction-badge construction-badge-completed">
              <CheckCircle className="w-3 h-3 mr-1" />
              Aceito
            </Badge>
          )}
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-primary">
            €{quote.price}
          </div>
        </div>
      </div>

      <p className="text-muted-foreground mb-4">
        {quote.description}
      </p>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-muted-foreground">
          <User className="w-4 h-4 mr-2" />
          <span>{quote.provider_name}</span>
          {quote.provider_rating > 0 && (
            <div className="ml-2">
              <StarRating rating={quote.provider_rating} size="sm" />
            </div>
          )}
        </div>

        {quote.estimated_duration && (
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="w-4 h-4 mr-2" />
            <span>Prazo estimado: {quote.estimated_duration}</span>
          </div>
        )}

        <div className="flex items-center text-sm text-muted-foreground">
          <Calendar className="w-4 h-4 mr-2" />
          <span>Enviado em: {formatDate(quote.created_at)}</span>
        </div>
      </div>

      {showActions && userType === 'client' && !quote.is_accepted && (
        <div className="flex space-x-2 pt-4 border-t border-border">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onReject?.(quote)}
            className="flex items-center space-x-1"
          >
            <XCircle className="w-4 h-4" />
            <span>Recusar</span>
          </Button>
          <Button
            size="sm"
            onClick={() => onAccept?.(quote)}
            className="flex items-center space-x-1"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Aceitar Orçamento</span>
          </Button>
        </div>
      )}
    </div>
  );
};

