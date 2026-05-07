import { Icon } from '@iconify/react';
import type { ComponentPropsWithoutRef } from 'react';

type Props = Omit<ComponentPropsWithoutRef<typeof Icon>, 'icon'>;

export default function ClearIcon(props: Props) {
	return <Icon icon="lucide:x-circle" {...props} />;
}
