import React, { useState } from "react";
import { analyzeImage } from "../פיענוח מבחן/AnalyzeImag";
// import axios from "axios";

const ExampleExam: React.FC = () => {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [files, setFiles] = useState<File[]>([]);
    const [progress, setProgress] = useState<{ [key: string]: number }>({});


    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const fileArray = Array.from(event.target.files);
            setFiles(fileArray);

            // במקרה של תמונה, המרתה ל-Base64
            const file = fileArray[0];
            if (file && file.type.startsWith("image")) {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onloadend = () => {
                    const base64String = reader.result?.toString().split(",")[1] || "";
                    setSelectedImage(base64String);
                };
            }
        }
    };

    const handleAnalyze = async () => {
        if (selectedImage) {
            const result = await analyzeImage(selectedImage);
            console.log(result)

            const dateIndex = result.findIndex((myname: any) => myname.description.includes("תאריך"))
            console.log(result[dateIndex + 2].description + result[dateIndex + 3].description + ' ' + result[dateIndex + 4].description + ' ' + result[dateIndex + 5].description)
            const date = result[dateIndex + 2].description + result[dateIndex + 3].description + ' ' + result[dateIndex + 4].description + ' ' + result[dateIndex + 5].description
            const subjectIndex = result.findIndex((myname: any) => myname.description.includes("מקצוע"))
            console.log(result[subjectIndex + 2].description + ' ' + result[subjectIndex + 3].description)
            const subject = result[subjectIndex + 2].description + ' ' + result[subjectIndex + 3].description





        }
    };

    return (

        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h1>ExampleExam</h1>
            <input type="file" multiple onChange={handleFileChange} />
            <button onClick={handleAnalyze} disabled={!selectedImage}>פענח טקסט</button>

            {files.map((file) => (
                <div key={file.name}>
                    {file.name}: {progress[file.name] || 0}%
                </div>
            ))}
        </div>
    );
};

export default ExampleExam;