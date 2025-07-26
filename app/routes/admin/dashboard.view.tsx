import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useEffect, useState } from "react";
import { useDashboardStore } from "@/hooks";
import { initDashboardModel } from "@/models/response/dashboard.response";
import type { DashboardModel } from "@/models";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const dashboard = () => {

  const { getData } = useDashboardStore();
  const [data, setData] = useState<DashboardModel>(initDashboardModel);

  useEffect(() => {
    getData()
      .then((res) => setData(res));
  }, []);
  return (
    <div className="p-6 space-y-6">
      {/* Métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold">Estudiantes</h2>
            <p className="text-3xl font-bold">{data.metrics?.totalStudents ?? "..."}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold">Profesores</h2>
            <p className="text-3xl font-bold">{data.metrics?.totalTeachers ?? "..."}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold">Sucursales</h2>
            <p className="text-3xl font-bold">{data.metrics?.totalBranches ?? "..."}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold">Deudas Pendientes</h2>
            <p className="text-3xl font-bold">{data.metrics?.totalDebts ?? "..."}</p>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de Inscripciones */}
      <div className="bg-white rounded-2xl shadow p-4">
        <h2 className="text-xl font-semibold mb-4">Inscripciones por Mes</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data.inscriptionsData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count" fill="#ac1380" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Tabla de Deudas */}
      <div className="bg-white rounded-2xl shadow p-4">
        <h2 className="text-xl font-semibold mb-4">Deudas Pendientes</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cod. Estudiante</TableHead>
              <TableHead>Estudiante</TableHead>
              <TableHead>Monto Total (Bs)</TableHead>
              <TableHead>Saldo (Bs)</TableHead>
              <TableHead>Vencimiento</TableHead>
              {/* <TableHead>Acción</TableHead> */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.debts.map(debt => (
              debt.totalAmount !== debt.remainingBalance && (
                <TableRow key={debt.id}>
                  <TableCell>{debt.inscription.student?.code}</TableCell>
                  <TableCell>{`${debt.inscription.student?.user.name} ${debt.inscription.student?.user.lastName}`}</TableCell>
                  <TableCell>{debt.totalAmount}</TableCell>
                  <TableCell>{debt.remainingBalance}</TableCell>
                  <TableCell>
                    {debt.dueDate ? format(new Date(debt.dueDate), 'dd-MMMM-yyyy', { locale: es }) : '—'}
                  </TableCell>
                </TableRow>
              )
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default dashboard;