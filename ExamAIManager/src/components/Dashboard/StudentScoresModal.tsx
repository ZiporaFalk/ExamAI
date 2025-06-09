import {
    Dialog, DialogTitle, DialogContent, Table, TableHead, TableRow, TableCell, TableBody,
    Button, TextField, Box, IconButton, DialogActions, Typography
} from "@mui/material"
import { observer } from "mobx-react"
import { useState } from "react"
import { Visibility, Close, Download, Save, Cancel, Search } from "@mui/icons-material"
import studentStore from "./StudentStore"
import "../../stylies/student-scores-modal.css"
import ExamUploadService from "../../services/ExamUploadService"
import { motion } from "framer-motion"


const StudentScoresModal = observer(({ open, onClose, student }: any) => {
    const [editedScores, setEditedScores] = useState<Map<number, Map<number, number>>>(new Map())
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)

    if (!student) return null

    const handleScoreChange = (studentId: number, examId: number, score: string) => {
        const numericValue = Number.parseFloat(score)
        if (!isNaN(numericValue)) {
            setEditedScores((prev) => {
                const newMap = new Map(prev)
                if (!newMap.has(studentId)) {
                    newMap.set(studentId, new Map())
                }
                const studentMap = newMap.get(studentId)!
                studentMap.set(examId, numericValue)
                return newMap
            })
        }
    }

    const handleSave = () => {
        editedScores.forEach((studentMap, studentId) => {
            studentMap.forEach((score, examId) => {
                studentStore.updateScore(studentId, examId, score)
            })
        })
        onClose()
    }

    const openPreview = async (url: string) => {
        console.log(url)
        setPreviewUrl(url) 
        try {
            const presignedUrl = await ExamUploadService.getUrl(url)
            setPreviewUrl(presignedUrl)
        } catch (error) {
            console.error("שגיאה בקבלת הקישור:", error)
        }
    }

    const closePreview = () => {
        setPreviewUrl(null)
    }

    return (
        <>
            <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth classes={{ paper: "scores-modal-paper" }}>
                <div className="modal-header">
                    <DialogTitle className="modal-title">
                        <Typography variant="h5" className="student-name">
                            Student grades - {student.name}
                        </Typography>
                    </DialogTitle>
                    <IconButton onClick={onClose} className="close-button">
                        <Close />
                    </IconButton>
                </div>

                <DialogContent className="modal-content">
                    <div className="table-container">
                        <Table className="scores-table">
                            <TableHead>
                                <TableRow>
                                    <TableCell className="table-header">View</TableCell>
                                    <TableCell className="table-header">Score</TableCell>
                                    <TableCell className="table-header">Date Exam</TableCell>
                                    <TableCell className="table-header">Subject</TableCell>
                                </TableRow>
                            </TableHead>
                            {/* <TableBody>
                                {[...(studentStore.scores.get(student.id!)?.entries() ?? [])].map(([examId, submission]) => {
                                    const exam = studentStore.exams.find(e => e.id === examId);
                                    if (!exam) return null;
                                    const scoreValue =
                                        editedScores.get(student.id!)?.get(examId)?.toString() ??
                                        submission?.score?.toString() ?? "";
                                    return (
                                        <TableRow key={exam.id} className="table-row">
                                            <TableCell className="view-cell">
                                                {submission?.file_Url ? (
                                                    <IconButton onClick={() => openPreview(submission.file_Url)} className="view-button">
                                                        <Visibility />
                                                    </IconButton>
                                                ) : (
                                                    <span className="no-file">-</span>
                                                )}
                                            </TableCell>
                                            <TableCell className="score-cell">
                                                <TextField
                                                    size="small"
                                                    type="number"
                                                    value={scoreValue}
                                                    onChange={(e) => handleScoreChange(student.id!, exam.id!, e.target.value)}
                                                    className="score-input"
                                                    InputProps={{
                                                        classes: {
                                                            root: "score-input-root",
                                                        },
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell className="date-cell">{exam.dateExam}</TableCell>
                                            <TableCell className="subject-cell">{exam.subject}</TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody> */}
                            <TableBody>
                                {studentStore.scores.get(student.id!)?.size
                                    ? [...studentStore.scores.get(student.id!)!.entries()].map(([examId, submission]) => {
                                        const exam = studentStore.exams.find(e => e.id === examId);
                                        if (!exam) return null;

                                        const scoreValue =
                                            editedScores.get(student.id!)?.get(examId)?.toString() ??
                                            submission?.score?.toString() ?? "";

                                        return (
                                            <TableRow key={examId} className="table-row">
                                                <TableCell className="view-cell">
                                                    {submission?.file_Url ? (
                                                        <IconButton onClick={() => openPreview(submission.file_Url)} className="view-button">
                                                            <Visibility />
                                                        </IconButton>
                                                    ) : (
                                                        <span className="no-file">-</span>
                                                    )}
                                                </TableCell>
                                                <TableCell className="score-cell">
                                                    <TextField
                                                        size="small"
                                                        type="number"
                                                        value={scoreValue}
                                                        onChange={(e) => handleScoreChange(student.id!, examId, e.target.value)}
                                                        className="score-input"
                                                        InputProps={{
                                                            classes: {
                                                                root: "score-input-root",
                                                            },
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell className="date-cell">{exam.dateExam}</TableCell>
                                                <TableCell className="subject-cell">{exam.subject}</TableCell>
                                            </TableRow>
                                        );
                                    })
                                    : (
                                        // <TableRow>
                                        //     <TableCell colSpan={4} align="center">
                                        //         אין מבחנים להצגה
                                        //     </TableCell>
                                        // </TableRow>
                                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="no-results2">
                                            <div className="no-results-content2">
                                                <Search className="no-results2-icon" />
                                                <h3>No submissions found for this student</h3>
                                                <p>Try changing the filters or search term</p>
                                            </div>
                                        </motion.div>
                                    )}
                            </TableBody>

                        </Table>
                    </div>
                </DialogContent>

                <DialogActions className="modal-actions">
                    <Button onClick={onClose} className="cancel-button" startIcon={<Cancel />}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave} variant="contained" className="save-button" startIcon={<Save />}>
                        Save Changes
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={!!previewUrl}
                onClose={closePreview}
                maxWidth="lg"
                fullWidth
                classes={{ paper: "preview-modal-paper" }}
            >
                <div className="preview-header">
                    <DialogTitle className="preview-title">
                        <Typography variant="h5">View test file</Typography>
                    </DialogTitle>
                    <IconButton onClick={closePreview} className="close-button">
                        <Close />
                    </IconButton>
                </div>

                <DialogContent className="preview-content">
                    {previewUrl && (
                        <Box className="preview-container">
                            <img src={previewUrl || "/placeholder.svg"} alt="preview" className="preview-image" />
                        </Box>
                    )}
                </DialogContent>

                <DialogActions className="preview-actions">
                    <Button onClick={closePreview} className="close-preview-button">
                        Close
                    </Button>
                    {previewUrl && (
                        <a href={previewUrl} download style={{ textDecoration: "none" }}>
                            <Button variant="outlined" className="download-button" startIcon={<Download />}>
                                Upload File
                            </Button>
                        </a>
                    )}
                </DialogActions>
            </Dialog>
        </>
    )
})

export default StudentScoresModal

{/* {studentStore.exams.map((exam) => {
                                    const submission = studentStore.scores.get(student.id!)?.get(exam.id!)
                                    const scoreValue =
                                        editedScores.get(student.id!)?.get(exam.id!)?.toString() ?? submission?.score?.toString() ?? "" */}
{/* .............................. */ }
