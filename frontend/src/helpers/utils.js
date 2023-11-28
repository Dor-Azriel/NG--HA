export const API_URL = 'http://127.0.0.1:8000';


// Build network requests.

export const network = async (url, method, data = {}, headers = {}) => {
    const body = method !== "GET" ? { body: data } : {};
    const response = await fetch(
        `${url}`,
        {
            method: method,
            headers: {
                ...headers,
            },
            ...body,
        }
    );
    if (!response.ok) {
        throw new Error('Request failed');
    }
    const resdata = await response.json();
    return resdata;
}


export const isEmptyString = (str) => str.trim().length === 0;


