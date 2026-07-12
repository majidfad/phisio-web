import { Typography } from 'antd';
import type { ReactNode } from 'react';

const { Title, Text } = Typography;

interface PageSectionProps {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
}

export function PageSection({ title, description, action, children }: PageSectionProps) {
  return (
    <section style={{ marginTop: 28 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 16,
          marginBottom: 16,
        }}
      >
        <div>
          <Title level={5} style={{ margin: 0, fontWeight: 600 }}>
            {title}
          </Title>
          {description ? (
            <Text type="secondary" style={{ display: 'block', marginTop: 4, fontSize: 14 }}>
              {description}
            </Text>
          ) : null}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
