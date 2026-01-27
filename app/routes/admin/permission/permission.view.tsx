import { useCallback, useState } from 'react';
import {  PermissionTable } from '.';
import { Button } from '@/components';
import { usePermissionStore } from '@/hooks';

const permissionView = () => {
  const { dataPermission, getPermissions} = usePermissionStore();

  return (
    <>
      {/* Encabezado */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Permisos</h2>
      </div>

      {/* Tabla de role */}
      <PermissionTable
        dataRole={dataPermission}
        onRefresh={getPermissions}
      />
    </>
  );
};

export default permissionView;