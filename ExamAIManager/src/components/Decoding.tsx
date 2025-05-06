import React, { useContext, useState } from "react";
import StepperDataContext from "./StepperDataContext";


const Decoding = () => {
    const { setSelectedImages, setFiles, files } = useContext(StepperDataContext)!
    const [progress, setProgress] = useState<{ [key: string]: number }>({});

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const fileArray = Array.from(event.target.files);
            setFiles(fileArray);
            const analizeimages: string[] = []
            fileArray.map((file) => {
                if (file && file.type.startsWith("image")) {
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onloadend = () => {
                        analizeimages.push(reader.result?.toString().split(",")[1] || "");
                    };
                }
            });
            setSelectedImages(analizeimages)
        }
    };

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h1>3</h1>
            <h1>Decoding</h1>
            <h3>בחירת מבחן</h3>
            <input type="file" multiple onChange={handleFileChange} />

            {files.map((file) => (
                <div key={file.name}>
                    {file.name}: {progress[file.name] || 0}%
                </div>
            ))}
        </div>
    );
};

export default Decoding;

