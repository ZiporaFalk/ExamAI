
import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material";
import { observer } from "mobx-react-lite";
import { StudentScoresModalProps, Submission } from "../types";
import studentStore from "./StudentStore";

// const apiUrl = "https://localhost:7083/api";
const StudentScoresModal: React.FC<StudentScoresModalProps> = observer(({ open, onClose, student }) => {
    const [scores, setScores] = useState<Map<number, number>>(new Map());
    useEffect(() => {
        console.log(student);

        if (student) {
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
                    <div key={exam.id} style={{ display: "flex", alignItems: "center" }}>
                        <TextField
                            key={exam.id}
                            label={exam.subject}
                            value={scores.get(exam.id) ?? ""}
                            onChange={(e) => handleChange(exam.id, e.target.value)}
                            fullWidth
                            margin="dense"
                            type="number"
                        />
                    </div>
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
