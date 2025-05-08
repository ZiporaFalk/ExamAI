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
                                            <DialogContent>
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