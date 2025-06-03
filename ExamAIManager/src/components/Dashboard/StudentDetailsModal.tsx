// שלי מקורי
// import React, { useState, ChangeEvent, useEffect } from "react";
// import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material";
// import axios from "axios";
// import { Student } from "../types";
// import studentStore from "./StudentStore";

// interface StudentModalProps {
//     open: boolean;
//     onClose: () => void; 
//     onSave: (student: Student) => void;
//     student?: Student | null;
// } 
// // const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:7083/api';
// const apiUrl = 'https://localhost:7083/api';

// const StudentDetailsModal: React.FC<StudentModalProps> = ({ open, onClose, student }) => {
//     const [formData, setFormData] = useState<Student>(student || { id: 0, name: "", email: "", studentClass: "", password: "" });

//     useEffect(() => {
//         if (student) {
//             setFormData(student);
//         } else {
//             setFormData({ id: 0, name: "", email: "", studentClass: "", password: "" });
//         }
//     }, [student]);

//     // שינוי הערכים בטופס
//     const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
//         setFormData({ ...formData, [e.target.name]: e.target.value });
//     };
//     const handleSubmit = async () => {
//         try {
//             console.log("Submitting:", formData); // ✅ בדיקה
//             const url = student ? `${apiUrl}/Student/${student.id}` : `${apiUrl}/Student`;
//             const method = student ? axios.put : axios.post;
//             await method(url, formData);
//             // onSave(formData); // כאן שולחים את הסטודנט המעודכן
//             await studentStore.fetchStudents();
//             onClose();
//         } catch (error) {
//             console.error("Error submitting student data:", error);
//         }
//     };
//     return (
//         <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
//             <DialogTitle>{student ? "עריכת תלמיד" : "הוספת תלמיד חדש"}</DialogTitle>
//             <DialogContent>
//                 <TextField
//                     label="מספר מזהה"
//                     name="id"
//                     value={formData.id}
//                     onChange={handleChange}
//                     fullWidth
//                     margin="dense"
//                     disabled={!!student} // לא מאפשר שינוי ID בעריכה
//                 />
//                 <TextField
//                     label="שם"
//                     name="name"
//                     value={formData.name}
//                     onChange={handleChange}
//                     fullWidth
//                     margin="dense"
//                 />
//                 <TextField
//                     label="כיתה"
//                     name="studentClass"
//                     value={formData.studentClass}
//                     onChange={handleChange}
//                     fullWidth
//                     margin="dense"
//                 />
//                 <TextField
//                     label="מייל"
//                     name="email"
//                     value={formData.email}
//                     onChange={handleChange}
//                     fullWidth
//                     margin="dense"
//                 />
//                 <TextField
//                     label="סיסמה"
//                     name="password"
//                     value={formData.password}
//                     onChange={handleChange}
//                     fullWidth
//                     margin="dense"
//                 />
//             </DialogContent>
//             <DialogActions>
//                 <Button onClick={onClose} color="secondary">בטל</Button>
//                 <Button onClick={handleSubmit} color="primary" variant="contained">שמור</Button>
//             </DialogActions>
//         </Dialog>
//     );
// };
// export default StudentDetailsModal;



// קלאוד ראשון מצוין

// import React, { useState, ChangeEvent, useEffect } from "react";
// import { Dialog, DialogContent, DialogActions, Button, TextField, IconButton, Typography, Box, Paper } from "@mui/material";
// import CloseIcon from '@mui/icons-material/Close';
// import PersonIcon from '@mui/icons-material/Person';
// import EmailIcon from '@mui/icons-material/Email';
// import ClassIcon from '@mui/icons-material/Class';
// import LockIcon from '@mui/icons-material/Lock';
// import BadgeIcon from '@mui/icons-material/Badge';
// import { styled } from '@mui/material/styles';
// import axios from "axios";
// import { Student } from "../types";
// import studentStore from "./StudentStore";

// interface StudentModalProps {
//     open: boolean;
//     onClose: () => void;
//     onSave: (student: Student) => void;
//     student?: Student | null;
// }

// // const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:7083/api';
// const apiUrl = 'https://localhost:7083/api';

// // Custom styling for components
// const StyledDialog = styled(Dialog)(({ theme }) => ({
//     '& .MuiDialog-paper': {
//         borderRadius: 16,
//         background: 'linear-gradient(135deg, #0a192f 0%, #112240 100%)',
//         boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
//         border: '1px solid rgba(255, 255, 255, 0.08)',
//         overflow: 'hidden',
//     }
// }));

// const DialogHeader = styled(Box)(({ theme }) => ({
//     background: 'linear-gradient(90deg, #55b9f3 0%, #7f5af0 100%)',
//     padding: theme.spacing(2, 3),
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'space-between',
// }));

// const StyledTextField = styled(TextField)(({ theme }) => ({
//     margin: theme.spacing(1.5, 0),
//     '& .MuiOutlinedInput-root': {
//         borderRadius: 12,
//         background: 'rgba(255, 255, 255, 0.05)',
//         '&:hover': {
//             background: 'rgba(255, 255, 255, 0.08)',
//         },
//         '&.Mui-focused': {
//             background: 'rgba(255, 255, 255, 0.08)',
//         }
//     },
//     '& .MuiOutlinedInput-notchedOutline': {
//         borderColor: 'rgba(255, 255, 255, 0.15)',
//     },
//     '& .MuiInputLabel-root': {
//         color: 'rgba(255, 255, 255, 0.7)',
//     },
//     '& .MuiOutlinedInput-input': {
//         color: 'rgba(255, 255, 255, 0.9)',
//     },
//     '& .MuiInputAdornment-root': {
//         color: 'rgba(255, 255, 255, 0.5)',
//     },
//     '& .MuiSvgIcon-root': {
//         color: 'rgba(255, 255, 255, 0.5)',
//     },
// }));

// const StyledButton = styled(Button)(({ theme }) => ({
//     borderRadius: 28,
//     padding: theme.spacing(1, 3),
//     textTransform: 'none',
//     fontSize: 16,
//     fontWeight: 600,
//     boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
//     transition: 'all 0.3s ease',
// }));

// const SaveButton = styled(StyledButton)(({ theme }) => ({
//     background: 'linear-gradient(90deg, #55b9f3 0%, #7f5af0 100%)',
//     color: '#ffffff',
//     '&:hover': {
//         background: 'linear-gradient(90deg, #44a8e2 0%, #6e49df 100%)',
//         boxShadow: '0 6px 16px rgba(0, 0, 0, 0.2)',
//         transform: 'translateY(-2px)',
//     }
// }));

// const CancelButton = styled(StyledButton)(({ theme }) => ({
//     background: 'rgba(255, 255, 255, 0.08)',
//     color: 'rgba(255, 255, 255, 0.7)',
//     '&:hover': {
//         background: 'rgba(255, 255, 255, 0.12)',
//     }
// }));

// const ContentContainer = styled(Box)(({ theme }) => ({
//     padding: theme.spacing(3, 3, 2),
// }));

// const InputContainer = styled(Paper)(({ theme }) => ({
//     background: 'rgba(255, 255, 255, 0.02)',
//     borderRadius: 16,
//     padding: theme.spacing(3),
//     marginBottom: theme.spacing(2),
//     border: '1px solid rgba(255, 255, 255, 0.05)',
// }));

// const StudentDetailsModal: React.FC<StudentModalProps> = ({ open, onClose, student }) => {
//     const [formData, setFormData] = useState<Student>(student || { id: 0, name: "", email: "", studentClass: "", password: "" });

//     useEffect(() => {
//         if (student) {
//             setFormData(student);
//         } else {
//             setFormData({ id: 0, name: "", email: "", studentClass: "", password: "" });
//         }
//     }, [student]);

//     const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
//         setFormData({ ...formData, [e.target.name]: e.target.value });
//     };

//     const handleSubmit = async () => {
//         try {
//             console.log("Submitting:", formData);

//             const url = student ? `${apiUrl}/Student/${student.id}` : `${apiUrl}/Student`;
//             const method = student ? axios.put : axios.post;
//             await method(url, formData);
//             await studentStore.fetchStudents();
//             onClose();
//         } catch (error) {
//             console.error("Error submitting student data:", error);
//         }
//     };

//     return (
//         <StyledDialog
//             open={open}
//             onClose={onClose}
//             fullWidth
//             maxWidth="sm"
//             dir="rtl"
//         >
//             <DialogHeader>
//                 <Typography variant="h5" fontWeight={600} color="#ffffff">
//                     {student ? "עריכת תלמיד" : "הוספת תלמיד חדש"}
//                 </Typography>
//                 <IconButton onClick={onClose} size="small" sx={{ color: '#ffffff' }}>
//                     <CloseIcon />
//                 </IconButton>
//             </DialogHeader>

//             <DialogContent sx={{ padding: 0 }}>
//                 <ContentContainer>
//                     <InputContainer elevation={0}>
//                         <StyledTextField
//                             label="מספר מזהה"
//                             name="id"
//                             value={formData.id}
//                             onChange={handleChange}
//                             fullWidth
//                             InputProps={{
//                                 startAdornment: <BadgeIcon sx={{ mr: 1 }} />,
//                             }}
//                             disabled={!!student}
//                         />
//                         <StyledTextField
//                             label="שם"
//                             name="name"
//                             value={formData.name}
//                             onChange={handleChange}
//                             fullWidth
//                             InputProps={{
//                                 startAdornment: <PersonIcon sx={{ mr: 1 }} />,
//                             }}
//                         />
//                         <StyledTextField
//                             label="כיתה"
//                             name="studentClass"
//                             value={formData.studentClass}
//                             onChange={handleChange}
//                             fullWidth
//                             InputProps={{
//                                 startAdornment: <ClassIcon sx={{ mr: 1 }} />,
//                             }}
//                         />
//                         <StyledTextField
//                             label="מייל"
//                             name="email"
//                             value={formData.email}
//                             onChange={handleChange}
//                             fullWidth
//                             InputProps={{
//                                 startAdornment: <EmailIcon sx={{ mr: 1 }} />,
//                             }}
//                         />
//                         <StyledTextField
//                             label="סיסמה"
//                             name="password"
//                             type="password"
//                             value={formData.password}
//                             onChange={handleChange}
//                             fullWidth
//                             InputProps={{
//                                 startAdornment: <LockIcon sx={{ mr: 1 }} />,
//                             }}
//                         />
//                     </InputContainer>
//                 </ContentContainer>
//             </DialogContent>

//             <DialogActions sx={{
//                 padding: 3,
//                 paddingTop: 0,
//                 justifyContent: 'flex-start',
//                 gap: 2
//             }}>
//                 <SaveButton onClick={handleSubmit} variant="contained">
//                     שמור
//                 </SaveButton>
//                 <CancelButton onClick={onClose}>
//                     בטל
//                 </CancelButton>
//             </DialogActions>
//         </StyledDialog>
//     );
// };

// export default StudentDetailsModal;



// // קלאוד שני נסיון לפצל CSS----------עברית
// import React, { useState, ChangeEvent, useEffect } from "react";
// import { 
//   Dialog, 
//   DialogContent, 
//   DialogActions, 
//   Button, 
//   TextField,
//   IconButton,
//   Typography,
//   Box,
//   Paper,
//   InputAdornment
// } from "@mui/material";
// import CloseIcon from '@mui/icons-material/Close';
// import PersonIcon from '@mui/icons-material/Person';
// import EmailIcon from '@mui/icons-material/Email';
// import ClassIcon from '@mui/icons-material/Class';
// import LockIcon from '@mui/icons-material/Lock';
// import BadgeIcon from '@mui/icons-material/Badge';
// import VisibilityIcon from '@mui/icons-material/Visibility';
// import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
// import axios from "axios";
// import { Student } from "../types";
// import studentStore from "./StudentStore";
// // import './StudentDetailsModal.css';
// import "../../stylies/StudentDetailsModal.css"
// interface StudentModalProps {
//     open: boolean;
//     onClose: () => void;
//     onSave: (student: Student) => void;
//     student?: Student | null;
// } 

// // const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:7083/api';
// const apiUrl = 'https://localhost:7083/api';

// const StudentDetailsModal: React.FC<StudentModalProps> = ({ open, onClose, student }) => {
//     const [formData, setFormData] = useState<Student>(student || { id: 0, name: "", email: "", studentClass: "", password: "" });
//     const [showPassword, setShowPassword] = useState(false);

//     useEffect(() => {
//         if (student) {
//             setFormData(student);
//         } else {
//             setFormData({ id: 0, name: "", email: "", studentClass: "", password: "" });
//         }
//     }, [student]);

//     const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
//         setFormData({ ...formData, [e.target.name]: e.target.value });
//     };

//     const handleTogglePasswordVisibility = () => {
//         setShowPassword(!showPassword);
//     };

//     const handleSubmit = async () => {
//         try {
//             console.log("Submitting:", formData);

//             const url = student ? `${apiUrl}/Student/${student.id}` : `${apiUrl}/Student`;
//             const method = student ? axios.put : axios.post;
//             await method(url, formData);
//             await studentStore.fetchStudents();
//             onClose();
//         } catch (error) {
//             console.error("Error submitting student data:", error);
//         }
//     };

//     return (
//         <Dialog 
//             open={open} 
//             onClose={onClose} 
//             fullWidth 
//             maxWidth="sm"
//             dir="rtl"
//             className="student-dialog"
//         >
//             <Box className="dialog-header">
//                 <Typography variant="h5" fontWeight={600} color="#ffffff">
//                     {student ? "עריכת תלמיד" : "הוספת תלמיד חדש"}
//                 </Typography>
//                 <IconButton onClick={onClose} size="small" sx={{ color: '#ffffff' }}>
//                     <CloseIcon />
//                 </IconButton>
//             </Box>
            
//             <DialogContent sx={{ padding: 0 }}>
//                 <Box className="content-container">
//                     <Paper className="input-container" elevation={0}>
//                         {/* <TextField
//                             label="מספר מזהה"
//                             name="id"
//                             value={formData.id}
//                             onChange={handleChange}
//                             fullWidth
//                             className="styled-input"
//                             InputProps={{
//                                 startAdornment: <BadgeIcon sx={{ mr: 1 }} />,
//                             }}
//                             disabled={!!student}
//                         /> */}
//                         <TextField
//                             label="שם"
//                             name="name"
//                             value={formData.name}
//                             onChange={handleChange}
//                             fullWidth
//                             className="styled-input"
//                             InputProps={{
//                                 startAdornment: <PersonIcon sx={{ mr: 1 }} />,
//                             }}
//                         />
//                         <TextField
//                             label="כיתה"
//                             name="studentClass"
//                             value={formData.studentClass}
//                             onChange={handleChange}
//                             fullWidth
//                             className="styled-input"
//                             InputProps={{
//                                 startAdornment: <ClassIcon sx={{ mr: 1 }} />,
//                             }}
//                         />
//                         <TextField
//                             label="מייל"
//                             name="email"
//                             value={formData.email}
//                             onChange={handleChange}
//                             fullWidth
//                             className="styled-input"
//                             InputProps={{
//                                 startAdornment: <EmailIcon sx={{ mr: 1 }} />,
//                             }}
//                         />
//                         <TextField
//                             label="סיסמה"
//                             name="password"
//                             type={showPassword ? "text" : "password"}
//                             value={formData.password}
//                             onChange={handleChange}
//                             fullWidth
//                             className="styled-input"
//                             InputProps={{
//                                 startAdornment: <LockIcon sx={{ mr: 1 }} />,
//                                 endAdornment: (
//                                     <InputAdornment position="end">
//                                         <IconButton
//                                             onClick={handleTogglePasswordVisibility}
//                                             edge="end"
//                                             className="password-visibility-toggle"
//                                         >
//                                             {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
//                                         </IconButton>
//                                     </InputAdornment>
//                                 )
//                             }}
//                         />
//                     </Paper>
//                 </Box>
//             </DialogContent>
            
//             <DialogActions sx={{ padding: 3, paddingTop: 0, justifyContent: 'flex-start', gap: 2 }}>
//                 <Button onClick={handleSubmit} variant="contained" className="save-button">
//                     שמור
//                 </Button>
//                 <Button onClick={onClose} className="cancel-button">
//                     בטל
//                 </Button>
//             </DialogActions>
//         </Dialog>
//     );
// };

// export default StudentDetailsModal;

// קלאוד אנגלית
import React, { useState, ChangeEvent, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField,
  IconButton,
  Typography,
  Box,
  Paper,
  InputAdornment
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import ClassIcon from '@mui/icons-material/Class';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
// import axios from "axios";
import { Student } from "../../utils/types";
import studentStore from "./StudentStore";
import "../../stylies/StudentDetailsModal.css"
import axiosInstance from "../../utils/axiosInstance";

interface StudentModalProps {
    open: boolean;
    onClose: () => void;
    // onSave: (student: Student) => void;
    student?: Student | null;
} 

// const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:7083/api';
// const apiUrl = 'https://localhost:7083/api';

const StudentDetailsModal: React.FC<StudentModalProps> = ({ open, onClose, student }) => {
    const [formData, setFormData] = useState<Student>(student || { id: 0, name: "", email: "", studentClass: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);

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
        } catch (error) {
            console.error("Error submitting student data:", error);
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