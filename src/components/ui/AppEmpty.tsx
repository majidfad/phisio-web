import { Inbox, type LucideIcon } from 'lucide-react';
import { Empty, type EmptyProps } from 'antd';
import type { CSSProperties } from 'react';

interface AppEmptyProps extends Omit<EmptyProps, 'image'> {
  icon?: LucideIcon;
  iconSize?: number;
  image?: EmptyProps['image'];
}

/** Minimal Lucide empty state — replaces Ant Design’s default cartoon illustration. */
export function AppEmpty({ icon: Icon = Inbox, iconSize = 40, image, ...props }: AppEmptyProps) {
  const imageStyle: CSSProperties = {
    height: iconSize,
    marginBottom: 12,
  };

  return (
    <Empty
      {...props}
      image={
        image ?? (
          <Icon
            size={iconSize}
            strokeWidth={1.5}
            className="app-empty__icon"
            style={imageStyle}
            aria-hidden="true"
          />
        )
      }
    />
  );
}
