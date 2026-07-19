import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';

import { queryClient } from '@/api';
import { AntdProvider } from '@/components/providers/AntdProvider';
import { AuthProvider } from '@/features/auth';
import { router } from '@/routes';
import { ThemeProvider } from '@/theme/ThemeProvider';

export function AppProviders() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AntdProvider>
          <AuthProvider>
            <RouterProvider router={router} />
          </AuthProvider>
        </AntdProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
