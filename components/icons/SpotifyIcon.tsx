import { Icon } from '@iconify/react';
import type { ComponentPropsWithoutRef } from 'react';

type Props = Readonly<Omit<ComponentPropsWithoutRef<typeof Icon>, 'icon'>>;

export default function SpotifyIcon(props: Props) {
	return <Icon icon="mdi:spotify" {...props} />;
}
