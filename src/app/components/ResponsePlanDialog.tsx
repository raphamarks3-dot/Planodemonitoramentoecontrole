import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';

interface ResponsePlanDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (riskId: string, type: 'preventiva' | 'mitigacao', data: any) => void;
  riskId: string;
  riskName: string;
}

export function ResponsePlanDialog({
  isOpen,
  onClose,
  onSave,
  riskId,
  riskName
}: ResponsePlanDialogProps) {
  const [activeTab, setActiveTab] = useState<'preventiva' | 'mitigacao'>('preventiva');
  
  // Campos de Prevenção
  const [acaoPreventiva, setAcaoPreventiva] = useState('');
  const [custoResposta, setCustoResposta] = useState('');
  const [novaProbabilidade, setNovaProbabilidade] = useState('');
  const [novoImpacto, setNovoImpacto] = useState('');

  // Campos de Mitigação
  const [acaoMitigacao, setAcaoMitigacao] = useState('');
  const [custoRespostaMitigacao, setCustoRespostaMitigacao] = useState('');
  const [momentoAcompanhamento, setMomentoAcompanhamento] = useState('');
  const [responsavelAcompanhamento, setResponsavelAcompanhamento] = useState('');
  const [responsavelAcao, setResponsavelAcao] = useState('');
  const [gatilho, setGatilho] = useState('');

  if (!isOpen) return null;

  const handleSavePreventiva = () => {
    onSave(riskId, 'preventiva', {
      acaoPreventiva,
      custoResposta: parseFloat(custoResposta) || 0,
      novaProbabilidade,
      novoImpacto: parseFloat(novoImpacto) || 0
    });
    resetForm();
    onClose();
  };

  const handleSaveMitigacao = () => {
    onSave(riskId, 'mitigacao', {
      acaoMitigacao,
      custoRespostaMitigacao: parseFloat(custoRespostaMitigacao) || 0,
      momentoAcompanhamento,
      responsavelAcompanhamento,
      responsavelAcao,
      gatilho
    });
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setAcaoPreventiva('');
    setCustoResposta('');
    setNovaProbabilidade('');
    setNovoImpacto('');
    setAcaoMitigacao('');
    setCustoRespostaMitigacao('');
    setMomentoAcompanhamento('');
    setResponsavelAcompanhamento('');
    setResponsavelAcao('');
    setGatilho('');
    setActiveTab('preventiva');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Novo Plano de Resposta</h2>
            <p className="text-sm text-gray-600 mt-1">{riskName}</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              onClose();
            }}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('preventiva')}
            className={`flex-1 px-6 py-3 font-medium transition-colors ${
              activeTab === 'preventiva'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            Prevenção/Facilitação
          </button>
          <button
            onClick={() => setActiveTab('mitigacao')}
            className={`flex-1 px-6 py-3 font-medium transition-colors ${
              activeTab === 'mitigacao'
                ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            Mitigação/Aproveitamento
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'preventiva' ? (
            <div className="space-y-4">
              <div>
                <Label htmlFor="acaoPreventiva">Ação de Prevenção/Facilitação *</Label>
                <Textarea
                  id="acaoPreventiva"
                  value={acaoPreventiva}
                  onChange={(e) => setAcaoPreventiva(e.target.value)}
                  placeholder="Descreva a ação preventiva ou de facilitação..."
                  className="mt-1"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="custoResposta">Custo de Resposta (R$) *</Label>
                <Input
                  id="custoResposta"
                  type="number"
                  step="0.01"
                  min="0"
                  value={custoResposta}
                  onChange={(e) => setCustoResposta(e.target.value)}
                  placeholder="0.00"
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="novaProbabilidade">Nova Probabilidade *</Label>
                  <Input
                    id="novaProbabilidade"
                    type="text"
                    value={novaProbabilidade}
                    onChange={(e) => {
                      let val = e.target.value.replace(/[^\d]/g, '');
                      if (val) {
                        const num = parseInt(val);
                        if (num > 100) val = '100';
                        setNovaProbabilidade(val + '%');
                      } else {
                        setNovaProbabilidade('');
                      }
                    }}
                    placeholder="0%"
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">Formato: 0% a 100%</p>
                </div>

                <div>
                  <Label htmlFor="novoImpacto">Novo Impacto (R$) *</Label>
                  <Input
                    id="novoImpacto"
                    type="number"
                    step="0.01"
                    min="0"
                    value={novoImpacto}
                    onChange={(e) => setNovoImpacto(e.target.value)}
                    placeholder="0.00"
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                <p className="text-sm text-blue-900 font-medium">Cálculos Automáticos:</p>
                <p className="text-xs text-blue-700 mt-2">
                  • Novo Valor Esperado = Nova Probabilidade × Novo Impacto
                </p>
                <p className="text-xs text-blue-700">
                  • Nova Prioridade será calculada automaticamente
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <Label htmlFor="acaoMitigacao">Ação de Mitigação/Aproveitamento *</Label>
                <Textarea
                  id="acaoMitigacao"
                  value={acaoMitigacao}
                  onChange={(e) => setAcaoMitigacao(e.target.value)}
                  placeholder="Descreva a ação de mitigação ou aproveitamento..."
                  className="mt-1"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="custoRespostaMitigacao">Custo de Resposta (R$) *</Label>
                <Input
                  id="custoRespostaMitigacao"
                  type="number"
                  step="0.01"
                  min="0"
                  value={custoRespostaMitigacao}
                  onChange={(e) => setCustoRespostaMitigacao(e.target.value)}
                  placeholder="0.00"
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="momentoAcompanhamento">Momento de Acompanhamento</Label>
                  <Input
                    id="momentoAcompanhamento"
                    type="text"
                    value={momentoAcompanhamento}
                    onChange={(e) => setMomentoAcompanhamento(e.target.value)}
                    placeholder="Ex: Semanal, Mensal..."
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="responsavelAcompanhamento">Responsável por Acompanhamento</Label>
                  <Input
                    id="responsavelAcompanhamento"
                    type="text"
                    value={responsavelAcompanhamento}
                    onChange={(e) => setResponsavelAcompanhamento(e.target.value)}
                    placeholder="Nome do responsável"
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="responsavelAcao">Responsável pela Ação</Label>
                  <Input
                    id="responsavelAcao"
                    type="text"
                    value={responsavelAcao}
                    onChange={(e) => setResponsavelAcao(e.target.value)}
                    placeholder="Nome do responsável"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="gatilho">Gatilho</Label>
                  <Input
                    id="gatilho"
                    type="text"
                    value={gatilho}
                    onChange={(e) => setGatilho(e.target.value)}
                    placeholder="Condição de ativação"
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mt-4">
                <p className="text-sm text-purple-900 font-medium">Cálculo Automático:</p>
                <p className="text-xs text-purple-700 mt-2">
                  • Valor Esperado do Custo = Custo de Resposta × Nova Probabilidade
                </p>
                <p className="text-xs text-purple-600 mt-1 italic">
                  (Nova Probabilidade vem da aba Prevenção/Facilitação)
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
          <Button
            variant="outline"
            onClick={() => {
              resetForm();
              onClose();
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={activeTab === 'preventiva' ? handleSavePreventiva : handleSaveMitigacao}
            disabled={
              activeTab === 'preventiva'
                ? !acaoPreventiva || !custoResposta || !novaProbabilidade || !novoImpacto
                : !acaoMitigacao || !custoRespostaMitigacao
            }
            className={activeTab === 'preventiva' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-purple-600 hover:bg-purple-700'}
          >
            Salvar {activeTab === 'preventiva' ? 'Prevenção' : 'Mitigação'}
          </Button>
        </div>
      </div>
    </div>
  );
}
