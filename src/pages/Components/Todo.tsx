import React, { useEffect, useRef, useState } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { FiPlus } from 'react-icons/fi';
import { GoSearch } from 'react-icons/go';
import { IoIosCheckboxOutline } from 'react-icons/io';
import { MdOpenInNew, MdPushPin } from 'react-icons/md';
import { RxCross1 } from 'react-icons/rx';

interface TodoProps {
  onclick: () => void;
}

interface Task {
  title: string;
  textarea: string;
}

const Todo: React.FC<TodoProps> = ({ onclick }) => {
  const [more, setMore] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showForm, setShowForm] = useState(true);
  const [editingTask, setEditingTask] = useState<number | null>(null);
  const [currentTaskIndex, setCurrentTaskIndex] = useState<number | null>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const title = (form.elements.namedItem('title') as HTMLInputElement).value;
    const textarea = (form.elements.namedItem('textarea') as HTMLTextAreaElement).value;

    if (title && textarea) {
      setTasks([...tasks, { title, textarea }]);
      form.reset();
      setShowForm(false);
    }
  };

  const handleChange = (index: number, field: keyof Task, value: string) => {
    const updatedTasks = [...tasks];
    updatedTasks[index] = { ...updatedTasks[index], [field]: value };
    setTasks(updatedTasks);
  };

  const handleEditClick = (index: number) => {
    setEditingTask(index);
  };

  const handleDoneClick = () => {
    setEditingTask(null);
  };

  const handleDelete = (index: number) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
    setMore(false);
  };

  const handleMoreClick = (index: number) => {
    setCurrentTaskIndex(index);
    setMore(!more);
  };

   const ref = useRef<HTMLDivElement>(null);
  
  
      useEffect(() => {
          const handler = (e:any) => {
              if (ref.current && !ref.current.contains(e.target)) onclick();
          };
          document.addEventListener("mousedown", handler);
          return () => document.removeEventListener("mousedown", handler);
      }, []);

  return (
    <div ref={ref} className="w-72 h-[90vh] rounded-2xl bg-[#fff] settingAnimation">
      <div className="px-6 py-2 flex  items-center justify-between">
        <div>
          <h2 className="text-[12px] text-[#5f6368]">KEEP</h2>
          <h3 className="text-[#3c4043] text-[16px] font-semibold">Notes</h3>
        </div>
        <div className="flex gap-3 text-[#5f6368]">
          <button className="text-lg"><GoSearch /></button>
          <button className="text-lg"><MdOpenInNew /></button>
          <button className="text-lg" onClick={onclick}><RxCross1 /></button>
        </div>
      </div>

      <div>
        {showForm && (
          <iframe
            src="https://keep-notes-umber-chi.vercel.app/"
            className="h-[90vh] w-full"
            title="Keep Notes"
          />
        )}

        {/* Uncomment if using custom note input form */}
        {/*
        {showForm && (
          <form className='pt-4' onSubmit={handleSubmit}>
            <div className="border rounded-xl px-4">
              <div className="flex w-full justify-between">
                <input
                  name="title"
                  type="text"
                  placeholder="Title"
                  className="py-2 focus:outline-none"
                />
                <div className="flex gap-2 items-center">
                  <button type="button" onClick={() => setMore(!more)}>
                    <BsThreeDotsVertical />
                  </button>
                  <button type="button">
                    <MdPushPin />
                  </button>
                </div>
              </div>
              <div>
                <textarea
                  name="textarea"
                  placeholder="Take a note..."
                  className="w-full focus:outline-none resize-none text-base"
                />
                <div className="pb-3 flex w-full justify-end">
                  <button type="submit">Done</button>
                </div>
              </div>
            </div>
          </form>
        )}
        */}
      </div>
    </div>
  );
};

export default Todo;
