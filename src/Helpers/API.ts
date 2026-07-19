const url = import.meta.env.VITE_API_URL || 'http://localhost:6969/api/';


export const API = {

    get: async (endpoint: string, options: RequestInit = {}) => {
        const response = await fetch(`${url}${endpoint.startsWith('/') ? endpoint.slice(1) : endpoint}`, options);

        const checkedResponse = await checkResponse(response);

        if (!checkedResponse.success) {
            throw new Error(checkedResponse.message);
        }

        return response.json();
    },
    post: async (endpoint: string, options: RequestInit = {}) => {
        const response = await fetch(`${url}${endpoint.startsWith('/') ? endpoint.slice(1) : endpoint}`, {
            ...options,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(options.headers || {}),
            },
        });

        const checkedResponse = await checkResponse(response);

        if (!checkedResponse.success) {
            throw new Error(checkedResponse.message);
        }

        return response.json();
    }
};


const checkResponse = async (response: Response): Promise<{ success: boolean; message: string }> => {

    if (typeof response === 'undefined') {
        return { success: false, message: 'No response received from the server.' };
    }

    if (typeof response === 'object' && response !== null && 'status' in response && response.status === 404) {
        return { success: false, message: 'Resource not found (404).' };
    }

    if (typeof response === 'object' && response !== null && 'status' in response && response.status === 200) {
        return { success: true, message: 'Request successful.' };
    }

    if (typeof response === 'string') {
        return { success: false, message: 'Unexpected response format or status code.' };
    }

    if (!response.ok) {
        return { success: false, message: `HTTP error! status: ${response.status}` };
    }

    return { success: true, message: 'Request successful.' };
}