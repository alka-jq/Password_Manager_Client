import React, { useState, useEffect } from 'react';
import {
  Drawer,
  TextField,
  Button,
  Typography,
  Box,
  useMediaQuery,
  useTheme,
  IconButton,
  alpha,
} from '@mui/material';
import {
  Close as CloseIcon,
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
          width: isMobile ? '100%' : '420px',
          padding: 0,
          background: '#ffffff',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          borderLeft: '1px solid rgba(0, 0, 0, 0.08)',
          overflow: 'hidden',
        },
      }}
    >
      <Box display="flex" flexDirection="column" height="100%" p={isMobile ? 2 : 3}>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h6" fontWeight="600" color="text.primary">
            {editVault ? 'Edit Cell' : 'Create Cell'}
          </Typography>
          <IconButton
            onClick={onClose}
            size="small"
            sx={{
              backgroundColor: 'rgba(0, 0, 0, 0.04)',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.08)',
              },
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* Title Field */}
        <Box mb={4}>
          <Box display="flex" alignItems="center" mb={1.5}>
            <Box
              sx={{
                color: selectedColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 1.5,
              }}
            >
              {iconComponents[selectedIcon]}
            </Box>
            <Typography variant="subtitle2" color="text.secondary" fontWeight="500">
              CELL NAME
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
              <Box display="flex" alignItems="center" color="error.main" fontSize="13px" mt={0.5}>
                <DotIcon sx={{ fontSize: '10px', mr: '6px' }} />
                {error}
              </Box>
            )}
            placeholder="Enter a name for your cell"
            InputProps={{
              sx: {
                backgroundColor: '#f8fafc',
                borderRadius: '10px',
                '& fieldset': {
                  borderColor: '#e2e8f0',
                  borderRadius: '10px',
                },
                '&:hover fieldset': {
                  borderColor: '#cbd5e1',
                },
                '&.Mui-focused fieldset': {
                  borderColor: selectedColor,
                  borderWidth: '2px',
                },
              },
            }}
          />
        </Box>

        {/* Color Picker */}
        <Typography variant="subtitle2" color="text.secondary" fontWeight="500" mb={1.5} pl={0.5}>
          COLOR
        </Typography>
        <Box display="flex" flexWrap="wrap" gap={1.5} mb={4}>
          {colorOptions.map((color) => (
            <Box
              key={color}
              onClick={() => setSelectedColor(color)}
              sx={{
                width: 32,
                height: 32,
                borderRadius: '8px',
                backgroundColor: color,
                border: selectedColor === color ? `2px solid white` : `2px solid transparent`,
                outline: selectedColor === color ? `2px solid ${color}` : 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': {
                  transform: 'scale(1.1)',
                },
              }}
            />
          ))}
        </Box>

        {/* Icon Picker */}
        <Typography variant="subtitle2" color="text.secondary" fontWeight="500" mb={1.5} pl={0.5}>
          ICON
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(6, 1fr)',
            gap: 1,
            mb: 4,
          }}
        >
          {Object.entries(iconComponents).map(([name, icon]) => (
            <Box
              key={name}
              onClick={() => setSelectedIcon(name)}
              sx={{
                cursor: 'pointer',
                borderRadius: '10px',
                p: 1.5,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: selectedIcon === name ? alpha(selectedColor, 0.1) : 'transparent',
                border: selectedIcon === name ? `2px solid ${alpha(selectedColor, 0.3)}` : '2px solid transparent',
                color: selectedIcon === name ? selectedColor : '#64748b',
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: alpha(selectedColor, 0.05),
                  transform: 'translateY(-2px)',
                },
              }}
            >
              {icon}
            </Box>
          ))}
        </Box>

        {/* Footer Buttons */}
        <Box mt="auto" display="flex" flexDirection={isMobile ? 'column' : 'row'} justifyContent="flex-end" gap={1.5} pt={2}>
          <Button
            variant="outlined"
            onClick={onClose}
            fullWidth={isMobile}
            sx={{
              borderColor: '#e2e8f0',
              color: '#64748b',
              textTransform: 'none',
              borderRadius: '10px',
              py: 1.2,
              fontWeight: 500,
              '&:hover': {
                backgroundColor: '#f1f5f9',
                borderColor: '#cbd5e1',
              },
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
              backgroundColor: selectedColor,
              color: '#fff',
              textTransform: 'none',
              borderRadius: '10px',
              py: 1.2,
              fontWeight: 500,
              boxShadow: `0 4px 6px ${alpha(selectedColor, 0.3)}`,
              '&:hover': {
                backgroundColor: selectedColor,
                boxShadow: `0 6px 10px ${alpha(selectedColor, 0.4)}`,
                transform: 'translateY(-1px)',
              },
              '&.Mui-disabled': {
                backgroundColor: '#e2e8f0',
                color: '#94a3b8',
                boxShadow: 'none',
                 py: 1.2,
              },
            }}
          >
            {editVault ? 'Save Changes' : 'Create Cell'}
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default CreateVaultDrawer;