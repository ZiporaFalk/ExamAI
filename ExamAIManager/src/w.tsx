// ------------------------------------כל הקבצים עם העדכון של ה-URLS------------------------------------------------



// import React, { useState, useEffect } from "react";
// import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, IconButton } from "@mui/material";
// import { observer } from "mobx-react-lite";
// import studentStore, { Student, Submission } from "./StudentStore";
// import { Edit, UploadFile } from "@mui/icons-material";
// import UpdateUrlsModal from "./UpdateUrlsModal";
// // import UpdateUrlsModal from "./UpdateUrlsModal";

// const apiUrl = "https://localhost:7083/api";


// interface StudentScoresModalProps {
//     open: boolean;
//     onClose: () => void;
//     onSave: (student: Student) => Promise<void>;
//     student?: Student | null;
// }

// const StudentScoresModal: React.FC<StudentScoresModalProps> = observer(({ open, onClose, onSave, student }) => {
//     const [scores, setScores] = useState<Map<number, number>>(new Map());
//     useEffect(() => {
//         console.log(student);

//         if (student) {
//             // setScores(new Map(studentStore.getStudentScores(student.id)));
//             const scoresMap = new Map<number, number>();
//             studentStore.getStudentScores(student.id).forEach((submission, examId) => {
//                 scoresMap.set(examId, submission.score);
//             });
//             setScores(scoresMap);
//         }
//     }, [student]);

//     const handleChange = (examId: number, value: string) => {
//         setScores((prev) => new Map(prev.set(examId, Number(value))));
//     };

//     const handleSubmit = async () => {
//         try {
//             if (!student) return;
//             const submissionsMap = new Map<number, Submission>();
//             scores.forEach((score, examId) => {
//                 const existingSubmission = studentStore.scores.get(student.id)?.get(examId);
//                 submissionsMap.set(examId, {
//                     id: existingSubmission?.id ?? 0,  // שמירה על ה-ID הקיים, אם יש
//                     score,
//                     urlFile: existingSubmission?.urlFile ?? "",
//                     urlFeedback: existingSubmission?.urlFeedback ?? "",
//                     studentId: student.id,
//                     // examId
//                 });
//             });
//             await studentStore.updateStudentScores(student.id, submissionsMap);
//             onClose();
//         } catch (error) {
//             console.error("Error updating student scores:", error);
//         }
//     };
//     // /////////////////////////////////////////////////////////////
//     const handleUrlsModalOpen = (examId: number) => {
//         if (student) {
//             studentStore.openUrlsModalForExam(examId);
//         }
//     };
//     /////////
//     // const handleUrlsModalOpen = (examId: number) => {
//     //     if (student) {
//     //         const submission = studentStore.getStudentScores(student.id).get(examId);
//     //         if (submission) {
//     //             studentStore.openUrlsModalForSubmission(submission);
//     //         }
//     //     }
//     // };


//     const handleUrlsModalClose = () => {
//         studentStore.closeUrlsModal();  // שימוש ב-MobX לסגירת המודל של URLs
//     };
//     //////////////////////////////////////
//     return (
//         <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
//             <DialogTitle>עריכת ציונים עבור {student?.name}</DialogTitle>
//             <DialogContent>
//                 {studentStore.exams.map((exam) => (
//                     <div key={exam.id} style={{ display: "flex", alignItems: "center" }}>
//                         <TextField
//                             key={exam.id}
//                             label={exam.subject}
//                             value={scores.get(exam.id) ?? ""}
//                             onChange={(e) => handleChange(exam.id, e.target.value)}
//                             fullWidth
//                             margin="dense"
//                             type="number"
//                         />
//                         {/* ////// */}
//                         <IconButton
//                             onClick={() => handleUrlsModalOpen(exam.id)}  // פתיחת המודל של URLs
//                             color="primary"
//                         >
//                             <UploadFile />
//                         </IconButton>
//                         {/*  */}
//                     </div>
//                 ))}

//             </DialogContent>
//             <DialogActions>
//                 <Button onClick={onClose} color="secondary">בטל</Button>
//                 <Button onClick={handleSubmit} color="primary" variant="contained">שמור</Button>
//             </DialogActions>
//             {/* מודל עדכון URLs */}
//             <UpdateUrlsModal
//                 open={studentStore.openUrlsModal}
//                 onClose={handleUrlsModalClose}
//                 examId={studentStore.examIdForUrls!}
//                 studentId={student?.id!}
//             />
//             {/*  */}

//         </Dialog>
//     );
// });

// export default StudentScoresModal;





// import { makeAutoObservable } from "mobx";
// import axios from "axios";

// const apiUrl = 'https://localhost:7083/api';

// export interface Student {
//     id: number;
//     name: string;
//     email: string;
//     class: string;
//     password: string;
// }

// export interface Exam {
//     id: number;
//     subject: string;
// }

// export interface Submission {
//     id: number;
//     studentId: number;
//     score: number;
//     urlFile: string;
//     urlFeedback: string;
// }

// class StudentStore {
//     students: Student[] = [];
//     exams: Exam[] = [];
//     // scores: Map<number, Map<number, number>> = new Map();
//     scores: Map<number, Map<number, Submission>> = new Map();
//     loading: boolean = false;

//     // משתנים לניהול מודלים
//     currentStudent: Student | null = null;
//     openAddDialog: boolean = false;
//     openDetailsDialog: boolean = false;
//     openScoresDialog: boolean = false;
//     // .......urls
//     openUrlsModal: boolean = false;  // מצב פתיחת המודל של URLs
//     examIdForUrls: number | null = null;  // המבחן שנבחר לעדכון URLs

//     constructor() {
//         makeAutoObservable(this);
//     }

//     async fetchStudents() {
//         this.loading = true;
//         try {
//             const response = await axios.get<Student[]>(`${apiUrl}/Student`);
//             this.students = response.data;
//         } catch (error) {
//             console.error("Error fetching students:", error);
//         } finally {
//             this.loading = false;
//         }
//     }

//     async fetchExams() {
//         try {
//             const response = await axios.get<Exam[]>(`${apiUrl}/Exam`);
//             this.exams = response.data;
//         } catch (error) {
//             console.error("Error fetching exams:", error);
//         }
//     }

//     async fetchScores() {
//         try {
//             const scorePromises = this.students.flatMap((student) =>
//                 this.exams.map((exam) =>
//                     axios.get<Submission>(`${apiUrl}/Submission/${student.id}/${exam.id}`)
//                         .then((response) => {
//                             const submission = response.data;
//                             console.log("Fetched submission:", submission);  // 🔥 הדפס את הנתונים מהשרת
//                             const newScores = new Map(this.scores);
//                             const studentScores = newScores.get(student.id) || new Map();
//                             studentScores.set(exam.id, submission);
//                             newScores.set(student.id, studentScores);
//                             this.scores = newScores;
//                         })
//                         .catch(() => { })
//                 )
//             );
//             await Promise.all(scorePromises);

            
//         } catch (error) {
//             console.error("Error fetching scores:", error);
//         }
//     }

//     // פונקציה שמביאה את כל הנתונים יחד
//     async fetchData() {
//         await this.fetchStudents();
//         await this.fetchExams();
//         await this.fetchScores();
//     }
//     async addStudent(newStudent: Student) {
//         try {
//             console.log("Before:", this.students);
//             const response = await axios.post(`${apiUrl}/Student`, newStudent);
//             console.log("After:", this.students);
//             // this.students.push(newStudent);
//             const addedStudent = response.data; // קבלת הסטודנט מהשרת עם ה-ID שנוצר
//             this.students = [...this.students, addedStudent]; // יצירת מערך חדש כדי שמובקס יזהה שינוי
//             this.openAddDialog = false; // סגירת המודל אחרי הוספה
//             await this.fetchStudents();

//         } catch (error) {
//             console.error("Error adding student:", error);
//         }
//     }

//     async updateStudent(updatedStudent: Student) {
//         try {
//             await axios.put(`${apiUrl}/Student/${updatedStudent.id}`, updatedStudent);
//             // this.students = this.students.map((s) => (s.id === updatedStudent.id ? updatedStudent : s));
//             this.students = this.students.map((s) => s.id === updatedStudent.id ? { ...s, ...updatedStudent } : s); // יצירת אובייקט חדש כדי שמובקס יזהה שינוי            
//             this.currentStudent = null; // סגירת המודל אחרי עדכון
//         } catch (error) {
//             console.error("Error updating student:", error);
//         }
//     }

//     async deleteStudent(studentId: number) {

//         try {
//             await axios.delete(`${apiUrl}/Student/${studentId}`);
//             this.students = this.students.filter(student => student.id !== studentId);
//         } catch (error) {
//             console.error("Error deleting student:", error);
//         }
//     }
//     getStudentScores(studentId: number): Map<number, Submission> {
//         return this.scores.get(studentId) || new Map();
//     }


//     async updateStudentScores(studentId: number, updatedScores: Map<number, Submission>) {
//         try {
//             await Promise.all(
//                 Array.from(updatedScores.entries()).map(([examId, submission]) => {
//                     axios.put(`${apiUrl}/Submission/${submission.id}`, {
//                         id: submission.id,
//                         studentId: studentId,                    // שליחה של studentid
//                         score: submission.score,                 // שליחה של הציון
//                         file_Url: submission.urlFile,             // שליחה של קובץ
//                         file_Url_FeedBack: submission.urlFeedback      // שליחה של פידבק
//                     })
//                 }
//                 )
//             );
//             ////    נסיון שאם היה קודם - ואחר כך מספר שיוסיף אותו כנגשה חדשה
//             // await Promise.all(
//             //     Array.from(updatedScores.entries()).map(([examId, submission]) => {
//             //         const oldSubmission = studentStore.scores.get(studentId)?.get(examId);
//             //         const oldScore = oldSubmission ? oldSubmission.score : "-"; // הציון הישן
//             //         const newScore = submission.score; // הציון החדש
//             //         if (oldScore.toString() !== "-") {
//             //             return axios.put(`${apiUrl}/Submission/${submission.id}`, {
//             //                 id: submission.id,
//             //                 studentId: studentId,
//             //                 score: submission.score,
//             //                 file_Url: submission.urlFile,
//             //                 file_Url_FeedBack: submission.urlFeedback
//             //             });
//             //         }
//             //         else if (oldScore === "-" && newScore.toString() !== '-') {

//             //             return axios.post(`${apiUrl}/Submission`, {
//             //                 id: submission.id,
//             //                 studentId: studentId,
//             //                 score: submission.score,
//             //                 file_Url: submission.urlFile,
//             //                 file_Url_FeedBack: submission.urlFeedback
//             //             });
//             //         }
//             //     })
//             // );
//             this.scores.set(studentId, new Map(updatedScores));
//         } catch (error) {
//             console.error("Error updating student scores:", error);
//         }
//     }
   
//     // .......urls
//     openUrlsModalForExam(examId: number) {
//         this.examIdForUrls = examId;
//         this.openUrlsModal = true;
//     }

//     // // פונקציה לסגירת המודל של URLs
//     closeUrlsModal() {
//         this.examIdForUrls = null;
//         this.openUrlsModal = false;
//     }
//     // // updateSubmissionUrls(studentId: number, examId: number, urlFile: string, urlFeedback: string) {
//     // //     const submissionsMap = new Map(this.scores);
//     // //     const studentScores = submissionsMap.get(studentId) || new Map();
//     // //     const existingSubmission = studentScores.get(examId);
        
//     // //     if (existingSubmission) {
//     // //         existingSubmission.urlFile = urlFile;
//     // //         existingSubmission.urlFeedback = urlFeedback;
//     // //         studentScores.set(examId, existingSubmission);
//     // //         submissionsMap.set(studentId, studentScores);
//     // //         this.scores = submissionsMap;
//     // //     }
//     // // }
//     // updateSubmissionUrls(submission: Submission, urlFile: string, urlFeedback: string) {
//     //     submission.urlFile = urlFile;
//     //     submission.urlFeedback = urlFeedback;
        
//     //     this.scores.get(submission.studentId)?.set(submission.examId, submission);
//     // }
    
//     // openUrlsModalForSubmission(submission: Submission) {
//     //     this.currentSubmission = submission;
//     //     this.openUrlsModal = true;
//     // }
    
// }
// const studentStore = new StudentStore();
// export default studentStore;



// // import React, { useEffect, useState } from "react";
// // import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material";
// // import { observer } from "mobx-react-lite";
// // import studentStore from "./StudentStore";
// // interface UpdateUrlsModalProps {
// //     open: boolean;
// //     onClose: () => void;
// //     examId: number;
// //     studentId: number;
// // }
// // const UpdateUrlsModal: React.FC<UpdateUrlsModalProps> = observer(({ open, onClose, examId, studentId }) => {
// //     const [urlFile, setUrlFile] = useState("");
// //     const [urlFeedback, setUrlFeedback] = useState("");

// //     // const examId = studentStore.examIdForUrls;
// //     // const studentId = studentStore.currentStudent?.id;

// //     useEffect(() => {
// //         if (examId !== null && studentId !== undefined) {
// //             const submission = studentStore.scores.get(studentId)?.get(examId);
// //             if (submission) {
// //                 setUrlFile(submission.urlFile);
// //                 setUrlFeedback(submission.urlFeedback);
// //             }
// //         }
// //     }, [examId, studentId]);

// //     const handleUrlSubmit = () => {
// //         if (studentId !== undefined && examId !== null) {
// //             studentStore.updateSubmissionUrls(studentId, examId, urlFile, urlFeedback);
// //             studentStore.closeUrlsModal();
// //         }
// //     };

// //     return (
// //         <Dialog open={studentStore.openUrlsModal} onClose={studentStore.closeUrlsModal}>
// //             <DialogTitle>עדכון URLs</DialogTitle>
// //             <DialogContent>
// //                 <TextField
// //                     label="URL קובץ"
// //                     value={urlFile}
// //                     onChange={(e) => setUrlFile(e.target.value)}
// //                     fullWidth
// //                     margin="dense"
// //                 />
// //                 <TextField
// //                     label="URL פידבק"
// //                     value={urlFeedback}
// //                     onChange={(e) => setUrlFeedback(e.target.value)}
// //                     fullWidth
// //                     margin="dense"
// //                 />
// //             </DialogContent>
// //             <DialogActions>
// //                 <Button onClick={studentStore.closeUrlsModal} color="secondary">בטל</Button>
// //                 <Button onClick={handleUrlSubmit} color="primary" variant="contained">שמור</Button>
// //             </DialogActions>
// //         </Dialog>
// //     );
// // });

// // export default UpdateUrlsModal;
// import React from "react";
// import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material";
// import { observer } from "mobx-react-lite";
// import studentStore from "./StudentStore";

// interface UpdateUrlsModalProps {
//     open: boolean;
//     onClose: () => void;
//     examId: number;
//     studentId: number;
// }

// const UpdateUrlsModal: React.FC<UpdateUrlsModalProps> = observer(({ open, onClose, examId, studentId }) => {
//     const submission = studentStore.scores.get(studentId)?.get(examId);

//     const [urlFile, setUrlFile] = React.useState(submission?.urlFile || "");
//     const [urlFeedback, setUrlFeedback] = React.useState(submission?.urlFeedback || "");

//     React.useEffect(() => {
//         console.log(submission + "submission in Url");

//         setUrlFile(submission?.urlFile || "");  // טעינת ערך ברירת מחדל
//         setUrlFeedback(submission?.urlFeedback || ""); // טעינת ערך ברירת מחדל
//     }, [submission]);

//     const handleSave = () => {
//         if (submission) {
//             studentStore.updateStudentScores(studentId, new Map([
//                 [examId, { ...submission, urlFile, urlFeedback }]
//             ]));
//         }
//         onClose();
//     };

//     return (
//         <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
//             <DialogTitle>עדכון קישורים</DialogTitle>
//             <DialogContent>
//                 <TextField
//                     // label="קישור לקובץ"
//                     value={urlFile}
//                     onChange={(e) => setUrlFile(e.target.value)}
//                     fullWidth
//                     margin="dense"
//                 />
//                 <TextField
//                     // label="קישור למשוב"
//                     value={urlFeedback}
//                     onChange={(e) => setUrlFeedback(e.target.value)}
//                     fullWidth
//                     margin="dense"
//                 />
//             </DialogContent>
//             <DialogActions>
//                 <Button onClick={onClose} color="secondary">בטל</Button>
//                 <Button onClick={handleSave} color="primary" variant="contained">שמור</Button>
//             </DialogActions>
//         </Dialog>
//     );
// });

// export default UpdateUrlsModal;
