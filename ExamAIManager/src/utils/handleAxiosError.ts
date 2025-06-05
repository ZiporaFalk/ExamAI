import axios from "axios";

export const handleAxiosError = (e: any, defaultMessage: string) => {
    if (axios.isAxiosError(e) && e.response) {
        const errorMessage = e.response.data || "Server Error";
        console.log(`${defaultMessage}: ${errorMessage}`);
        
    } else {
        console.log(`${defaultMessage}: Unknown error`);
    }
    console.error(defaultMessage, e);
}

