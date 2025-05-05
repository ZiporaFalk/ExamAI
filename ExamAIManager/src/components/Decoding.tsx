import React, { useState } from "react";

// type DecodingProps = {
//     onSelectedImage: (imageBase64: string) => void;
//     // onSelectedImage: (imagesBase64: string[]) => void;
//     onChangedFiles: (files: File[]) => void;
// };
type DecodingProps = {
    onChangedFiles: (files: File[]) => void;
    onSelectedImages: (images: string[]) => void;
};

const Decoding = ({ onSelectedImages, onChangedFiles }: DecodingProps) => {

    const [files, setFiles] = useState<File[]>([]);
    const [progress, setProgress] = useState<{ [key: string]: number }>({});

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const fileArray = Array.from(event.target.files);
            setFiles(fileArray);
            onChangedFiles(fileArray)
            // const file = fileArray[0];
            // if (file && file.type.startsWith("image")) {
            //     const reader = new FileReader();
            //     reader.readAsDataURL(file);
            //     reader.onloadend = () => {
            //         const base64String = reader.result?.toString().split(",")[1] || "";
            //         onSelectedImage(base64String)
            //     };
            // }
            const b: string[] = []
            fileArray.map((file) => {
                if (file && file.type.startsWith("image")) {
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onloadend = () => {
                        b.push(reader.result?.toString().split(",")[1] || "");
                    };
                }
            });
            onSelectedImages(b)
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



// ........מ-GPT
// import React, { useState } from 'react';

// type DecodingProps = {
//   onChangedFiles: (files: File[]) => void;
//   onSelectedImages: (images: string[]) => void;
// };

// const Decoding = ({ onChangedFiles, onSelectedImages }: DecodingProps) => {
//   const [localFiles, setLocalFiles] = useState<File[]>([]);
//   const [imagePreviews, setImagePreviews] = useState<string[]>([]);

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (!e.target.files) return;

//     const selectedFiles = Array.from(e.target.files);
//     setLocalFiles(selectedFiles);
//     onChangedFiles(selectedFiles);

//     // יצירת כתובות מקומיות להצגת תמונות
//     const imageUrls = selectedFiles.map((file) => URL.createObjectURL(file));
//     setImagePreviews(imageUrls);
//     onSelectedImages(imageUrls);
//   };

//   return (
//     <div>
//       <input type="file" multiple accept="image/*" onChange={handleFileChange} />
//       <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
//         {imagePreviews.map((src, index) => (
//           <img key={index} src={src} alt={`preview-${index}`} width={120} />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Decoding;



// ..................................לפני קבצים רבים.............................
// import React, { useState } from "react";

// type DecodingProps = {
//     onSelectedImage: (imageBase64: string) => void;
//     // onSelectedImage: (imagesBase64: string[]) => void;
//     onChangedFiles: (files: File[]) => void;
// };

// const Decoding = ({ onSelectedImage, onChangedFiles }: DecodingProps) => {

//     const [files, setFiles] = useState<File[]>([]);
//     const [progress, setProgress] = useState<{ [key: string]: number }>({});

//     const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//         if (event.target.files) {
//             const fileArray = Array.from(event.target.files);
//             setFiles(fileArray);
//             onChangedFiles(fileArray)
//             const file = fileArray[0];
//             if (file && file.type.startsWith("image")) {
//                 const reader = new FileReader();
//                 reader.readAsDataURL(file);
//                 reader.onloadend = () => {
//                     const base64String = reader.result?.toString().split(",")[1] || "";
//                     onSelectedImage(base64String)
//                 };
//             }
//             // const b: string[] = []
//             // fileArray.map((file) => {
//             //     if (file && file.type.startsWith("image")) {
//             //         const reader = new FileReader();
//             //         reader.readAsDataURL(file);
//             //         reader.onloadend = () => {
//             //             b.push(reader.result?.toString().split(",")[1] || "");
//             //         };
//             //     }
//             // });
//             // onSelectedImage(b)
//         }
//     };

//     return (
//         <div style={{ textAlign: "center", marginTop: "50px" }}>
//             <h1>3</h1>
//             <h1>Decoding</h1>
//             <h3>בחירת מבחן</h3>
//             <input type="file" multiple onChange={handleFileChange} />

//             {files.map((file) => (
//                 <div key={file.name}>
//                     {file.name}: {progress[file.name] || 0}%
//                 </div>
//             ))}
//         </div>
//     );
// };

// export default Decoding;
