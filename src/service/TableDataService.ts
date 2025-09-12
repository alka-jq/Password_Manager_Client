// Service file to handle all API calls related to table data management
import apiClient from "./apiClient";

export const getAlldata = async () => {
  try {
    const response = await apiClient.get('/api/filter/all');
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch data');
  }
}

export const getAllCell = async () => {
  try {
    const response = await apiClient.get('/api/password/getCell')
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch data');
  }
}

export const getPersonaldata = async () => {
  try {
    const response = await apiClient.get('/api/password/state/personal')
    return response.data;
  } catch (error) {
    console.error(error)
  }
}

export const getTrashdata = async () => {
  try {
    const response = await apiClient.get('/api/password/state/trash')
    return response.data;
  } catch (error) {

    console.error(error)
  }
}

export const getPindata = async () => {
  try {
    const response = await apiClient.get('/api/password/state/pin')
    return response.data
  } catch (error) {
    console.error(error)
  }
}



// POST API for password Generator
export const generatePasswordAPI = async (
  type: "advanced" | "memorable" | "random" = "advanced",
  options: any = {}
) => {
  try {
    const token = localStorage.getItem("authToken") // or however you're storing it

    const config: any = {
      headers: {},
    };

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    const response = await apiClient.post(
      "/api/password/generate",
      {
        type,
        options,
      },
      config
    );

    return response.data.password.value;
  } catch (err) {
    console.error(err);
    throw err; // Re-throw to handle in component
  }
}

// / Post API Call For Add Login Credentials
export const addLoginCredentials = async (formData: FormData) => {
  try {
    const response = await apiClient.post('/api/login-credentials/add', formData,{
      headers: { 
        'Content-Type': 'multipart/form-data'
       }
    });
    return response.data;
  } catch (error) {
    console.error('Failed to add login credentials:', error);
    throw new Error('Failed to add login credentials');
  }
};


export const deletePasswordById = async (id: string,) => {
  try {
    const response = await apiClient.delete(`/api/password/delete/${id}`, {
    });
    return response.data;
  } catch (error: any) {
    console.error(`Failed to delete password with ID ${id}:`, error.response?.data || error.message);
    throw new Error('Permanent delete by ID failed');
  }
};

export const bulkDeletePasswords = async (ids: string[]) => {
  try {
    const response = await apiClient.delete('/api/password/delete-multiple', {
      data: { ids },  // <-- update here: use 'ids' instead of 'id'
    });
    return response.data;
  } catch (error: any) {
    console.error('Bulk delete failed:', error.response?.data || error.message);
    throw new Error('Bulk delete failed');
  }
};


// Soft Delete API Call
export const softDeleteItems = async (ids: string[]) => {
  const response = await apiClient.patch('/api/password/item/softDelete', {
    id: ids,
  });

  return response.data;
}

//Restore API Call for both by ID and by all
export const restorePasswords= async (ids: string[]) => {
  try {
    const response = await apiClient.patch('/api/password/item/restore', {
      id: ids,
     });
    return response.data;
  } catch (error: any) {
    console.error('Restore failed:', error.response?.data || error.message);
    throw new Error('Restore failed');
  }
};


// Toggle Pin/Unpin API Call
export const togglePinStatus = async (ids: string[], is_pin: boolean) => {
  try {
    const response = await apiClient.patch('/api/password/items/pin', {
      ids,
      is_pin,
    });

    return response.data;
  } catch (error: any) {
    console.error('Toggle pin status failed:', error.response?.data || error.message);
    throw new Error('Failed to toggle pin status');
  }
};

// Create a Cell API call 
export const createCell = async (FormData: FormData) => {
  try {
    const response = await apiClient.post('/api/identity/cell/create', FormData)
    return response.data
  } catch (error) {
    console.error('Failed to create cell:', error)
    throw new Error('Failed to create cell')
  }
}

// Edit a cell API call 
export const editCell = async (id: string, formData: FormData) => {
  try {
    const response = await apiClient.put(`/api/identity/cell/edit/${id}`, formData)
    return response.data
  } catch (error) {
    console.error('Failed to edit the cell:', error)
    throw new Error('Failed to edit the cell')
  }
}


