import { useState } from 'react';
import { Settings } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/app/components/ui/dialog';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';

interface SensitivityManagerProps {
  sensitivity: number;
  onUpdateSensitivity: (sensitivity: number) => void;
}

export function SensitivityManager({ sensitivity, onUpdateSensitivity }: SensitivityManagerProps) {
  const [tempSensitivity, setTempSensitivity] = useState(sensitivity.toString());
  const [isOpen, setIsOpen] = useState(false);

  const handleSave = () => {
    const numValue = parseFloat(tempSensitivity);
    if (!isNaN(numValue) && numValue >= 0 && numValue <= 200) {
      onUpdateSensitivity(numValue);
      setIsOpen(false);
    }
  };

  const handleChange = (value: string) => {
    // Remove tudo exceto números e ponto decimal
    const cleaned = value.replace(/[^0-9.]/g, '');
    setTempSensitivity(cleaned);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="w-4 h-4 mr-2" />
          Configurar Sensibilidade
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Configurar Sensibilidade da Análise</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <p className="text-sm text-gray-600">
            A sensibilidade é usada para ajustar o impacto financeiro dos riscos. 
            Por exemplo, uma sensibilidade de 110% aumenta o impacto em 10%.
          </p>
          
          <div className="space-y-2">
            <Label htmlFor="sensitivity">Sensibilidade (%)</Label>
            <Input
              id="sensitivity"
              type="text"
              value={tempSensitivity}
              onChange={(e) => handleChange(e.target.value)}
              placeholder="Ex: 100"
              className="text-lg"
            />
            <p className="text-xs text-gray-500">
              Valor atual: {sensitivity}%
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              className="flex-1"
            >
              Salvar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
