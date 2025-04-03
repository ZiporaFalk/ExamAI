
import { makeAutoObservable } from "mobx";
import axios from "axios";
import { Exam, Student, Submission } from "./types";

const apiUrl = 'https://localhost:7083/api';

class StudentStore {
    students: Student[] = [];
    exams: Exam[] = [];
    scores: Map<number, Map<number, Submission>> = new Map();
    loading: boolean = false;
    
    currentStudent: Student | null = null;
    openAddDialog: boolean = false;
    openDetailsDialog: boolean = false;
    openScoresDialog: boolean = false;

     filteredClass: string = ""; // משתנה לאחסון הכיתה המסוננת

    constructor() {
        makeAutoObservable(this);
    }

    async fetchStudents() {
        this.loading = true;
        try {
            const response = await axios.get<Student[]>(`${apiUrl}/Student`);
            this.students = response.data;
        } catch (error) {
            console.error("Error fetching students:", error);
        } finally {
            this.loading = false;
        }
    }

    async fetchExams() {
        try {
            const response = await axios.get<Exam[]>(`${apiUrl}/Exam`);
            this.exams = response.data;
        } catch (error) {
            console.error("Error fetching exams:", error);
        }
    }

    async fetchScores() {
        try {
            const scorePromises = this.students.flatMap((student) =>
                this.exams.map((exam) =>
                    axios.get<Submission>(`${apiUrl}/Submission/${student.id}/${exam.id}`)
                        .then((response) => {
                            const submission = response.data;
                            const newScores = new Map(this.scores);
                            const studentScores = newScores.get(student.id) || new Map();
                            studentScores.set(exam.id, submission);
                            newScores.set(student.id, studentScores);
                            this.scores = newScores;
                        })
                        .catch(() => { })
                )
            );
            await Promise.all(scorePromises);
        } catch (error) {
            console.error("Error fetching scores:", error);
        }
    }

    async fetchData() {
        await this.fetchStudents();
        await this.fetchExams();
        await this.fetchScores();
    }

    async addStudent(newStudent: Student) {
        try {
            const response = await axios.post(`${apiUrl}/Student`, newStudent);
            const addedStudent = response.data;
            this.students = [...this.students, addedStudent];
            this.openAddDialog = false;
            await this.fetchStudents();
        } catch (error) {
            console.error("Error adding student:", error);
        }
    }

    async updateStudent(updatedStudent: Student) {
        try {
            await axios.put(`${apiUrl}/Student/${updatedStudent.id}`, updatedStudent);
            this.students = this.students.map((s) => s.id === updatedStudent.id ? { ...s, ...updatedStudent } : s);
            this.currentStudent = null;
        } catch (error) {
            console.error("Error updating student:", error);
        }
    }

    async deleteStudent(studentId: number) {
        try {
            await axios.delete(`${apiUrl}/Student/${studentId}`);
            this.students = this.students.filter(student => student.id !== studentId);
        } catch (error) {
            console.error("Error deleting student:", error);
        }
    }

    getStudentScores(studentId: number): Map<number, Submission> {
        return this.scores.get(studentId) || new Map();
    }

    async updateStudentScores(studentId: number, updatedScores: Map<number, Submission>) {
        try {
            await Promise.all(
                Array.from(updatedScores.entries()).map(([examId, submission]) => {
                    return axios.put(`${apiUrl}/Submission/${submission.id}`, {
                        id: submission.id,
                        studentId: studentId,
                        score: submission.score,
                        file_Url: submission.urlFile,
                        file_Url_FeedBack: submission.urlFeedback
                    });
                })
            );
            this.scores.set(studentId, new Map(updatedScores));
        } catch (error) {
            console.error("Error updating student scores:", error);
        }
    }

    setFilteredClass(className: string) {
        this.filteredClass = className;
    }

    get filteredStudents() {
        return this.filteredClass ? this.students.filter(student => student.class === this.filteredClass) : this.students;
    }
}

const studentStore = new StudentStore();
export default studentStore;


 
////
// import { makeAutoObservable } from "mobx";
// import axios from "axios";
// import { Exam, Student, Submission } from "./types";

// const apiUrl = 'https://localhost:7083/api';


// class StudentStore {
//     students: Student[] = [];
//     exams: Exam[] = [];
//     // scores: Map<number, Map<number, number>> = new Map();
//     scores: Map<number, Map<number, Submission>> = new Map();
//     loading: boolean = false;

//     // משתנים לניהול מודלים
//     currentStudent: Student | null = null;
//     openAddDialog: boolean = false;
//     openDetailsDialog: boolean = false;
//     openScoresDialog: boolean = false;
    
//     constructor() {
//         makeAutoObservable(this);
//     }

//     async fetchStudents() {
//         this.loading = true;
//         try {
//             const response = await axios.get<Student[]>(`${apiUrl}/Student`);
//             this.students = response.data;
//         } catch (error) {
//             console.error("Error fetching students:", error);
//         } finally {
//             this.loading = false;
//         }
//     }

//     async fetchExams() {
//         try {
//             const response = await axios.get<Exam[]>(`${apiUrl}/Exam`);
//             this.exams = response.data;
//         } catch (error) {
//             console.error("Error fetching exams:", error);
//         }
//     }

//     async fetchScores() {
//         try {
//             const scorePromises = this.students.flatMap((student) =>
//                 this.exams.map((exam) =>
//                     axios.get<Submission>(`${apiUrl}/Submission/${student.id}/${exam.id}`)
//                         .then((response) => {
//                             const submission = response.data;
//                             console.log("Fetched submission:", submission);  // 🔥 הדפס את הנתונים מהשרת
//                             const newScores = new Map(this.scores);
//                             const studentScores = newScores.get(student.id) || new Map();
//                             studentScores.set(exam.id, submission);
//                             newScores.set(student.id, studentScores);
//                             this.scores = newScores;
//                         })
//                         .catch(() => { })
//                 )
//             );
//             await Promise.all(scorePromises);

            
//         } catch (error) {
//             console.error("Error fetching scores:", error);
//         }
//     }

//     // פונקציה שמביאה את כל הנתונים יחד
//     async fetchData() {
//         await this.fetchStudents();
//         await this.fetchExams();
//         await this.fetchScores();
//     }
//     async addStudent(newStudent: Student) {
//         try {
//             console.log("Before:", this.students);
//             const response = await axios.post(`${apiUrl}/Student`, newStudent);
//             console.log("After:", this.students);
//             // this.students.push(newStudent);
//             const addedStudent = response.data; // קבלת הסטודנט מהשרת עם ה-ID שנוצר
//             this.students = [...this.students, addedStudent]; // יצירת מערך חדש כדי שמובקס יזהה שינוי
//             this.openAddDialog = false; // סגירת המודל אחרי הוספה
//             await this.fetchStudents();

//         } catch (error) {
//             console.error("Error adding student:", error);
//         }
//     }

//     async updateStudent(updatedStudent: Student) {
//         try {
//             await axios.put(`${apiUrl}/Student/${updatedStudent.id}`, updatedStudent);
//             // this.students = this.students.map((s) => (s.id === updatedStudent.id ? updatedStudent : s));
//             this.students = this.students.map((s) => s.id === updatedStudent.id ? { ...s, ...updatedStudent } : s); // יצירת אובייקט חדש כדי שמובקס יזהה שינוי            
//             this.currentStudent = null; // סגירת המודל אחרי עדכון
//         } catch (error) {
//             console.error("Error updating student:", error);
//         }
//     }

//     async deleteStudent(studentId: number) {

//         try {
//             await axios.delete(`${apiUrl}/Student/${studentId}`);
//             this.students = this.students.filter(student => student.id !== studentId);
//         } catch (error) {
//             console.error("Error deleting student:", error);
//         }
//     }
//     getStudentScores(studentId: number): Map<number, Submission> {
//         return this.scores.get(studentId) || new Map();
//     }


//     async updateStudentScores(studentId: number, updatedScores: Map<number, Submission>) {
//         try {
//             await Promise.all(
//                 Array.from(updatedScores.entries()).map(([examId, submission]) => {
//                     axios.put(`${apiUrl}/Submission/${submission.id}`, {
//                         id: submission.id,
//                         studentId: studentId,                    // שליחה של studentid
//                         score: submission.score,                 // שליחה של הציון
//                         file_Url: submission.urlFile,             // שליחה של קובץ
//                         file_Url_FeedBack: submission.urlFeedback      // שליחה של פידבק
//                     })
//                 }
//                 )
//             );
//             ////    נסיון שאם היה קודם - ואחר כך מספר שיוסיף אותו כנגשה חדשה
//             // await Promise.all(
//             //     Array.from(updatedScores.entries()).map(([examId, submission]) => {
//             //         const oldSubmission = studentStore.scores.get(studentId)?.get(examId);
//             //         const oldScore = oldSubmission ? oldSubmission.score : "-"; // הציון הישן
//             //         const newScore = submission.score; // הציון החדש
//             //         if (oldScore.toString() !== "-") {
//             //             return axios.put(`${apiUrl}/Submission/${submission.id}`, {
//             //                 id: submission.id,
//             //                 studentId: studentId,
//             //                 score: submission.score,
//             //                 file_Url: submission.urlFile,
//             //                 file_Url_FeedBack: submission.urlFeedback
//             //             });
//             //         }
//             //         else if (oldScore === "-" && newScore.toString() !== '-') {

//             //             return axios.post(`${apiUrl}/Submission`, {
//             //                 id: submission.id,
//             //                 studentId: studentId,
//             //                 score: submission.score,
//             //                 file_Url: submission.urlFile,
//             //                 file_Url_FeedBack: submission.urlFeedback
//             //             });
//             //         }
//             //     })
//             // );
//             this.scores.set(studentId, new Map(updatedScores));
//         } catch (error) {
//             console.error("Error updating student scores:", error);
//         }
//     }
    
// }
// const studentStore = new StudentStore();
// export default studentStore;


