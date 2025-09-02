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