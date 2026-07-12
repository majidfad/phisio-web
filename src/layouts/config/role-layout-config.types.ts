export interface RoleLayoutNavItem {
  id: string;
  labelKey: string;
  to?: string;
  /** When true, NavLink matches only the exact path (e.g. dashboard index). */
  end?: boolean;
}

export interface RoleLayoutConfig {
  layoutClassName: string;
  roleLabelKey: string;
  navAriaLabelKey: string;
  navItems: RoleLayoutNavItem[];
}
