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
// -------------------------------------------------------------------------


// POST API for password Generator 
export const generatePasswordAPI = async (
  type: "advanced" | "memorable" | "random" = "advanced",
  length: number = 20
) => {
  try {
    const token = localStorage.getItem("authToken") // or however you're storing it

    if (!token) {
      throw new Error("Authentication token not found");
    }

    const response = await apiClient.post(
      "/api/password/generate",
      {
        type,
        options: {
          length,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (err) {
    console.error(err)
  }
}

// / Post API Call For Add Login Credentials
export const addLoginCredentials = async (formData: FormData) => {
  try {
    const response = await apiClient.post('/api/login-credentials/add', formData,);
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
export const restorePasswords = async (ids: string[]) => {
  try {
    const response = await apiClient.post(
      '/api/password/item/restore', // Adjust the path if needed
      { ids }
    );
    return response.data;
  } catch (error: any) {
    console.error('Restore failed:', error.response?.data || error.message);
    throw new Error('Failed to restore passwords');
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
