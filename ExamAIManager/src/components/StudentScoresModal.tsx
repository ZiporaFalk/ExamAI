

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
//             console.log(scores.get(2)+"scoressssssssssssss");
//         }
//     }, [student]);

//     const handleChange = (examId: number, value: string) => {
//         setScores((prev) => new Map(prev.set(examId, Number(value))));
//     };

//     const handleSubmit = async () => {
//         try {
//             if (!student) return;
//             await studentStore.updateStudentScores(student.id, scores);
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


import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material";
import { observer } from "mobx-react-lite";
import studentStore, { Student, Submission } from "./StudentStore";

const apiUrl = "https://localhost:7083/api";


interface StudentScoresModalProps {
    open: boolean;
    onClose: () => void;
    onSave: (student: Student) => Promise<void>;
    student?: Student | null;
}

const StudentScoresModal: React.FC<StudentScoresModalProps> = observer(({ open, onClose, onSave, student }) => {
    const [scores, setScores] = useState<Map<number, number>>(new Map());

    useEffect(() => {
        if (student) {
            // setScores(new Map(studentStore.getStudentScores(student.id)));
            const scoresMap = new Map<number, number>();
            studentStore.getStudentScores(student.id).forEach((submission, examId) => {
                scoresMap.set(examId, submission.score);
            });
            setScores(scoresMap);
        }
    }, [student]);

    const handleChange = (examId: number, value: string) => {
        setScores((prev) => new Map(prev.set(examId, Number(value))));
    };

    const handleSubmit = async () => {
        try {
            if (!student) return;
            const submissionsMap = new Map<number, Submission>();
            scores.forEach((score, examId) => {
                const existingSubmission = studentStore.scores.get(student.id)?.get(examId);
                submissionsMap.set(examId, {
                    id: existingSubmission?.id ?? 0,  // שמירה על ה-ID הקיים, אם יש
                    score,
                    urlFile: existingSubmission?.urlFile ?? "",
                    urlFeedback: existingSubmission?.urlFeedback ?? "",
                    studentId: student.id,
                    // examId
                });
            });
            await studentStore.updateStudentScores(student.id, submissionsMap);
            onClose();
        } catch (error) {
            console.error("Error updating student scores:", error);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>עריכת ציונים עבור {student?.name}</DialogTitle>
            <DialogContent>
                {studentStore.exams.map((exam) => (
                    <TextField
                        key={exam.id}
                        label={exam.subject}
                        value={scores.get(exam.id) ?? ""}
                        onChange={(e) => handleChange(exam.id, e.target.value)}
                        fullWidth
                        margin="dense"
                        type="number"
                    />
                ))}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">בטל</Button>
                <Button onClick={handleSubmit} color="primary" variant="contained">שמור</Button>
            </DialogActions>
        </Dialog>
    );
});

export default StudentScoresModal;
