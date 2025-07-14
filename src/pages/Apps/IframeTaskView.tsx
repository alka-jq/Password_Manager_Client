// import { useState, useEffect } from 'react';
// import { FiCalendar, FiChevronDown, FiChevronRight, FiExternalLink, FiTrash2 } from 'react-icons/fi';
// import Box from '@mui/material/Box';
// import FormControl from '@mui/material/FormControl';
// import { IoCloseSharp } from 'react-icons/io5';
// import IconButton from '@mui/material/IconButton';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import dayjs from 'dayjs';

// interface MyTaskProps {
//     onclick: () => void;
// }

// const IframeTaskView = ({ onclick }: MyTaskProps) => {
//     const [tasks, setTasks] = useState([
//         { id: 1, title: 'Finish UI Layout', tags: ['team'], done: false, date: new Date(), isEditing: false },
//         { id: 2, title: 'Review PR for Tasks', tags: ['update'], done: true, date: new Date(), isEditing: false },
//         { id: 3, title: 'Book Flights', tags: ['low'], done: false, date: new Date(), isEditing: false },
//     ]);
//     const [newTask, setNewTask] = useState('');
//     const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);
//     const [showCompleted, setShowCompleted] = useState(false);

//     const handleAddTask = () => {
//         const trimmed = newTask.trim();
//         if (!trimmed) return;
//         const newTaskItem = {
//             id: Date.now(),
//             title: trimmed,
//             tags: [],
//             done: false,
//             date: new Date(),
//             isEditing: false,
//         };
//         setTasks((prev) => [...prev, newTaskItem]);
//         setNewTask('');
//     };

//     const toggleTaskDone = (id: number) => {
//         setTasks((prev) =>
//             prev.map((t) =>
//                 t.id === id ? { ...t, done: !t.done } : t
//             )
//         );
//     };

//     const handleDateChange = (id: number, newDate: any) => {
//         setTasks((prev) =>
//             prev.map((t) =>
//                 t.id === id ? { ...t, date: newDate?.toDate?.() || new Date() } : t
//             )
//         );
//     };

//     const handleDeleteTask = (id: number) => {
//         setTasks((prev) => prev.filter((t) => t.id !== id));
//     };

//     const startEditing = (id: number) => {
//         setTasks((prev) =>
//             prev.map((t) =>
//                 t.id === id ? { ...t, isEditing: true } : { ...t, isEditing: false }
//             )
//         );
//     };

//     const updateTitle = (id: number, value: string) => {
//         setTasks((prev) =>
//             prev.map((t) =>
//                 t.id === id ? { ...t, title: value } : t
//             )
//         );
//     };

//     const stopEditing = (id: number) => {
//         setTasks((prev) =>
//             prev.map((t) =>
//                 t.id === id ? { ...t, isEditing: false } : t
//             )
//         );
//     };

//     const formatDate = (date: Date) => {
//         return date.toLocaleDateString('en-GB', {
//             day: 'numeric',
//             month: 'long',
//             year: 'numeric',
//         });
//     };

//     useEffect(() => {
//         if (typingTimeout) clearTimeout(typingTimeout);
//         if (newTask.trim() === '') return;
//         const timeout = setTimeout(() => {
//             handleAddTask();
//         }, 1000);
//         setTypingTimeout(timeout);
//     }, [newTask]);

//     const pendingTasks = tasks.filter((t) => !t.done);
//     const completedTasks = tasks.filter((t) => t.done);

//     return (
//         <div className="w-72 h-[90vh] rounded-2xl bg-[#fff] py-4 px-4 shadow-lg dark:shadow-[0_0_10px_rgba(255,255,255,0.05)] flex flex-col">
//             <div className="flex justify-between items-center px-3 py-2 border-b">
//                 <Box sx={{ minWidth: 60 }}>
//                     <FormControl variant="standard">
//                         <h2 className='text-xl font-medium'>Tasks</h2>
//                     </FormControl>
//                 </Box>
//                 <div>
//                     <button className="hover:bg-[#DCDCDC] transition rounded-full p-2">
//                         <FiExternalLink size={20} />
//                     </button>
//                     <button onClick={onclick} className="hover:bg-[#DCDCDC] transition rounded-full p-2">
//                         <IoCloseSharp size={20} />
//                     </button>
//                 </div>
//             </div>

//             <div className="my-4">
//                 <input
//                     type="text"
//                     value={newTask}
//                     onChange={(e) => setNewTask(e.target.value)}
//                     placeholder="Enter new task"
//                     className="w-full border border-[#cac5dd] rounded px-3 py-2 text-sm bg-white dark:bg-[#2b2b2b] focus:outline-none focus:ring-0 focus:border-[#e2def1]"
//                 />
//             </div>

//             <LocalizationProvider dateAdapter={AdapterDayjs}>
//                 <div className="flex-1 overflow-y-auto space-y-2 pb-4">
//                     {pendingTasks.map((task) => (
//                         <div key={task.id} className="bg-gray-100 dark:bg-[#2b2b2b] p-3 rounded">
//                             <div className="flex items-start gap-2">
//                                 <input
//                                     type="checkbox"
//                                     checked={task.done}
//                                     onChange={() => toggleTaskDone(task.id)}
//                                     className="mt-2"
//                                 />
//                                 <div className="flex-1">
//                                     <div className="flex justify-between items-center">
//                                         {task.isEditing ? (
//                                             <input
//                                                 type="text"
//                                                 autoFocus
//                                                 value={task.title}
//                                                 onChange={(e) => updateTitle(task.id, e.target.value)}
//                                                 onBlur={() => stopEditing(task.id)}
//                                                 onKeyDown={(e) => e.key === 'Enter' && stopEditing(task.id)}
//                                                 className="text-sm font-medium w-full bg-transparent border-b border-gray-300 dark:border-gray-600 outline-none"
//                                             />
//                                         ) : (
//                                             <p
//                                                 className={`text-sm font-medium ${task.done ? 'line-through text-gray-400' : ''}`}
//                                                 onClick={() => startEditing(task.id)}
//                                             >
//                                                 {task.title}
//                                             </p>
//                                         )}
//                                         <DatePicker
//                                             value={dayjs(task.date)}
//                                             onChange={(date) => handleDateChange(task.id, date)}
//                                             slots={{
//                                                 openPickerIcon: () => (
//                                                     <FiCalendar className="text-gray-500 dark:text-gray-300 text-sm hover:text-black dark:hover:text-white" />
//                                                 ),
//                                             }}
//                                             slotProps={{
//                                                 textField: {
//                                                     variant: 'standard',
//                                                     sx: { width: 32, padding: 0, minWidth: 0 },
//                                                     InputProps: { disableUnderline: true }, 
//                                                 },
//                                             }}
//                                         />

//                                     </div>
//                                     <div className="text-xs text-gray-500 dark:text-gray-400">
//                                         Created on: {formatDate(task.date)}
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             </LocalizationProvider>

//             {completedTasks.length > 0 && (
//                 <div className="mt-auto pt-4 border-t">
//                     <button
//                         onClick={() => setShowCompleted((prev) => !prev)}
//                         className="flex items-center gap-1 text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2"
//                     >
//                         {showCompleted ? <FiChevronDown /> : <FiChevronRight />}
//                         Completed ({completedTasks.length})
//                     </button>

//                     {showCompleted && (
//                         <div className="space-y-2">
//                             {completedTasks.map((task) => (
//                                 <div
//                                     key={task.id}
//                                     className="bg-gray-100 dark:bg-[#2b2b2b] p-3 rounded"
//                                 >
//                                     <div className="flex items-start gap-2">
//                                         <input
//                                             type="checkbox"
//                                             checked={task.done}
//                                             onChange={() => toggleTaskDone(task.id)}
//                                             className="mt-1"
//                                         />
//                                         <div className="flex-1">
//                                             <div className="flex justify-between items-center">
//                                                 {task.isEditing ? (
//                                                     <input
//                                                         type="text"
//                                                         autoFocus
//                                                         value={task.title}
//                                                         onChange={(e) => updateTitle(task.id, e.target.value)}
//                                                         onBlur={() => stopEditing(task.id)}
//                                                         onKeyDown={(e) => e.key === 'Enter' && stopEditing(task.id)}
//                                                         className="text-sm font-medium w-full bg-transparent border-b border-gray-300 dark:border-gray-600 outline-none"
//                                                     />
//                                                 ) : (
//                                                     <p
//                                                         className="text-sm font-medium line-through text-gray-400"
//                                                         onClick={() => startEditing(task.id)}
//                                                     >
//                                                         {task.title}
//                                                     </p>
//                                                 )}
//                                                 <button
//                                                     onClick={() => handleDeleteTask(task.id)}
//                                                     className="text-red-500 hover:text-red-700"
//                                                 >
//                                                     <FiTrash2 />
//                                                 </button>
//                                             </div>
//                                             <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
//                                                 Completed on: {formatDate(task.date)}
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     )}
//                 </div>
//             )}
//         </div>
//     );
// };

// export default IframeTaskView;




import { useState, useEffect } from 'react';
import { FiCalendar, FiChevronDown, FiChevronRight, FiExternalLink, FiTrash2 } from 'react-icons/fi';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import { IoCloseSharp } from 'react-icons/io5';
import dayjs from 'dayjs';

interface MyTaskProps {
    onclick: () => void;
}

interface Task {
    id: number;
    title: string;
    tags: string[];
    done: boolean;
    date: Date;
    isEditing: boolean;
}

const CustomCalendar = ({ 
    selectedDate, 
    onDateChange, 
    onClose 
}: {
    selectedDate: Date;
    onDateChange: (date: Date) => void;
    onClose: () => void;
}) => {
    const [currentMonth, setCurrentMonth] = useState(dayjs(selectedDate));
    const [selectedDateState, setSelectedDateState] = useState(dayjs(selectedDate));

    const daysInMonth = currentMonth.daysInMonth();
    const firstDayOfMonth = currentMonth.startOf('month').day();
    
    const weeks: (dayjs.Dayjs | null)[][] = [];
    let week: (dayjs.Dayjs | null)[] = [];
    
    // Add empty slots for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
        week.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const date = currentMonth.date(day);
        week.push(date);
        
        if (week.length === 7) {
            weeks.push(week);
            week = [];
        }
    }
    
    // Add empty slots for remaining days in the last week
    if (week.length > 0) {
        while (week.length < 7) {
            week.push(null);
        }
        weeks.push(week);
    }

    const handleDateClick = (date: dayjs.Dayjs) => {
        setSelectedDateState(date);
        onDateChange(date.toDate());
        onClose();
    };

    const goToPreviousMonth = () => {
        setCurrentMonth(currentMonth.subtract(1, 'month'));
    };

    const goToNextMonth = () => {
        setCurrentMonth(currentMonth.add(1, 'month'));
    };

    return (
        <div className="absolute z-50 bg-white dark:bg-[#2b2b2b] border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg p-2 w-64">
            <div className="flex justify-between items-center mb-2">
                <button 
                    onClick={goToPreviousMonth}
                    className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                    &lt;
                </button>
                <div className="font-medium">
                    {currentMonth.format('MMMM YYYY')}
                </div>
                <button 
                    onClick={goToNextMonth}
                    className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                    &gt;
                </button>
            </div>
            
            <div className="grid grid-cols-7 gap-1 mb-2">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                    <div key={day} className="text-center text-xs font-medium text-gray-500 dark:text-gray-400">
                        {day}
                    </div>
                ))}
            </div>
            
            <div className="grid grid-cols-7 gap-1">
                {weeks.map((week, weekIndex) => (
                    <div key={weekIndex} className="contents">
                        {week.map((date, dayIndex) => (
                            <button
                                key={dayIndex}
                                onClick={() => date && handleDateClick(date)}
                                className={`w-8 h-8 rounded-full text-sm flex items-center justify-center
                                    ${date ? 
                                        date.isSame(selectedDateState, 'day') ? 
                                            'bg-blue-500 text-white' : 
                                            'hover:bg-gray-100 dark:hover:bg-gray-700' : 
                                        'opacity-0 cursor-default'
                                    }`}
                                disabled={!date}
                            >
                                {date ? date.date() : ''}
                            </button>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

const IframeTaskView = ({ onclick }: MyTaskProps) => {
    const [tasks, setTasks] = useState<Task[]>([
        { id: 1, title: 'Finish UI Layout', tags: ['team'], done: false, date: new Date(), isEditing: false },
        { id: 2, title: 'Review PR for Tasks', tags: ['update'], done: true, date: new Date(), isEditing: false },
        { id: 3, title: 'Book Flights', tags: ['low'], done: false, date: new Date(), isEditing: false },
    ]);
    const [newTask, setNewTask] = useState('');
    const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);
    const [showCompleted, setShowCompleted] = useState(false);
    const [showCalendarForTask, setShowCalendarForTask] = useState<number | null>(null);

    const handleAddTask = () => {
        const trimmed = newTask.trim();
        if (!trimmed) return;
        const newTaskItem = {
            id: Date.now(),
            title: trimmed,
            tags: [],
            done: false,
            date: new Date(),
            isEditing: false,
        };
        setTasks((prev) => [...prev, newTaskItem]);
        setNewTask('');
    };

    const toggleTaskDone = (id: number) => {
        setTasks((prev) =>
            prev.map((t) =>
                t.id === id ? { ...t, done: !t.done } : t
            )
        );
    };

    const handleDateChange = (id: number, newDate: Date) => {
        setTasks((prev) =>
            prev.map((t) =>
                t.id === id ? { ...t, date: newDate } : t
            )
        );
        setShowCalendarForTask(null);
    };

    const handleDeleteTask = (id: number) => {
        setTasks((prev) => prev.filter((t) => t.id !== id));
    };

    const startEditing = (id: number) => {
        setTasks((prev) =>
            prev.map((t) =>
                t.id === id ? { ...t, isEditing: true } : { ...t, isEditing: false }
            )
        );
    };

    const updateTitle = (id: number, value: string) => {
        setTasks((prev) =>
            prev.map((t) =>
                t.id === id ? { ...t, title: value } : t
            )
        );
    };

    const stopEditing = (id: number) => {
        setTasks((prev) =>
            prev.map((t) =>
                t.id === id ? { ...t, isEditing: false } : t
            )
        );
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    const toggleCalendar = (taskId: number) => {
        setShowCalendarForTask(showCalendarForTask === taskId ? null : taskId);
    };

    useEffect(() => {
        if (typingTimeout) clearTimeout(typingTimeout);
        if (newTask.trim() === '') return;
        const timeout = setTimeout(() => {
            handleAddTask();
        }, 1000);
        setTypingTimeout(timeout);
    }, [newTask]);

    const pendingTasks = tasks.filter((t) => !t.done);
    const completedTasks = tasks.filter((t) => t.done);

    return (
        <div className="w-72 h-[90vh] rounded-2xl bg-[#fff] py-4 shadow-lg dark:shadow-[0_0_10px_rgba(255,255,255,0.05)] flex flex-col relative">
            <div className="flex justify-between items-center px-3 py-2 border-b">
                <Box sx={{ minWidth: 60 }}>
                    <FormControl variant="standard">
                        <h2 className='text-xl font-medium'>Tasks</h2>
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

            <div className="my-4 px-2">
                <input
                    type="text"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    placeholder="Enter new task"
                    className="w-full border border-[#cac5dd] rounded px-3 py-2 text-sm bg-white dark:bg-[#2b2b2b] focus:outline-none focus:ring-0 focus:border-[#e2def1]"
                />
            </div>

            <div className="flex-1 overflow-y-auto px-2 space-y-2 pb-4">
                {pendingTasks.map((task) => (
                    <div key={task.id} className="bg-gray-100 dark:bg-[#2b2b2b] p-3 rounded relative">
                        <div className="flex items-start gap-2">
                            <input
                                type="checkbox"
                                checked={task.done}
                                onChange={() => toggleTaskDone(task.id)}
                                className="mt-2"
                            />
                            <div className="flex-1 ">
                                <div className="flex justify-between items-center">
                                    {task.isEditing ? (
                                        <input
                                            type="text"
                                            autoFocus
                                            value={task.title}
                                            onChange={(e) => updateTitle(task.id, e.target.value)}
                                            onBlur={() => stopEditing(task.id)}
                                            onKeyDown={(e) => e.key === 'Enter' && stopEditing(task.id)}
                                            className="text-sm font-medium w-full bg-transparent border-b border-gray-300 dark:border-gray-600 outline-none"
                                        />
                                    ) : (
                                        <p
                                            className={`text-sm font-medium ${task.done ? 'line-through text-gray-400' : ''}`}
                                            onClick={() => startEditing(task.id)}
                                        >
                                            {task.title}
                                        </p>
                                    )}
                                    <button 
                                        onClick={() => toggleCalendar(task.id)}
                                        className="text-gray-500 dark:text-gray-300 hover:text-black dark:hover:text-white p-1"
                                    >
                                        <FiCalendar className="text-sm" />
                                    </button>
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                    Created on: {formatDate(task.date)}
                                </div>
                            </div>
                        </div>
                        
                        {showCalendarForTask === task.id && (
                            <CustomCalendar
                                selectedDate={task.date}
                                onDateChange={(date) => handleDateChange(task.id, date)}
                                onClose={() => setShowCalendarForTask(null)}
                            />
                        )}
                    </div>
                ))}
            </div>

            {completedTasks.length > 0 && (
                <div className="mt-auto pt-4 px-2 border-t">
                    <button
                        onClick={() => setShowCompleted((prev) => !prev)}
                        className="flex items-center gap-1 text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2"
                    >
                        {showCompleted ? <FiChevronDown /> : <FiChevronRight />}
                        Completed ({completedTasks.length})
                    </button>

                    {showCompleted && (
                        <div className="space-y-2">
                            {completedTasks.map((task) => (
                                <div
                                    key={task.id}
                                    className="bg-gray-100 dark:bg-[#2b2b2b] p-3 rounded"
                                >
                                    <div className="flex items-start gap-2">
                                        <input
                                            type="checkbox"
                                            checked={task.done}
                                            onChange={() => toggleTaskDone(task.id)}
                                            className="mt-1"
                                        />
                                        <div className="flex-1">
                                            <div className="flex justify-between items-center">
                                                {task.isEditing ? (
                                                    <input
                                                        type="text"
                                                        autoFocus
                                                        value={task.title}
                                                        onChange={(e) => updateTitle(task.id, e.target.value)}
                                                        onBlur={() => stopEditing(task.id)}
                                                        onKeyDown={(e) => e.key === 'Enter' && stopEditing(task.id)}
                                                        className="text-sm font-medium w-full bg-transparent border-b border-gray-300 dark:border-gray-600 outline-none"
                                                    />
                                                ) : (
                                                    <p
                                                        className="text-sm font-medium line-through text-gray-400"
                                                        onClick={() => startEditing(task.id)}
                                                    >
                                                        {task.title}
                                                    </p>
                                                )}
                                                <button
                                                    onClick={() => handleDeleteTask(task.id)}
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    <FiTrash2 />
                                                </button>
                                            </div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                Completed on: {formatDate(task.date)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default IframeTaskView;