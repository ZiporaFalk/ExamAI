import React, { useState } from "react";
import axios from "axios";
import { analyzeImage } from "./AnalyzeImag";

const FileProcessor: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [textResult, setTextResult] = useState<string>("");
  const [files, setFiles] = useState<File[]>([]);
  const [progress, setProgress] = useState<{ [key: string]: number }>({});

  // const analyzeStudent = (result: any) => {
  //   const name = textResult[result.indexOf("שם") + 1]
  //   //const name1=textResult[3]
  //   console.log(name)
  //   console.log(result[result.indexOf("שם")]) 
  // }
  
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
      setTextResult(result || "לא נמצא טקסט");
      console.log(textResult)
      // analyzeStudent(result)
    }
  };

  // const handleUpload = async () => {
  //   if (files.length === 0) return;

  //   try {
  //     const uploadPromises = files.map(async (file) => {
  //       const response = await axios.get("https://localhost:7166/api/upload/presigned-url", {
  //         params: { fileName: file.name, contentType: file.type }, // 🔹 שליחת סוג הקובץ
  //       });

  //       const presignedUrl = response.data.url;
  //       await axios.put(presignedUrl, file, {
  //         headers: {
  //           "Content-Type": file.type, // 🔹 התאמת סוג הקובץ
  //           "x-amz-acl": "bucket-owner-full-control",
  //         },
  //         onUploadProgress: (progressEvent) => {
  //           const percent = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
  //           setProgress((prev) => ({ ...prev, [file.name]: percent }));
  //         },
  //       });
  //     });

  //     await Promise.all(uploadPromises);
  //     alert("All files uploaded successfully!");
  //   } catch (error) {
  //     console.error("Upload error:", error);
  //   }
  // };


  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Google Vision OCR & File Uploader</h1>
      <input type="file" multiple onChange={handleFileChange} />
      <button onClick={handleAnalyze} disabled={!selectedImage}>פענח טקסט</button>
      {/* <button onClick={handleUpload} disabled={files.length === 0}>העלה קבצים</button> */}

      {textResult && (
        <div>
          <h2>תוצאה:</h2>
          <p>{textResult}</p>
        </div>
      )}
      {files.map((file) => (
        <div key={file.name}>
          {file.name}: {progress[file.name] || 0}%
        </div>
      ))}
    </div>
  );
};

export default FileProcessor;