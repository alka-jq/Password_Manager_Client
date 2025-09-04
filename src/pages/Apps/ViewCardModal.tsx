import React, { useState, useEffect, useRef } from 'react';
import {
  CreditCard, CalendarDays, Lock, Eye, EyeOff,
  FileText, Info, Paperclip, LinkIcon, X, User
} from 'lucide-react';
import apiClient from '@/service/apiClient';
import { useDispatch, useSelector } from "react-redux"
import { fetchAlldata } from '../../store/Slices/TableSlice';
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

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCardDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiClient.get(`/api/password/items/${item.id}`);
        const data = await response.data;

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
            expirationDate: formattedDate,
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
      let formattedExpirationDate = '';
      if (details.expirationDate) {
        const [month, year] = details.expirationDate.split('/');
        const fullYear = parseInt(year.length === 2 ? `20${year}` : year);
        formattedExpirationDate = new Date(fullYear, parseInt(month) - 1, 1).toISOString();
      }

      const payload = {
        title: details.title,
        name_on_card: details.nameOnCard,
        card_number: details.cardNumber,
        expiration_date: formattedExpirationDate,
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
      dispatch(fetchAlldata());
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
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              {/* =========Card Name=== */}
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium">
                <User className="w-4 h-4" />
                Name on Card
              </div>
              {editMode ? (
                <input
                  type="text"
                  className="ml-6 w-full p-2 rounded border dark:bg-gray-900 dark:text-white"
                  value={details.nameOnCard}
                  onChange={(e) =>
                    setDetails((prev: any) => ({ ...prev, nameOnCard: e.target.value }))
                  }
                />
              ) : (
                <span className="ml-6 text-gray-600 dark:text-gray-400">
                  {details.nameOnCard || "Not provided"}
                </span>
              )}
            </div>
            {/* =========================== */}

            {/* ==========================Card Number========================== */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium">
                <CreditCard className="w-4 h-4" />
                Card Number
              </div>
              {editMode ? (
                <input
                  type="text"
                  className="ml-6 w-full p-2 rounded border dark:bg-gray-900 dark:text-white"
                  value={details.cardNumber}
                  onChange={(e) =>
                    setDetails((prev: any) => ({ ...prev, cardNumber: e.target.value }))
                  }
                />
              ) : (
                <span className="ml-6 text-gray-600 dark:text-gray-400 font-mono tracking-wide">
                  {details.cardNumber}
                </span>
              )}
            </div>
            {/* ============================================================= */}


            {/* =============Expiration Date================ */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium">
                <CalendarDays className="w-4 h-4" />
                Expiration Date
              </div>
              {editMode ? (
                <input
                  type="text"
                  className="ml-6 w-full p-2 rounded border dark:bg-gray-900 dark:text-white"
                  value={details.expirationDate}
                  onChange={(e) =>
                    setDetails((prev: any) => ({ ...prev, expirationDate: e.target.value }))
                  }
                />
              ) : (
                <span className="ml-6 text-gray-600 dark:text-gray-400">
                  {details.expirationDate || "Not provided"}
                </span>
              )}
            </div>
            {/* ============================================*/}

            {/* ===========================Sensitive Field======================== */}
            {editMode ? (
              <input
                type="text"
                className="ml-6 w-40 p-2 rounded border dark:bg-gray-900 dark:text-white"
                value={details.securityCode}
                onChange={(e) =>
                  setDetails((prev: any) => ({ ...prev, securityCode: e.target.value }))
                }
              />
            ) : (
              <SensitiveField
                isVisible={showSecurityCode}
                value={details.securityCode}
                onToggle={() => setShowSecurityCode(prev => !prev)}
              />
            )}
            {/* ============================================================= */}
          </div>

          {/* ====================================Note====================================== */}
          <div className="space-y-2 md:col-span-2">
            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium">
              <FileText className="w-4 h-4" />
              Note
            </div>
            {editMode ? (
              <textarea
                className="ml-6 w-full p-2 rounded border dark:bg-gray-900 dark:text-white"
                value={details.note}
                rows={3}
                onChange={(e) =>
                  setDetails((prev: any) => ({ ...prev, note: e.target.value }))
                }
              />
            ) : (
              <span className="ml-6 text-gray-600 dark:text-gray-400">{details.note || "Not provided"}</span>
            )}
          </div>
          {/* ==================================================================================== */}




          {/* ========================Dynamic field======================== */}
          {details.dynamicFields?.length > 0 && (
            <div className="space-y-2 pt-1">
              <Label icon={<Info className="w-4 h-4" />} text="Additional Fields" />
              <div className="grid grid-cols-1 gap-2 ml-1">
                {details.dynamicFields.map((field: any, i: number) => (
                  <div key={i} className="bg-gray-50 dark:bg-gray-900/50 p-2 rounded-lg">
                    <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">{field.id}</div>
                    {editMode ? (
                      <input
                        type="text"
                        className="w-full mt-1 p-1 rounded border dark:bg-gray-800 dark:text-white"
                        value={field.value}
                        onChange={(e) => {
                          const updatedFields = [...details.dynamicFields];
                          updatedFields[i].value = e.target.value;
                          setDetails((prev: any) => ({ ...prev, dynamicFields: updatedFields }));
                        }}
                      />
                    ) : (
                      <div className="text-gray-800 dark:text-gray-200 mt-0.5 break-words">{field.value}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* ===================================== */}
          {/* {details.attachments?.length > 0 && (
            <div className="space-y-2 pt-1">
              <Label icon={<Paperclip className="w-4 h-4" />} text={`Attachments (${details.attachments.length})`} />
              <div className="ml-1 space-y-1">
                {details.attachments.map((attachment: string, i: number) => (
                  <div key={i} className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                    <LinkIcon className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer text-xs break-all">{attachment}</span>
                  </div>
                ))}
              </div>
            </div>
          )} */}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center px-5 py-3 border-t border-gray-200 dark:border-gray-800 bg-[#f9fafb] dark:bg-[#2a2b30] rounded-b-2xl">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Last updated: {new Date().toLocaleDateString()}
          </div>

          {editMode ? (
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-all shadow-md hover:shadow-lg"
            >
              Save
            </button>
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
  );
};

export default ViewCardModal;




function Field({
  label,
  value,
  icon,
  placeholder = "Not provided",
  isSensitive = false,
  fullWidth = false,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  placeholder?: string;
  isSensitive?: boolean;
  fullWidth?: boolean;
}) {
  const displayValue = value?.trim() || placeholder;
  const isEmpty = !value?.trim();

  return (
    <div className={`space-y-1 ${fullWidth ? 'md:col-span-2' : ''}`}>
      <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium">
        {icon}
        {label}
      </div>
      <span className={`ml-6 break-all ${isEmpty ? 'text-gray-400 dark:text-gray-600' : 'text-gray-600 dark:text-gray-400'} ${isSensitive && !isEmpty ? 'font-mono tracking-wide' : ''}`}>
        {isSensitive && !isEmpty ? '•••• •••• •••• ••••' : displayValue}
      </span>
    </div>
  );
}

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
