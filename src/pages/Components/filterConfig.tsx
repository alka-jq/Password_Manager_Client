// filterConfig.ts (or keep inline inside TaskList if small)

import {
  CreditCard, User, Lock, Globe, Shield, Folder
} from 'lucide-react';

export const filterConfig: Record<string, { label: string; icon: JSX.Element }> = {
  'All Items': {
    label: 'All Items',
    icon: <Folder size={16} />,
  },
  'Login': {
    label: 'Login',
    icon: <User size={16} color='red' />,
  },
  'Identity Card': {
    label: 'Identity Card',
    icon: <Shield size={16} />,
  },
  'Password': {
    label: 'Password',
    icon: <Lock size={16} />,
  },
  'Card': {
    label: 'Card',
    icon: <CreditCard size={16} />,
  },
 
};
