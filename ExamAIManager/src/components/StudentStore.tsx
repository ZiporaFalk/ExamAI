// // כרגע מיותר- שומרת כאן כל מה שנתן עבור שיוניי ציונים ואחרי שינוי האוביקט sumbission

// //////////////////אחרי שינוי של אוביקט sumbission וכן עידכון של ציון ספציפי.........................................

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
//     score: number;
//     urlFile: string;
//     urlFeedback: string;
//     studentId?: number;
//     examId: number;
// }

// class StudentStore {
//     students: Student[] = [];
//     exams: Exam[] = [];
//     submissions: Submission[] = [];
//     loading: boolean = false;

//     openAddDialog: boolean = false;
//     currentStudent: Student | null = null;

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

//     async fetchSubmissions() {
//         try {
//             const response = await axios.get<Submission[]>(`${apiUrl}/Submission`);
//             this.submissions = response.data;
//         } catch (error) {
//             console.error("Error fetching submissions:", error);
//         }
//     }

//     async fetchData() {
//         await this.fetchStudents();
//         await this.fetchExams();
//         await this.fetchSubmissions();
//     }
//     // .............................................
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
//     // ..........................................
//     getStudentSubmissions(studentId: number): Submission[] {
//         return this.submissions.filter(sub => sub.studentId === studentId);
//     }

//     async updateStudentScore(submissionId: number, newScore: number) {


//          try {
//             // 🔹 יצירת אובייקט Submission מלא עם כל הנתונים
//         const updatedSubmission: Submission = {
//             ...submission,  // שמירת שאר הנתונים
//             score: newScore // עדכון הציון
//         };

       
//             // await axios.put(`${apiUrl}/Submission/${submissionId}`, { score: newScore });
//             await axios.put(`${apiUrl}/Submission/${submissionId}`,updatedSubmission);
//             this.submissions = this.submissions.map(sub =>
//                 sub.id === submissionId ? { ...sub, score: newScore } : sub
//             );
//         } catch (error) {
//             console.error("Error updating submission score:", error);
//         }
//     }
//     getStudentScores(studentId: number): Map<number, number> {
//         const scores = new Map<number, number>();
//         this.submissions
//             .filter(sub => sub.studentId === studentId)
//             .forEach(sub => scores.set(sub.examId, sub.score));
//         return scores;
//     }

// }

// const studentStore = new StudentStore();
// export default studentStore;
// // ..........................................
// // 



//////////////////אחרי שינוי של אוביקט sumbission וכן עידכון של ציון ספציפי.........................................

// import React, { useState, useEffect } from "react";
// import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material";
// import { observer } from "mobx-react-lite";
// import studentStore, { Student } from "./StudentStore";

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
//         if (student) {
//             setScores(new Map(studentStore.getStudentScores(student.id)));
//             console.log(scores.get(2) + "scoressssssssssssss");
//         }
//     }, [student]);

//     const handleChange = (examId: number, value: string) => {
//         setScores((prev) => new Map(prev.set(examId, Number(value))));
//     };

//     const handleSubmit = async () => {
//         try {
//             if (!student) return;
//             // await studentStore.updateStudentScores(student.id, scores);
//             await Promise.all(
//                 Array.from(scores.entries()).map(([examId, score]) =>
//                 // studentStore.updateStudentScore(examId, score)
//                 {
//                     const submission = studentStore.submissions.find(sub => sub.studentId === student.id && sub.examId === examId);
//                     if (submission) {
//                         // 🔹 קריאה לעדכון עם ה-ID הנכון
//                         await studentStore.updateStudentScore(submission.id, score);
//                     }
//                 })
//             );
//             onClose();
//         } catch (error) {
//             console.error("Error updating student scores:", error);
//         }
//     };

//     return (
//         <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
//             <DialogTitle>עריכת ציונים עבור {student?.name}</DialogTitle>
//             <DialogContent>
//                 {studentStore.exams.map((exam) => (
//                     <TextField
//                         key={exam.id}
//                         label={exam.subject}
//                         value={scores.get(exam.id) ?? ""}
//                         onChange={(e) => handleChange(exam.id, e.target.value)}
//                         fullWidth
//                         margin="dense"
//                         type="number"
//                     />
//                 ))}
//             </DialogContent>
//             <DialogActions>
//                 <Button onClick={onClose} color="secondary">בטל</Button>
//                 <Button onClick={handleSubmit} color="primary" variant="contained">שמור</Button>
//             </DialogActions>
//         </Dialog>
//     );
// });

// export default StudentScoresModal;


//////////////////אחרי שינוי של אוביקט sumbission וכן עידכון של ציון ספציפי.........................................

// import { useEffect } from "react";
// import { observer } from "mobx-react";
// import studentStore from "./StudentStore";
// import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, CircularProgress, Button } from "@mui/material";
// import { School, Grade, Edit, Add, Delete } from "@mui/icons-material";
// import StudentModal from "./StudentScoresModal";

// const StudentTable = observer(() => {
//     useEffect(() => {
//         studentStore.fetchData();
//     }, []);

//     if (studentStore.loading) {
//         return (
//             <Typography align="center">
//                 <CircularProgress />
//             </Typography>
//         );
//     }

//     return (
//         <Paper sx={{ maxWidth: 1200, margin: "auto", marginTop: 4, padding: 3, boxShadow: 5, borderRadius: 3, backgroundColor: "#f5f5f5" }}>
//             <Typography variant="h5" align="center" gutterBottom sx={{ fontWeight: "bold", color: "#3f51b5" }}>
//                 <School sx={{ verticalAlign: "middle", marginRight: 1 }} /> רשימת תלמידים
//             </Typography>

//             <Button variant="contained" color="primary" startIcon={<Add />} onClick={() => studentStore.openAddDialog = true} sx={{ marginBottom: 2 }}>
//                 הוסף תלמיד
//             </Button>

//             <TableContainer component={Paper} sx={{ borderRadius: 2, overflow: "hidden" }}>
//                 <Table>
//                     <TableHead>
//                         <TableRow sx={{ backgroundColor: "#3f51b5" }}>
//                             {studentStore.exams.map((exam) => (
//                                 <TableCell key={exam.id} align="left" sx={{ color: "white", fontWeight: "bold" }}>
//                                     <Grade sx={{ verticalAlign: "middle", marginRight: 1 }} /> {exam.subject}
//                                 </TableCell>
//                             ))}
//                             <TableCell align="right" sx={{ color: "white", fontWeight: "bold" }}>מייל</TableCell>
//                             <TableCell align="right" sx={{ color: "white", fontWeight: "bold" }}>סיסמה</TableCell>
//                             <TableCell align="right" sx={{ color: "white", fontWeight: "bold" }}>כיתה</TableCell>
//                             <TableCell align="right" sx={{ color: "white", fontWeight: "bold" }}>שם</TableCell>
//                             <TableCell align="right" sx={{ color: "white", fontWeight: "bold" }}>מספר מזהה</TableCell>
//                             <TableCell align="right" sx={{ color: "white", fontWeight: "bold" }}>עריכה</TableCell>
//                         </TableRow>
//                     </TableHead>
//                     <TableBody>
//                         {studentStore.students.map((student) => (
//                             <TableRow key={student.id}>
//                                 {/* {studentStore.exams.map((exam) => {
//                                     const score = studentStore.submissions.get(student.id)?.get(exam.id) ?? "-";
//                                     return <TableCell key={exam.id} align="left">{score}</TableCell>;
//                                 })} */}
//                                 {studentStore.exams.map((exam) => {
//                                     const submission = studentStore.submissions.find(sub => sub.studentId === student.id && sub.examId === exam.id);
//                                     const score = submission ? submission.score : "-";
//                                     return <TableCell key={exam.id} align="left">{score}</TableCell>;
//                                 })}

//                                 <TableCell align="right">{student.email}</TableCell>
//                                 <TableCell align="right">{student.password}</TableCell>
//                                 <TableCell align="right">{student.class}</TableCell>
//                                 <TableCell align="right">{student.name}</TableCell>
//                                 <TableCell align="right">{student.id}</TableCell>
//                                 <TableCell align="right">
//                                     <Button onClick={() => studentStore.currentStudent = student} startIcon={<Edit />} color="primary">ערוך ציוני תלמיד</Button>
//                                     <Button onClick={() => studentStore.currentStudent = student} startIcon={<Edit />} color="primary">ערוך פרטי תלמיד</Button>
//                                     <Button onClick={() => studentStore.deleteStudent(student.id)} startIcon={<Delete />} color="primary">מחק</Button>
//                                 </TableCell>
//                             </TableRow>
//                         ))}
//                     </TableBody>
//                 </Table>
//             </TableContainer>
//             <StudentModal
//                 open={studentStore.openAddDialog}
//                 onClose={() => studentStore.openAddDialog = false}
//                 onSave={studentStore.addStudent}
//             />
//             <StudentModal
//                 open={!!studentStore.currentStudent}
//                 onClose={() => studentStore.currentStudent = null}
//                 onSave={studentStore.updateStudent}
//                 student={studentStore.currentStudent}
//             />
//         </Paper>
//     );
// });

// export default StudentTable;
