
// ....................................למחוק!!!!!!!!!!!!!!.........................








// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import {
//     Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, CircularProgress, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField
// } from "@mui/material";
// import { School, Person, Class, Grade, Edit, Add } from "@mui/icons-material";
// import StudentModal from "./components/StudentModal";
// // import StudentModal from "./StudentModal";



// // const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:7083/api';
// const apiUrl = 'https://localhost:7083/api';

// interface Student {
//     id: number;
//     name: string;
//     email: string;
//     class: string;
//     password: string;
// }

// interface Exam {
//     id: number;
//     subject: string;
// }

// interface StudentExamScore {
//     score: number;
// }

// // const StudentTable: React.FC = () => {
// const StudentTable = () => {
//     const [students, setStudents] = useState<Student[]>([]);
//     const [exams, setExams] = useState<Exam[]>([]);
//     const [scores, setScores] = useState<Map<number, Map<number, number>>>(new Map());
//     const [loading, setLoading] = useState(true);
//     const [openAddDialog, setOpenAddDialog] = useState(false);
//     const [openEditDialog, setOpenEditDialog] = useState(false);
//     const [currentStudent, setCurrentStudent] = useState<Student | undefined>(undefined);
//     const [newStudent, setNewStudent] = useState<Student>({ id: 0, name: "", email: "", class: "", password: "" });

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const [studentsRes, examsRes] = await Promise.all([
//                     axios.get<Student[]>(`${apiUrl}/Student`),
//                     axios.get<Exam[]>(`${apiUrl}/Exam`),
//                 ]);

//                 setStudents(studentsRes.data);
//                 setExams(examsRes.data);

//                 const scorePromises = studentsRes.data.flatMap((student) =>
//                     examsRes.data.map((exam) =>
//                         axios.get<StudentExamScore>(`${apiUrl}/Submission/${student.id}/${exam.id}`)
//                             .then((response) => {
//                                 setScores((prevScores) => {
//                                     const newScores = new Map(prevScores);
//                                     const studentScores = newScores.get(student.id) || new Map();
//                                     studentScores.set(exam.id, response.data.score);
//                                     newScores.set(student.id, studentScores);
//                                     return newScores;
//                                 });
//                             })
//                             .catch(() => { })
//                     )
//                 );
//                 await Promise.all(scorePromises);
//             } catch (error) {
//                 console.error("Error fetching data:", error);
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchData();
//     }, []);

//     // הוספת תלמיד חדש
//     const handleAddStudent = async () => {
//         try {
//             await axios.post(`${apiUrl}/Student`, newStudent);
//             setStudents([...students, newStudent]);
//             setOpenAddDialog(false);
//             setNewStudent({ id: 0, name: "", email: "", class: "", password: "" });
//         } catch (error) {
//             console.error("Error adding student:", error);
//         }
//     };

//     // פתיחת מודל עריכה עם נתוני תלמיד
//     const handleEditStudent = (student: Student) => {
//         setCurrentStudent(student);
//         setOpenEditDialog(true);
//     };

//     // שמירת עדכון תלמיד
//     // const handleSaveEdit = async () => {
//     //     if (!currentStudent) return;
//     //     try {
//     //         console.log(currentStudent);

//     //         await axios.put(`${apiUrl}/Student/${currentStudent.id}`, currentStudent);
//     //         setStudents(students.map((s) => (s.id === currentStudent.id ? currentStudent : s)));
//     //         setOpenEditDialog(false);
//     //     } catch (error) {
//     //         console.error("Error updating student:", error);
//     //     }
//     // };
//     const handleSaveEdit = async (updatedStudent: Student) => {
//         try {
//             console.log("Updated student:", updatedStudent); // נוודא שמודפסים הנתונים המעודכנים

//             // שלח את הבקשה לעדכון הסטודנט בשרת
//             await axios.put(`${apiUrl}/Student/${updatedStudent.id}`, updatedStudent);

//             // עדכון המערך המקומי עם הסטודנט החדש
//             setStudents((prevStudents) =>
//                 prevStudents.map((s) => (s.id === updatedStudent.id ? updatedStudent : s))
//             );
//             setOpenEditDialog(false);
//         } catch (error) {
//             console.error("Error updating student:", error);
//         }
//     };

//     return (
//         <Paper sx={{ maxWidth: 1000, margin: "auto", marginTop: 4, padding: 3, boxShadow: 5, borderRadius: 3, backgroundColor: "#f5f5f5" }}>
//             <Typography variant="h5" align="center" gutterBottom sx={{ fontWeight: "bold", color: "#3f51b5" }}>
//                 <School sx={{ verticalAlign: "middle", marginRight: 1 }} /> רשימת תלמידים
//             </Typography>

//             {loading ? (
//                 <Typography align="center">
//                     <CircularProgress />
//                 </Typography>
//             ) : (
//                 <>
//                     <Button variant="contained" color="primary" startIcon={<Add />} onClick={() => setOpenAddDialog(true)} sx={{ marginBottom: 2 }}>
//                         הוסף תלמיד
//                     </Button>

//                     <TableContainer component={Paper} sx={{ borderRadius: 2, overflow: "hidden" }}>
//                         <Table>
//                             <TableHead>
//                                 <TableRow sx={{ backgroundColor: "#3f51b5" }}>
//                                     {exams.map((exam) => (
//                                         <TableCell key={exam.id} align="left" sx={{ color: "white", fontWeight: "bold" }}>
//                                             <Grade sx={{ verticalAlign: "middle", marginRight: 1 }} /> {exam.subject}
//                                         </TableCell>
//                                     ))}
//                                     <TableCell align="right" sx={{ color: "white", fontWeight: "bold" }}>מייל</TableCell>
//                                     <TableCell align="right" sx={{ color: "white", fontWeight: "bold" }}>סיסמה</TableCell>
//                                     <TableCell align="right" sx={{ color: "white", fontWeight: "bold" }}>כיתה</TableCell>
//                                     <TableCell align="right" sx={{ color: "white", fontWeight: "bold" }}>שם</TableCell>
//                                     <TableCell align="right" sx={{ color: "white", fontWeight: "bold" }}>מספר מזהה</TableCell>
//                                     <TableCell align="right" sx={{ color: "white", fontWeight: "bold" }}>עריכה</TableCell>
//                                 </TableRow>
//                             </TableHead>
//                             <TableBody>
//                                 {students.map((student) => (
//                                     <TableRow key={student.id}>
//                                         {exams.map((exam) => {
//                                             const score = scores.get(student.id)?.get(exam.id) ?? "-";
//                                             return <TableCell key={exam.id} align="left">{score}</TableCell>;
//                                         })}
//                                         <TableCell align="right">{student.email}</TableCell>
//                                         <TableCell align="right">{student.password}</TableCell>
//                                         <TableCell align="right">{student.class}</TableCell>
//                                         <TableCell align="right">{student.name}</TableCell>
//                                         <TableCell align="right">{student.id}</TableCell>
//                                         <TableCell align="right">
//                                             <Button onClick={() => handleEditStudent(student)} startIcon={<Edit />} color="primary">ערוך</Button>
//                                         </TableCell>
//                                     </TableRow>
//                                 ))}
//                             </TableBody>
//                         </Table>
//                     </TableContainer>
//                     <StudentModal
//                         open={openAddDialog}
//                         onClose={() => setOpenAddDialog(false)}
//                         onSave={handleAddStudent}
//                     />
//                     <StudentModal
//                         open={openEditDialog}
//                         onClose={() => setOpenEditDialog(false)}
//                         onSave={handleSaveEdit}
//                         student={currentStudent}
//                     />
//                 </>
//             )}
//         </Paper>
//     );
// };

// export default StudentTable;