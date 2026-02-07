import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/app/components/ui/dialog';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Risk } from '@/app/components/RiskTable';

interface RiskFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (risk: Omit<Risk, 'id'>) => void;
  categories: string[];
}

const AREAS = [
  'Obra',
  'Planejamento',
  'Logística',
  'Orçamentos',
  'Incorporação',
  'Produtos',
  'Suprimentos',
  'Qualidade',
  'Comercial'
];

const NATUREZAS = ['Oportunidade', 'Ameaça'];

export function RiskFormDialog({ isOpen, onClose, onSave, categories }: RiskFormDialogProps) {
  const [formData, setFormData] = useState<Omit<Risk, 'id'>>({
    data: new Date().toISOString().split('T')[0],
    risco: '',
    motivo: '',
    natureza: '',
    categoria: '',
    area: '',
    responsavel: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    // Reset form
    setFormData({
      data: new Date().toISOString().split('T')[0],
      risco: '',
      motivo: '',
      natureza: '',
      categoria: '',
      area: '',
      responsavel: ''
    });
    onClose();
  };

  const handleChange = (field: keyof Omit<Risk, 'id'>, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Risco</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Data de Identificação */}
          <div className="space-y-2">
            <Label htmlFor="data">Data de Identificação</Label>
            <Input
              id="data"
              type="date"
              value={formData.data}
              onChange={(e) => handleChange('data', e.target.value)}
              required
            />
          </div>

          {/* Qual o Risco */}
          <div className="space-y-2">
            <Label htmlFor="risco">Qual o Risco</Label>
            <Input
              id="risco"
              type="text"
              placeholder="Descreva o risco identificado..."
              value={formData.risco}
              onChange={(e) => handleChange('risco', e.target.value)}
              required
            />
          </div>

          {/* Motivo */}
          <div className="space-y-2">
            <Label htmlFor="motivo">Motivo</Label>
            <Input
              id="motivo"
              type="text"
              placeholder="Qual o motivo deste risco..."
              value={formData.motivo}
              onChange={(e) => handleChange('motivo', e.target.value)}
              required
            />
          </div>

          {/* Natureza do Risco */}
          <div className="space-y-2">
            <Label htmlFor="natureza">Natureza do Risco</Label>
            <Select
              value={formData.natureza}
              onValueChange={(value) => handleChange('natureza', value)}
              required
            >
              <SelectTrigger id="natureza">
                <SelectValue placeholder="Selecione a natureza..." />
              </SelectTrigger>
              <SelectContent>
                {NATUREZAS.map((natureza) => (
                  <SelectItem key={natureza} value={natureza}>
                    {natureza}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Categoria do Risco */}
          <div className="space-y-2">
            <Label htmlFor="categoria">Categoria do Risco</Label>
            <Select
              value={formData.categoria}
              onValueChange={(value) => handleChange('categoria', value)}
              required
            >
              <SelectTrigger id="categoria">
                <SelectValue placeholder="Selecione a categoria..." />
              </SelectTrigger>
              <SelectContent>
                {categories.map((categoria) => (
                  <SelectItem key={categoria} value={categoria}>
                    {categoria}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Área Responsável */}
          <div className="space-y-2">
            <Label htmlFor="area">Área Responsável</Label>
            <Select
              value={formData.area}
              onValueChange={(value) => handleChange('area', value)}
              required
            >
              <SelectTrigger id="area">
                <SelectValue placeholder="Selecione a área..." />
              </SelectTrigger>
              <SelectContent>
                {AREAS.map((area) => (
                  <SelectItem key={area} value={area}>
                    {area}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Responsável */}
          <div className="space-y-2">
            <Label htmlFor="responsavel">Responsável</Label>
            <Input
              id="responsavel"
              type="text"
              placeholder="Nome do responsável..."
              value={formData.responsavel}
              onChange={(e) => handleChange('responsavel', e.target.value)}
              required
            />
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              Salvar Risco
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
