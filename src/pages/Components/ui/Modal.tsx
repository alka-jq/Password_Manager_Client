import * as Popover from '@radix-ui/react-popover';
import { X } from 'lucide-react';
import React, { ReactNode } from 'react';

interface ReusablePopoverProps {
    trigger: ReactNode;
    title?: string;
    children: ReactNode;
    side?: 'top' | 'right' | 'bottom' | 'left';
    align?: 'start' | 'center' | 'end';
}

const Modal: React.FC<ReusablePopoverProps> = ({
    trigger,
    title,
    children,
    side = 'top',
    align = 'center',
}) => {
    return (
        <Popover.Root>
            <Popover.Trigger asChild>{trigger}</Popover.Trigger>

            <Popover.Portal>
                <Popover.Content
                    side={side}
                    align={align}
                    className="z-50 bg-white rounded-xl shadow-xl p-5 w-[320px] border border-gray-200"
                >
                    <div className="flex justify-between items-center mb-3">
                        {title && <h3 className="text-lg font-medium">{title}</h3>}
                        <Popover.Close className="text-gray-500 hover:text-gray-800">
                            <X size={18} />
                        </Popover.Close>
                    </div>

                    <div className="text-sm text-gray-700">{children}</div>

                    <Popover.Arrow className="fill-white" />
                </Popover.Content>
            </Popover.Portal>
        </Popover.Root>
    );
};

export default Modal;
