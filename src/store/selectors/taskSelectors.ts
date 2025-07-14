import { RootState } from '@/store';
import { selectCombinedItems } from './combinedSelector';

export const getCombinedItemCountsByTab = (state: RootState) => {
  const combinedItems = selectCombinedItems(state); 

  return {
    inbox: combinedItems.filter((item) => item.status !== 'trash').length,
    done: combinedItems.filter((item) => item.status === 'complete').length,
    important: combinedItems.filter((item) => item.status === 'important').length,
    trash: combinedItems.filter((item) => item.status === 'trash').length,
  };
};
