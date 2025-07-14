import React, { useEffect, useRef, useState } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { FiExternalLink } from 'react-icons/fi';
import { IoCloseSharp } from 'react-icons/io5';

import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import NativeSelect from '@mui/material/NativeSelect';
import { MdAddTask } from "react-icons/md";
import { MdOutlineStarBorderPurple500 } from "react-icons/md";



interface Task {
  id: number;
  title: string;
  details: string;
  isFocused: boolean;
  date?: number;
}

interface MyTaskProps {
  onclick: () => void;
}

function MyTask({ onclick }: MyTaskProps) {
  const [moretask, setMoretask] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [taskDeletepopup, setTaskDeletepopup] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');
  const [details, setDetails] = useState<string>('Details');
  const [taskSheets, setTaskSheets] = useState<Task[]>([]);
  const [startColor, setStarcolor] = useState<boolean>(false);
  const [selectedSort, setSelectedSort] = useState<string>("My Order");
  const [addTaskOther, setAddTaskOther] = useState<boolean>(false);

  const addNewTaskSheet = () => {
    setTaskSheets((prev: Task[]) => {
      const lastTask = prev[0];
      if (lastTask && (lastTask.title.trim() === "" && lastTask.details.trim() === "")) {
        return prev;
      } else {
        return [{ id: Date.now(), title: "tomato", details: "red", isFocused: false }, ...prev];
      }
    });
  };


  const updateTask = (
    index: number,
    field: keyof Task,
    value: string | boolean | number | undefined
  ) => {
    const newTasks: Task[] = [...taskSheets];
    newTasks[index] = { ...newTasks[index], [field]: value };
    setTaskSheets(newTasks);
  };


  const setFocus = (index: number, isFocused: boolean) => {
    const newTasks = [...taskSheets];
    newTasks[index].isFocused = isFocused;
    setTaskSheets(newTasks);
  };

  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const removeTaskSheet = (index: number) => {
    setTaskSheets((prev) => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsFocused(false);
        console.log('Saved Title:', title);
        console.log('Saved Details:', details);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [title, details]);

  const popupRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current && !popupRef.current.contains(event.target as Node) &&
        triggerRef.current && !triggerRef.current.contains(event.target as Node)
      ) {
        setMoretask(false);
        setTaskDeletepopup(false);
        setAddTaskOther(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="w-72 h-[90vh] rounded-2xl bg-[#fff]">
      <div className="flex justify-between items-center px-3 py-2 border-b">
        <Box sx={{ minWidth: 60 }}>
          <FormControl variant="standard">
            <InputLabel htmlFor="task-select">Task</InputLabel>
            <NativeSelect
              defaultValue="my-tasks"
              inputProps={{
                name: 'task',
                id: 'task-select',
              }}
              className="font-bold"
              disableUnderline

            >
              {/* <div className='flex justify-between items-center px-3 py-2 border-b'> */}
              <option value="starred">Starred</option>
              <option value="my-tasks">My Tasks</option>
              <option value="create-new-list">Create new list</option>
              {/* </div> */}
            </NativeSelect>
          </FormControl>
        </Box>
        <div>
          <button className="hover:bg-[#DCDCDC] transition rounded-full p-2">
            <FiExternalLink size={20} />
          </button>
          <button onClick={onclick} className="hover:bg-[#DCDCDC] transition rounded-full p-2">
            <IoCloseSharp size={20} />
          </button>
        </div>
      </div>
      <div className="w-72 h-[90vh] rounded-2xl bg-[#fff] p-2 space-y-2">
        {/* Header */}
        <div className="flex justify-between px-4 py-3 items-center hover:bg-[#E3F2FD] font-medium cursor-pointer">
          <div
            className="flex gap-3 items-center text-[#094ca8]"
            onClick={addNewTaskSheet}
          >
            <MdAddTask />
            <button>Add a starred task</button>
          </div>
          <BsThreeDotsVertical size={18} />
        </div>

        {/* Task List */}
        <div className="px-2 space-y-2">
          {taskSheets.map((task) => (
            <div
              key={task.id}
              className="flex items-center justify-between bg-[#f1f8ff] rounded p-3 text-sm text-[#202124]"
            >
              {/* Left part: circle and content */}
              <div className="flex items-start space-x-2">
                <div className="w-5 h-5 border rounded-full flex-shrink-0"></div>
                <div>
                  <div className="flex justify-between items-center">
                    <input
                      type="text"
                      defaultValue={task.title}
                      placeholder="Title"
                      className="outline-none bg-transparent text-base font-medium w-full"
                    />
                    <div className="flex items-center space-x-2 ml-2">
                      <BsThreeDotsVertical size={18} />
                      <MdOutlineStarBorderPurple500 size={18} />
                    </div>
                  </div>
                  <input
                    type="text"
                    defaultValue={task.details}
                    placeholder="Details"
                    className="outline-none bg-transparent text-base font-medium"
                  />
                  <div className="flex space-x-2 mt-2">
                    <button className="border rounded-full px-3 py-1 text-sm">Today</button>
                    <button className="border rounded-full px-3 py-1 text-sm">Tomorrow</button>
                    <button className="border rounded-full p-1">
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>



    </div>

  );
}

export default MyTask;
