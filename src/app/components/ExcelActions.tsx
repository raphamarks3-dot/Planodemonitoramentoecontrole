import { useRef } from 'react';
import { FileDown, FileUp, FileSpreadsheet } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import * as XLSX from 'xlsx';
import { Risk } from '@/app/components/RiskTable';
import { toast } from 'sonner';

interface ExcelActionsProps {
  risks: Risk[];
  onImport: (risks: Risk[]) => void;
}

export function ExcelActions({ risks, onImport }: ExcelActionsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    try {
      // Prepara os dados para exportação
      const exportData = risks.map(risk => ({
        'Data Identificação': risk.data,
        'Qual o Risco': risk.risco,
        'Motivo': risk.motivo,
        'Natureza do Risco': risk.natureza,
        'Categoria do Risco': risk.categoria,
        'Área Responsável': risk.area,
        'Responsável': risk.responsavel,
      }));

      // Cria uma planilha
      const worksheet = XLSX.utils.json_to_sheet(exportData);
      
      // Define larguras das colunas
      const columnWidths = [
        { wch: 15 }, // Data
        { wch: 40 }, // Qual o Risco
        { wch: 40 }, // Motivo
        { wch: 18 }, // Natureza
        { wch: 35 }, // Categoria
        { wch: 20 }, // Área
        { wch: 25 }, // Responsável
      ];
      worksheet['!cols'] = columnWidths;

      // Cria um workbook e adiciona a planilha
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Riscos');

      // Gera o arquivo e faz o download
      const fileName = `gestao_riscos_${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(workbook, fileName);

      toast.success('Excel exportado com sucesso!');
    } catch (error) {
      console.error('Erro ao exportar:', error);
      toast.error('Erro ao exportar arquivo Excel');
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: 'binary' });
          
          // Pega a primeira planilha
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          
          // Converte para JSON
          const jsonData = XLSX.utils.sheet_to_json(worksheet) as any[];
          
          // Mapeia os dados importados para o formato Risk
          const importedRisks: Risk[] = jsonData.map((row, index) => ({
            id: `risk-${Date.now()}-${index}`,
            data: row['Data Identificação'] || row['data'] || '',
            risco: row['Qual o Risco'] || row['risco'] || '',
            motivo: row['Motivo'] || row['motivo'] || '',
            natureza: (row['Natureza do Risco'] || row['natureza'] || '') as 'Oportunidade' | 'Ameaça' | '',
            categoria: row['Categoria do Risco'] || row['categoria'] || '',
            area: row['Área Responsável'] || row['area'] || '',
            responsavel: row['Responsável'] || row['responsavel'] || '',
          }));

          onImport(importedRisks);
          toast.success(`${importedRisks.length} riscos importados com sucesso!`);
        } catch (error) {
          console.error('Erro ao processar arquivo:', error);
          toast.error('Erro ao processar arquivo Excel');
        }
      };

      reader.readAsBinaryString(file);
    } catch (error) {
      console.error('Erro ao importar:', error);
      toast.error('Erro ao importar arquivo Excel');
    }

    // Limpa o input para permitir importar o mesmo arquivo novamente
    event.target.value = '';
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="lg">
            <FileSpreadsheet className="w-5 h-5 mr-2" />
            Excel
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem onClick={handleExport}>
            <FileDown className="w-4 h-4 mr-2" />
            Exportar em Excel (.xlsx)
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleImportClick}>
            <FileUp className="w-4 h-4 mr-2" />
            Importar de Excel (.xlsx)
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Input oculto para selecionar arquivo */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
    </>
  );
}