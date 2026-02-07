import { useState } from 'react';
import { Plus, X, Settings } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/app/components/ui/dialog';
import { Input } from '@/app/components/ui/input';

interface CategoryManagerProps {
  exposures: string[];
  onUpdateExposures: (exposures: string[]) => void;
}

export function CategoryManager({ exposures, onUpdateExposures }: CategoryManagerProps) {
  const [newExposure, setNewExposure] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleAddExposure = () => {
    if (newExposure.trim() && !exposures.includes(newExposure.trim())) {
      onUpdateExposures([...exposures, newExposure.trim()]);
      setNewExposure('');
    }
  };

  const handleRemoveExposure = (exposure: string) => {
    onUpdateExposures(exposures.filter(c => c !== exposure));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddExposure();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="w-4 h-4 mr-2" />
          Configurar Exposição
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Gerenciar Níveis de Exposição ao Risco</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Input para nova exposição */}
          <div className="flex gap-2">
            <Input
              placeholder="Digite um novo nível de exposição..."
              value={newExposure}
              onChange={(e) => setNewExposure(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
            <Button onClick={handleAddExposure} size="sm">
              <Plus className="w-4 h-4 mr-1" />
              Adicionar
            </Button>
          </div>

          {/* Lista de exposições */}
          <div className="border rounded-lg p-4 max-h-96 overflow-y-auto">
            <p className="text-sm font-medium mb-3 text-gray-700">Níveis Atuais:</p>
            <div className="space-y-2">
              {exposures.map((exposure) => (
                <div
                  key={exposure}
                  className="flex items-center justify-between bg-gray-50 p-3 rounded-md hover:bg-gray-100 transition-colors"
                >
                  <span className="text-sm">{exposure}</span>
                  <button
                    onClick={() => handleRemoveExposure(exposure)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                    title="Remover nível"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}