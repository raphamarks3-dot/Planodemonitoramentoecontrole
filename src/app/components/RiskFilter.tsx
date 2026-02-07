import { Filter } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';

interface RiskFilterProps {
  filter: 'Todos' | 'Oportunidade' | 'Ameaça';
  onFilterChange: (filter: 'Todos' | 'Oportunidade' | 'Ameaça') => void;
  count: number;
}

export function RiskFilter({ filter, onFilterChange, count }: RiskFilterProps) {
  return (
    <div className="flex items-center gap-2">
      <Filter className="w-4 h-4 text-gray-600" />
      <Select value={filter} onValueChange={onFilterChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filtrar por..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Todos">Todos os Riscos</SelectItem>
          <SelectItem value="Oportunidade">🟢 Oportunidades</SelectItem>
          <SelectItem value="Ameaça">🔴 Ameaças</SelectItem>
        </SelectContent>
      </Select>
      <span className="text-sm text-gray-600 font-medium">
        ({count} {count === 1 ? 'risco' : 'riscos'})
      </span>
    </div>
  );
}