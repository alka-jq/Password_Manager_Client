import React, { useState, useEffect } from 'react';
import {
  Home, Briefcase, Gift, Store, Heart, Clock, Grid, Settings, Users, Ghost,
  ShoppingCart, Leaf, Shield, Circle, CreditCard, Fish, Smile, Lock, UserCheck, Star,
  Flame, Wallet, Bookmark, IceCream, Laptop, BookOpen, Infinity, FileText,
  X
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
  Home: <Home size={20} />, Briefcase: <Briefcase size={20} />, Gift: <Gift size={20} />, 
  Store: <Store size={20} />, Heart: <Heart size={20} />, Clock: <Clock size={20} />, 
  Grid: <Grid size={20} />, Settings: <Settings size={20} />, Users: <Users size={20} />, 
  Ghost: <Ghost size={20} />, ShoppingCart: <ShoppingCart size={20} />, Leaf: <Leaf size={20} />,
  Shield: <Shield size={20} />, Circle: <Circle size={20} />, CreditCard: <CreditCard size={20} />, 
  Fish: <Fish size={20} />, Smile: <Smile size={20} />, Lock: <Lock size={20} />, 
  UserCheck: <UserCheck size={20} />, Star: <Star size={20} />, Flame: <Flame size={20} />, 
  Wallet: <Wallet size={20} />, Bookmark: <Bookmark size={20} />, IceCream: <IceCream size={20} />,
  Laptop: <Laptop size={20} />, BookOpen: <BookOpen size={20} />, Infinity: <Infinity size={20} />, 
  FileText: <FileText size={20} />,
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
  const [isTouched, setIsTouched] = useState(false);
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null);

  const isTitleValid = title.trim() !== '';

  useEffect(() => {
    if (editVault) {
      setTitle(editVault.name);
      setSelectedIcon(editVault.icon);
      setSelectedColor(editVault.color);
    } else {
      setTitle('');
      setSelectedIcon('Home');
      setSelectedColor(colorOptions[0]);
    }
    setIsTouched(false);
  }, [editVault, open]);

  const handleSubmit = () => {
    if (!isTitleValid) {
      setIsTouched(true);
      return;
    }
    
    if (editVault && onEdit) {
      onEdit(editVault.id, title, selectedIcon, selectedColor);
    } else {
      onCreate(title, selectedIcon, selectedColor);
    }
    onClose();
  };

  const handleClose = () => {
    setIsTouched(false);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-30 transition-opacity"
      />
      
      {/* Drawer */}
      <div className="absolute inset-y-0 right-0 max-w-full flex">
        <div className="relative w-screen max-w-md">
          <div className="h-full flex flex-col bg-white shadow-xl overflow-y-auto">
            <div className="p-6 flex flex-col h-full">
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  {editVault ? 'Edit Cell' : 'Create Cell'}
                </h2>
                <button
                  onClick={handleClose}
                  className="rounded-lg p-1.5 hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Title Field */}
              <div className="mb-6">
                <div className="flex items-center mb-2">
                  <div 
                    className="mr-3 flex items-center justify-center"
                    style={{ color: selectedColor }}
                  >
                    {iconComponents[selectedIcon]}
                  </div>
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide flex items-center">
                    CELL NAME <span className="text-red-500 ml-1">*</span>
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      setIsTouched(true);
                    }}
                    placeholder="Enter a name for your cell"
                    className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-offset-1 pr-10 text-gray-800 ${
                      isTouched && !isTitleValid
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                        : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200'
                    }`}
                    style={isTouched && !isTitleValid ? {} : { borderColor: selectedColor }}
                  />
                  
                  
                </div>               
              </div>

              {/* Color Picker */}
              <div className="mb-6">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2 block">
                  COLOR
                </span>
                <div className="flex flex-wrap gap-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-8 h-8 rounded-lg transition-transform hover:scale-110 ${
                        selectedColor === color ? 'ring-2 ring-offset-2' : ''
                      }`}
                      style={{ 
                        backgroundColor: color,
                        border: selectedColor === color ? '2px solid white' : 'none',
                        outline: selectedColor === color ? `2px solid ${color}` : 'none'
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Icon Picker */}
              <div className="mb-6">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2 block">
                  ICON
                </span>
                <div className="grid grid-cols-6 gap-2">
                  {Object.entries(iconComponents).map(([name, icon]) => (
                    <div key={name} className="relative group">
                      <button
                        onClick={() => setSelectedIcon(name)}
                        onMouseEnter={() => setHoveredIcon(name)}
                        onMouseLeave={() => setHoveredIcon(null)}
                        className={`p-3 rounded-xl flex items-center justify-center transition-all transform ${
                          selectedIcon === name 
                            ? 'bg-opacity-10 border-2 scale-105' 
                            : 'border-2 border-transparent text-gray-500 hover:bg-gray-100'
                        } ${hoveredIcon === name ? 'scale-110' : 'scale-100'}`}
                        style={{
                          backgroundColor: selectedIcon === name ? `${selectedColor}1a` : '',
                          borderColor: selectedIcon === name ? `${selectedColor}4d` : 'transparent',
                          color: selectedIcon === name ? selectedColor : '',
                          transition: 'transform 0.2s ease, background-color 0.2s ease'
                        }}
                      >
                        {icon}
                      </button>
                      
                      {/* Tooltip */}
                      <div className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 
                        text-xs font-medium text-white bg-gray-800 rounded-md opacity-0 group-hover:opacity-100 
                        transition-opacity duration-200 pointer-events-none z-10 whitespace-nowrap`}>
                        {name}
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 
                          border-transparent border-t-gray-800"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer Buttons - Right Aligned */}
              <div className="mt-auto pt-4 flex flex-col sm:flex-row gap-3 justify-end">
                <button
                  onClick={handleClose}
                  className="px-4 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-4 py-3 text-white rounded-xl font-medium transition-all hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
                  style={{ backgroundColor: selectedColor }}
                  disabled={!isTitleValid}
                >
                  {editVault ? 'Save Changes' : 'Create Cell'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateVaultDrawer;