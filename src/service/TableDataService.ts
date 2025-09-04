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

//Move to trash item 
export const softDeleteItems = async (ids: string[]) => {
    const response = await apiClient.patch('/api/password/item/softDelete', {
        id: ids,
    });

    return response.data;
};

// / Post API Call For Add Login Credentials

export const addLoginCredentials = async (formData: FormData, token: string) => {
    try {
        const response = await apiClient.post(
            '/api/login-credentials/add',
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error('Failed to add login credentials:', error);
        throw new Error('Failed to add login credentials');
    }
};