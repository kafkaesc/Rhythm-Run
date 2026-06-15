import { Icon } from '@iconify/react';
import type { ComponentPropsWithoutRef } from 'react';

type Props = Omit<ComponentPropsWithoutRef<typeof Icon>, 'icon'>;

export default function ChevronDownIcon(props: Props) {
	return <Icon icon="lucide:chevron-down" {...props} />;
}
