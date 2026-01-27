import { useEffect, useState } from 'react';
import { TypeAction, TypeSubject, type BaseResponse, type RoleModel } from '@/models';
import { useDebounce, usePermissionStore } from '@/hooks';
import { PaginationControls } from '@/components/pagination.control';
import { ActionButtons, InputCustom } from '@/components';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Shield } from 'lucide-react';

interface Props {
  handleEdit: (role: RoleModel) => void;
  limitInit?: number;
  itemSelect?: (role: RoleModel) => void;
  dataRole: BaseResponse<RoleModel>;
  onRefresh: (page?: number, limit?: number, keys?: string) => void;
  onDelete: (id: string) => void;
}

const groupPermissions = (permissions: RoleModel['permissions']) => {
  const groups: Record<string, string[]> = {};

  permissions.forEach(perm => {
    if (!groups[perm.subject]) {
      groups[perm.subject] = [];
    }
    groups[perm.subject].push(TypeAction[perm.action as unknown as keyof typeof TypeAction]);
  });

  return groups;
};

export const RoleTable = (props: Props) => {
  const {
    handleEdit,
    itemSelect,
    limitInit = 10,
    dataRole,
    onRefresh,
    onDelete,
  } = props;


  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(limitInit);
  const { hasPermission } = usePermissionStore();
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 1500);
  useEffect(() => {
    const maxPage = Math.max(1, Math.ceil(dataRole.total / rowsPerPage));
    if (page > maxPage) {
      setPage(maxPage);
    }
  }, [dataRole.total, rowsPerPage]);

  useEffect(() => {
    onRefresh(page, rowsPerPage, debouncedQuery);
  }, [page, rowsPerPage, debouncedQuery]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <InputCustom
          name="query"
          value={query}
          placeholder="Buscar rol..."
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <Table className='mb-3'>
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/3">Rol</TableHead>
            <TableHead className="w-2/3">Permisos</TableHead>
            <TableHead className="sticky right-0 z-10 bg-white">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dataRole.data.map(item => {
            const permissionGroups = groupPermissions(item.permissions);
            const moduleCount = Object.keys(permissionGroups).length;

            return (
              <TableRow key={item.id}>
                <TableCell>
                  <div className="font-medium">{item.name}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {item.permissions.length} permiso{item.permissions.length !== 1 ? 's' : ''}
                  </div>
                </TableCell>
                <TableCell>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="permissions" className="border-0">
                      <AccordionTrigger className="py-1 hover:no-underline">
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-gray-500" />
                          <span className="text-sm">
                            {moduleCount} módulo{moduleCount !== 1 ? 's' : ''}
                          </span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        {Object.entries(permissionGroups).map(([module, actions]) => (
                          <div key={module} className="border-l-2 border-primary pl-3 py-1">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium truncate">{module}</span>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {actions.join(', ')}
                            </div>
                          </div>
                        ))}
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </TableCell>
                <TableCell className="sticky right-0 z-10 bg-white">
                  <ActionButtons
                    item={item}
                    onEdit={hasPermission(TypeAction.update, TypeSubject.role) ? handleEdit : undefined}
                    onDelete={hasPermission(TypeAction.delete, TypeSubject.role) ? onDelete : undefined}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <PaginationControls
        total={dataRole.total}
        page={page}
        limit={rowsPerPage}
        onPageChange={(newPage) => setPage(newPage)}
        onRowsPerPageChange={(newLimit) => {
          setRowsPerPage(newLimit);
          setPage(1);
        }}
      />
    </div>
  );
};