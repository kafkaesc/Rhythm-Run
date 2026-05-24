import { Icon } from '@iconify/react';
import type { ComponentPropsWithoutRef } from 'react';

type Props = Omit<ComponentPropsWithoutRef<typeof Icon>, 'icon'>;

export default function StravaIcon(props: Props) {
	return <Icon icon="mdi:strava" {...props} />;
}
