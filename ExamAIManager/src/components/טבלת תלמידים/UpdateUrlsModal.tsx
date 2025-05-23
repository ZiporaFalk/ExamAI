
// import React, { useEffect, useState } from "react";
// import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material";
// import { observer } from "mobx-react-lite";
// import studentStore from "./StudentStore";
// interface UpdateUrlsModalProps {
//     open: boolean;
//     onClose: () => void;
//     examId: number;
//     studentId: number;
// }
// const UpdateUrlsModal: React.FC<UpdateUrlsModalProps> = observer(({ open, onClose, examId, studentId }) => {
//     const [urlFile, setUrlFile] = useState("");
//     const [urlFeedback, setUrlFeedback] = useState("");

//     // const examId = studentStore.examIdForUrls;
//     // const studentId = studentStore.currentStudent?.id;

//     useEffect(() => {
//         if (examId !== null && studentId !== undefined) {
//             const submission = studentStore.scores.get(studentId)?.get(examId);
//             if (submission) {
//                 setUrlFile(submission.urlFile);
//                 setUrlFeedback(submission.urlFeedback);
//             }
//         }
//     }, [examId, studentId]);

//     const handleUrlSubmit = () => {
//         if (studentId !== undefined && examId !== null) {
//             studentStore.updateSubmissionUrls(studentId, examId, urlFile, urlFeedback);
//             studentStore.closeUrlsModal();
//         }
//     };

//     return (
//         <Dialog open={studentStore.openUrlsModal} onClose={studentStore.closeUrlsModal}>
//             <DialogTitle>עדכון URLs</DialogTitle>
//             <DialogContent>
//                 <TextField
//                     label="URL קובץ"
//                     value={urlFile}
//                     onChange={(e) => setUrlFile(e.target.value)}
//                     fullWidth
//                     margin="dense"
//                 />
//                 <TextField
//                     label="URL פידבק"
//                     value={urlFeedback}
//                     onChange={(e) => setUrlFeedback(e.target.value)}
//                     fullWidth
//                     margin="dense"
//                 />
//             </DialogContent>
//             <DialogActions>
//                 <Button onClick={studentStore.closeUrlsModal} color="secondary">בטל</Button>
//                 <Button onClick={handleUrlSubmit} color="primary" variant="contained">שמור</Button>
//             </DialogActions>
//         </Dialog>
//     );
// });

// export default UpdateUrlsModal;




// import React from "react";
// import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material";
// import { observer } from "mobx-react-lite";
// import studentStore from "./StudentStore";

// interface UpdateUrlsModalProps {
//     open: boolean; 
//     onClose: () => void;
//     examId: number;
//     studentId: number;
// }

// const UpdateUrlsModal: React.FC<UpdateUrlsModalProps> = observer(({ open, onClose, examId, studentId }) => {
//     const submission = studentStore.scores.get(studentId)?.get(examId);

//     const [file_Url, setfile_Url] = React.useState(submission?.file_Url || "");
//     const [file_Url_FeedBack, setfile_Url_FeedBack] = React.useState(submission?.file_Url_FeedBack || "");

//     React.useEffect(() => {
//         console.log(submission + "submission in Url");

//         setfile_Url(submission?.file_Url || "");  // טעינת ערך ברירת מחדל
//         setfile_Url_FeedBack(submission?.file_Url_FeedBack || ""); // טעינת ערך ברירת מחדל
//     }, [submission]);

//     const handleSave = () => {
//         if (submission) {
//             studentStore.updateStudentScores(studentId, new Map([
//                 [examId, { ...submission, file_Url, file_Url_FeedBack }]
//             ]));
//         }
//         onClose();
//     };

//     return (
//         <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
//             <DialogTitle>עדכון קישורים</DialogTitle>
//             <DialogContent>
//                 <TextField
//                     // label="קישור לקובץ"
//                     value={file_Url}
//                     onChange={(e) => setfile_Url(e.target.value)}
//                     fullWidth
//                     margin="dense"
//                 />
//                 <TextField
//                     // label="קישור למשוב"
//                     value={file_Url_FeedBack}
//                     onChange={(e) => setfile_Url_FeedBack(e.target.value)}
//                     fullWidth
//                     margin="dense"
//                 />
//             </DialogContent>
//             <DialogActions>
//                 <Button onClick={onClose} color="secondary">בטל</Button>
//                 <Button onClick={handleSave} color="primary" variant="contained">שמור</Button>
//             </DialogActions>
//         </Dialog>
//     );
// });

// export default UpdateUrlsModal;
