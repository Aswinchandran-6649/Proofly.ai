import axios from "axios";

export const commonAPI = async (httpRequest, url, reqBody, reqHeader) => {
    const reqConfig = {
        method: httpRequest,
        url,
        data: reqBody,
        // FIX: If reqHeader is empty/null, default to JSON
        headers: reqHeader ? reqHeader : { "Content-Type": "application/json" }
    };

    return await axios(reqConfig)
        .then((res) => {
            return res;
        })
        .catch((err) => {
            // FIX: This allows your frontend to read the error message from the backend
            return err.response; 
        });
};