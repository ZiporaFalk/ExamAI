import axiosInstance from "../utils/axiosInstance";
import { Exam, Student } from "../utils/types";
import { handleAxiosError } from "../utils/handleAxiosError";
import axios from "axios";

const ExamUploadService = {

    async uploadAll(
        files: ({ file: File } | null)[],
        students: Student[],
        exams: Exam[],
        isStudentTest: boolean,
        setProgress: (p: Record<string, number>) => void,
        sendMail: (student: any, exam: any) => void
    ): Promise<void> {
        console.log("pppppppppppppppppppppp");
        const loopLength = isStudentTest ? students.length : exams.length;

        for (let i = 0; i < loopLength; i++) {
            const student = isStudentTest ? students[i] : null;
            const exam = exams[i];

            const nameFile = isStudentTest
                ? student?.name
                : `${exam.subject}-${exam.dateExam}`;

            const renamedFile = this.renameFile(files[i]?.file!, `${nameFile}.jpg`);

            try {
                const { data } = await axiosInstance.get("/ExamUpload/presigned-url", {
                    params: {
                        fileName: renamedFile.name,
                        subject: exam.subject,
                        class: isStudentTest ? student?.studentClass : "null",
                        date: exam.dateExam,
                        isStudentTest,
                        contentType: "image/jpeg"
                    },
                });
                const presignedUrl = data.url;
                console.log(presignedUrl);
                console.log("presignedUrl");

                await axios.put(presignedUrl, renamedFile, {
                    headers: {
                        'Content-Type': renamedFile.type,
                        // 'x-amz-acl': 'bucket-owner-full-control'
                    },
                    onUploadProgress: (e) => {
                        const percent = Math.round((e.loaded * 100) / (e.total || 1));
                        setProgress({ [renamedFile.name]: percent });
                    },
                });
                if (isStudentTest) sendMail(student, exam);
                console.log(`✔️ ${renamedFile.name} uploaded successfully`);
            } catch (error) {
                console.error(`❌ Error uploading file ${renamedFile.name}:`, error);
            }
        }
    },

    renameFile(file: File, newName: string): File {
        return new File([file], newName, { type: file.type });
    },

    uploadStudentWordFeedback: async (student: Student, exam: Exam, wordBlob: Blob) => {
        const fileName = `${student.name.replace(/\s/g, "_")}_feedback.docx`;
        try {
            const response = await axiosInstance.get(`/ExamUpload/presigned-url`, {
                params: {
                    fileName,
                    IsStudentTest: true,
                    subject: exam.subject,
                    date: exam.dateExam,
                    class: student.studentClass,
                    contentType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                },
            });

            const uploadUrl = response.data.url;

            await axios.put(uploadUrl, wordBlob, {
                headers: {
                    "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                    // "x-amz-acl": "bucket-owner-full-control",
                },
            });
        }
        catch (e: any) {
            handleAxiosError(e, "Error upload Student Feedback")
        }
    },
    
    getUrl: async (url: string) => {
        try {            
            const response = await axiosInstance.get(`/ExamUpload/download-url`, {
                params: {
                    Url: encodeURIComponent(url),
                    // IsStudentTest: true,
                    IsDownload: true,
                },
            })
            return response.data.url
        }
        catch (e: any) {
            handleAxiosError(e, "Error download-url")
        }
    }
}


export default ExamUploadService;