import { Icon } from '@iconify/react';
import type { ComponentPropsWithoutRef } from 'react';

type Props = Readonly<Omit<ComponentPropsWithoutRef<typeof Icon>, 'icon'>>;

export default function DarkModeIcon(props: Props) {
	return <Icon icon="material-symbols:dark-mode" {...props} />;
}
