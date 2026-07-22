import { App } from 'antd';
import { useMemo } from 'react';

/** App-scoped toast helpers (Ant Design message API). */
export function useToast() {
  const { message } = App.useApp();

  return useMemo(
    () => ({
      success: (content: string) => {
        void message.success(content);
      },
      error: (content: string) => {
        void message.error(content);
      },
      info: (content: string) => {
        void message.info(content);
      },
      warning: (content: string) => {
        void message.warning(content);
      },
    }),
    [message],
  );
}
