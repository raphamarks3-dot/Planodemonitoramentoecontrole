import { useState, useRef, useEffect } from 'react';
import { Trash2 } from 'lucide-react';

export interface Risk {
  id: string;
  // Campos originais (já preenchidos de outras telas)
  data: string;
  risco: string;
  motivo: string;
  natureza: 'Oportunidade' | 'Ameaça' | '';
  categoria: string;
  area: string;
  responsavel: string;
  probabilidade: string;
  exposicao: string;
  estrategia: string;
  respostas: string;
  dataPrevista: string;
  observacao: string;
  // Novos campos da análise quantitativa (aparecem por último)
  causaRaiz: string;
  impactoFinanceiro: number;
  impactoFinanceiroAjustado: number;
  valorEsperado: number;
  prioridade: string;
  // Campos de Prevenção/Facilitação
  acaoPreventiva: string;
  custoResposta: number;
  novaProbabilidade: string;
  novoImpacto: number;
  novoValorEsperado: number;
  novaPrioridade: string;
  // Campos de Plano de Mitigação/Aproveitamento
  acaoMitigacao: string;
  custoRespostaMitigacao: number;
  valorEsperadoCustoResposta: number;
  momentoAcompanhamento: string;
  responsavelAcompanhamento: string;
  responsavelAcao: string;
  gatilho: string;
  // Novos campos de Monitoramento e Controle
  custoRealRespostasPrevencao: number;
  impactoReal: number;
  valorEsperadoRiscosNaoRealizados: number;
  custoRealRespostaMitigacao: number;
  valorEsperadoAcoesMitigacaoNaoRealizadas: number;
  gatilhoAtivado: 'Sim' | 'Não' | '';
  statusMitigacao: string;
  eficienciaSolucao: string;
  prioridadeFinal: string;
}

interface RiskTableProps {
  risks: Risk[];
  onUpdateRisk: (id: string, field: keyof Risk, value: string) => void;
  onDeleteRisk: (id: string) => void;
  categories: string[];
  exposures: string[];
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

const ESTRATEGIAS = ['Evitar', 'Reduzir', 'Compartilhar', 'Transferir', 'Aceitar', 'Melhorar', 'Provocar'];

const STATUS_MITIGACAO = ['Não necessária', 'Não iniciada', 'Em andamento', 'Concluída'];

const EFICIENCIA_SOLUCAO = [
  'Não foi utilizada',
  'Foi utilizada e não foi eficaz',
  'Foi utilizada e atendeu parcialmente',
  'Foi utilizada e foi eficaz'
];

export function RiskTable({ risks, onUpdateRisk, onDeleteRisk, categories, exposures }: RiskTableProps) {
  const [activeCell, setActiveCell] = useState<{ row: number; col: number } | null>(null);
  const [editingCell, setEditingCell] = useState<{ row: number; col: number } | null>(null);
  const inputRefs = useRef<{ [key: string]: HTMLInputElement | HTMLSelectElement | null }>({});
  const tableContainerRef = useRef<HTMLDivElement>(null);

  const columns = [
    { key: 'data', label: 'Data Identificação', type: 'date', section: 'basic' },
    { key: 'risco', label: 'Qual o Risco', type: 'text', section: 'basic' },
    { key: 'motivo', label: 'Motivo', type: 'text', section: 'basic' },
    { key: 'natureza', label: 'Natureza do Risco', type: 'select', options: NATUREZAS, section: 'basic' },
    { key: 'categoria', label: 'Categoria do Risco', type: 'select', options: categories, section: 'basic' },
    { key: 'area', label: 'Área Responsável', type: 'select', options: AREAS, section: 'basic' },
    { key: 'responsavel', label: 'Responsável', type: 'text', section: 'basic' },
    { key: 'probabilidade', label: 'Probabilidade', type: 'text', section: 'basic' },
    { key: 'exposicao', label: 'Exposição', type: 'select', options: exposures, section: 'basic' },
    { key: 'estrategia', label: 'Estratégia', type: 'select', options: ESTRATEGIAS, section: 'basic' },
    { key: 'respostas', label: 'Respostas', type: 'text', section: 'basic' },
    { key: 'dataPrevista', label: 'Data Prevista', type: 'date', section: 'basic' },
    { key: 'observacao', label: 'Observação', type: 'text', section: 'basic' },
    { key: 'causaRaiz', label: 'Causa Raiz', type: 'text', section: 'basic' },
    { key: 'impactoFinanceiro', label: 'Impacto Financeiro', type: 'number', section: 'basic' },
    { key: 'impactoFinanceiroAjustado', label: 'Impacto Financeiro Ajustado', type: 'number', section: 'basic' },
    { key: 'valorEsperado', label: 'Valor Esperado', type: 'number', section: 'basic' },
    { key: 'prioridade', label: 'Prioridade', type: 'text', section: 'basic' },
    { key: 'acaoPreventiva', label: 'Ação Preventiva', type: 'text', section: 'prevention' },
    { key: 'custoResposta', label: 'Custo Resposta', type: 'number', section: 'prevention' },
    { key: 'novaProbabilidade', label: 'Nova Probabilidade', type: 'text', section: 'prevention' },
    { key: 'novoImpacto', label: 'Novo Impacto', type: 'number', section: 'prevention' },
    { key: 'novoValorEsperado', label: 'Novo Valor Esperado', type: 'number', section: 'prevention' },
    { key: 'novaPrioridade', label: 'Nova Prioridade', type: 'text', section: 'prevention' },
    { key: 'acaoMitigacao', label: 'Ação Mitigação', type: 'text', section: 'mitigation' },
    { key: 'custoRespostaMitigacao', label: 'Custo Resposta', type: 'number', section: 'mitigation' },
    { key: 'valorEsperadoCustoResposta', label: 'Valor Esperado Custo', type: 'number', section: 'mitigation' },
    { key: 'momentoAcompanhamento', label: 'Momento Acompanhamento', type: 'text', section: 'mitigation' },
    { key: 'responsavelAcompanhamento', label: 'Responsável Acompanhamento', type: 'text', section: 'mitigation' },
    { key: 'responsavelAcao', label: 'Responsável Ação', type: 'text', section: 'mitigation' },
    { key: 'gatilho', label: 'Gatilho', type: 'text', section: 'mitigation' },
    { key: 'custoRealRespostasPrevencao', label: 'Custo Real Respostas Prevenção', type: 'number', section: 'monitoring' },
    { key: 'impactoReal', label: 'Impacto Real', type: 'number', section: 'monitoring' },
    { key: 'valorEsperadoRiscosNaoRealizados', label: 'Valor Esperado Riscos Não Realizados', type: 'number', section: 'monitoring' },
    { key: 'custoRealRespostaMitigacao', label: 'Custo Real Resposta Mitigação', type: 'number', section: 'monitoring' },
    { key: 'valorEsperadoAcoesMitigacaoNaoRealizadas', label: 'Valor Esperado Ações Mitigação Não Realizadas', type: 'number', section: 'monitoring' },
    { key: 'gatilhoAtivado', label: 'Gatilho foi ativado?', type: 'select', options: ['Sim', 'Não'], section: 'monitoring' },
    { key: 'statusMitigacao', label: 'Status da Mitigação', type: 'select', options: STATUS_MITIGACAO, section: 'monitoring' },
    { key: 'eficienciaSolucao', label: 'Eficiência da Solução', type: 'select', options: EFICIENCIA_SOLUCAO, section: 'monitoring' },
    { key: 'prioridadeFinal', label: 'Prioridade Final', type: 'text', section: 'monitoring' },
  ] as const;

  // Efeito para fazer scroll automático para as últimas colunas ao montar
  useEffect(() => {
    if (tableContainerRef.current) {
      // Scroll para a direita (final da tabela)
      tableContainerRef.current.scrollLeft = tableContainerRef.current.scrollWidth;
    }
  }, []);

  // Efeito para focar e selecionar quando entrar em modo de edição
  useEffect(() => {
    if (editingCell) {
      const key = `${editingCell.row}-${editingCell.col}`;
      const input = inputRefs.current[key];
      if (input) {
        input.focus();
        if (input instanceof HTMLInputElement && input.type !== 'date') {
          input.select();
        }
      }
    }
  }, [editingCell]);

  // Efeito para entrar automaticamente em modo de edição quando activeCell mudar
  useEffect(() => {
    if (activeCell) {
      setEditingCell(activeCell);
    }
  }, [activeCell]);

  const handleKeyDown = (e: React.KeyboardEvent, row: number, col: number) => {
    const isEditing = editingCell?.row === row && editingCell?.col === col;

    // Se estiver editando e não for Tab, permite edição normal
    if (isEditing && !['Tab', 'Enter', 'Escape', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
      return;
    }

    switch (e.key) {
      case 'Enter':
        if (!isEditing) {
          e.preventDefault();
          setEditingCell({ row, col });
        } else {
          e.preventDefault();
          setEditingCell(null);
          // Move para linha abaixo
          if (row < risks.length - 1) {
            setActiveCell({ row: row + 1, col });
          }
        }
        break;

      case 'Escape':
        e.preventDefault();
        setEditingCell(null);
        break;

      case 'Tab':
        e.preventDefault();
        setEditingCell(null);
        if (e.shiftKey) {
          // Shift + Tab - move para esquerda
          if (col > 0) {
            setActiveCell({ row, col: col - 1 });
          } else if (row > 0) {
            setActiveCell({ row: row - 1, col: columns.length - 1 });
          }
        } else {
          // Tab - move para direita
          if (col < columns.length - 1) {
            setActiveCell({ row, col: col + 1 });
          } else if (row < risks.length - 1) {
            setActiveCell({ row: row + 1, col: 0 });
          }
        }
        break;

      case 'ArrowUp':
        e.preventDefault();
        setEditingCell(null);
        if (row > 0) {
          setActiveCell({ row: row - 1, col });
        }
        break;

      case 'ArrowDown':
        e.preventDefault();
        setEditingCell(null);
        if (row < risks.length - 1) {
          setActiveCell({ row: row + 1, col });
        }
        break;
    }
  };

  const handleCellClick = (row: number, col: number) => {
    setActiveCell({ row, col });
  };

  const handleCellDoubleClick = (row: number, col: number) => {
    setEditingCell({ row, col });
  };

  const handleChange = (riskId: string, field: keyof Risk, value: string) => {
    onUpdateRisk(riskId, field, value);
  };

  const renderCell = (risk: Risk, column: typeof columns[number], row: number, col: number) => {
    const isActive = activeCell?.row === row && activeCell?.col === col;
    const isEditing = editingCell?.row === row && editingCell?.col === col;
    const key = `${row}-${col}`;
    const value = risk[column.key];

    // Definir cor de fundo baseado na seção
    let sectionBgClass = 'bg-gray-50 hover:bg-gray-100';
    if (column.section === 'prevention') {
      sectionBgClass = 'bg-blue-50 hover:bg-blue-100';
    } else if (column.section === 'mitigation') {
      sectionBgClass = 'bg-purple-50 hover:bg-purple-100';
    } else if (column.section === 'analysis') {
      sectionBgClass = 'bg-amber-50 hover:bg-amber-100';
    } else if (column.section === 'monitoring') {
      sectionBgClass = 'bg-green-50 hover:bg-green-100';
    }

    const cellClasses = `
      px-3 py-2 border-r border-gray-200 min-w-[150px] max-w-[300px]
      ${isActive ? 'ring-2 ring-blue-500 ring-inset' : ''}
      ${isEditing ? 'bg-white' : sectionBgClass}
      cursor-pointer transition-colors
    `;

    // Função para formatar o valor de exibição
    const getDisplayValue = () => {
      if (value === null || value === undefined || value === '') {
        return '-';
      }
      
      // Para campos numéricos (number type)
      if (column.type === 'number') {
        const numValue = typeof value === 'number' ? value : parseFloat(value as string);
        if (isNaN(numValue)) return '-';
        return new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }).format(numValue);
      }
      
      return value;
    };

    // Renderização especial para "Gatilho Ativado" com cores
    if (column.key === 'gatilhoAtivado') {
      const bgColorClass = value === 'Sim' ? 'bg-red-100 text-red-700' : value === 'Não' ? 'bg-green-100 text-green-700' : '';
      
      return (
        <td
          key={col}
          className={cellClasses}
          onClick={() => handleCellClick(row, col)}
          onDoubleClick={() => handleCellDoubleClick(row, col)}
          onKeyDown={(e) => handleKeyDown(e, row, col)}
          tabIndex={0}
        >
          {isEditing ? (
            <select
              ref={(el) => (inputRefs.current[key] = el)}
              value={value || ''}
              onChange={(e) => handleChange(risk.id, column.key, e.target.value)}
              onBlur={() => setEditingCell(null)}
              onKeyDown={(e) => handleKeyDown(e, row, col)}
              className="w-full bg-white border border-blue-500 rounded px-2 py-1 text-sm focus:outline-none"
            >
              <option value="">Selecione...</option>
              <option value="Sim">Sim</option>
              <option value="Não">Não</option>
            </select>
          ) : (
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${bgColorClass}`}>
              {value || '-'}
            </span>
          )}
        </td>
      );
    }

    if (column.type === 'select' && column.options) {
      return (
        <td
          key={col}
          className={cellClasses}
          onClick={() => handleCellClick(row, col)}
          onDoubleClick={() => handleCellDoubleClick(row, col)}
          onKeyDown={(e) => handleKeyDown(e, row, col)}
          tabIndex={0}
        >
          {isEditing ? (
            <select
              ref={(el) => (inputRefs.current[key] = el)}
              value={value || ''}
              onChange={(e) => handleChange(risk.id, column.key, e.target.value)}
              onBlur={() => setEditingCell(null)}
              onKeyDown={(e) => handleKeyDown(e, row, col)}
              className="w-full bg-white border border-blue-500 rounded px-2 py-1 text-sm focus:outline-none"
            >
              <option value="">Selecione...</option>
              {column.options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          ) : (
            <span className="text-sm text-gray-900">{getDisplayValue()}</span>
          )}
        </td>
      );
    }

    return (
      <td
        key={col}
        className={cellClasses}
        onClick={() => handleCellClick(row, col)}
        onDoubleClick={() => handleCellDoubleClick(row, col)}
        onKeyDown={(e) => handleKeyDown(e, row, col)}
        tabIndex={0}
      >
        {isEditing ? (
          <input
            ref={(el) => (inputRefs.current[key] = el)}
            type={column.type === 'date' ? 'date' : column.type === 'number' ? 'number' : 'text'}
            step={column.type === 'number' ? '0.01' : undefined}
            value={value || ''}
            onChange={(e) => handleChange(risk.id, column.key, e.target.value)}
            onBlur={() => setEditingCell(null)}
            onKeyDown={(e) => handleKeyDown(e, row, col)}
            className="w-full bg-white border border-blue-500 rounded px-2 py-1 text-sm focus:outline-none"
          />
        ) : (
          <span className="text-sm text-gray-900">{getDisplayValue()}</span>
        )}
      </td>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto" ref={tableContainerRef}>
        <table className="w-full border-collapse">
          <thead className="bg-gray-800 text-white">
            <tr>
              {columns.map((column) => {
                let headerBgClass = 'bg-gray-800';
                if (column.section === 'prevention') {
                  headerBgClass = 'bg-blue-700';
                } else if (column.section === 'mitigation') {
                  headerBgClass = 'bg-purple-700';
                } else if (column.section === 'analysis') {
                  headerBgClass = 'bg-amber-700';
                } else if (column.section === 'monitoring') {
                  headerBgClass = 'bg-green-700';
                }
                
                return (
                  <th
                    key={column.key}
                    className={`px-3 py-3 text-left text-sm font-semibold border-r border-gray-700 last:border-r-0 ${headerBgClass}`}
                  >
                    {column.label}
                  </th>
                );
              })}
              <th className="px-3 py-3 text-center text-sm font-semibold w-16 bg-gray-800">Ações</th>
            </tr>
          </thead>
          <tbody>
            {risks.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="text-center py-8 text-gray-500">
                  Nenhum risco cadastrado. Adicione um novo risco para começar.
                </td>
              </tr>
            ) : (
              risks.map((risk, rowIndex) => (
                <tr key={risk.id} className="border-b border-gray-200 hover:bg-gray-50">
                  {columns.map((column, colIndex) => renderCell(risk, column, rowIndex, colIndex))}
                  <td className="px-3 py-2 text-center">
                    <button
                      onClick={() => onDeleteRisk(risk.id)}
                      className="text-red-500 hover:text-red-700 transition-colors p-1 hover:bg-red-50 rounded"
                      title="Excluir risco"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      <div className="p-4 bg-gray-50 border-t border-gray-200">
        <p className="text-xs text-gray-600">
          💡 Dica: Use <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs">Tab</kbd>,{' '}
          <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs">Shift+Tab</kbd>,{' '}
          <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs">↑</kbd> e{' '}
          <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs">↓</kbd> para navegar e editar automaticamente.
          Pressione <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs">Esc</kbd> para cancelar a edição.
        </p>
      </div>
    </div>
  );
}