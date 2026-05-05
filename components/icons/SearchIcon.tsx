import { Icon } from '@iconify/react';
import type { ComponentPropsWithoutRef } from 'react';

type Props = Omit<ComponentPropsWithoutRef<typeof Icon>, 'icon'>;

export default function SearchIcon(props: Props) {
	return <Icon icon="lucide:search" className="-translate-y-px" {...props} />;
}
