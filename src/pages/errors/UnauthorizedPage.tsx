import { AppResult } from '@/components/ui';
import { Button } from 'antd';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { routes } from '@/routes/routes';

export function UnauthorizedPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="route-loading" style={{ background: 'var(--phisio-bg)' }}>
      <AppResult
        status="403"
        title={t('errors.unauthorized.title')}
        subTitle={t('errors.unauthorized.message')}
        extra={
          <Button type="primary" onClick={() => void navigate(routes.login)}>
            {t('auth.signInButton')}
          </Button>
        }
      />
    </div>
  );
}
