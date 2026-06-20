import { Icon } from '@iconify/react';
import type { ComponentPropsWithoutRef } from 'react';

type Props = Readonly<Omit<ComponentPropsWithoutRef<typeof Icon>, 'icon'>>;

export default function CircleAlertIcon(props: Props) {
	return <Icon icon="lucide:circle-alert" {...props} />;
}
