import { AntDesignRoleShell } from '@/layouts/components/AntDesignRoleShell';
import { adminLayoutConfig } from '@/layouts/config/role-layout-config';

export function AdminLayout() {
  return <AntDesignRoleShell config={adminLayoutConfig} />;
}
