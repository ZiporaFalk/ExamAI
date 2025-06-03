import axios from "axios";

export const handleAxiosError = (e: any, defaultMessage: string) => {
    if (axios.isAxiosError(e) && e.response) {
        const errorMessage = e.response.data || "Server Error";
        alert(`${defaultMessage}: ${errorMessage}`);
    } else {
        alert(`${defaultMessage}: Unknown error`);
    }
    console.error(defaultMessage, e);
}