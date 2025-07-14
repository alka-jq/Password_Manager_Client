import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

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
  return (
  <Dialog
  open={open}
  onClose={onClose}
  BackdropProps={{
    sx: {
      backgroundColor: 'rgba(0, 0, 0, 0.2)', // semi-transparent dark overlay
    },
  }}
  PaperProps={{
    sx: {
      backgroundColor: 'transparent', // transparent dialog surface
      boxShadow: 'none',
    },
  }}
>
  <DialogTitle
    sx={{
      bgcolor: 'background.paper',
      color: 'text.primary',
      borderTopLeftRadius: 8,
      borderTopRightRadius: 8,
      px: 3,
      py: 2,
    }}
  >
    Delete Cell
  </DialogTitle>

  <DialogContent
    sx={{
      bgcolor: 'background.paper',
      color: 'text.primary',
      px: 3,
      py: 2,
    }}
  >
    <p>Are you sure you want to delete the cell "{vaultName}"? This action cannot be undone.</p>
  </DialogContent>

  <DialogActions
    sx={{
      bgcolor: 'background.paper',
      px: 3,
      py: 2,
      borderBottomLeftRadius: 8,
      borderBottomRightRadius: 8,
    }}
  >
    <Button onClick={onClose} color="primary" sx={{ textTransform: 'none' }}>
      Cancel
    </Button>
    <Button onClick={onConfirm} color="error" variant="contained" sx={{ textTransform: 'none' }}>
      Delete
    </Button>
  </DialogActions>
</Dialog>

  );
};