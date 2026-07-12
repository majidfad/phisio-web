import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';

import { queryClient } from '@/api';
import { AntdProvider } from '@/components/providers/AntdProvider';
import { AuthProvider } from '@/features/auth';
import { router } from '@/routes';

export function AppProviders() {
  return (
    <QueryClientProvider client={queryClient}>
      <AntdProvider>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </AntdProvider>
    </QueryClientProvider>
  );
}
