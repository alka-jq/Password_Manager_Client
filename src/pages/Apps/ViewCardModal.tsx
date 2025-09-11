import React, { useState, useEffect, useRef } from 'react';
import {
  CreditCard, CalendarDays, Lock, Eye, EyeOff,
  FileText, Info, Paperclip, LinkIcon, X, User,
  Save, Edit3, Shield, Hash
} from 'lucide-react';
import apiClient from '@/service/apiClient';
import { useDispatch, useSelector } from "react-redux"
import { fetchAlldata, fetchcellIdData } from '../../store/Slices/TableSlice';
import type { AppDispatch } from '@/store';

type TableItem = {
  id: string;
  title: string;
  type: string;
};

type Props = {
  item: TableItem;
  onClose: () => void;
  editMode?: boolean;
};

const ViewCardModal: React.FC<Props> = ({ item, onClose, editMode }) => {
  const dispatch = useDispatch<AppDispatch>()
  const [details, setDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSecurityCode, setShowSecurityCode] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [cellId, setCellId] = useState<string>()
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCardDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiClient.get(`/api/password/items/${item.id}`);
        const data = await response.data;
        const cell = data.item.cell_id
      
        setCellId(cell)
        if (response && data.item) {
          const card = data.item;

          // Format expiration date (YYYY-MM-DD to MM/YY)
          const formattedDate = card.expiration_date
            ? new Date(card.expiration_date).toLocaleDateString('en-US', {
              year: '2-digit',
              month: '2-digit',
            }).replace('/', '/')
            : '';

          const mappedDetails = {
            title: card.title,
            type: card.type,
            nameOnCard: card.name_on_card,
            cardNumber: card.card_number,
            expirationDate: card.expiration_date,
            securityCode: card.security_code,
            pin: card.pin,
            note: card.note || '',
            dynamicFields: [], // You can populate this if needed
            attachments: card.attachments || [],
          };

          setDetails(mappedDetails);
        } else {
          throw new Error(data.message || 'Failed to fetch card details');
        }
      } catch (err: any) {
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    if (item?.id) {
      fetchCardDetails();
    }
  }, [item]);

  const handleSave = async () => {
    if (!details) return;

    setLoading(true);
    setError(null);

    try {
      // Format expiration date to ISO string if it's in MM/YY format
      // let formattedExpirationDate = '';
      // if (details.expirationDate) {
      //   const [month, year] = details.expirationDate.split('/');
      //   const fullYear = parseInt(year.length === 2 ? `20${year}` : year);
      //   formattedExpirationDate = new Date(fullYear, parseInt(month) - 1, 1).toISOString();
      // }

      const payload = {
        title: details.title,
        name_on_card: details.nameOnCard,
        card_number: details.cardNumber,
        expiration_date: details.expiration_date,
        security_code: details.securityCode,
        pin: details.pin,
        attachments: details.attachments || [],
        two_factor_secret: null,
        hidden: false,
        note: details.note || '',
        is_personal: false,
        is_pin: false,
        is_trash: false,
        type: 'card',
      };

      const response = await apiClient.put(`/api/card/edit/${item.id}`, payload);

      console.log("Card updated successfully:", response.data.message);
      onClose(); // Close modal on success
      if (location.pathname === '/all_items') {
        dispatch(fetchAlldata());
      }
      if (cellId) {
        dispatch(fetchcellIdData(cellId));
      }
    } catch (err: any) {
      console.error("Error updating card:", err);
      setError("Failed to update card.");
    } finally {
      setLoading(false);
    }
  };

  if (!details) return <p className="text-center p-4">Loading card details...</p>;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 transition-all backdrop-blur-sm">
      <div
        ref={modalRef}
        className="w-full max-w-2xl max-h-[95vh] flex flex-col overflow-hidden rounded-2xl bg-white dark:bg-[#1e1f24] shadow-xl border border-gray-300 dark:border-gray-800"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-[#f9fafb] to-[#f0f4ff] dark:from-[#2a2b30] dark:to-[#24252a] rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <CreditCard className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold flex items-center gap-2 text-gray-800 dark:text-white">
                <User className="w-5 h-5" />
                {editMode ? (
                  <input
                    type="text"
                    value={details?.title || ''}
                    onChange={(e) =>
                      setDetails((prev: any) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    className="border-b border-gray-400 dark:border-gray-600 bg-transparent focus:outline-none focus:border-blue-500 text-lg font-bold"
                    autoFocus
                  />
                ) : (
                  details?.title || 'Untitled'
                )}
              </h2>
              <span className="text-xs text-gray-500 dark:text-gray-400">{details.type}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-4 space-y-4 text-sm overflow-y-auto flex-1">
          {error && (
            <div className="bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Card Name */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium">
                <User className="w-4 h-4" />
                Name on Card
              </label>
              {editMode ? (
                <div className="relative">
                  <input
                    type="text"
                    className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    value={details.nameOnCard}
                    onChange={(e) =>
                      setDetails((prev: any) => ({ ...prev, nameOnCard: e.target.value }))
                    }
                    placeholder="Enter name on card"
                  />
                </div>
              ) : (
                <span className="ml-6 text-gray-600 dark:text-gray-400">
                  {details.nameOnCard || "Not provided"}
                </span>
              )}
            </div>

            {/* Card Number */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium">
                <CreditCard className="w-4 h-4" />
                Card Number
              </label>
              {editMode ? (
                <div className="relative">
                  <input
                    type="text"
                    className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-mono tracking-wider"
                    value={details.cardNumber}
                    onChange={(e) =>
                      setDetails((prev: any) => ({ ...prev, cardNumber: e.target.value }))
                    }
                    placeholder="1234 5678 9012 3456"
                  />
                </div>
              ) : (
                <span className="ml-6 text-gray-600 dark:text-gray-400 font-mono tracking-wide">
                  {details.cardNumber}
                </span>
              )}
            </div>

            {/* Expiration Date */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium">
                <CalendarDays className="w-4 h-4" />
                Expiration Date
              </label>
              {editMode ? (
                <div className="relative">
                  <input
                    type="text"
                    className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    value={details.expirationDate}
                    onChange={(e) =>
                      setDetails((prev: any) => ({ ...prev, expirationDate: e.target.value }))
                    }
                    placeholder="MM/YY"
                  />
                </div>
              ) : (
                <span className="ml-6 text-gray-600 dark:text-gray-400">
                  {details.expirationDate || "Not provided"}
                </span>
              )}
            </div>

            {/* Security Code */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium">
                <Shield className="w-4 h-4" />
                Security Code
              </label>
              {editMode ? (
                <div className="relative">
                  <input
                    type={showSecurityCode ? "text" : "password"}
                    className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-mono"
                    value={details.securityCode}
                    onChange={(e) =>
                      setDetails((prev: any) => ({ ...prev, securityCode: e.target.value }))
                    }
                    placeholder="•••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSecurityCode(!showSecurityCode)}
                    className="absolute right-3 top-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  >
                    {showSecurityCode ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              ) : (
                <SensitiveField
                  isVisible={showSecurityCode}
                  value={details.securityCode}
                  onToggle={() => setShowSecurityCode(prev => !prev)}
                />
              )}
            </div>

            {/* PIN */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium">
                <Hash className="w-4 h-4" />
                PIN
              </label>
              {editMode ? (
                <div className="relative">
                  <input
                    type={showPin ? "text" : "password"}
                    className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-mono"
                    value={details.pin}
                    onChange={(e) =>
                      setDetails((prev: any) => ({ ...prev, pin: e.target.value }))
                    }
                    placeholder="••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPin(!showPin)}
                    className="absolute right-3 top-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  >
                    {showPin ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              ) : (
                <SensitiveField
                  isVisible={showPin}
                  value={details.pin}
                  onToggle={() => setShowPin(prev => !prev)}
                />
              )}
            </div>
          </div>

          {/* Note */}
          <div className="space-y-2 pt-2">
            <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium">
              <FileText className="w-4 h-4" />
              Note
            </label>
            {editMode ? (
              <textarea
                className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                value={details.note}
                rows={3}
                onChange={(e) =>
                  setDetails((prev: any) => ({ ...prev, note: e.target.value }))
                }
                placeholder="Add any additional notes about this card"
              />
            ) : (
              <span className="ml-6 text-gray-600 dark:text-gray-400">{details.note || "Not provided"}</span>
            )}
          </div>

          {/* Dynamic Fields */}
          {details.dynamicFields?.length > 0 && (
            <div className="space-y-2 pt-4">
              <Label icon={<Info className="w-4 h-4" />} text="Additional Fields" />
              <div className="grid grid-cols-1 gap-3">
                {details.dynamicFields.map((field: any, i: number) => (
                  <div key={i} className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg">
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">{field.id}</label>
                    {editMode ? (
                      <input
                        type="text"
                        className="w-full mt-1 p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        value={field.value}
                        onChange={(e) => {
                          const updatedFields = [...details.dynamicFields];
                          updatedFields[i].value = e.target.value;
                          setDetails((prev: any) => ({ ...prev, dynamicFields: updatedFields }));
                        }}
                      />
                    ) : (
                      <div className="text-gray-800 dark:text-gray-200 mt-1 break-words">{field.value}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center px-5 py-3 border-t border-gray-200 dark:border-gray-800 bg-[#f9fafb] dark:bg-[#2a2b30] rounded-b-2xl">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Last updated: {new Date().toLocaleDateString()}
          </div>

          <div className="flex gap-2">
            {editMode ? (
              <>
                <button
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg transition-all hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-all shadow-md hover:shadow-lg flex items-center gap-2 disabled:opacity-70"
                >
                  <Save className="w-4 h-4" />
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </>
            ) : (
              <button
                onClick={onClose}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-all shadow-md hover:shadow-lg"
              >
                Close
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewCardModal;

function Label({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium">
      {icon}
      {text}
    </div>
  );
}

function SensitiveField({ isVisible, value, onToggle }: { isVisible: boolean; value: string; onToggle: () => void }) {
  return (
    <div className="ml-6 flex items-center gap-2">
      {isVisible ? (
        <span className="text-gray-600 dark:text-gray-400 font-mono">{value || "Not provided"}</span>
      ) : (
        <span className="text-gray-400 dark:text-gray-600 tracking-widest">••••</span>
      )}
      {value && (
        <button
          onClick={onToggle}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          {isVisible ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
      )}
    </div>
  );
}