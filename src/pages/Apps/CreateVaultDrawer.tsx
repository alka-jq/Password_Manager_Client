import React, { useState, useEffect } from 'react';
import {
  Drawer,
  TextField,
  Button,
  Typography,
  Box,
  useMediaQuery,
  useTheme,
  Tooltip,
} from '@mui/material';
import {
  Close as CloseIcon,
  Folder as FolderIcon,
  FiberManualRecord as DotIcon,
} from '@mui/icons-material';
import {
  Home, Briefcase, Gift, Store, Heart, AlarmClock, AppWindow, Settings, Users, Ghost,
  ShoppingCart, Leaf, Shield, Circle, CreditCard, Fish, Smile, Lock, UserCheck, Star,
  Flame, Wallet, Bookmark, IceCream, Laptop, BookOpen, Infinity, FileText
} from 'lucide-react';

interface Vault {
  id: string;
  name: string;
  icon: string;
  color: string;
}

interface CreateVaultDrawerProps {
  open: boolean;
  onClose: () => void;
  onCreate: (vaultName: string, iconName: string, color: string) => void;
  onEdit?: (vaultId: string, vaultName: string, iconName: string, color: string) => void;
  editVault?: Vault | null;
}

const iconComponents: Record<string, React.ReactNode> = {
  Home: <Home size={20} />, Briefcase: <Briefcase size={20} />, Gift: <Gift size={20} />, Store: <Store size={20} />,
  Heart: <Heart size={20} />, AlarmClock: <AlarmClock size={20} />, AppWindow: <AppWindow size={20} />, Settings: <Settings size={20} />,
  Users: <Users size={20} />, Ghost: <Ghost size={20} />, ShoppingCart: <ShoppingCart size={20} />, Leaf: <Leaf size={20} />,
  Shield: <Shield size={20} />, Circle: <Circle size={20} />, CreditCard: <CreditCard size={20} />, Fish: <Fish size={20} />,
  Smile: <Smile size={20} />, Lock: <Lock size={20} />, UserCheck: <UserCheck size={20} />, Star: <Star size={20} />,
  Flame: <Flame size={20} />, Wallet: <Wallet size={20} />, Bookmark: <Bookmark size={20} />, IceCream: <IceCream size={20} />,
  Laptop: <Laptop size={20} />, BookOpen: <BookOpen size={20} />, Infinity: <Infinity size={20} />, FileText: <FileText size={20} />,
};

const colorOptions = [
  '#a855f7', '#fb7185', '#d97706', '#0f766e', '#3b82f6',
  '#ec4899', '#be123c', '#f97316', '#737373', '#14b8a6',
];

const CreateVaultDrawer: React.FC<CreateVaultDrawerProps> = ({
  open,
  onClose,
  onCreate,
  onEdit,
  editVault,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [title, setTitle] = useState('');
  const [selectedIcon, setSelectedIcon] = useState(editVault?.icon || 'Home');
  const [selectedColor, setSelectedColor] = useState(editVault?.color || colorOptions[0]);
  const [error, setError] = useState<string | null>(
    editVault ? null : 'Cell name is required'
  );

  useEffect(() => {
    if (editVault) {
      setTitle(editVault.name);
      setSelectedIcon(editVault.icon);
      setSelectedColor(editVault.color);
      setError(null);
    } else {
      setTitle('');
      setSelectedIcon('Home');
      setSelectedColor(colorOptions[0]);
      setError('Cell name is required');
    }
  }, [editVault]);

  const handleSubmit = () => {
    if (error) return;
    if (editVault && onEdit) {
      onEdit(editVault.id, title, selectedIcon, selectedColor);
    } else {
      onCreate(title, selectedIcon, selectedColor);
    }
    onClose();
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: isMobile ? '100%' : '600px',
          padding: isMobile ? '16px' : '24px',
          background: 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(16px)',
          boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',

        },
      }}
    >
      <Box display="flex" flexDirection="column" height="100%">
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h6" fontWeight="bold">
            {editVault ? 'Edit Cell' : 'Create Cell'}
          </Typography>
          <Button
            onClick={onClose}
            color="inherit"
            sx={{
              minWidth: 'auto',
              padding: '6px',
              borderRadius: '50%',
              '&:hover': {
                backgroundColor: '#D0D5DC', // light gray on hover
              },
            }}
          >
            <CloseIcon fontSize="small" />
          </Button>

        </Box>

        {/* Title Field */}
        <Box mb={4}>
          <Box display="flex" alignItems="center" mb={1}>
            <Box sx={{ color: selectedColor, mr: 1, fontSize: 20 }}>
              {iconComponents[selectedIcon]}
            </Box>
            <Typography variant="subtitle1" color="text.secondary">
              Title
            </Typography>
          </Box>
          <TextField
            fullWidth
            variant="outlined"
            value={title}
            onChange={(e) => {
              const val = e.target.value;
              setTitle(val);
              setError(val.trim() ? null : 'Cell name is required');
            }}
            error={!!error}
            helperText={error && (
              <Box display="flex" alignItems="center" color="error.main">
                <DotIcon sx={{ fontSize: '10px', mr: '4px' }} />
                {error}
              </Box>
            )}
            placeholder="Untitled"
            InputProps={{
              sx: {
                backgroundColor: '#f9fafb',
                borderRadius: '8px',
              },
            }}
          />
        </Box>

        {/* Color Picker */}
        <Typography variant="subtitle1" gutterBottom>
          Choose Color
        </Typography>
        <Box display="flex" flexWrap="wrap" gap={2} mb={6}>
          {colorOptions.map((color) => (
            <Box
              key={color}
              onClick={() => setSelectedColor(color)}
              sx={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                backgroundColor: color,
                border: selectedColor === color ? '2px solid #3b82f6' : '2px solid transparent',
                boxShadow: selectedColor === color ? '0 0 0 2px white' : 'none',
                cursor: 'pointer',
              }}
            />
          ))}
        </Box>

        {/* Icon Picker */}
        <Typography variant="subtitle1" gutterBottom>
          Choose Icon
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(36px, 1fr))', // tight columns
            gap: '14px', // reduced spacing between icons
            // maxWidth: '300px', // optional: control overall width
          }}
        >
          {Object.entries(iconComponents).map(([name, icon]) => (
            <Box
              key={name}
              onClick={() => setSelectedIcon(name)}
              sx={{
                cursor: 'pointer',
                borderRadius: '50%',
                p: 1,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: selectedIcon === name ? '#c7e8fd' : 'transparent',
                '&:hover': {
                  backgroundColor: '#f1f5f9',
                },
              }}
            >
              {icon}
            </Box>
          ))}
        </Box>


        {/* Footer Buttons */}
        <Box mt="auto" display="flex" flexDirection={isMobile ? 'column' : 'row'} justifyContent="flex-end" gap={2} pt={3}>
          <Button
            variant="outlined"
            onClick={onClose}
            fullWidth={isMobile}
            sx={{
              borderColor: 'grey.300',
              color: 'grey.700',
              textTransform: 'none',
              '&:hover': { backgroundColor: 'grey.100' },
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            disabled={!!error}
            onClick={handleSubmit}
            fullWidth={isMobile}
            sx={{
              backgroundColor: !!error ? 'grey.300' : 'bg-[#2565C7]',
              color: '#fff',
              textTransform: 'none',
              '&:hover': {
                backgroundColor: !!error ? 'grey.300' : 'bg-[#2565C7]',
              },
            }}
          >
            {editVault ? 'Save Changes' : 'Create'}
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default CreateVaultDrawer;
