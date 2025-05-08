
import { useEffect, useState } from "react";
import { observer } from "mobx-react";
import studentStore from "./StudentStore";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, CircularProgress, Button, TextField, Box } from "@mui/material";
import { School, Edit, Add, Delete, Clear, FilterList, Download } from "@mui/icons-material";
import StudentDetailsModal from "./StudentDetailsModal";
import StudentScoresModal from "./StudentScoresModal";
import * as XLSX from "xlsx";

const StudentTable = observer(() => {
    const [filterClass, setFilterClass] = useState(""); // 🔹 הוספה: סטייט לכיתה מסוננת

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
    const exportToExcel = () => {
        const data: any[] = [];
    
        studentStore.filteredStudents.forEach((student) => {
            studentStore.exams.forEach((exam) => {
                const submission = studentStore.scores.get(student.id!)?.get(exam.id!);
                data.push({
                    'מזהה תלמיד': student.id,
                    'שם תלמיד': student.name,
                    'כיתה': student.studentClass,
                    'מייל': student.email,
                    'מבחן': exam.subject,
                    'תאריך מבחן': exam.dateExam,
                    'ציון': submission?.score //?? '',
                });
            });
        });
    
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Students Scores");
    
        XLSX.writeFile(workbook, "students_scores.xlsx");
    };
    
    return (
        <Paper sx={{ maxWidth: 1200, margin: "auto", marginTop: 4, padding: 3, boxShadow: 5, borderRadius: 3, backgroundColor: "#f5f5f5" }}>
            <Typography variant="h5" align="center" gutterBottom sx={{ fontWeight: "bold", color: "#3f51b5" }}>
                <School sx={{ verticalAlign: "middle", marginRight: 1 }} /> רשימת תלמידים
            </Typography>

            <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ marginBottom: 2 }}>
                <Box display="flex" alignItems="center">
                    <TextField // 🔹 הוספה: שדה להזנת כיתה לסינון
                        label="סנן לפי כיתה"
                        variant="outlined"
                        size="small"
                        value={filterClass}
                        onChange={(e) => setFilterClass(e.target.value)}
                        sx={{ width: 180, backgroundColor: "#e3f2fd", borderRadius: 1, marginRight: 1 }}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => studentStore.setFilteredClass(filterClass)}
                        sx={{ marginRight: 1 }}
                        startIcon={<FilterList />}>
                        סנן
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => { setFilterClass(""); studentStore.setFilteredClass("") }}
                        sx={{ marginRight: 1 }}
                        startIcon={<Clear />}>
                        נקה סינון
                    </Button>
                </Box>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<Add />}
                    onClick={() => studentStore.openAddDialog = true}
                    sx={{ fontWeight: "bold" }}>
                    הוסף תלמיד
                </Button>
                <Button
                   variant="outlined"
                   color="secondary"
                   startIcon={<Download />}
                   onClick={exportToExcel}
                    sx={{ fontWeight: "bold", marginRight: 1 }}
>
    ייצוא לאקסל
</Button>

            </Box>
            <TableContainer component={Paper} sx={{ borderRadius: 2, overflow: "hidden" }}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: "#3f51b5" }}>
                            <TableCell align="right" sx={{ color: "white", fontWeight: "bold" }}>מייל</TableCell>
                            <TableCell align="right" sx={{ color: "white", fontWeight: "bold" }}>סיסמה</TableCell>
                            <TableCell align="right" sx={{ color: "white", fontWeight: "bold" }}>כיתה</TableCell>
                            <TableCell align="right" sx={{ color: "white", fontWeight: "bold" }}>שם</TableCell>
                            <TableCell align="right" sx={{ color: "white", fontWeight: "bold" }}>מספר מזהה</TableCell>
                            <TableCell align="right" sx={{ color: "white", fontWeight: "bold" }}>עריכה</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {studentStore.filteredStudents.map((student) => ( // 🔹 הוספה: שימוש ברשימת התלמידים המסוננים
                            <TableRow key={student.id}>
                                <TableCell align="right">{student.email}</TableCell>
                                <TableCell align="right">{student.password}</TableCell>
                                <TableCell align="right">{student.studentClass}</TableCell>
                                <TableCell align="right">{student.name}</TableCell>
                                <TableCell align="right">{student.id}</TableCell>
                                <TableCell align="right">
                                    <Button onClick={() => { studentStore.currentStudent = student; studentStore.openScoresDialog = true }} startIcon={<Edit />} color="primary">ערוך ציוני תלמיד</Button>
                                    <Button onClick={() => { studentStore.currentStudent = student; studentStore.openDetailsDialog = true }} startIcon={<Edit />} color="primary">ערוך פרטי תלמיד</Button>
                                    <Button onClick={() => studentStore.deleteStudent(student.id!)} startIcon={<Delete />} color="primary">מחק</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <StudentDetailsModal
                open={studentStore.openAddDialog}
                onClose={() => studentStore.openAddDialog = false}
                onSave={studentStore.addStudent}
            />

            <StudentScoresModal
                open={!!studentStore.currentStudent && studentStore.openScoresDialog}
                onClose={() => { studentStore.currentStudent = null; studentStore.openScoresDialog = false }}
                onSave={studentStore.updateStudent}
                // student={studentStore.currentStudent}
                student={studentStore.currentStudent}
            />
            <StudentDetailsModal
                open={studentStore.openDetailsDialog}
                onClose={() => studentStore.openDetailsDialog = false}
                onSave={studentStore.addStudent}
                student={studentStore.currentStudent}
            />
        </Paper>
    );
});

export default StudentTable;















// import { useEffect, useState } from "react";
// import { observer } from "mobx-react";
// import studentStore from "./StudentStore";
// import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, CircularProgress, Button, TextField, Box } from "@mui/material";
// import { School, Edit, Add, Delete, Clear, FilterList } from "@mui/icons-material";
// import StudentDetailsModal from "./StudentDetailsModal";
// import StudentScoresModal from "./StudentScoresModal";

// const StudentTable = observer(() => {
//     const [filterClass, setFilterClass] = useState(""); // 🔹 הוספה: סטייט לכיתה מסוננת

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

//             <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ marginBottom: 2 }}>
//                 <Box display="flex" alignItems="center">
//                     <TextField // 🔹 הוספה: שדה להזנת כיתה לסינון
//                         label="סנן לפי כיתה"
//                         variant="outlined"
//                         size="small"
//                         value={filterClass}
//                         onChange={(e) => setFilterClass(e.target.value)}
//                         sx={{ width: 180, backgroundColor: "#e3f2fd", borderRadius: 1, marginRight: 1 }}
//                     />
//                     <Button
//                         variant="contained"
//                         color="primary"
//                         size="small"
//                         onClick={() => studentStore.setFilteredClass(filterClass)}
//                         sx={{ marginRight: 1 }}
//                         startIcon={<FilterList />}>
//                         סנן
//                     </Button>
//                     <Button
//                         variant="contained"
//                         color="primary"
//                         size="small"
//                         onClick={() => { setFilterClass(""); studentStore.setFilteredClass("") }}
//                         sx={{ marginRight: 1 }}
//                         startIcon={<Clear />}>
//                         נקה סינון
//                     </Button>
//                 </Box>
//                 <Button
//                     variant="contained"
//                     color="primary"
//                     startIcon={<Add />}
//                     onClick={() => studentStore.openAddDialog = true}
//                     sx={{ fontWeight: "bold" }}>
//                     הוסף תלמיד
//                 </Button>
//             </Box>
//             <TableContainer component={Paper} sx={{ borderRadius: 2, overflow: "hidden" }}>
//                 <Table>
//                     <TableHead>
//                         <TableRow sx={{ backgroundColor: "#3f51b5" }}>
//                             <TableCell align="right" sx={{ color: "white", fontWeight: "bold" }}>מייל</TableCell>
//                             <TableCell align="right" sx={{ color: "white", fontWeight: "bold" }}>סיסמה</TableCell>
//                             <TableCell align="right" sx={{ color: "white", fontWeight: "bold" }}>כיתה</TableCell>
//                             <TableCell align="right" sx={{ color: "white", fontWeight: "bold" }}>שם</TableCell>
//                             <TableCell align="right" sx={{ color: "white", fontWeight: "bold" }}>מספר מזהה</TableCell>
//                             <TableCell align="right" sx={{ color: "white", fontWeight: "bold" }}>עריכה</TableCell>
//                         </TableRow>
//                     </TableHead>
//                     <TableBody>
//                         {studentStore.filteredStudents.map((student) => ( // 🔹 הוספה: שימוש ברשימת התלמידים המסוננים
//                             <TableRow key={student.id}>
//                                 <TableCell align="right">{student.email}</TableCell>
//                                 <TableCell align="right">{student.password}</TableCell>
//                                 <TableCell align="right">{student.studentClass}</TableCell>
//                                 <TableCell align="right">{student.name}</TableCell>
//                                 <TableCell align="right">{student.id}</TableCell>
//                                 <TableCell align="right">
//                                     <Button onClick={() => { studentStore.currentStudent = student; studentStore.openScoresDialog = true }} startIcon={<Edit />} color="primary">ערוך ציוני תלמיד</Button>
//                                     <Button onClick={() => { studentStore.currentStudent = student; studentStore.openDetailsDialog = true }} startIcon={<Edit />} color="primary">ערוך פרטי תלמיד</Button>
//                                     <Button onClick={() => studentStore.deleteStudent(student.id!)} startIcon={<Delete />} color="primary">מחק</Button>
//                                 </TableCell>
//                             </TableRow>
//                         ))}
//                     </TableBody>
//                 </Table>
//             </TableContainer>

//             <StudentDetailsModal
//                 open={studentStore.openAddDialog}
//                 onClose={() => studentStore.openAddDialog = false}
//                 onSave={studentStore.addStudent}
//             />

//             <StudentScoresModal
//                 open={!!studentStore.currentStudent && studentStore.openScoresDialog}
//                 onClose={() => { studentStore.currentStudent = null; studentStore.openScoresDialog = false }}
//                 onSave={studentStore.updateStudent}
//                 // student={studentStore.currentStudent}
//                 student={studentStore.currentStudent}
//             />
//             <StudentDetailsModal
//                 open={studentStore.openDetailsDialog}
//                 onClose={() => studentStore.openDetailsDialog = false}
//                 onSave={studentStore.addStudent}
//                 student={studentStore.currentStudent}
//             />
//         </Paper>
//     );
// });

// export default StudentTable;

