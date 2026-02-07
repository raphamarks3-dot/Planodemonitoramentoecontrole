import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/app/components/ui/dialog';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';

interface QualitativeAnalysisData {
  probabilidade: string;
  exposicao: string;
  estrategia: string;
  respostas: string;
  dataPrevista: string;
  observacao: string;
}

interface QualitativeAnalysisDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (riskId: string, data: QualitativeAnalysisData) => void;
  riskId: string;
  exposures: string[];
}

const ESTRATEGIAS = ['Evitar', 'Reduzir', 'Compartilhar', 'Transferir', 'Aceitar', 'Melhorar', 'Provocar'];

export function QualitativeAnalysisDialog({ isOpen, onClose, onSave, riskId, exposures }: QualitativeAnalysisDialogProps) {
  const [formData, setFormData] = useState<QualitativeAnalysisData>({
    probabilidade: '',
    exposicao: '',
    estrategia: '',
    respostas: '',
    dataPrevista: '',
    observacao: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(riskId, formData);
    // Reset form
    setFormData({
      probabilidade: '',
      exposicao: '',
      estrategia: '',
      respostas: '',
      dataPrevista: '',
      observacao: ''
    });
    onClose();
  };

  const handleChange = (field: keyof QualitativeAnalysisData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nova Análise Qualitativa</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Probabilidade de Acontecer */}
          <div className="space-y-2">
            <Label htmlFor="probabilidade">Probabilidade de Acontecer (%)</Label>
            <Input
              id="probabilidade"
              type="text"
              placeholder="Ex: 25"
              value={formData.probabilidade}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, '');
                const numValue = parseInt(value);
                if (value === '' || (numValue >= 0 && numValue <= 100)) {
                  handleChange('probabilidade', value);
                }
              }}
              required
            />
          </div>

          {/* Exposição ao Risco */}
          <div className="space-y-2">
            <Label htmlFor="exposicao">Exposição ao Risco</Label>
            <Select
              value={formData.exposicao}
              onValueChange={(value) => handleChange('exposicao', value)}
              required
            >
              <SelectTrigger id="exposicao">
                <SelectValue placeholder="Selecione a exposição..." />
              </SelectTrigger>
              <SelectContent>
                {exposures.map((exposure) => (
                  <SelectItem key={exposure} value={exposure}>
                    {exposure}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Estratégia */}
          <div className="space-y-2">
            <Label htmlFor="estrategia">Estratégia</Label>
            <Select
              value={formData.estrategia}
              onValueChange={(value) => handleChange('estrategia', value)}
              required
            >
              <SelectTrigger id="estrategia">
                <SelectValue placeholder="Selecione a estratégia..." />
              </SelectTrigger>
              <SelectContent>
                {ESTRATEGIAS.map((estrategia) => (
                  <SelectItem key={estrategia} value={estrategia}>
                    {estrategia}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Respostas ao Risco */}
          <div className="space-y-2">
            <Label htmlFor="respostas">Respostas ao Risco</Label>
            <Input
              id="respostas"
              type="text"
              placeholder="Descreva as respostas ao risco..."
              value={formData.respostas}
              onChange={(e) => handleChange('respostas', e.target.value)}
              required
            />
          </div>

          {/* Data Prevista para Conclusão */}
          <div className="space-y-2">
            <Label htmlFor="dataPrevista">Data Prevista para Conclusão</Label>
            <Input
              id="dataPrevista"
              type="date"
              value={formData.dataPrevista}
              onChange={(e) => handleChange('dataPrevista', e.target.value)}
              required
            />
          </div>

          {/* Observação */}
          <div className="space-y-2">
            <Label htmlFor="observacao">Observação</Label>
            <Input
              id="observacao"
              type="text"
              placeholder="Observações adicionais..."
              value={formData.observacao}
              onChange={(e) => handleChange('observacao', e.target.value)}
            />
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              Salvar Análise
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}