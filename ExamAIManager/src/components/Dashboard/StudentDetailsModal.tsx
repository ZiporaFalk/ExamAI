import React, { useState, ChangeEvent, useEffect } from "react";
import {
    Dialog, DialogContent, DialogActions, Button, TextField, IconButton,
    Typography, Box, Paper, InputAdornment
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import ClassIcon from '@mui/icons-material/Class';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { Student } from "../../utils/types";
import studentStore from "./StudentStore";
import "../../stylies/StudentDetailsModal.css"
import axiosInstance from "../../utils/axiosInstance";

interface StudentModalProps {
    open: boolean;
    onClose: () => void;
    student?: Student | null;
}

const StudentDetailsModal: React.FC<StudentModalProps> = ({ open, onClose, student }) => {
    const [formData, setFormData] = useState<Student>(student || { id: 0, name: "", email: "", studentClass: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState("")

    useEffect(() => {
        if (student) {
            setFormData(student);
        } else {
            setFormData({ id: 0, name: "", email: "", studentClass: "", password: "" });
        }
    }, [student]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleTogglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async () => {
        try {
            console.log("Submitting:", formData);
            const url = student ? `/Student/${student.id}` : `/Student`;
            const method = student ? axiosInstance.put : axiosInstance.post;
            await method(url, formData);
            await studentStore.fetchStudents();
            onClose();
        } catch (error: any) {
            setMessage("vchbtydghjMP,;;L,MNMI")
            console.error("Error submitting student data:", error);
            if (error.response?.status === 400) {
                setMessage(
                    `.This student does not exist in the Google Sheets`
                );
            } else {
                setMessage("An unexpected error occurred while submitting the student data.");
            }
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
            dir="rtl"
            className="student-dialog"
        >
            <Box className="dialog-header">
                <Typography variant="h5" fontWeight={600} color="#ffffff">
                    {student ? "Edit Student" : "Add New Student"}
                </Typography>
                <IconButton onClick={onClose} size="small" sx={{ color: '#ffffff' }}>
                    <CloseIcon />
                </IconButton>
            </Box>

            <DialogContent sx={{ padding: 0 }}>
                <Box className="content-container">
                    <Paper className="input-container" elevation={0}>
                        <TextField
                            label="Name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            fullWidth
                            className="styled-input"
                            InputProps={{
                                startAdornment: <PersonIcon sx={{ mr: 1 }} />,
                            }}
                        />
                        <TextField
                            label="Class"
                            name="studentClass"
                            value={formData.studentClass}
                            onChange={handleChange}
                            fullWidth
                            className="styled-input"
                            InputProps={{
                                startAdornment: <ClassIcon sx={{ mr: 1 }} />,
                            }}
                        />
                        <TextField
                            label="Gmail"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            fullWidth
                            className="styled-input"
                            InputProps={{
                                startAdornment: <EmailIcon sx={{ mr: 1 }} />,
                            }}
                        />
                        <TextField
                            label="Password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            value={formData.password}
                            onChange={handleChange}
                            fullWidth
                            className="styled-input"
                            InputProps={{
                                startAdornment: <LockIcon sx={{ mr: 1 }} />,
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={handleTogglePasswordVisibility}
                                            edge="end"
                                            className="password-visibility-toggle"
                                        >
                                            {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />
                        <h4 style={{color:"rgba(168, 8, 8)"}}>{message}</h4>
                    </Paper>
                </Box>
            </DialogContent>

            <DialogActions sx={{ padding: 3, paddingTop: 0, justifyContent: 'flex-start', gap: 2 }}>
                <Button onClick={handleSubmit} variant="contained" className="save-button">
                    Save
                </Button>
                <Button onClick={onClose} className="cancel-button">
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default StudentDetailsModal;