import { DollarSign, TrendingUp, TrendingDown, Target, Coins } from 'lucide-react';

interface RiskIndicatorsProps {
  impactoRealAmeacas: number;
  impactoRealOportunidades: number;
  custoRealContingencias: number;
  custoRealAproveitamento: number;
  valorEsperadoAmeacas: number;
  valorEsperadoOportunidades: number;
  valorEsperadoReservasContingencia: number;
  valorEsperadoReservasAproveitamento: number;
}

export function RiskIndicators({
  impactoRealAmeacas,
  impactoRealOportunidades,
  custoRealContingencias,
  custoRealAproveitamento,
  valorEsperadoAmeacas,
  valorEsperadoOportunidades,
  valorEsperadoReservasContingencia,
  valorEsperadoReservasAproveitamento,
}: RiskIndicatorsProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <>
      {/* Grid de 8 indicadores de monitoramento */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4 mb-8">
        {/* Impacto Real das Ameaças */}
        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-red-700">
          <div className="flex items-center justify-between">
            <div className="flex-1 pr-2">
              <p className="text-xs text-gray-600 mb-1">Impacto Real das Ameaças</p>
              <p className="text-lg font-bold text-red-700">{formatCurrency(impactoRealAmeacas)}</p>
            </div>
            <div className="bg-red-100 p-2 rounded-full">
              <TrendingDown className="w-5 h-5 text-red-700" />
            </div>
          </div>
        </div>

        {/* Impacto Real das Oportunidades */}
        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-green-700">
          <div className="flex items-center justify-between">
            <div className="flex-1 pr-2">
              <p className="text-xs text-gray-600 mb-1">Impacto Real das Oportunidades</p>
              <p className="text-lg font-bold text-green-700">{formatCurrency(impactoRealOportunidades)}</p>
            </div>
            <div className="bg-green-100 p-2 rounded-full">
              <TrendingUp className="w-5 h-5 text-green-700" />
            </div>
          </div>
        </div>

        {/* Custo Real das Contingências */}
        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-amber-600">
          <div className="flex items-center justify-between">
            <div className="flex-1 pr-2">
              <p className="text-xs text-gray-600 mb-1">Custo Real das Contingências</p>
              <p className="text-lg font-bold text-amber-600">{formatCurrency(custoRealContingencias)}</p>
            </div>
            <div className="bg-amber-100 p-2 rounded-full">
              <Coins className="w-5 h-5 text-amber-600" />
            </div>
          </div>
        </div>

        {/* Custo Real do Aproveitamento */}
        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-emerald-600">
          <div className="flex items-center justify-between">
            <div className="flex-1 pr-2">
              <p className="text-xs text-gray-600 mb-1">Custo Real do Aproveitamento</p>
              <p className="text-lg font-bold text-emerald-600">{formatCurrency(custoRealAproveitamento)}</p>
            </div>
            <div className="bg-emerald-100 p-2 rounded-full">
              <Coins className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
        </div>

        {/* Valor Esperado das Ameaças */}
        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-rose-600">
          <div className="flex items-center justify-between">
            <div className="flex-1 pr-2">
              <p className="text-xs text-gray-600 mb-1">Valor Esperado das Ameaças</p>
              <p className="text-lg font-bold text-rose-600">{formatCurrency(valorEsperadoAmeacas)}</p>
            </div>
            <div className="bg-rose-100 p-2 rounded-full">
              <Target className="w-5 h-5 text-rose-600" />
            </div>
          </div>
        </div>

        {/* Valor Esperado das Oportunidades */}
        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-cyan-600">
          <div className="flex items-center justify-between">
            <div className="flex-1 pr-2">
              <p className="text-xs text-gray-600 mb-1">Valor Esperado das Oportunidades</p>
              <p className="text-lg font-bold text-cyan-600">{formatCurrency(valorEsperadoOportunidades)}</p>
            </div>
            <div className="bg-cyan-100 p-2 rounded-full">
              <Target className="w-5 h-5 text-cyan-600" />
            </div>
          </div>
        </div>

        {/* Valor Esperado das Reservas de Contingência */}
        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-indigo-600">
          <div className="flex items-center justify-between">
            <div className="flex-1 pr-2">
              <p className="text-xs text-gray-600 mb-1">Valor Esperado das Reservas de Contingência</p>
              <p className="text-lg font-bold text-indigo-600">{formatCurrency(valorEsperadoReservasContingencia)}</p>
            </div>
            <div className="bg-indigo-100 p-2 rounded-full">
              <DollarSign className="w-5 h-5 text-indigo-600" />
            </div>
          </div>
        </div>

        {/* Valor Esperado das Reservas de Aproveitamento */}
        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-lime-600">
          <div className="flex items-center justify-between">
            <div className="flex-1 pr-2">
              <p className="text-xs text-gray-600 mb-1">Valor Esperado das Reservas de Aproveitamento</p>
              <p className="text-lg font-bold text-lime-600">{formatCurrency(valorEsperadoReservasAproveitamento)}</p>
            </div>
            <div className="bg-lime-100 p-2 rounded-full">
              <DollarSign className="w-5 h-5 text-lime-600" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
