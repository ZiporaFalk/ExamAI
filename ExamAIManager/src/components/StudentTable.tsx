import { useEffect } from "react";
import { observer } from "mobx-react";
import studentStore from "./StudentStore";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, CircularProgress, Button } from "@mui/material";
import { School, Grade, Edit, Add, Delete } from "@mui/icons-material";
import StudentModal from "./StudentScoresModal";

const StudentTable = observer(() => {
    useEffect(() => {
        studentStore.fetchData();
    }, []);

    if (studentStore.loading) {
        return (
            <Typography align="center">
                <CircularProgress />
            </Typography>
        );
    }

    return (
        <Paper sx={{ maxWidth: 1200, margin: "auto", marginTop: 4, padding: 3, boxShadow: 5, borderRadius: 3, backgroundColor: "#f5f5f5" }}>
            <Typography variant="h5" align="center" gutterBottom sx={{ fontWeight: "bold", color: "#3f51b5" }}>
                <School sx={{ verticalAlign: "middle", marginRight: 1 }} /> רשימת תלמידים
            </Typography>

            <Button variant="contained" color="primary" startIcon={<Add />} onClick={() => studentStore.openAddDialog = true} sx={{ marginBottom: 2 }}>
                הוסף תלמיד
            </Button>

            <TableContainer component={Paper} sx={{ borderRadius: 2, overflow: "hidden" }}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: "#3f51b5" }}>
                            {studentStore.exams.map((exam) => (
                                <TableCell key={exam.id} align="left" sx={{ color: "white", fontWeight: "bold" }}>
                                    <Grade sx={{ verticalAlign: "middle", marginRight: 1 }} /> {exam.subject}
                                </TableCell>
                            ))}
                            <TableCell align="right" sx={{ color: "white", fontWeight: "bold" }}>מייל</TableCell>
                            <TableCell align="right" sx={{ color: "white", fontWeight: "bold" }}>סיסמה</TableCell>
                            <TableCell align="right" sx={{ color: "white", fontWeight: "bold" }}>כיתה</TableCell>
                            <TableCell align="right" sx={{ color: "white", fontWeight: "bold" }}>שם</TableCell>
                            <TableCell align="right" sx={{ color: "white", fontWeight: "bold" }}>מספר מזהה</TableCell>
                            <TableCell align="right" sx={{ color: "white", fontWeight: "bold" }}>עריכה</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {studentStore.students.map((student) => (
                            <TableRow key={student.id}>
                                {/* {studentStore.exams.map((exam) => {
                                    const score = studentStore.scores.get(student.id)?.get(exam.id) ?? "-";
                                    return <TableCell key={exam.id} align="left">{score}</TableCell>;
                                })} */}
                                {studentStore.exams.map((exam) => {
                                    const submission = studentStore.scores.get(student.id)?.get(exam.id);
                                    const score = submission ? submission.score : "-"; // ניגש לשדה הנכון
                                    return <TableCell key={exam.id} align="left">{score}</TableCell>;
                                })}
                                <TableCell align="right">{student.email}</TableCell>
                                <TableCell align="right">{student.password}</TableCell>
                                <TableCell align="right">{student.class}</TableCell>
                                <TableCell align="right">{student.name}</TableCell>
                                <TableCell align="right">{student.id}</TableCell>
                                <TableCell align="right">
                                    <Button onClick={() => studentStore.currentStudent = student} startIcon={<Edit />} color="primary">ערוך ציוני תלמיד</Button>
                                    <Button onClick={() => studentStore.currentStudent = student} startIcon={<Edit />} color="primary">ערוך פרטי תלמיד</Button>
                                    <Button onClick={() => studentStore.deleteStudent(student.id)} startIcon={<Delete />} color="primary">מחק</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <StudentModal
                open={studentStore.openAddDialog}
                onClose={() => studentStore.openAddDialog = false}
                onSave={studentStore.addStudent}
            />
            <StudentModal
                open={!!studentStore.currentStudent}
                onClose={() => studentStore.currentStudent = null}
                onSave={studentStore.updateStudent}
                student={studentStore.currentStudent}
            />
        </Paper>
    );
});
export default StudentTable;

