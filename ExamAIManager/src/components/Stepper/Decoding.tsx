import { ChangeEvent, useContext, useRef, useState, DragEvent } from "react";
import StepperDataContext from "./StepperDataContext";
import { FileWithProgress } from "../../utils/types";
import "../../stylies/Decoding.css"

const Decoding = () => {
    const { setSelectedImages, setFiles, files, setIsAbleNext } = useContext(StepperDataContext)!
    const [isDragOver, setIsDragOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const simulateFileUpload = (fileIndex: number) => {
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 20;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);

                setFiles((prev: (FileWithProgress | null)[]) => {
                    const updated = prev.map((f, i) =>
                        i === fileIndex && f ? { ...f, progress: 100, uploading: false } : f
                    );

                    const allDone = updated.every((f) => f && f.progress === 100);
                    setIsAbleNext(allDone);
                    return updated;
                });
            } else {
                setFiles((prev: (FileWithProgress | null)[]) =>
                    prev.map((f, i) =>
                        i === fileIndex && f ? { ...f, progress: Math.round(progress) } : f
                    )
                );
            }
        }, 200);
    };

    const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const filesArray = Array.from(e.target.files || []);
        await processNewFiles(filesArray);
    };

    const handleDrop = async (e: DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        const droppedFiles = Array.from(e.dataTransfer.files);
        await processNewFiles(droppedFiles);
    };

    const processNewFiles = async (newFileList: File[]) => {
        const newFiles: FileWithProgress[] = newFileList.map((file) => ({
            file,
            progress: 0,
            uploading: true,
        }));

        setFiles((prev: (FileWithProgress | null)[]) => [...prev, ...newFiles]);

        const base64Promises = newFileList.map((file) =>
            new Promise<string>((resolve) => {
                if (file.type.startsWith("image")) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        const base64 = reader.result?.toString().split(",")[1] || "";
                        resolve(base64);
                    };
                    reader.readAsDataURL(file);
                } else {
                    resolve("");
                }
            })
        );

        const base64Array = await Promise.all(base64Promises);
        setSelectedImages?.(base64Array);


        newFiles.forEach((_, index) => {
            const fileIndex = files.length + index;
            setTimeout(() => simulateFileUpload(fileIndex), index * 500);
        });
    };

    const removeFile = (indexToRemove: number) => {
        setFiles((prev: (FileWithProgress | null)[]) => {
            const updated = prev.filter((_, index) => index !== indexToRemove);
            const allDone = updated.every((f) => f && f.progress === 100);
            setIsAbleNext(allDone);
            return updated;
        });
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };
    return (
        <div className="upload-container">
            <div
                className={`upload-area ${isDragOver ? "drag-over" : ""}`}
                onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragOver(true);
                }}
                onDragLeave={(e) => {
                    e.preventDefault();
                    setIsDragOver(false);
                }}
                onDrop={handleDrop}
            >
                <div className="upload-content">
                    <div className={`upload-icon ${isDragOver ? "icon-drag-over" : ""}`}>
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="7,10 12,15 17,10"></polyline>
                            <line x1="12" y1="15" x2="12" y2="3"></line>
                        </svg>
                    </div>

                    <div className="upload-text">
                        <h3 className="upload-title">Drag files here or click to select</h3>
                        <p className="upload-subtitle">
                            You can upload image files (JPG, PNG) or PDF
                        </p>
                    </div>

                    <button
                        className="select-button"
                        onClick={(e) => {
                            e.stopPropagation();
                            fileInputRef.current?.click();
                        }}
                    >
                        Select Files
                    </button>
                </div>

                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={handleFileChange}
                    className="file-input"
                />
            </div>

            {files.length > 0 && (
                <div className="files-section">
                    <h3 className="files-title">Selected Files ({files.length})</h3>
                    <div className="file-list">
                        {files.map((fileData, index) => (
                            <div key={index} className="file-item">
                                <div className="file-info">
                                    <div className="file-icon">
                                        <svg
                                            width="20"
                                            height="20"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                        >
                                            <path d="M14,2 L14,8 L20,8 M14,2 L20,8 L20,22 C20,22.5523 19.5523,23 19,23 L5,23 C4.44772,23 4,22.5523 4,22 L4,2 C4,1.44772 4.44772,1 5,1 L14,1 L14,2 Z" />
                                        </svg>
                                    </div>
                                    <div className="file-details">
                                        <div className="file-name">{fileData && fileData.file.name}</div>
                                        <div className="file-size">
                                            {fileData && formatFileSize(fileData.file.size)}
                                        </div>
                                    </div>
                                </div>

                                <div className="file-progress">
                                    <div className="progress-bar">
                                        <div
                                            className="progress-fill"
                                            style={{ width: `${fileData && fileData.progress}%` }}
                                        ></div>
                                    </div>
                                    <div className="progress-text">{fileData && fileData.progress}%</div>
                                </div>

                                <button
                                    className="remove-button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeFile(index);
                                    }}
                                >
                                    <svg
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        <line x1="18" y1="6" x2="6" y2="18"></line>
                                        <line x1="6" y1="6" x2="18" y2="18"></line>
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Decoding;

