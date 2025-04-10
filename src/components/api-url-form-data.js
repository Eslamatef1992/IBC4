import axios from "axios";
let token;
if (typeof window !== 'undefined') {
    token       = localStorage.getItem('token');
}
export default axios.create({
    baseURL: `https://back.ibc-finance.com`, //process.env.API_URL,
    headers: {
        "Content-Type": "multipart/form-data",
        'accept':'application/json',
        "x-access-token": token
    }
});
