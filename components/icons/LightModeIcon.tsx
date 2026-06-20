import { Icon } from '@iconify/react';
import type { ComponentPropsWithoutRef } from 'react';

type Props = Readonly<Omit<ComponentPropsWithoutRef<typeof Icon>, 'icon'>>;

export default function LightModeIcon(props: Props) {
	return <Icon icon="material-symbols:light-mode" {...props} />;
}
