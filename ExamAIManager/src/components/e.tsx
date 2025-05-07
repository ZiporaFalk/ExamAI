import React from 'react';
import axios from 'axios';
const apiUrl = 'https://localhost:7083/api';

type props = {
    fileKey: string
    isStudentTest: boolean
}
const OpenPresignedImageButton = ({ fileKey, isStudentTest }: props) => {
    const handleOpenImage = async () => {
        try {
            const response = await axios.get(`${apiUrl}/download-url`, {
                params: {
                    Url: fileKey,
                    IsStudentTest: isStudentTest
                }
            });

            const presignedUrl = response.data.url;

            // פתיחה בלשונית חדשה
            window.open(presignedUrl, '_blank');
        } catch (error) {
            console.error('שגיאה בקבלת הקישור:', error);
            alert('אירעה שגיאה בעת ניסיון לפתוח את הקובץ.');
        }
    };

    return (
        <button onClick={handleOpenImage}>
            פתח קובץ מ-AWS
        </button>
    );
};

export default OpenPresignedImageButton;
