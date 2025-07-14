import { getColorFromString } from '@/utils/getColorFromString';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Task {
  id: number;
  title: string;
  email: string;
  password: string;
  totp: string;
  websites: string[];
  note: string;
  created_at: string
  status?: '' | 'complete' | 'important' | 'trash';
}

interface TaskState {
  tasks: Task[];
  selectedTab: string;
  searchTerm: string;
  editTask: Task | null;
  searching: boolean;
  isModalOpen: boolean;
  modalMode: 'add' | 'edit';
}

const getOrdinal = (n: number): string => {
  if (n > 3 && n < 21) return 'th';
  switch (n % 10) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
};

const getDate = () => {
  const today = new Date();
  const day = today.getDate();
  const month = today.toLocaleString('default', { month: 'long' });
  const year = today.getFullYear();
  return `${day}${getOrdinal(day)} ${month}, ${year}`;
};

const initialState: TaskState = {
  tasks: [],
  selectedTab: '',
  searchTerm: '',
  editTask: null,
  searching: false,
  isModalOpen: false,
  modalMode: 'add',
};

const taskSlice = createSlice({
  name: 'task',
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<Omit<Task, 'id' | 'created_at' | 'date' | 'assigneeColor'>>) => {
      const newId = state.tasks.length ? Math.max(...state.tasks.map(t => t.id)) + 1 : 1;
      const now = new Date();
      const assigneeColor = getColorFromString(action.payload.title); // Using title for color generation

      const newTask: Task = {
        ...action.payload,
        id: newId,

      };

      state.tasks.unshift(newTask);
    },

    editTask: (state, action: PayloadAction<{ id: number; updates: Partial<Task> }>) => {
      const { id, updates } = action.payload;
      const index = state.tasks.findIndex(t => t.id === id);
      if (index !== -1) {
        state.tasks[index] = { ...state.tasks[index], ...updates };
      }
    },

    deleteTask: (state, action: PayloadAction<{ id: number; permanent?: boolean }>) => {
      const { id, permanent } = action.payload;
      if (permanent) {
        state.tasks = state.tasks.filter(task => task.id !== id);
      } else {
        const task = state.tasks.find(t => t.id === id);
        if (task) task.status = 'trash';
      }
    },

    restoreTask: (state, action: PayloadAction<number>) => {
      const task = state.tasks.find(t => t.id === action.payload);
      if (task) task.status = '';
    },

    toggleComplete: (state, action: PayloadAction<number>) => {
      const task = state.tasks.find(t => t.id === action.payload);
      if (task) {
        task.status = task.status === 'complete' ? '' : 'complete';
      }
    },

    toggleImportant: (state, action: PayloadAction<number>) => {
      const task = state.tasks.find(t => t.id === action.payload);
      if (task) {
        task.status = task.status === 'important' ? '' : 'important';
      }
    },

    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },

    setSelectedTab: (state, action: PayloadAction<string>) => {
      state.selectedTab = action.payload;
    },

    setEditTask: (state, action: PayloadAction<Task | null>) => {
      state.editTask = action.payload;
    },

    setTasksFromStorage: (state, action: PayloadAction<Task[]>) => {
      state.tasks = action.payload;
    },

    setSearchingData: (state, action: PayloadAction<boolean>) => {
      state.searching = action.payload;
    },

    // Modal control
    openAddModal: (state) => {
      state.modalMode = 'add';
      state.editTask = null;
      state.isModalOpen = true;
    },

    openEditModal: (state, action: PayloadAction<Task>) => {
      state.modalMode = 'edit';
      state.editTask = action.payload;
      state.isModalOpen = true;
    },

    closeModal: (state) => {
      state.isModalOpen = false;
      state.editTask = null;
    },
  },
});

export const {
  addTask,
  editTask,
  deleteTask,
  restoreTask,
  toggleComplete,
  toggleImportant,
  setSearchTerm,
  setSelectedTab,
  setEditTask,
  setTasksFromStorage,
  setSearchingData,
  openAddModal,
  openEditModal,
  closeModal
} = taskSlice.actions;

export default taskSlice.reducer;