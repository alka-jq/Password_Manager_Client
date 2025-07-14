import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import TextAlign from '@tiptap/extension-text-align';
import { useEffect, useState, useRef, RefObject } from 'react';
import { ChromePicker, ColorResult } from 'react-color';
import {
  FaBold,
  FaItalic,
  FaUnderline,
  FaListUl,
  FaListOl,
  FaAlignLeft,
  FaAlignRight,
  FaPalette,
  FaFillDrip,
} from 'react-icons/fa';
import { Extension } from '@tiptap/core';

const BackgroundColor = Extension.create({
  name: 'backgroundColor',
  addOptions() {
    return {
      types: ['textStyle'],
    };
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          backgroundColor: {
            default: null,
            parseHTML: (element: HTMLElement) => element.style.backgroundColor || null,
            renderHTML: (attributes: Record<string, any>) => {
              if (!attributes.backgroundColor) return {};
              return {
                style: `background-color: ${attributes.backgroundColor}`,
              };
            },
          },
        },
      },
    ];
  },
});

export default function Tiptap() {
  const [content, setContent] = useState('');
  const [showTextColorPicker, setShowTextColorPicker] = useState(false);
  const [showBgColorPicker, setShowBgColorPicker] = useState(false);
  const [activeButtons, setActiveButtons] = useState<string[]>([]);

  const colorBtnRef: RefObject<HTMLDivElement> = useRef(null);
  const bgColorBtnRef: RefObject<HTMLDivElement> = useRef(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: false,
        orderedList: false,
      }),
      Underline,
      TextStyle,
      Color,
      BulletList,
      OrderedList,
      TextAlign.configure({ types: ['paragraph'] }),
      BackgroundColor,
    ],
    content: '',
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
  });

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        colorBtnRef.current &&
        !colorBtnRef.current.contains(e.target as Node) &&
        bgColorBtnRef.current &&
        !bgColorBtnRef.current.contains(e.target as Node)
      ) {
        setShowTextColorPicker(false);
        setShowBgColorPicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!editor) return null;

  const toggleButtonActive = (buttonName: string) => {
    setActiveButtons((prevState) =>
      prevState.includes(buttonName)
        ? prevState.filter((name) => name !== buttonName)
        : [...prevState, buttonName]
    );
  };

  const toolbarButtons: {
    icon: JSX.Element;
    action: () => void;
    title: string;
    name: string;
  }[] = [
    {
      icon: <FaBold />,
      action: () => {
        editor.chain().focus().toggleBold().run();
        toggleButtonActive('bold');
      },
      title: 'Bold',
      name: 'bold',
    },
    {
      icon: <FaItalic />,
      action: () => {
        editor.chain().focus().toggleItalic().run();
        toggleButtonActive('italic');
      },
      title: 'Italic',
      name: 'italic',
    },
    {
      icon: <FaUnderline />,
      action: () => {
        editor.chain().focus().toggleUnderline().run();
        toggleButtonActive('underline');
      },
      title: 'Underline',
      name: 'underline',
    },
    {
      icon: <FaListUl />,
      action: () => {
        editor.chain().focus().toggleBulletList().run();
        toggleButtonActive('bulletList');
      },
      title: 'Bullet List',
      name: 'bulletList',
    },
    {
      icon: <FaListOl />,
      action: () => {
        editor.chain().focus().toggleOrderedList().run();
        toggleButtonActive('orderedList');
      },
      title: 'Ordered List',
      name: 'orderedList',
    },
    {
      icon: <FaAlignLeft />,
      action: () => {
        editor.chain().focus().setTextAlign('left').run();
        toggleButtonActive('alignLeft');
      },
      title: 'Align Left',
      name: 'alignLeft',
    },
    {
      icon: <FaAlignRight />,
      action: () => {
        editor.chain().focus().setTextAlign('right').run();
        toggleButtonActive('alignRight');
      },
      title: 'Align Right',
      name: 'alignRight',
    },
  ];

  return (
    <div className="max-w-[800px] mx-auto p-4">
      <div className="border border-gray-300 rounded-lg p-4 bg-gray-50 shadow-sm">
        <EditorContent
          editor={editor}
          className="outline-none focus:outline-none focus:ring-0 focus:border-none min-h-[150px] font-sans"
        />
      </div>

      <div className="mt-4 flex flex-wrap items-center bg-gray-50 border border-gray-300 rounded-lg p-3 shadow-sm">
        {toolbarButtons.map(({ icon, action, title, name }, i) => (
          <button
            key={i}
            title={title}
            className={`p-2 mr-2 mb-2 border rounded flex items-center justify-center ${
              activeButtons.includes(name) ? 'bg-blue-500 text-white' : 'bg-gray-100'
            }`}
            onClick={action}
          >
            {icon}
          </button>
        ))}

        {/* Text Color */}
        <div
          ref={colorBtnRef}
          className={`relative p-2 mr-2 mb-2 border rounded flex items-center justify-center cursor-pointer ${
            activeButtons.includes('color') ? 'bg-blue-500 text-white' : 'bg-gray-100'
          }`}
          title="Text Color"
          onClick={() => {
            setShowTextColorPicker(!showTextColorPicker);
            setShowBgColorPicker(false);
            toggleButtonActive('color');
          }}
        >
          <FaPalette />
          {showTextColorPicker && (
            <div className="absolute bottom-[110%] z-10">
              <ChromePicker
                color="#000000"
                onChange={(color: ColorResult) =>
                  editor.chain().focus().setColor(color.hex).run()
                }
              />
            </div>
          )}
        </div>

        {/* Background Color */}
        <div
          ref={bgColorBtnRef}
          className={`relative p-2 mr-2 mb-2 border rounded flex items-center justify-center cursor-pointer ${
            activeButtons.includes('bgColor') ? 'bg-blue-500 text-white' : 'bg-gray-100'
          }`}
          title="Background Color"
          onClick={() => {
            setShowBgColorPicker(!showBgColorPicker);
            setShowTextColorPicker(false);
            toggleButtonActive('bgColor');
          }}
        >
          <FaFillDrip />
          {showBgColorPicker && (
            <div className="absolute bottom-[110%] z-10">
              <ChromePicker
                color="#ffffff"
                onChange={(color: ColorResult) =>
                  editor.chain().focus().setMark('textStyle', {
                    backgroundColor: color.hex,
                  }).run()
                }
              />
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 font-mono whitespace-pre-wrap">
        <strong>Editor Output (HTML):</strong>
        <div className="bg-gray-100 p-2 mt-1">{content}</div>
      </div>
    </div>
  );
}
