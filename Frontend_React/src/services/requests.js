// src/services/requests.js

const BASE_URL = "http://localhost:8080";

// Shared fetch helper.
// On success returns the parsed JSON body.
// On failure throws an Error whose message is the backend "error_message" (if any)
// and which carries the HTTP status in error.status (undefined for network errors).
async function request(method, url, body) {
    // const userName = getCookie(userName);
    const params = {
        method,
        mode: "cors",
        cache: "no-store",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
    };
    if (body !== undefined) {
        params.body = JSON.stringify(body);
    }

    let response;
    try {
        response = await fetch(BASE_URL + url, params);
    } catch (error) {
        console.error(`${method} request failed (network):`, error);
        throw new Error("Could not reach the server. Is the backend running?");
    }

    if (!response.ok) {
        // Backend errors look like { status, error_message, fieldErrors? }
        let errorBody = null;
        try {
            errorBody = await response.json();
        } catch {
            // body was not JSON
        }
        const error = new Error(errorBody?.error_message || `HTTP error! status: ${response.status}`);
        error.status = response.status;
        error.fieldErrors = errorBody?.fieldErrors || [];
        console.error(`${method} request failed:`, error);
        throw error;
    }

    return await response.json();
}

// GET request
export const GET = (url) => request("GET", url);

// POST request
export const POST = (url, body) => request("POST", url, body);

// PATCH request
export const PATCH = (url, body) => request("PATCH", url, body);
