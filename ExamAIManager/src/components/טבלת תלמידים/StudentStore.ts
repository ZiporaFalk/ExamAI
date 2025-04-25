
import { makeAutoObservable } from "mobx";
import axios from "axios";
import { Exam, Student, Submission } from "../types";

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
    IsLogin: boolean = false

    filteredClass: string = ""; // משתנה לאחסון הכיתה המסוננת

    constructor() {
        makeAutoObservable(this);
        this.IsLogin = localStorage.getItem("isLogin") === "true";
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

    //////אם בסוף אני לא צריכה כל העידכון זאת אומרת רק לעדכן הציון עצמו 
    // אז לשנות פהה שיפעיל פונקציה חדשה בשרת שעושה עידכון ספציפי לציון ולא מקבלת אוביקט שלם
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
        return this.filteredClass ? this.students.filter(student => student.studentClass === this.filteredClass) : this.students;
    }
}

const studentStore = new StudentStore();
export default studentStore;



