import React, { useEffect, useState } from 'react';
import { decryptFile } from '@/utils/attachments-encryption';

// Icons for known file types
import ImagePlaceholder from '@/assets/images/UB_Logos/imagePlaceholderImage.png';
import sheetIcon from '@/assets/images/UB_Logos/attachement-docs.png';
import pdfIcon from '@/assets/images/UB_Logos/attachement-pdf.png';
import docIcon from '@/assets/images/UB_Logos/attachement-form.png';
import unknownIcon from '@/assets/images/UB_Logos/attachement-docs.png';

// Type for a single attachment
interface Attachment {
  name: string;
  encryptedData: string;
  type: string; // MIME type like 'image/png', 'application/pdf', etc.
}

// Props for the component
interface ImageFileProps {
  attachments: Attachment[];
}

// Utility to determine appropriate icon based on file type
function getFileIcon(fileName: string, mimeType: string): string {
  const ext = fileName.toLowerCase().split('.').pop() || '';

  if (mimeType.startsWith('image/') || ['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(ext)) {
    return ''; // Real image will be shown
  }

  if (mimeType.includes('pdf') || ext === 'pdf') return pdfIcon;
  if (['xls', 'xlsx', 'csv'].includes(ext)) return sheetIcon;
  if (['doc', 'docx', 'txt'].includes(ext)) return docIcon;

  return unknownIcon;
}

// Main component
export const ImageFile: React.FC<ImageFileProps> = ({ attachments }) => {
  const [decryptedAttachments, setDecryptedAttachments] = useState<
    { name: string; url: string; type: string }[]
  >([]);

  useEffect(() => {
    const decryptAll = async () => {
      const results = await Promise.all(
        attachments.map(async (file) => {
          try {
            const url = await decryptFile(file.encryptedData);
            return {
              name: file.name,
              url: url || ImagePlaceholder,
              type: file.type
            };
          } catch (err) {
            console.error(`Failed to decrypt file ${file.name}`, err);
            return {
              name: file.name,
              url: ImagePlaceholder,
              type: file.type
            };
          }
        })
      );
      setDecryptedAttachments(results);
    };

    if (attachments?.length > 0) decryptAll();
  }, [attachments]);

  return (
    <div className="gap-2 flex items-center flex-wrap">
      {decryptedAttachments.map((file, idx) => {
        const isImage = file.type.startsWith('image/');
        const icon = isImage ? file.url : getFileIcon(file.name, file.type);

        return (
          <div className="">
            <button
              key={idx}
              className="flex items-center gap-1 border border-gray-300 rounded-xl hover:bg-gray-200 px-2 py-1 text-gray-500 hover:border-gray-400"
            >
              <img src={icon} className="w-4 h-4 object-contain" alt="file icon" />
              <div className=" w-8 addellipsis"> {file.name}</div>
             
            </button>
            
          </div>
        );
      })}
    </div>
  );
};
