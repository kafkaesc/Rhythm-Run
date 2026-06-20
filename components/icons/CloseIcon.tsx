import { Icon } from '@iconify/react';
import type { ComponentPropsWithoutRef } from 'react';

type Props = Readonly<Omit<ComponentPropsWithoutRef<typeof Icon>, 'icon'>>;

export default function CloseIcon(props: Props) {
	return <Icon icon="material-symbols:close" {...props} />;
}
