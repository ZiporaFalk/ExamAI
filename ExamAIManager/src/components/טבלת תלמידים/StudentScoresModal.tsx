
// import { Dialog, DialogTitle, DialogContent, Table, TableHead, TableRow, TableCell, TableBody, Button, TextField, Box, IconButton, DialogActions, Typography } from "@mui/material";
// import { observer } from "mobx-react";
// import { useState } from "react";
// import { Visibility } from "@mui/icons-material";
// import studentStore from "./StudentStore";

// const StudentScoresModal = observer(({ open, onClose, student }: any) => {
//     const [editedScores, setEditedScores] = useState<Map<number, Map<number, number>>>(new Map());
//     const [previewUrl, setPreviewUrl] = useState<string | null>(null);

//     if (!student) {
//         console.log(student);

//         return null;
//     }

//     const handleScoreChange = (studentId: number, examId: number, score: string) => {
//         const numericValue = parseFloat(score);
//         if (!isNaN(numericValue)) {
//             setEditedScores(prev => {
//                 const newMap = new Map(prev);
//                 if (!newMap.has(studentId)) {
//                     newMap.set(studentId, new Map());
//                 }
//                 const studentMap = newMap.get(studentId)!;
//                 studentMap.set(examId, numericValue);
//                 return newMap;
//             });
//         }
//     };

//     const handleSave = () => {
//         editedScores.forEach((studentMap, studentId) => {
//             studentMap.forEach((score, examId) => {
//                 studentStore.updateScore(studentId, examId, score);
//             });
//         });
//         onClose();
//     };

//     const openPreview = (url: string) => {
//         setPreviewUrl(url);
//     };

//     const closePreview = () => {
//         setPreviewUrl(null);
//     };

//     return (
//         <>
//             <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
//                 <DialogTitle>ציוני תלמיד - {student.name}</DialogTitle>
//                 <DialogContent>
//                     <Table>
//                         <TableHead>
//                             <TableRow>
//                                 <TableCell>צפייה</TableCell>
//                                 <TableCell>ציון</TableCell>
//                                 <TableCell>תאריך מבחן</TableCell>
//                                 <TableCell>מקצוע</TableCell>
//                             </TableRow>
//                         </TableHead>
//                         <TableBody>
//                             {studentStore.exams.map((exam) => {
//                                 const submission = studentStore.scores.get(student.id!)?.get(exam.id!);
//                                 const scoreValue = editedScores.has(student.id!)
//                                     ? editedScores.get(student.id())!.get(exam.id!)?.toString() ?? ''
//                                     : submission?.score?.toString() ?? '';

//                                 return (
//                                     <TableRow key={exam.id}>
//                                         <TableCell>
//                                             {submission?.urlFile ? (
//                                                 <IconButton onClick={() => openPreview(submission.urlFile)} color="primary">
//                                                     <Visibility />
//                                                 </IconButton>
//                                             ) : (
//                                                 '-'
//                                             )}
//                                         </TableCell>
//                                         <TableCell>
//                                             <TextField
//                                                 size="small"
//                                                 type="number"
//                                                 value={scoreValue}
//                                                 onChange={(e) => handleScoreChange(student.id!, exam.id!, e.target.value)}
//                                                 sx={{ width: 80 }}
//                                             />
//                                         </TableCell>
//                                         <TableCell>{new Date(exam.dateExam).toLocaleDateString()}</TableCell>
//                                         <TableCell>{exam.subject}</TableCell>
//                                     </TableRow>
//                                 );
//                             })}
//                         </TableBody>
//                     </Table>
//                 </DialogContent>
//                 <DialogActions>
//                     <Button onClick={onClose}>ביטול</Button>
//                     <Button onClick={handleSave} variant="contained" color="primary">שמור שינויים</Button>
//                 </DialogActions>
//             </Dialog>

//             {/* תצוגת קובץ בגודל מלא */}
//             <Dialog open={!!previewUrl} onClose={closePreview} maxWidth="lg" fullWidth>
//                 <DialogTitle>צפייה בקובץ מבחן</DialogTitle>
//                 <DialogContent>
//                     {previewUrl && (
//                         <Box sx={{ height: "80vh" }}>
//                             <iframe
//                                 src={previewUrl}
//                                 title="preview"
//                                 width="100%"
//                                 height="100%"
//                                 style={{ border: "none" }}
//                             />
//                         </Box>
//                     )}
//                 </DialogContent>
//                 <DialogActions>
//                     <Button onClick={closePreview}>סגור</Button>
//                 </DialogActions>
//             </Dialog>
//         </>
//     );
// });

// export default StudentScoresModal;



// נסיונות שלא ממש עבדו- עידכן את כל המבחנים

import { Dialog, DialogTitle, DialogContent, Table, TableHead, TableRow, TableCell, TableBody, Button, TextField, Box, IconButton, DialogActions, Typography } from "@mui/material";
import { observer } from "mobx-react";
import { useState } from "react";
import { Visibility } from "@mui/icons-material";
import studentStore from "./StudentStore";
import axios from "axios";
const apiUrl = 'https://localhost:7083/api';

const StudentScoresModal = observer(({ open, onClose, student }: any) => {
    const [editedScores, setEditedScores] = useState<Map<number, Map<number, number>>>(new Map());
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    if (!student) return null;

    const handleScoreChange = (studentId: number, examId: number, score: string) => {
        const numericValue = parseFloat(score);
        if (!isNaN(numericValue)) {
            setEditedScores(prev => {
                const newMap = new Map(prev);
                if (!newMap.has(studentId)) {
                    newMap.set(studentId, new Map());
                }
                const studentMap = newMap.get(studentId)!;
                studentMap.set(examId, numericValue); 
                return newMap;
            });
        }
    };

    const handleSave = () => {
        editedScores.forEach((studentMap, studentId) => {
            studentMap.forEach((score, examId) => {
                studentStore.updateScore(studentId, examId, score);
            });
        });
        onClose();
    };

    const openPreview = async (url: string) => {
        console.log(url);
        // url = `exams/Students/מערכות הפעלה-י' אייר תשפ"ג/ה3/ריקי_קראוס_feedback.docx`
        // url = `exams/Students/מערכות הפעלה-י' אייר תשפ\"ג/ה3/ריקי קראוס.jpg`
        setPreviewUrl(url);
        try {
            const response = await axios.get(`${apiUrl}/ExamUpload/download-url`, {
                params: {
                    Url: encodeURIComponent(url),
                    IsStudentTest: true
                }
            });
            const presignedUrl = response.data.url;
            setPreviewUrl(presignedUrl);
            // window.open(presignedUrl, '_blank');
        } catch (error) {
            console.error('שגיאה בקבלת הקישור:', error);
            alert('אירעה שגיאה בעת ניסיון לפתוח את הקובץ.');
        }
    };

    const closePreview = () => {
        setPreviewUrl(null);
    };

    return (
        <>
            <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
                <DialogTitle>ציוני תלמיד - {student.name}</DialogTitle>
                <DialogContent>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>צפייה</TableCell>
                                <TableCell>ציון</TableCell>
                                <TableCell>תאריך מבחן</TableCell>
                                <TableCell>מקצוע</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {studentStore.exams.map((exam) => {
                                console.log(studentStore.scores.get(student.id)?.get(exam.id!));
                                const submission = studentStore.scores.get(student.id!)?.get(exam.id!);
                                console.log("urlFile:", submission?.file_Url);
                                console.log("id:", submission?.id);
                                console.log("ציון:", submission?.score);
                                console.log("ציון:", submission?.studentId);
                                const scoreValue = editedScores.get(student.id!)?.get(exam.id!)?.toString()
                                    ?? submission?.score?.toString() ?? '';
                                return (
                                    <TableRow key={exam.id}>
                                        <TableCell>
                                            {submission?.file_Url ? (
                                                <IconButton onClick={() => openPreview(submission.file_Url)} color="primary">
                                                    <Visibility />
                                                </IconButton>
                                            ) : (
                                                '-'
                                            )}
                                            {/* <IconButton onClick={() => openPreview("exams/Students/מערכות הפעלה-י' אייר תשפ\"ג/ה3/ריקי קראוס.jpg")} color="primary">
                                                <Visibility />
                                            </IconButton> */}
                                            <DialogContent>
                                                {/* {previewUrl && (
                                                    <Box sx={{// height: "80vh", display: 'flex', justifyContent: 'center', alignItems: 'center'
                                                        // display: 'flex',
                                                        // justifyContent: 'center',
                                                        // alignItems: 'center',
                                                        // maxHeight: '80vh',
                                                        // overflow: 'hidden'
                                                    }}>
                                                        <img src={previewUrl} alt="preview" style={{ maxHeight: "100%", maxWidth: "100%" }} />
                                                    </Box>
                                                )} */}
                                            </DialogContent>
                                        </TableCell>
                                        <TableCell>
                                            <TextField
                                                size="small"
                                                type="number"
                                                value={scoreValue}
                                                onChange={(e) => handleScoreChange(student.id!, exam.id!, e.target.value)} 
                                                sx={{ width: 80 }}
                                            />
                                        </TableCell>
                                        <TableCell>{exam.dateExam}</TableCell>
                                        <TableCell>{exam.subject}</TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>ביטול</Button>
                    <Button onClick={handleSave} variant="contained" color="primary">שמור שינויים</Button>
                </DialogActions>
            </Dialog>
            {/* תצוגת קובץ בגודל מלא */}
            <Dialog open={!!previewUrl} onClose={closePreview} maxWidth="lg" fullWidth>
                <DialogTitle style={{ textAlign: 'right' }}>צפייה בקובץ מבחן</DialogTitle>
                <DialogContent>
                    {previewUrl && (
                        // לא טוב לתמונה
                        // <Box sx={{ height: "80vh" }}>
                        //     <iframe
                        //         src={previewUrl}
                        //         title="preview"
                        //         width="100%"
                        //         height="100%"
                        //         style={{ border: "none" }}
                        //     />
                        // </Box>
                        <Box
                            sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', overflow: 'hidden', p: 2 }}>
                            <img
                                src={previewUrl}
                                alt="preview"
                                style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', display: 'block' }} />
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={closePreview}>סגור</Button>
                    {previewUrl && (
                        <a href={previewUrl} download style={{ textDecoration: 'none' }}>
                            <Button variant="outlined" color="primary">הורד קובץ</Button>
                        </a>
                    )}
                </DialogActions>
            </Dialog>
        </>
    );
});

export default StudentScoresModal;

// לפני הבלאגן
// // StudentScoresModal.tsx
// import { Dialog, DialogTitle, DialogContent, Table, TableHead, TableRow, TableCell, TableBody, Button, Typography } from "@mui/material";
// import studentStore from "./StudentStore";

// const StudentScoresModal = ({ open, onClose, student }: any) => {
//     if (!student) return null;

//     return (
//         <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
//             <DialogTitle>ציונים של {student.name}</DialogTitle>
//             <DialogContent>
//                 {student.exams?.length === 0 && <Typography>אין ציונים זמינים</Typography>}

//                 <Table>
//                     <TableHead>
//                         <TableRow>
//                             <TableCell>קובץ</TableCell>
//                             <TableCell>ציון</TableCell>
//                             <TableCell>מקצוע</TableCell>
//                         </TableRow>
//                     </TableHead>
//                     <TableBody>
//                         {studentStore.exams.map(exam => {
//                             const submission = studentStore.scores.get(student.id!)?.get(exam.id!);
//                             if (!submission) return null;

//                             return (
//                                 <TableRow key={exam.id}>
//                                     <TableCell>
//                                         <Button
//                                             href={submission.urlFile}
//                                             target="_blank"
//                                             rel="noopener noreferrer"
//                                             variant="outlined"
//                                             size="small"
//                                         >
//                                             צפייה
//                                         </Button>
//                                     </TableCell>
//                                     <TableCell>{submission.score}</TableCell>
//                                     <TableCell>{exam.subject}</TableCell>

//                                 </TableRow>
//                             );
//                         })}
//                     </TableBody>
//                 </Table>
//             </DialogContent>
//         </Dialog>
//     );
// };

// export default StudentScoresModal;



// import React, { useState, useEffect } from "react";
// import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material";
// import { observer } from "mobx-react-lite";
// import { StudentScoresModalProps, Submission } from "../types";
// import studentStore from "./StudentStore";

// // const apiUrl = "https://localhost:7083/api";
// const StudentScoresModal: React.FC<StudentScoresModalProps> = observer(({ open, onClose, student }) => {
//     const [scores, setScores] = useState<Map<number, number>>(new Map());
//     useEffect(() => {
//         console.log(student);
//         if (student) {
//             const scoresMap = new Map<number, number>();
//             student.id && studentStore.getStudentScores(student.id).forEach((submission, examId) => {
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
//                 const existingSubmission = student.id && studentStore.scores.get(student.id)?.get(examId);
//                 submissionsMap.set(examId, {
//                     id: existingSubmission ? existingSubmission?.id : 0,  // שמירה על ה-ID הקיים, אם יש
//                     score,
//                     urlFile: existingSubmission ? existingSubmission?.urlFile : "",
//                     urlFeedback: existingSubmission ? existingSubmission?.urlFeedback : "",
//                     studentId: student.id ? student.id : 0,
//                 });
//             });
//             student.id && await studentStore.updateStudentScores(student.id, submissionsMap);
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
//                     <div key={exam.id} style={{ display: "flex", alignItems: "center" }}>
//                         <TextField
//                             key={exam.id}
//                             label={exam.subject}
//                             value={scores.get(exam.id ? exam.id : 0)}
//                             onChange={(e) => handleChange(exam.id ? exam.id : 0, e.target.value)}
//                             fullWidth
//                             margin="dense"
//                             type="number"
//                         />
//                     </div>
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
