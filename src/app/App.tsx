import { useState } from 'react';
import { ClipboardList } from 'lucide-react';
import { RiskIndicators } from '@/app/components/RiskIndicators';
import { RiskTable, Risk } from '@/app/components/RiskTable';
import { ResponsePlanDialog } from '@/app/components/ResponsePlanDialog';
import { RiskFilter } from '@/app/components/RiskFilter';
import { ExcelActions } from '@/app/components/ExcelActions';
import { Button } from '@/app/components/ui/button';
import { Toaster } from '@/app/components/ui/sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { toast } from 'sonner';

const INITIAL_CATEGORIES = [
  'Disponibilidade de terras, acesso a local',
  'Ambiental',
  'Social',
  'Design (projeto)',
  'Risco de Construção',
  'Variações de escopo',
  'Demanda operacional',
  'Mercado',
  'Estratégico/parceria',
  'Força Maior',
  'MAGA (Meio Ambiente Governamental Material Adversa)',
  'Mudanças de Legislação',
  'Financeiro',
  'Sistemas e Tecnologias'
];

const INITIAL_EXPOSURES = [
  'Impacta um serviço',
  'Impacta um vagão',
  'Impacta diversos vagões',
  'Impacta a obra',
  'Impacta a entrega final ao cliente',
  'Impacta diversas obras',
  'Impacta toda empresa',
  'Impacta a imagem da empresa'
];

// Dados iniciais de 15 riscos totalmente preenchidos (exceto novos campos)
const INITIAL_RISKS: Risk[] = [
  {
    id: 'risk-1',
    causaRaiz: 'Dependência de fornecedor único',
    impactoFinanceiro: 50000,
    impactoFinanceiroAjustado: 42500,
    valorEsperado: 14875,
    prioridade: '6',
    data: '2026-01-15',
    risco: 'Atraso na entrega de materiais',
    motivo: 'Problemas logísticos com fornecedor',
    natureza: 'Ameaça',
    categoria: 'Risco de Construção',
    area: 'Logística',
    responsavel: 'João Silva',
    probabilidade: '35%',
    exposicao: 'Impacta a obra',
    estrategia: 'Reduzir',
    respostas: 'Buscar fornecedores alternativos',
    dataPrevista: '2026-03-15',
    observacao: 'Monitorar prazo de entrega',
    acaoPreventiva: 'Cadastrar fornecedores alternativos e fazer pedidos antecipados',
    custoResposta: 5000,
    novaProbabilidade: '15%',
    novoImpacto: 40000,
    novoValorEsperado: 6000,
    novaPrioridade: '8',
    acaoMitigacao: 'Contratar transporte expresso em caso de atraso',
    custoRespostaMitigacao: 3000,
    valorEsperadoCustoResposta: 1050,
    momentoAcompanhamento: '2 semanas antes da entrega prevista',
    responsavelAcompanhamento: 'João Silva',
    responsavelAcao: 'Equipe de Suprimentos',
    gatilho: 'Atraso superior a 5 dias na previsão de entrega',
    custoRealRespostasPrevencao: 0,
    impactoReal: 0,
    valorEsperadoRiscosNaoRealizados: 0,
    custoRealRespostaMitigacao: 0,
    valorEsperadoAcoesMitigacaoNaoRealizadas: 0,
    gatilhoAtivado: '',
    statusMitigacao: '',
    eficienciaSolucao: '',
    prioridadeFinal: ''
  },
  {
    id: 'risk-2',
    causaRaiz: 'Oportunidade de negociação comercial',
    impactoFinanceiro: 120000,
    impactoFinanceiroAjustado: 102000,
    valorEsperado: 71400,
    prioridade: '2',
    data: '2026-01-18',
    risco: 'Redução de custos com novo fornecedor',
    motivo: 'Negociação bem-sucedida',
    natureza: 'Oportunidade',
    categoria: 'Financeiro',
    area: 'Orçamentos',
    responsavel: 'Maria Santos',
    probabilidade: '70%',
    exposicao: 'Impacta diversas obras',
    estrategia: 'Melhorar',
    respostas: 'Implementar contrato de longo prazo',
    dataPrevista: '2026-02-28',
    observacao: 'Avaliar qualidade dos produtos',
    acaoPreventiva: 'Negociar condições favoráveis e estabelecer parcerias',
    custoResposta: 8000,
    novaProbabilidade: '85%',
    novoImpacto: 130000,
    novoValorEsperado: 110500,
    novaPrioridade: '1',
    acaoMitigacao: 'Estabelecer programa de qualidade e auditorias regulares',
    custoRespostaMitigacao: 5000,
    valorEsperadoCustoResposta: 4250,
    momentoAcompanhamento: 'Revisão trimestral',
    responsavelAcompanhamento: 'Maria Santos',
    responsavelAcao: 'Equipe de Qualidade',
    gatilho: 'Redução de qualidade detectada em auditorias',
    custoRealRespostasPrevencao: 0,
    impactoReal: 0,
    valorEsperadoRiscosNaoRealizados: 0,
    custoRealRespostaMitigacao: 0,
    valorEsperadoAcoesMitigacaoNaoRealizadas: 0,
    gatilhoAtivado: '',
    statusMitigacao: '',
    eficienciaSolucao: '',
    prioridadeFinal: ''
  },
  {
    id: 'risk-3',
    causaRaiz: 'Mudanças regulatórias externas',
    impactoFinanceiro: 200000,
    impactoFinanceiroAjustado: 170000,
    valorEsperado: 42500,
    prioridade: '1',
    data: '2026-01-20',
    risco: 'Mudança na legislação ambiental',
    motivo: 'Nova regulamentação municipal',
    natureza: 'Ameaça',
    categoria: 'Mudanças de Legislação',
    area: 'Planejamento',
    responsavel: 'Carlos Oliveira',
    probabilidade: '25%',
    exposicao: 'Impacta toda empresa',
    estrategia: 'Aceitar',
    respostas: 'Adequar processos conforme necessário',
    dataPrevista: '2026-06-30',
    observacao: 'Acompanhar tramitação da lei',
    acaoPreventiva: 'Monitorar tramitação legislativa e estabelecer comitê de conformidade',
    custoResposta: 12000,
    novaProbabilidade: '15%',
    novoImpacto: 180000,
    novoValorEsperado: 27000,
    novaPrioridade: '5',
    acaoMitigacao: 'Contratar consultoria jurídica especializada',
    custoRespostaMitigacao: 8000,
    valorEsperadoCustoResposta: 1200,
    momentoAcompanhamento: 'Acompanhamento mensal durante tramitação',
    responsavelAcompanhamento: 'Carlos Oliveira',
    responsavelAcao: 'Departamento Jurídico',
    gatilho: 'Aprovação em primeira votação na câmara municipal',
    custoRealRespostasPrevencao: 15000,
    impactoReal: 0,
    valorEsperadoRiscosNaoRealizados: 0,
    custoRealRespostaMitigacao: 0,
    valorEsperadoAcoesMitigacaoNaoRealizadas: 0,
    gatilhoAtivado: 'Não',
    statusMitigacao: '',
    eficienciaSolucao: '',
    prioridadeFinal: ''
  },
  {
    id: 'risk-4',
    causaRaiz: 'Infraestrutura urbana inadequada',
    impactoFinanceiro: 35000,
    impactoFinanceiroAjustado: 29750,
    valorEsperado: 17850,
    prioridade: '4',
    data: '2026-01-22',
    risco: 'Acesso restrito ao terreno',
    motivo: 'Obras na via principal',
    natureza: 'Ameaça',
    categoria: 'Disponibilidade de terras, acesso a local',
    area: 'Obra',
    responsavel: 'Pedro Costa',
    probabilidade: '60%',
    exposicao: 'Impacta a entrega final ao cliente',
    estrategia: 'Reduzir',
    respostas: 'Planejar rotas alternativas',
    dataPrevista: '2026-02-15',
    observacao: 'Verificar cronograma de obras públicas',
    acaoPreventiva: 'Mapear rotas alternativas e negociar com prefeitura',
    custoResposta: 4000,
    novaProbabilidade: '35%',
    novoImpacto: 28000,
    novoValorEsperado: 9800,
    novaPrioridade: '6',
    acaoMitigacao: 'Estabelecer acordos com fornecedores próximos ao canteiro',
    custoRespostaMitigacao: 2500,
    valorEsperadoCustoResposta: 875,
    momentoAcompanhamento: 'Acompanhamento semanal durante obras na via',
    responsavelAcompanhamento: 'Pedro Costa',
    responsavelAcao: 'Engenheiro de Obra',
    gatilho: 'Bloqueio parcial ou total da via de acesso principal',
    custoRealRespostasPrevencao: 0,
    impactoReal: 0,
    valorEsperadoRiscosNaoRealizados: 0,
    custoRealRespostaMitigacao: 0,
    valorEsperadoAcoesMitigacaoNaoRealizadas: 0,
    gatilhoAtivado: '',
    statusMitigacao: '',
    eficienciaSolucao: '',
    prioridadeFinal: ''
  },
  {
    id: 'risk-5',
    causaRaiz: 'Avanço tecnológico disponível',
    impactoFinanceiro: 250000,
    impactoFinanceiroAjustado: 212500,
    valorEsperado: 170000,
    prioridade: '1',
    data: '2026-01-23',
    risco: 'Implementação de nova tecnologia',
    motivo: 'Automação de processos',
    natureza: 'Oportunidade',
    categoria: 'Sistemas e Tecnologias',
    area: 'Produtos',
    responsavel: 'Ana Ferreira',
    probabilidade: '80%',
    exposicao: 'Impacta toda empresa',
    estrategia: 'Provocar',
    respostas: 'Investir em treinamento da equipe',
    dataPrevista: '2026-04-30',
    observacao: 'Piloto em andamento',
    acaoPreventiva: 'Desenvolver plano de implementação e capacitação intensiva',
    custoResposta: 25000,
    novaProbabilidade: '90%',
    novoImpacto: 280000,
    novoValorEsperado: 252000,
    novaPrioridade: '1',
    acaoMitigacao: 'Estabelecer suporte técnico 24/7 e backup de sistemas legados',
    custoRespostaMitigacao: 15000,
    valorEsperadoCustoResposta: 13500,
    momentoAcompanhamento: 'Avaliação quinzenal durante implementação',
    responsavelAcompanhamento: 'Ana Ferreira',
    responsavelAcao: 'Equipe de TI',
    gatilho: 'Taxa de adoção abaixo de 70% após 1 mês',
    custoRealRespostasPrevencao: 0,
    impactoReal: 0,
    valorEsperadoRiscosNaoRealizados: 0,
    custoRealRespostaMitigacao: 0,
    valorEsperadoAcoesMitigacaoNaoRealizadas: 0,
    gatilhoAtivado: '',
    statusMitigacao: '',
    eficienciaSolucao: '',
    prioridadeFinal: ''
  },
  {
    id: 'risk-6',
    causaRaiz: 'Escassez de profissionais no mercado',
    impactoFinanceiro: 80000,
    impactoFinanceiroAjustado: 68000,
    valorEsperado: 30600,
    prioridade: '2',
    data: '2026-01-25',
    risco: 'Falta de mão de obra qualificada',
    motivo: 'Mercado aquecido',
    natureza: 'Ameaça',
    categoria: 'Risco de Construção',
    area: 'Obra',
    responsavel: 'Roberto Lima',
    probabilidade: '45%',
    exposicao: 'Impacta diversos vagões',
    estrategia: 'Compartilhar',
    respostas: 'Parceria com empresas de recrutamento',
    dataPrevista: '2026-03-01',
    observacao: 'Criar programa de capacitação interna',
    acaoPreventiva: 'Estabelecer parcerias com escolas técnicas e desenvolver programa trainee',
    custoResposta: 18000,
    novaProbabilidade: '25%',
    novoImpacto: 60000,
    novoValorEsperado: 15000,
    novaPrioridade: '7',
    acaoMitigacao: 'Contratar empresa terceirizada em caso de deficit de pessoal',
    custoRespostaMitigacao: 12000,
    valorEsperadoCustoResposta: 3000,
    momentoAcompanhamento: 'Avaliação mensal do quadro de funcionários',
    responsavelAcompanhamento: 'Roberto Lima',
    responsavelAcao: 'RH',
    gatilho: 'Vacância de mais de 20% das vagas críticas',
    custoRealRespostasPrevencao: 0,
    impactoReal: 0,
    valorEsperadoRiscosNaoRealizados: 0,
    custoRealRespostaMitigacao: 0,
    valorEsperadoAcoesMitigacaoNaoRealizadas: 0,
    gatilhoAtivado: '',
    statusMitigacao: '',
    eficienciaSolucao: '',
    prioridadeFinal: ''
  },
  {
    id: 'risk-7',
    causaRaiz: 'Flutuação favorável do mercado cambial',
    impactoFinanceiro: 95000,
    impactoFinanceiroAjustado: 80750,
    valorEsperado: 44412.5,
    prioridade: '3',
    data: '2026-01-26',
    risco: 'Variação cambial favorável',
    motivo: 'Importação de equipamentos',
    natureza: 'Oportunidade',
    categoria: 'Mercado',
    area: 'Orçamentos',
    responsavel: 'Fernanda Alves',
    probabilidade: '55%',
    exposicao: 'Impacta a obra',
    estrategia: 'Melhorar',
    respostas: 'Antecipar compras de equipamentos',
    dataPrevista: '2026-02-20',
    observacao: 'Monitorar cotação do dólar',
    acaoPreventiva: 'Monitorar diariamente câmbio e realizar hedge cambial',
    custoResposta: 6000,
    novaProbabilidade: '75%',
    novoImpacto: 110000,
    novoValorEsperado: 82500,
    novaPrioridade: '2',
    acaoMitigacao: 'Contratar assessoria financeira para proteção cambial',
    custoRespostaMitigacao: 4000,
    valorEsperadoCustoResposta: 3000,
    momentoAcompanhamento: 'Acompanhamento diário do câmbio',
    responsavelAcompanhamento: 'Fernanda Alves',
    responsavelAcao: 'Equipe Financeira',
    gatilho: 'Câmbio voltar a subir acima de R$ 5,50',
    custoRealRespostasPrevencao: 0,
    impactoReal: 0,
    valorEsperadoRiscosNaoRealizados: 0,
    custoRealRespostaMitigacao: 0,
    valorEsperadoAcoesMitigacaoNaoRealizadas: 0,
    gatilhoAtivado: '',
    statusMitigacao: '',
    eficienciaSolucao: '',
    prioridadeFinal: ''
  },
  {
    id: 'risk-8',
    causaRaiz: 'Falha no processo de validação técnica',
    impactoFinanceiro: 150000,
    impactoFinanceiroAjustado: 127500,
    valorEsperado: 25500,
    prioridade: '3',
    data: '2026-01-27',
    risco: 'Erro no projeto estrutural',
    motivo: 'Revisão necessária',
    natureza: 'Ameaça',
    categoria: 'Design (projeto)',
    area: 'Planejamento',
    responsavel: 'Lucas Martins',
    probabilidade: '20%',
    exposicao: 'Impacta a imagem da empresa',
    estrategia: 'Evitar',
    respostas: 'Contratar consultoria especializada',
    dataPrevista: '2026-02-10',
    observacao: 'Realizar auditoria de projeto',
    acaoPreventiva: 'Implementar revisões por pares e validação por engenheiro sênior',
    custoResposta: 20000,
    novaProbabilidade: '5%',
    novoImpacto: 120000,
    novoValorEsperado: 6000,
    novaPrioridade: '9',
    acaoMitigacao: 'Estabelecer equipe emergencial para correções',
    custoRespostaMitigacao: 15000,
    valorEsperadoCustoResposta: 750,
    momentoAcompanhamento: 'Revisão após cada fase do projeto',
    responsavelAcompanhamento: 'Lucas Martins',
    responsavelAcao: 'Equipe de Engenharia',
    gatilho: 'Identificação de inconsistências na verificação',
    custoRealRespostasPrevencao: 0,
    impactoReal: 0,
    valorEsperadoRiscosNaoRealizados: 0,
    custoRealRespostaMitigacao: 0,
    valorEsperadoAcoesMitigacaoNaoRealizadas: 0,
    gatilhoAtivado: '',
    statusMitigacao: '',
    eficienciaSolucao: '',
    prioridadeFinal: ''
  },
  {
    id: 'risk-9',
    causaRaiz: 'Networking e relacionamento comercial',
    impactoFinanceiro: 180000,
    impactoFinanceiroAjustado: 153000,
    valorEsperado: 99450,
    prioridade: '2',
    data: '2026-01-28',
    risco: 'Parcerias estratégicas',
    motivo: 'Novos contatos comerciais',
    natureza: 'Oportunidade',
    categoria: 'Estratégico/parceria',
    area: 'Comercial',
    responsavel: 'Paula Rocha',
    probabilidade: '65%',
    exposicao: 'Impacta diversas obras',
    estrategia: 'Provocar',
    respostas: 'Agendar reuniões com potenciais parceiros',
    dataPrevista: '2026-03-30',
    observacao: 'Proposta em análise',
    acaoPreventiva: 'Elaborar proposta de valor e apresentação executiva',
    custoResposta: 10000,
    novaProbabilidade: '80%',
    novoImpacto: 200000,
    novoValorEsperado: 160000,
    novaPrioridade: '2',
    acaoMitigacao: 'Estabelecer plano B com parceiros alternativos',
    custoRespostaMitigacao: 6000,
    valorEsperadoCustoResposta: 4800,
    momentoAcompanhamento: 'Acompanhamento após cada reunião de negociação',
    responsavelAcompanhamento: 'Paula Rocha',
    responsavelAcao: 'Equipe Comercial',
    gatilho: 'Proposta rejeitada ou contra-proposta desfavorável',
    custoRealRespostasPrevencao: 0,
    impactoReal: 0,
    valorEsperadoRiscosNaoRealizados: 0,
    custoRealRespostaMitigacao: 0,
    valorEsperadoAcoesMitigacaoNaoRealizadas: 0,
    gatilhoAtivado: '',
    statusMitigacao: '',
    eficienciaSolucao: '',
    prioridadeFinal: ''
  },
  {
    id: 'risk-10',
    causaRaiz: 'Fatores climáticos imprevisíveis',
    impactoFinanceiro: 45000,
    impactoFinanceiroAjustado: 38250,
    valorEsperado: 15300,
    prioridade: '4',
    data: '2026-01-29',
    risco: 'Condições climáticas adversas',
    motivo: 'Previsão de chuvas intensas',
    natureza: 'Ameaça',
    categoria: 'Força Maior',
    area: 'Obra',
    responsavel: 'André Souza',
    probabilidade: '40%',
    exposicao: 'Impacta um vagão',
    estrategia: 'Aceitar',
    respostas: 'Ajustar cronograma conforme clima',
    dataPrevista: '2026-05-31',
    observacao: 'Consultar previsão meteorológica semanal',
    acaoPreventiva: 'Preparar estruturas de proteção e ajustar cronograma com folgas',
    custoResposta: 7000,
    novaProbabilidade: '30%',
    novoImpacto: 38000,
    novoValorEsperado: 11400,
    novaPrioridade: '8',
    acaoMitigacao: 'Contratar equipe adicional para recuperação de atrasos',
    custoRespostaMitigacao: 5000,
    valorEsperadoCustoResposta: 1500,
    momentoAcompanhamento: 'Acompanhamento diário da previsão do tempo',
    responsavelAcompanhamento: 'André Souza',
    responsavelAcao: 'Equipe de Obra',
    gatilho: 'Previsão de chuvas acima de 50mm em 24h',
    custoRealRespostasPrevencao: 0,
    impactoReal: 0,
    valorEsperadoRiscosNaoRealizados: 0,
    custoRealRespostaMitigacao: 0,
    valorEsperadoAcoesMitigacaoNaoRealizadas: 0,
    gatilhoAtivado: '',
    statusMitigacao: '',
    eficienciaSolucao: '',
    prioridadeFinal: ''
  },
  {
    id: 'risk-11',
    causaRaiz: 'Inflação setorial de insumos',
    impactoFinanceiro: 110000,
    impactoFinanceiroAjustado: 93500,
    valorEsperado: 46750,
    prioridade: '3',
    data: '2026-01-30',
    risco: 'Aumento no custo de insumos',
    motivo: 'Inflação do setor',
    natureza: 'Ameaça',
    categoria: 'Financeiro',
    area: 'Suprimentos',
    responsavel: 'Marcos Pereira',
    probabilidade: '50%',
    exposicao: 'Impacta a entrega final ao cliente',
    estrategia: 'Transferir',
    respostas: 'Negociar reajuste com cliente',
    dataPrevista: '2026-04-15',
    observacao: 'Incluir cláusula de reajuste',
    acaoPreventiva: 'Comprar insumos antecipadamente e incluir cláusula de reajuste',
    custoResposta: 9000,
    novaProbabilidade: '35%',
    novoImpacto: 95000,
    novoValorEsperado: 33250,
    novaPrioridade: '4',
    acaoMitigacao: 'Negociar reajuste contratual e buscar fornecedores alternativos',
    custoRespostaMitigacao: 7000,
    valorEsperadoCustoResposta: 2450,
    momentoAcompanhamento: 'Acompanhamento mensal do IPCA e INCC',
    responsavelAcompanhamento: 'Marcos Pereira',
    responsavelAcao: 'Equipe de Suprimentos',
    gatilho: 'Inflação acumulada acima de 5% no trimestre',
    custoRealRespostasPrevencao: 0,
    impactoReal: 0,
    valorEsperadoRiscosNaoRealizados: 0,
    custoRealRespostaMitigacao: 0,
    valorEsperadoAcoesMitigacaoNaoRealizadas: 0,
    gatilhoAtivado: '',
    statusMitigacao: '',
    eficienciaSolucao: '',
    prioridadeFinal: ''
  },
  {
    id: 'risk-12',
    causaRaiz: 'Programa de incentivo governamental',
    impactoFinanceiro: 85000,
    impactoFinanceiroAjustado: 72250,
    valorEsperado: 54187.5,
    prioridade: '2',
    data: '2026-02-01',
    risco: 'Incentivos fiscais disponíveis',
    motivo: 'Novo programa governamental',
    natureza: 'Oportunidade',
    categoria: 'Financeiro',
    area: 'Orçamentos',
    responsavel: 'Juliana Mendes',
    probabilidade: '75%',
    exposicao: 'Impacta a obra',
    estrategia: 'Provocar',
    respostas: 'Preparar documentação para adesão',
    dataPrevista: '2026-03-10',
    observacao: 'Prazo de inscrição até março',
    acaoPreventiva: 'Organizar documentação e contratar consultoria fiscal',
    custoResposta: 5000,
    novaProbabilidade: '85%',
    novoImpacto: 90000,
    novoValorEsperado: 76500,
    novaPrioridade: '3',
    acaoMitigacao: 'Garantir cumprimento de todos requisitos e prazos',
    custoRespostaMitigacao: 3500,
    valorEsperadoCustoResposta: 2975,
    momentoAcompanhamento: 'Revisão semanal até submissão',
    responsavelAcompanhamento: 'Juliana Mendes',
    responsavelAcao: 'Equipe Fiscal',
    gatilho: 'Documentação incompleta detectada na verificação',
    custoRealRespostasPrevencao: 0,
    impactoReal: 0,
    valorEsperadoRiscosNaoRealizados: 0,
    custoRealRespostaMitigacao: 0,
    valorEsperadoAcoesMitigacaoNaoRealizadas: 0,
    gatilhoAtivado: '',
    statusMitigacao: '',
    eficienciaSolucao: '',
    prioridadeFinal: ''
  },
  {
    id: 'risk-13',
    causaRaiz: 'Conflito trabalhista no setor de transportes',
    impactoFinanceiro: 65000,
    impactoFinanceiroAjustado: 55250,
    valorEsperado: 16575,
    prioridade: '3',
    data: '2026-02-03',
    risco: 'Greve de transportadores',
    motivo: 'Negociação salarial em curso',
    natureza: 'Ameaça',
    categoria: 'Risco de Construção',
    area: 'Logística',
    responsavel: 'Ricardo Torres',
    probabilidade: '30%',
    exposicao: 'Impacta diversos vagões',
    estrategia: 'Compartilhar',
    respostas: 'Diversificar transportadoras',
    dataPrevista: '2026-02-25',
    observacao: 'Acompanhar negociações do sindicato',
    acaoPreventiva: 'Cadastrar transportadoras alternativas e estabelecer contratos paralelos',
    custoResposta: 8000,
    novaProbabilidade: '15%',
    novoImpacto: 52000,
    novoValorEsperado: 7800,
    novaPrioridade: '10',
    acaoMitigacao: 'Ativar frota própria emergencial e ajustar cronograma',
    custoRespostaMitigacao: 6000,
    valorEsperadoCustoResposta: 900,
    momentoAcompanhamento: 'Acompanhamento diário durante período de negociações',
    responsavelAcompanhamento: 'Ricardo Torres',
    responsavelAcao: 'Equipe de Logística',
    gatilho: 'Paralisação ou indicativo de greve iminente',
    custoRealRespostasPrevencao: 0,
    impactoReal: 0,
    valorEsperadoRiscosNaoRealizados: 0,
    custoRealRespostaMitigacao: 0,
    valorEsperadoAcoesMitigacaoNaoRealizadas: 0,
    gatilhoAtivado: '',
    statusMitigacao: '',
    eficienciaSolucao: '',
    prioridadeFinal: ''
  },
  {
    id: 'risk-14',
    causaRaiz: 'Crescimento demográfico e econômico regional',
    impactoFinanceiro: 300000,
    impactoFinanceiroAjustado: 255000,
    valorEsperado: 153000,
    prioridade: '1',
    data: '2026-02-05',
    risco: 'Expansão de mercado',
    motivo: 'Demanda crescente em nova região',
    natureza: 'Oportunidade',
    categoria: 'Mercado',
    area: 'Comercial',
    responsavel: 'Beatriz Cardoso',
    probabilidade: '60%',
    exposicao: 'Impacta toda empresa',
    estrategia: 'Melhorar',
    respostas: 'Realizar estudo de viabilidade',
    dataPrevista: '2026-05-15',
    observacao: 'Análise de mercado em andamento',
    acaoPreventiva: 'Realizar estudo de viabilidade e plano de expansão',
    custoResposta: 30000,
    novaProbabilidade: '75%',
    novoImpacto: 350000,
    novoValorEsperado: 262500,
    novaPrioridade: '1',
    acaoMitigacao: 'Estabelecer plano de contingência para demanda não atendida',
    custoRespostaMitigacao: 20000,
    valorEsperadoCustoResposta: 15000,
    momentoAcompanhamento: 'Revisão trimestral de indicadores de mercado',
    responsavelAcompanhamento: 'Beatriz Cardoso',
    responsavelAcao: 'Equipe de Expansão',
    gatilho: 'Demanda acima de 120% da capacidade atual',
    custoRealRespostasPrevencao: 0,
    impactoReal: 0,
    valorEsperadoRiscosNaoRealizados: 0,
    custoRealRespostaMitigacao: 0,
    valorEsperadoAcoesMitigacaoNaoRealizadas: 0,
    gatilhoAtivado: '',
    statusMitigacao: '',
    eficienciaSolucao: '',
    prioridadeFinal: ''
  },
  {
    id: 'risk-15',
    causaRaiz: 'Falta de organização documental',
    impactoFinanceiro: 90000,
    impactoFinanceiroAjustado: 76500,
    valorEsperado: 30600,
    prioridade: '4',
    data: '2026-02-07',
    risco: 'Problemas com licenciamento ambiental',
    motivo: 'Documentação incompleta',
    natureza: 'Ameaça',
    categoria: 'Ambiental',
    area: 'Planejamento',
    responsavel: 'Camila Rodrigues',
    probabilidade: '40%',
    exposicao: 'Impacta a imagem da empresa',
    estrategia: 'Evitar',
    respostas: 'Contratar consultoria ambiental',
    dataPrevista: '2026-03-20',
    observacao: 'Urgência alta - prazo apertado',
    acaoPreventiva: 'Contratar consultoria ambiental e organizar documentação imediatamente',
    custoResposta: 16000,
    novaProbabilidade: '15%',
    novoImpacto: 75000,
    novoValorEsperado: 11250,
    novaPrioridade: '7',
    acaoMitigacao: 'Estabelecer processo emergencial para regularização documental',
    custoRespostaMitigacao: 10000,
    valorEsperadoCustoResposta: 1500,
    momentoAcompanhamento: 'Revisão semanal do status da documentação',
    responsavelAcompanhamento: 'Camila Rodrigues',
    responsavelAcao: 'Equipe de Meio Ambiente',
    gatilho: 'Notificação de pendências pelo órgão ambiental',
    custoRealRespostasPrevencao: 0,
    impactoReal: 0,
    valorEsperadoRiscosNaoRealizados: 0,
    custoRealRespostaMitigacao: 0,
    valorEsperadoAcoesMitigacaoNaoRealizadas: 0,
    gatilhoAtivado: '',
    statusMitigacao: '',
    eficienciaSolucao: '',
    prioridadeFinal: ''
  }
];

function App() {
  const [risks, setRisks] = useState<Risk[]>(INITIAL_RISKS);
  const [categories, setCategories] = useState<string[]>(INITIAL_CATEGORIES);
  const [exposures, setExposures] = useState<string[]>(INITIAL_EXPOSURES);
  const [sensitivity, setSensitivity] = useState<number>(100);
  const [isAnalysisDialogOpen, setIsAnalysisDialogOpen] = useState(false);
  const [selectedRiskId, setSelectedRiskId] = useState<string>('');
  const [filter, setFilter] = useState<'Todos' | 'Oportunidade' | 'Ameaça'>('Todos');

  // Função para calcular prioridade
  const calculatePriority = (risksToCalculate: Risk[]): Risk[] => {
    // Separar oportunidades e ameaças
    const oportunidades = risksToCalculate
      .filter(r => r.natureza === 'Oportunidade')
      .sort((a, b) => Math.abs(b.valorEsperado) - Math.abs(a.valorEsperado)); // Decrescente: maior valor = maior prioridade
    
    const ameacas = risksToCalculate
      .filter(r => r.natureza === 'Ameaça')
      .sort((a, b) => Math.abs(b.valorEsperado) - Math.abs(a.valorEsperado)); // Decrescente: maior valor = maior prioridade
    
    const outros = risksToCalculate.filter(r => r.natureza !== 'Oportunidade' && r.natureza !== 'Ameaça');
    
    // Atribuir prioridades (1 = maior prioridade)
    const oportunidadesComPrioridade = oportunidades.map((r, index) => ({
      ...r,
      prioridade: (index + 1).toString()
    }));
    
    const ameacasComPrioridade = ameacas.map((r, index) => ({
      ...r,
      prioridade: (index + 1).toString()
    }));
    
    const outrosComPrioridade = outros.map(r => ({
      ...r,
      prioridade: '-'
    }));
    
    // Recombinar mantendo a ordem original do array
    const result: Risk[] = [];
    risksToCalculate.forEach(risk => {
      const found = 
        oportunidadesComPrioridade.find(r => r.id === risk.id) ||
        ameacasComPrioridade.find(r => r.id === risk.id) ||
        outrosComPrioridade.find(r => r.id === risk.id);
      if (found) result.push(found);
    });
    
    return result;
  };

  // Função para calcular impacto financeiro ajustado
  const calculateAdjustedImpact = (impactoFinanceiro: number): number => {
    return impactoFinanceiro * (sensitivity / 100);
  };

  // Função para calcular valor esperado
  const calculateExpectedValue = (impactoAjustado: number, probabilidade: string): number => {
    const prob = parseFloat(probabilidade.replace('%', '')) || 0;
    return impactoAjustado * (prob / 100);
  };

  // Filtrar riscos com base no filtro selecionado
  const filteredRisks = filter === 'Todos' 
    ? risks 
    : risks.filter(r => r.natureza === filter);

  // Cálculo dos indicadores de monitoramento
  // Impacto Real = somatório do campo "impactoReal"
  const impactoRealAmeacas = risks
    .filter(r => r.natureza === 'Ameaça')
    .reduce((sum, r) => sum + Math.abs(r.impactoReal || 0), 0);
    
  const impactoRealOportunidades = risks
    .filter(r => r.natureza === 'Oportunidade')
    .reduce((sum, r) => sum + Math.abs(r.impactoReal || 0), 0);
  
  // Custo Real das Contingências = somatório do "custo real resposta de mitigação" das Ameaças
  const custoRealContingencias = risks
    .filter(r => r.natureza === 'Ameaça')
    .reduce((sum, r) => sum + (r.custoRealRespostaMitigacao || 0), 0);
  
  // Custo Real do Aproveitamento = somatório do "custo real resposta de mitigação" das Oportunidades
  const custoRealAproveitamento = risks
    .filter(r => r.natureza === 'Oportunidade')
    .reduce((sum, r) => sum + (r.custoRealRespostaMitigacao || 0), 0);
  
  // Valor Esperado das Ameaças = soma do "valorEsperadoRiscosNaoRealizados" das Ameaças
  const valorEsperadoAmeacasMonitoramento = risks
    .filter(r => r.natureza === 'Ameaça')
    .reduce((sum, r) => sum + Math.abs(r.valorEsperadoRiscosNaoRealizados || 0), 0);
  
  // Valor Esperado das Oportunidades = soma do "valorEsperadoRiscosNaoRealizados" das Oportunidades
  const valorEsperadoOportunidadesMonitoramento = risks
    .filter(r => r.natureza === 'Oportunidade')
    .reduce((sum, r) => sum + Math.abs(r.valorEsperadoRiscosNaoRealizados || 0), 0);
  
  // Valor Esperado das Reservas de Contingência = soma do "valorEsperadoAcoesMitigacaoNaoRealizadas" das Ameaças
  const valorEsperadoReservasContingencia = risks
    .filter(r => r.natureza === 'Ameaça')
    .reduce((sum, r) => sum + Math.abs(r.valorEsperadoAcoesMitigacaoNaoRealizadas || 0), 0);
  
  // Valor Esperado das Reservas de Aproveitamento = soma do "valorEsperadoAcoesMitigacaoNaoRealizadas" das Oportunidades
  const valorEsperadoReservasAproveitamento = risks
    .filter(r => r.natureza === 'Oportunidade')
    .reduce((sum, r) => sum + Math.abs(r.valorEsperadoAcoesMitigacaoNaoRealizadas || 0), 0);

  const handleAddAnalysis = () => {
    if (risks.length === 0) {
      toast.error('Não há riscos cadastrados para análise');
      return;
    }
    setIsAnalysisDialogOpen(true);
  };

  const handleSaveResponsePlan = (riskId: string, type: 'preventiva' | 'mitigacao', data: any) => {
    const updatedRisks = risks.map(risk => {
      if (risk.id === riskId) {
        if (type === 'preventiva') {
          const novoValorEsp = calculateExpectedValue(data.novoImpacto, data.novaProbabilidade);
          
          return {
            ...risk,
            acaoPreventiva: data.acaoPreventiva,
            custoResposta: data.custoResposta,
            novaProbabilidade: data.novaProbabilidade,
            novoImpacto: data.novoImpacto,
            novoValorEsperado: novoValorEsp
          };
        } else {
          // Mitigação
          const novaProbVal = parseFloat(risk.novaProbabilidade?.replace('%', '') || '0') / 100;
          const valorEspCusto = data.custoRespostaMitigacao * novaProbVal;
          
          return {
            ...risk,
            acaoMitigacao: data.acaoMitigacao,
            custoRespostaMitigacao: data.custoRespostaMitigacao,
            valorEsperadoCustoResposta: valorEspCusto,
            momentoAcompanhamento: data.momentoAcompanhamento,
            responsavelAcompanhamento: data.responsavelAcompanhamento,
            responsavelAcao: data.responsavelAcao,
            gatilho: data.gatilho
          };
        }
      }
      return risk;
    });
    
    // Recalcular nova prioridade após salvar preventiva
    const risksWithNewPriority = calculateNewPriority(updatedRisks);
    setRisks(risksWithNewPriority);
    
    toast.success(`Plano de ${type === 'preventiva' ? 'Prevenção' : 'Mitigação'} salvo com sucesso!`);
  };

  // Função para calcular nova prioridade baseada em novoValorEsperado
  const calculateNewPriority = (risksToCalculate: Risk[]): Risk[] => {
    const oportunidades = risksToCalculate
      .filter(r => r.natureza === 'Oportunidade' && r.novoValorEsperado > 0)
      .sort((a, b) => Math.abs(b.novoValorEsperado) - Math.abs(a.novoValorEsperado));
    
    const ameacas = risksToCalculate
      .filter(r => r.natureza === 'Ameaça' && r.novoValorEsperado > 0)
      .sort((a, b) => Math.abs(b.novoValorEsperado) - Math.abs(a.novoValorEsperado));
    
    const outros = risksToCalculate.filter(r => 
      (r.natureza !== 'Oportunidade' && r.natureza !== 'Ameaça') || r.novoValorEsperado === 0
    );
    
    const oportunidadesComPrioridade = oportunidades.map((r, index) => ({
      ...r,
      novaPrioridade: (index + 1).toString()
    }));
    
    const ameacasComPrioridade = ameacas.map((r, index) => ({
      ...r,
      novaPrioridade: (index + 1).toString()
    }));
    
    const outrosComPrioridade = outros.map(r => ({
      ...r,
      novaPrioridade: r.novoValorEsperado === 0 ? '-' : r.novaPrioridade
    }));
    
    const result: Risk[] = [];
    risksToCalculate.forEach(risk => {
      const found = 
        oportunidadesComPrioridade.find(r => r.id === risk.id) ||
        ameacasComPrioridade.find(r => r.id === risk.id) ||
        outrosComPrioridade.find(r => r.id === risk.id);
      if (found) result.push(found);
    });
    
    return result;
  };

  const handleUpdateRisk = (id: string, field: keyof Risk, value: string) => {
    const updatedRisks = risks.map(risk => {
      if (risk.id === id) {
        const updatedRisk = { ...risk, [field]: value };
        
        // Recalcular campos dependentes
        if (field === 'impactoFinanceiro') {
          const impacto = parseFloat(value) || 0;
          updatedRisk.impactoFinanceiro = impacto;
          updatedRisk.impactoFinanceiroAjustado = calculateAdjustedImpact(impacto);
          updatedRisk.valorEsperado = calculateExpectedValue(
            updatedRisk.impactoFinanceiroAjustado,
            updatedRisk.probabilidade
          );
        }
        
        if (field === 'probabilidade') {
          updatedRisk.valorEsperado = calculateExpectedValue(
            updatedRisk.impactoFinanceiroAjustado,
            value
          );
        }
        
        return updatedRisk;
      }
      return risk;
    });
    
    // Recalcular prioridades após qualquer atualização que afete valorEsperado
    if (field === 'impactoFinanceiro' || field === 'probabilidade') {
      const risksWithPriority = calculatePriority(updatedRisks);
      setRisks(risksWithPriority);
    } else {
      setRisks(updatedRisks);
    }
  };

  const handleDeleteRisk = (id: string) => {
    setRisks(risks.filter(risk => risk.id !== id));
  };

  const handleUpdateSensitivity = (newSensitivity: number) => {
    setSensitivity(newSensitivity);
    
    // Recalcular todos os impactos ajustados, valores esperados e prioridades
    const updatedRisks = risks.map(risk => {
      const impactoAjustado = risk.impactoFinanceiro * (newSensitivity / 100);
      const valorEsperado = calculateExpectedValue(impactoAjustado, risk.probabilidade);
      
      return {
        ...risk,
        impactoFinanceiroAjustado: impactoAjustado,
        valorEsperado: valorEsperado
      };
    });
    
    // Recalcular prioridades após mudança na sensibilidade
    const risksWithPriority = calculatePriority(updatedRisks);
    setRisks(risksWithPriority);
    
    toast.success(`Sensibilidade atualizada para ${newSensitivity}%`);
  };

  const handleImportRisks = (importedRisks: Risk[]) => {
    setRisks([...risks, ...importedRisks]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-[1600px] mx-auto p-6">
        {/* Cabeçalho */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">
                Plano de Monitoramento e Controle de Riscos
              </h1>
              <p className="text-gray-600">
                Acompanhe e controle os riscos do seu projeto de construção
              </p>
            </div>
            <div className="flex gap-3">
              <ExcelActions
                risks={risks}
                onImport={handleImportRisks}
              />
              <Button onClick={handleAddAnalysis} size="lg">
                <ClipboardList className="w-5 h-5 mr-2" />
                Novo Plano de Resposta
              </Button>
            </div>
          </div>
        </div>

        {/* Indicadores */}
        <RiskIndicators
          impactoRealAmeacas={impactoRealAmeacas}
          impactoRealOportunidades={impactoRealOportunidades}
          custoRealContingencias={custoRealContingencias}
          custoRealAproveitamento={custoRealAproveitamento}
          valorEsperadoAmeacas={valorEsperadoAmeacasMonitoramento}
          valorEsperadoOportunidades={valorEsperadoOportunidadesMonitoramento}
          valorEsperadoReservasContingencia={valorEsperadoReservasContingencia}
          valorEsperadoReservasAproveitamento={valorEsperadoReservasAproveitamento}
        />

        {/* Filtro */}
        <div className="mb-4">
          <RiskFilter 
            filter={filter}
            onFilterChange={setFilter}
            count={filteredRisks.length}
          />
        </div>

        {/* Tabela de Riscos */}
        <RiskTable
          risks={filteredRisks}
          onUpdateRisk={handleUpdateRisk}
          onDeleteRisk={handleDeleteRisk}
          categories={categories}
          exposures={exposures}
        />

        {/* Dialog de Análise Qualitativa */}
        {isAnalysisDialogOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h2 className="text-xl font-bold mb-4">Selecione o Risco</h2>
              <p className="text-sm text-gray-600 mb-4">
                Escolha qual risco deseja fazer a análise quantitativa:
              </p>
              <Select
                value={selectedRiskId}
                onValueChange={setSelectedRiskId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um risco..." />
                </SelectTrigger>
                <SelectContent>
                  {risks.map((risk) => (
                    <SelectItem key={risk.id} value={risk.id}>
                      {risk.risco || `Risco ${risk.id}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex gap-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAnalysisDialogOpen(false);
                    setSelectedRiskId('');
                  }}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={() => {
                    if (selectedRiskId) {
                      setIsAnalysisDialogOpen(false);
                    } else {
                      toast.error('Selecione um risco primeiro');
                    }
                  }}
                  className="flex-1"
                  disabled={!selectedRiskId}
                >
                  Continuar
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Dialog de Plano de Resposta */}
        <ResponsePlanDialog
          isOpen={!!selectedRiskId && !isAnalysisDialogOpen}
          onClose={() => setSelectedRiskId('')}
          onSave={handleSaveResponsePlan}
          riskId={selectedRiskId}
          riskName={risks.find(r => r.id === selectedRiskId)?.risco || ''}
        />

        {/* Toaster */}
        <Toaster />
      </div>
    </div>
  );
}

export default App;