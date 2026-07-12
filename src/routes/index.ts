export { router } from './router';
export { routes, type AppRoutePath } from './routes';
export { GuestRoute } from './guards/GuestRoute';
export { ProtectedRoute } from './guards/ProtectedRoute';
export { RootRedirect } from './guards/RootRedirect';
export { getHomeRouteForUser, hasRequiredRole } from './utils/role-access';
