export type AdminListFilter = 'active' | 'inactive';

export function adminListFilterToIsEnabled(filter: AdminListFilter): boolean {
  return filter === 'active';
}
