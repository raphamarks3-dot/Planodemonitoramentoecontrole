import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/app/components/ui/dialog';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';

interface QuantitativeAnalysisDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (riskId: string, data: any) => void;
  riskId: string;
}

export function QuantitativeAnalysisDialog({
  isOpen,
  onClose,
  onSave,
  riskId,
}: QuantitativeAnalysisDialogProps) {
  const [formData, setFormData] = useState({
    causaRaiz: '',
    impactoFinanceiro: '',
  });

  const handleSubmit = () => {
    if (!formData.causaRaiz.trim()) {
      alert('Por favor, preencha a causa raiz do risco');
      return;
    }

    if (!formData.impactoFinanceiro || parseFloat(formData.impactoFinanceiro) === 0) {
      alert('Por favor, preencha o impacto financeiro');
      return;
    }

    onSave(riskId, {
      causaRaiz: formData.causaRaiz,
      impactoFinanceiro: formData.impactoFinanceiro,
    });

    // Limpar formulário
    setFormData({
      causaRaiz: '',
      impactoFinanceiro: '',
    });
    
    onClose();
  };

  const handleCancel = () => {
    setFormData({
      causaRaiz: '',
      impactoFinanceiro: '',
    });
    onClose();
  };

  const formatCurrency = (value: string) => {
    // Remove tudo exceto números, ponto e vírgula
    let cleaned = value.replace(/[^\d.,-]/g, '');
    
    // Remove pontos que não são decimais
    cleaned = cleaned.replace(/\./g, '');
    
    // Substitui vírgula por ponto para o cálculo
    cleaned = cleaned.replace(',', '.');
    
    return cleaned;
  };

  const handleImpactoChange = (value: string) => {
    const formatted = formatCurrency(value);
    setFormData({ ...formData, impactoFinanceiro: formatted });
  };

  const displayCurrency = (value: string) => {
    if (!value) return '';
    const num = parseFloat(value);
    if (isNaN(num)) return value;
    
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(num);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Nova Análise Quantitativa</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="causaRaiz">Qual a causa raiz do risco? *</Label>
            <Textarea
              id="causaRaiz"
              value={formData.causaRaiz}
              onChange={(e) => setFormData({ ...formData, causaRaiz: e.target.value })}
              placeholder="Descreva a causa raiz do risco..."
              rows={3}
              className="resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="impactoFinanceiro">Impacto Financeiro *</Label>
            <div className="space-y-1">
              <Input
                id="impactoFinanceiro"
                type="text"
                value={formData.impactoFinanceiro}
                onChange={(e) => handleImpactoChange(e.target.value)}
                placeholder="Ex: 20000 ou -15000"
                className="font-mono"
              />
              <p className="text-xs text-gray-500">
                {formData.impactoFinanceiro && !isNaN(parseFloat(formData.impactoFinanceiro)) 
                  ? `Valor: ${displayCurrency(formData.impactoFinanceiro)}`
                  : 'Digite um valor numérico (positivo para oportunidades, negativo para ameaças)'}
              </p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              💡 <strong>Dica:</strong> Os campos "Impacto Financeiro Ajustado", "Valor Esperado" e "Prioridade" 
              serão calculados automaticamente com base na sensibilidade, probabilidade e natureza do risco.
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              className="flex-1"
            >
              Salvar Análise
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
