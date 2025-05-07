import React, { useState, ChangeEvent, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material";
import axios from "axios";
import { Student } from "../types";
import studentStore from "./StudentStore";

interface StudentModalProps {
    open: boolean;
    onClose: () => void;
    onSave: (student: Student) => void;
    student?: Student | null;
} 
// const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:7083/api';
const apiUrl = 'https://localhost:7083/api';

const StudentDetailsModal: React.FC<StudentModalProps> = ({ open, onClose, student }) => {
    const [formData, setFormData] = useState<Student>(student || { id: 0, name: "", email: "", studentClass: "", password: "" });

    useEffect(() => {
        if (student) {
            setFormData(student);
        } else {
            setFormData({ id: 0, name: "", email: "", studentClass: "", password: "" });
        }
    }, [student]);

    // שינוי הערכים בטופס
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        try {
            console.log("Submitting:", formData); // ✅ בדיקה

            const url = student ? `${apiUrl}/Student/${student.id}` : `${apiUrl}/Student`;
            const method = student ? axios.put : axios.post;
            await method(url, formData);
            // onSave(formData); // כאן שולחים את הסטודנט המעודכן
            await studentStore.fetchStudents();
            onClose();
        } catch (error) {
            console.error("Error submitting student data:", error);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>{student ? "עריכת תלמיד" : "הוספת תלמיד חדש"}</DialogTitle>
            <DialogContent>
                <TextField
                    label="מספר מזהה"
                    name="id"
                    value={formData.id}
                    onChange={handleChange}
                    fullWidth
                    margin="dense"
                    disabled={!!student} // לא מאפשר שינוי ID בעריכה
                />
                <TextField
                    label="שם"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    fullWidth
                    margin="dense"
                />
                <TextField
                    label="כיתה"
                    name="studentClass"
                    value={formData.studentClass}
                    onChange={handleChange}
                    fullWidth
                    margin="dense"
                />
                <TextField
                    label="מייל"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    fullWidth
                    margin="dense"
                />
                <TextField
                    label="סיסמה"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    fullWidth
                    margin="dense"
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">בטל</Button>
                <Button onClick={handleSubmit} color="primary" variant="contained">שמור</Button>
            </DialogActions>
        </Dialog>
    );
};

export default StudentDetailsModal;