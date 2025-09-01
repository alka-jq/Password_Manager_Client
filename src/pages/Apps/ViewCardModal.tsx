import React, { useState, useEffect, useRef } from 'react';
import {
  CreditCard, CalendarDays, Lock, Eye, EyeOff,
  FileText, Info, Paperclip, LinkIcon, X, User
} from 'lucide-react';

type TableItem = {
  id: string;
  title: string;
  type: string;
};

type Props = {
  item: TableItem;
};

const ViewCardModal: React.FC<Props> = ({ item }) => {
  const [details, setDetails] = useState<any>(null);
  const [showSecurityCode, setShowSecurityCode] = useState(false);
  const [showPin, setShowPin] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await fetch(`/api/cards/${item.id}`);
        const data = await res.json();
        setDetails(data);
      } catch (err) {
        console.error(err);
        console.log("server error");
      }
    };

    fetchDetails();
  }, [item]);

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
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">{details.title || "Untitled Card"}</h2>
              <span className="text-xs text-gray-500 dark:text-gray-400">{details.type}</span>
            </div>
          </div>
          <button
            onClick={() => setDetails(null)}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-4 space-y-4 text-sm overflow-y-auto flex-1">
          <div className="grid grid-cols-1 gap-4">
            <Field label="Name on Card" value={details.nameOnCard} icon={<User className="w-4 h-4" />} />
            <Field label="Card Number" value={details.cardNumber} icon={<CreditCard className="w-4 h-4" />} isSensitive />
            <Field label="Expiration Date" value={details.expirationDate} icon={<CalendarDays className="w-4 h-4" />} />

            <div className="space-y-1">
              <Label icon={<Lock className="w-4 h-4" />} text="Security Code" />
              <SensitiveField
                isVisible={showSecurityCode}
                value={details.securityCode}
                onToggle={() => setShowSecurityCode(prev => !prev)}
              />
            </div>

            <div className="space-y-1">
              <Label icon={<Lock className="w-4 h-4" />} text="PIN" />
              <SensitiveField
                isVisible={showPin}
                value={details.pin}
                onToggle={() => setShowPin(prev => !prev)}
              />
            </div>
          </div>

          <Field label="Note" value={details.note} icon={<FileText className="w-4 h-4" />} fullWidth />

          {details.dynamicFields?.length > 0 && (
            <div className="space-y-2 pt-1">
              <Label icon={<Info className="w-4 h-4" />} text="Additional Fields" />
              <div className="grid grid-cols-1 gap-2 ml-1">
                {details.dynamicFields.map((field: any, i: number) => (
                  <div key={i} className="bg-gray-50 dark:bg-gray-900/50 p-2 rounded-lg">
                    <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">{field.id}</div>
                    <div className="text-gray-800 dark:text-gray-200 mt-0.5 break-words">{field.value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {details.attachments?.length > 0 && (
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
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center px-5 py-3 border-t border-gray-200 dark:border-gray-800 bg-[#f9fafb] dark:bg-[#2a2b30] rounded-b-2xl">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Last updated: {new Date().toLocaleDateString()}
          </div>
          <button
            onClick={() => setDetails(null)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-all shadow-md hover:shadow-lg"
          >
            Close
          </button>
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
