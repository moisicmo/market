import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { usePermissionStore, useReportStore } from "@/hooks";
import { usePrintStore } from "@/hooks/usePrint";
import { useState } from "react";
import { TypeAction, TypeSubject } from "@/models";
import { Download, Search } from "lucide-react";

interface InventoryRow {
  date: string;
  type: string;
  branch: string;
  product: string;
  code: string;
  quantity: number;
  price: number;
  detail: string;
}

const TYPE_BADGE: Record<string, string> = {
  Entrada: 'bg-green-100 text-green-700',
  Venta: 'bg-blue-100 text-blue-700',
  Baja: 'bg-red-100 text-red-700',
  Salida: 'bg-yellow-100 text-yellow-700',
};

const ReportInventory = () => {
  const { getReportInventories } = useReportStore();
  const { handleXlsx } = usePrintStore();
  const { hasPermission } = usePermissionStore();

  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [previewData, setPreviewData] = useState<InventoryRow[] | null>(null);
  const [xlsxBase64, setXlsxBase64] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePreview = async () => {
    if (!startDate || !endDate) return;
    setLoading(true);
    try {
      const result = await getReportInventories(startDate, endDate);
      setPreviewData(result.data as InventoryRow[]);
      setXlsxBase64(result.xlsxBase64);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!xlsxBase64) return;
    handleXlsx(xlsxBase64, `reporte-inventario-${startDate}-${endDate}.xlsx`);
  };

  const canGenerate = hasPermission(TypeAction.read, TypeSubject.report);

  return (
    <div className="space-y-6 p-4">
      <h2 className="text-xl font-semibold text-gray-800">Reporte de Inventario</h2>

      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium mb-1">Fecha Inicial</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => { setStartDate(e.target.value); setPreviewData(null); }}
                className="border rounded px-2 py-1.5 w-full text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Fecha Final</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => { setEndDate(e.target.value); setPreviewData(null); }}
                className="border rounded px-2 py-1.5 w-full text-sm"
              />
            </div>
            {canGenerate && (
              <Button
                onClick={handlePreview}
                disabled={loading || !startDate || !endDate}
                className="flex items-center gap-2"
              >
                <Search className="w-4 h-4" />
                {loading ? 'Cargando...' : 'Vista previa'}
              </Button>
            )}
            {xlsxBase64 && (
              <Button
                variant="outline"
                onClick={handleDownload}
                className="flex items-center gap-2 border-green-500 text-green-600 hover:bg-green-50"
              >
                <Download className="w-4 h-4" />
                Descargar XLSX
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {previewData !== null && (
        <Card>
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold">
                Vista Previa
                <span className="ml-2 text-sm font-normal text-gray-400">
                  {previewData.length} movimiento{previewData.length !== 1 ? 's' : ''}
                </span>
              </h3>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Sucursal</TableHead>
                  <TableHead>Producto</TableHead>
                  <TableHead>Código</TableHead>
                  <TableHead>Cantidad</TableHead>
                  <TableHead>Precio unit.</TableHead>
                  <TableHead>Detalle</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {previewData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-gray-400 py-8">
                      No hay movimientos en el rango seleccionado.
                    </TableCell>
                  </TableRow>
                ) : (
                  previewData.map((row, i) => (
                    <TableRow key={i}>
                      <TableCell className="whitespace-nowrap text-sm text-gray-600">{row.date}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${TYPE_BADGE[row.type] ?? 'bg-gray-100 text-gray-700'}`}>
                          {row.type}
                        </span>
                      </TableCell>
                      <TableCell>{row.branch}</TableCell>
                      <TableCell className="font-medium">{row.product}</TableCell>
                      <TableCell className="text-gray-400 text-sm">{row.code}</TableCell>
                      <TableCell className="font-semibold">{row.quantity}</TableCell>
                      <TableCell>{row.price}</TableCell>
                      <TableCell className="text-gray-500 text-sm max-w-xs truncate">{row.detail}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ReportInventory;
