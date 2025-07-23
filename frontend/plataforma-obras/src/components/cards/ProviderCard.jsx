import React from 'react';
import { Button } from '@/components/ui/button';
import { StarRating } from '@/components/ui/StarRating';
import { 
  Phone, 
  Mail, 
  Globe, 
  Instagram,
  MessageSquare,
  User
} from 'lucide-react';

export const ProviderCard = ({ provider, onContact, showActions = true }) => {
  const handleExternalLink = (url) => {
    if (url && !url.startsWith('http')) {
      url = 'https://' + url;
    }
    window.open(url, '_blank');
  };

  return (
    <div className="construction-card p-6">
      <div className="flex items-start space-x-4 mb-4">
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
          <User className="w-6 h-6 text-primary" />
        </div>
        
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground mb-1">
            {provider.name}
          </h3>
          
          <div className="flex items-center space-x-4 mb-2">
            <StarRating rating={provider.average_rating} />
            {provider.total_reviews > 0 && (
              <span className="text-sm text-muted-foreground">
                {provider.total_reviews} avaliação(ões)
              </span>
            )}
          </div>
        </div>
      </div>

      {provider.description && (
        <p className="text-muted-foreground mb-4 line-clamp-3">
          {provider.description}
        </p>
      )}

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-muted-foreground">
          <Mail className="w-4 h-4 mr-2" />
          <span>{provider.email}</span>
        </div>

        <div className="flex items-center text-sm text-muted-foreground">
          <Phone className="w-4 h-4 mr-2" />
          <span>{provider.phone}</span>
        </div>

        {provider.website && (
          <div className="flex items-center text-sm text-muted-foreground">
            <Globe className="w-4 h-4 mr-2" />
            <button
              onClick={() => handleExternalLink(provider.website)}
              className="text-primary hover:underline"
            >
              {provider.website}
            </button>
          </div>
        )}

        {provider.instagram && (
          <div className="flex items-center text-sm text-muted-foreground">
            <Instagram className="w-4 h-4 mr-2" />
            <button
              onClick={() => handleExternalLink(`https://instagram.com/${provider.instagram.replace('@', '')}`)}
              className="text-primary hover:underline"
            >
              @{provider.instagram.replace('@', '')}
            </button>
          </div>
        )}
      </div>

      {showActions && (
        <div className="flex space-x-2 pt-4 border-t border-border">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onContact?.(provider)}
            className="flex items-center space-x-1"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Contactar</span>
          </Button>
          <Button
            size="sm"
            onClick={() => onContact?.(provider)}
          >
            Ver Perfil
          </Button>
        </div>
      )}
    </div>
  );
};

