import {
  CreditCard,
  User,
  Lock,
  Shield,
  Folder,
} from 'lucide-react';

const iconBaseClass = 'w-4 h-4'; // Ensures consistency (16px)
const iconColorVariants = {
  default: 'text-gray-500 dark:text-gray-300',
  all: 'text-blue-500',
  login: 'text-red-500',
  id: 'text-yellow-500',
  password: 'text-purple-500',
  card: 'text-green-500',
  
};

export const filterConfig: Record<
  string,
  { label: string; icon: JSX.Element }
> = {
  'All Items': {
    label: 'All Items',
    icon: <Folder className={`${iconBaseClass} ${iconColorVariants.all}`} />,
  },
  'Login': {
    label: 'Login',
    icon: <User className={`${iconBaseClass} ${iconColorVariants.login}`} />,
  },
  'Identity Card': {
    label: 'Identity Card',
    icon: <Shield className={`${iconBaseClass} ${iconColorVariants.id}`} />,
  },
  'Card': {
    label: 'Card',
    icon: <CreditCard className={`${iconBaseClass} ${iconColorVariants.card}`} />,
  },
};
