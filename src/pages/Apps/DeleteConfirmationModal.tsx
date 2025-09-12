import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  TextField,
  Alert
} from '@mui/material';
import { Warning } from '@mui/icons-material';

interface DeleteConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  vaultName: string;
}

export const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  open,
  onClose,
  onConfirm,
  vaultName,
}) => {
  const [confirmationText, setConfirmationText] = useState('');
  const [error, setError] = useState(false);

  const handleConfirm = () => {
    if (confirmationText === vaultName) {
      onConfirm();
      setConfirmationText('');
      setError(false);
    } else {
      setError(true);
    }
  };

  const handleClose = () => {
    onClose();
    setConfirmationText('');
    setError(false);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '20px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden',
          border: '1px solid',
          borderColor: 'divider',
        },
      }}
      BackdropProps={{
        sx: {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(8px)',
        },
      }}
    >
      <DialogTitle
        sx={{
          bgcolor: 'background.paper',
          color: 'text.primary',
          px: 3,
          py: 2.5,
          fontSize: '1.25rem',
          fontWeight: 600,
          borderBottom: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <Warning sx={{ fontSize: '1.5rem', color: 'error.main' }} />
        Delete Cell "{vaultName}"?
      </DialogTitle>

      <DialogContent sx={{ bgcolor: 'background.paper', px: 3, py: 2.5 }}>
        <Typography variant="body1" sx={{ mb: 2, color: 'text.secondary' }}>
          Cell "{vaultName}" and all its items will be permanently deleted. You cannot undo this action.
        </Typography>

        <Box sx={{ mt: 3 }}>
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
            Confirm cell name
          </Typography>
          <Typography variant="body2" sx={{ mb: 1.5, color: 'text.secondary' }}>
            Retype "{vaultName}" to confirm deletion
          </Typography>
          <TextField
            fullWidth
            value={confirmationText}
            onChange={(e) => {
              setConfirmationText(e.target.value);
              setError(false);
            }}
            error={error}
            helperText={error ? "Vault name doesn't match" : ''}
            variant="outlined"
            size="small"
            autoComplete="off"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
                '&.Mui-focused fieldset': {
                  borderColor: 'primary.main',
                },
              },
            }}
          />
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          bgcolor: 'background.paper',
          px: 3,
          py: 2.5,
          borderTop: '1px solid',
          borderColor: 'divider',
          justifyContent: 'space-between',
        }}
      >
        <Button
          onClick={handleClose}
          color="primary"
          sx={{
            textTransform: 'none',
            fontWeight: 500,
            borderRadius: '8px',
            px: 3,
            py: 1,
            '&:hover': {
              backgroundColor: 'primary.light',
            },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          color="error"
          variant="contained"
          disabled={confirmationText !== vaultName}
          sx={{
            textTransform: 'none',
            fontWeight: 500,
            borderRadius: '8px',
            px: 3,
            py: 1,
            '&:hover': {
              backgroundColor: 'error.dark',
            },
            '&:disabled': {
              backgroundColor: 'action.disabledBackground',
              color: 'action.disabled',
            },
          }}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};