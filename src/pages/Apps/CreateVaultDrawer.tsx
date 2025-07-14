import React, { useState, useEffect } from 'react';
import {
  Drawer,
  TextField,
  Button,
  Typography,
  Box,
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
  Home: <Home />, Briefcase: <Briefcase />, Gift: <Gift />, Store: <Store />,
  Heart: <Heart />, AlarmClock: <AlarmClock />, AppWindow: <AppWindow />, Settings: <Settings />,
  Users: <Users />, Ghost: <Ghost />, ShoppingCart: <ShoppingCart />, Leaf: <Leaf />,
  Shield: <Shield />, Circle: <Circle />, CreditCard: <CreditCard />, Fish: <Fish />,
  Smile: <Smile />, Lock: <Lock />, UserCheck: <UserCheck />, Star: <Star />,
  Flame: <Flame />, Wallet: <Wallet />, Bookmark: <Bookmark />, IceCream: <IceCream />,
  Laptop: <Laptop />, BookOpen: <BookOpen />, Infinity: <Infinity />, FileText: <FileText />,
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
  const [title, setTitle] = useState('');
  const [selectedIcon, setSelectedIcon] = useState(editVault?.icon || 'Home');
  const [selectedColor, setSelectedColor] = useState(editVault?.color || colorOptions[0]);
  const [error, setError] = useState<string | null>(
    editVault ? null : 'Vault name is required'
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
          width: '600px',
          padding: '24px',
          background: 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(16px)',
          boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
       
        },
      }}
    >
      <Box display="flex" flexDirection="column" height="100%">
      
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Typography variant="h6" fontWeight="bold" color="text.primary">
            {editVault ? 'Edit Cell' : 'Create Cell'}
          </Typography>
          <Button onClick={onClose} color="inherit">
            <CloseIcon />
          </Button>
        </Box>

        
        <Box mb={4}>
          <Box display="flex" alignItems="center" mb={1}>
            <Box sx={{ color: selectedColor, mr: 1 }}>{iconComponents[selectedIcon] || <FolderIcon />}</Box>
            <Box
            
            />
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


   
        <Typography variant="subtitle1" gutterBottom>
          Choose Icon
        </Typography>
        <Box className="grid grid-cols-6">
          {Object.entries(iconComponents).map(([name, icon]) => (
            <Box
              key={name}
              onClick={() => setSelectedIcon(name)}
              sx={{
                cursor: 'pointer',
                borderRadius: '12px',
                p: 1.2,
                transition: 'all 0.2s ease-in-out',
                border: selectedIcon === name ? '2px solid #3b82f6' : '1px solid transparent',
                backgroundColor: selectedIcon === name ? '#e0f2fe' : 'transparent',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                '&:hover': {
                  backgroundColor: '#f1f5f9',
                },
              }}
            >
              {icon}
            </Box>
          ))}
        </Box>

   

    
       <Box mt="auto" display="flex" justifyContent="flex-end" gap={2}>
          <Button
            variant="outlined"
            onClick={onClose}
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
            sx={{
              backgroundColor: !!error ? 'grey.300' : '#3b82f6',
              color: '#fff',
               textTransform: 'none',
              '&:hover': {
                backgroundColor: !!error ? 'grey.300' : '#2563eb',
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
