import { makeAutoObservable } from "mobx";
import { Exam, Student, Submission } from "../../utils/types";
import axiosInstance from "../../utils/axiosInstance";
import { handleAxiosError } from "../../utils/handleAxiosError";

class StudentStore {
    students: Student[] = [];
    exams: Exam[] = [];
    scores: Map<number, Map<number, Submission>> = new Map();
    loading: boolean = false;
    currentStudent: Student | null = null;
    openAddDialog: boolean = false;
    openDetailsDialog: boolean = false;
    openScoresDialog: boolean = false;
    filteredClass: string = ""; 

    constructor() {
        makeAutoObservable(this);
    }
    async fetchStudents() {
        this.loading = true;
        try {
            const response = await axiosInstance.get<Student[]>(`/Student`);
            this.students = response.data;
        } catch (error) {
            console.error("Error fetching students:", error);
        } finally {
            this.loading = false;
        }

    }

    async fetchExams() {
        try {
            const response = await axiosInstance.get<Exam[]>(`/Exam`);
            this.exams = response.data;
        } catch (error) {
            console.error("Error fetching exams:", error);
        }
    }

    async fetchScores() {
        const newScores = new Map<number, Map<number, Submission>>();
        const scorePromises = this.students.flatMap((student) =>
            this.exams.map((exam) =>
                axiosInstance.get<Submission>(`/Submission/${student.id}/${exam.id}`)
                    .then((response) => {
                        const submission = response.data;
                        if (!newScores.has(student.id!)) {
                            newScores.set(student.id!, new Map());
                        }
                        newScores.get(student.id!)!.set(exam.id!, submission);
                        console.log(submission);
                    })
                    .catch(() => {
                        if (!newScores.has(student.id!)) {
                            newScores.set(student.id!, new Map());
                        }
                        newScores.get(student.id!)!.set(exam.id!, { studentId: student.id!, score: 0, file_Url: '', file_Url_FeedBack: '' }); // נכניס "אין ציון"
                    })
            )
        );
        await Promise.all(scorePromises);
        this.scores = newScores;
    }
    async fetchData() {
        await this.fetchStudents();
        await this.fetchExams();
        await this.fetchScores();
    }

    async addStudent(newStudent: Student) {
        try {
            const response = await axiosInstance.post(`/Student`, newStudent);
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
            await axiosInstance.put(`/Student/${updatedStudent.id}`, updatedStudent);
            this.students = this.students.map((s) => s.id === updatedStudent.id ? { ...s, ...updatedStudent } : s);
            this.currentStudent = null;
        } catch (error) {
            console.error("Error updating student:", error);
        }
    }

    async deleteStudent(studentId: number) {
        try {
            await axiosInstance.delete(`/Student/${studentId}`);
            this.students = this.students.filter(student => student.id !== studentId);
        } catch (error) {
            console.error("Error deleting student:", error);
        }
    }

    getStudentScores(studentId: number): Map<number, Submission> {
        return this.scores.get(studentId) || new Map();
    }

    setFilteredClass(className: string) {
        this.filteredClass = className;
    }

    get filteredStudents() {
        return this.filteredClass ? this.students.filter(student => student.studentClass === this.filteredClass) : this.students;
    }
    async updateScore(studentId: number, examId: number, newScore: number) {
        const submission = this.scores.get(studentId)?.get(examId);
        if (!submission) return;

        const updatedSubmission: Submission = {
            ...submission,
            score: newScore
        };

        try {
            await axiosInstance.put(`/Submission/${submission.id}/${newScore}`,
                { score: newScore, }, { headers: { "Content-Type": "application/json", }, });
            const studentScores = new Map<number, Submission>(this.scores.get(studentId)!);
            studentScores.set(examId, updatedSubmission);
            this.scores.set(studentId, studentScores);
        } catch (error) {
            console.error("Error updating score:", error);
        }
    }


    async getAll() {
        try {
            const res = await axiosInstance.get(`/Student`);
            return res.data;
        } catch (e: any) {
            handleAxiosError("Error fetching students:", e);
            throw e;
        }
    }
    async getByClass(classs: string) {
        try {
            const res = await axiosInstance.get(`/Student/class/${classs}`);
            return res.data;
        } catch (e: any) {
            console.error(`Error fetching students from class ${classs}:`, e);
            handleAxiosError(e, "כיתה זו לא קיימת");
            throw e;
        }
    }

    async getEmailByStudentId(studentId: number) {
        try {
            const res = await axiosInstance.get(`/Student/${studentId}`)
            return res.data.email;
        } catch (e: any) {
            handleAxiosError("Error getEmailByStudentId:", e);
            throw e;
        }
    }

    async getStudentByClassAndName(studentClass: string, studentName: string) {
        const res = await axiosInstance.get(`/Student/classandname/${studentClass}/${studentName}`)
        return res.data
    }

}

const studentStore = new StudentStore();
export default studentStore;



