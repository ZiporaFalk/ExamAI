import { FC, useEffect, useState } from "react"
import { Bar, Pie } from "react-chartjs-2"
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from "chart.js"
import "../stylies/statistics.css"
import ExamService from "../services/examService"
import { DashBoardService } from "../services/DashBoardService"
import studentStore from "./Dashboard/StudentStore"
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement)

interface StatisticsProps {
    className?: string
}

const StatisticsDashboard: FC<StatisticsProps> = ({ className }) => {
    const [stats, setStats] = useState({
        averageScore: 0,
        averageScoreChange: 0,
        passRate: 0,
        passRateChange: 0,
        totalExams: 0,
        totalStudents: 0,
        scoreDistribution: [0, 0, 0, 0, 0, 0],
    })
    const [selectedClass, setSelectedClass] = useState("")
    const [selectedSubject, setSelectedSubject] = useState("All Subjects")
    const [subjects, setSubjects] = useState<string[]>([])

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const response = await ExamService.getAll()
                const uniqueSubjects: string[] = Array.from(
                    new Set(response.map((exam: any) => exam.subject))
                )
                console.log(uniqueSubjects) 
                setSubjects(uniqueSubjects)
            } catch (error) {
                console.error("Error retrieving subjects", error)
            }
        }
        fetchSubjects()
    }, [])

    useEffect(() => {
        const fetchStats = async () => {
            try {
                let average = 0
                let passRate = 0
                let totalExams = 0
                let totalStudents = 0
                const classVal = selectedClass.trim() === "" ? undefined : selectedClass
                const subjectVal = selectedSubject === "All Subjects" ? undefined : selectedSubject
                average = await DashBoardService.getClassAverage(classVal, subjectVal)
                passRate = await DashBoardService.getPassRate(classVal, subjectVal)
                const exams = await DashBoardService.getExamsByClassAndSubject(classVal, subjectVal)
                totalExams = exams.length
                totalStudents = classVal
                    ? (await studentStore.getByClass(classVal)).length
                    : (await studentStore.getAll()).length
                let scoreDistribution = exams.map((exam: any) => exam.score)
                setStats({
                    averageScore: average,
                    averageScoreChange: 0,
                    passRate: passRate,
                    passRateChange: 0,
                    totalExams: totalExams,
                    totalStudents: totalStudents,
                    scoreDistribution: scoreDistribution,
                })
            } catch (error) {
                console.error("Error retrieving statistics", error)
            }
        }

        fetchStats()
    }, [selectedClass, selectedSubject])

    const barChartData = {
        labels: ["0-50", "51-60", "61-70", "71-80", "81-90", "91-100"],
        datasets: [
            {
                label: "Number of Students",
                data: stats.scoreDistribution,
                backgroundColor: [
                    "rgba(255, 99, 132, 0.8)", "rgba(255, 159, 64, 0.8)", "rgba(255, 205, 86, 0.8)",
                    "rgba(175, 222, 75, 0.8)", "rgba(54, 215, 126, 0.8)", "rgba(75, 192, 192, 0.8)",
                ],
                borderColor: [
                    "rgb(255, 99, 132)", "rgb(255, 159, 64)", "rgb(255, 205, 86)",
                    "rgb(175, 222, 75)", "rgb(54, 215, 126)", "rgb(75, 192, 192)",
                ],
                borderWidth: 1,
            },
        ],
    }

    const pieChartData = {
        labels: ["Pass", "Fail"],
        datasets: [
            {
                data: [stats.passRate, 100 - stats.passRate],
                backgroundColor: ["rgba(54, 215, 126, 0.8)", "rgba(255, 99, 132, 0.8)"],
                borderColor: ["rgb(54, 215, 126)", "rgb(255, 99, 132)"],
                borderWidth: 1,
            },
        ],
    }

    const barChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                grid: { color: "rgba(255, 255, 255, 0.1)", },
                ticks: { color: "rgba(255, 255, 255, 0.7)", },
            },
            x: {
                grid: { color: "rgba(255, 255, 255, 0.1)", },
                ticks: { color: "rgba(255, 255, 255, 0.7)", },
            },
        },
        plugins: {
            legend: {
                display: true,
                position: "bottom" as const,
                labels: { color: "rgba(255, 255, 255, 0.7)", },
            },
        },
    }

    const pieChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    label: (context: any) => `${context.label}: ${context.raw}%`,
                },
            },
        },
    }

    return (
        <div className={`statistics-container ${className || ""}`}>
            <div className="statistics-header">
                <h1>Statistics</h1>
                <div className="filter-controls">
                    <div className="input-wrapper">
                        <input
                            type="text"
                            value={selectedClass}
                            onChange={(e) => setSelectedClass(e.target.value)}
                            placeholder="הכנס כיתה"
                            className="styled-input"
                        />
                    </div>
                    <div className="select-wrapper">
                        <select
                            value={selectedSubject}
                            onChange={(e) => setSelectedSubject(e.target.value)}
                            className="filter-select"
                        >
                            <option>All Subjects</option>
                            {subjects.map((subject) => (
                                <option key={subject} value={subject}>
                                    {subject}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className="stats-cards">
                <div className="stat-card">
                    <div className="stat-title">Average Score</div>
                    <div className="stat-subtitle">Overall</div>
                    <div className="stat-value">{stats.averageScore}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-title">Pass Rate</div>
                    <div className="stat-subtitle">Score above 60</div>
                    <div className="stat-value">{stats.passRate}%</div>
                </div>
                <div className="stat-card">
                    <div className="stat-title">Total Exams</div>
                    <div className="stat-subtitle">Total</div>
                    <div className="stat-value">{stats.totalExams}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-title">Total Students</div>
                    <div className="stat-subtitle">Total</div>
                    <div className="stat-value">{stats.totalStudents}</div>
                    <div className="stat-change">Across all classes</div>
                </div>
            </div>

            <div className="charts-container">
                <div className="chart-card">
                    <div className="chart-header">
                        <h2>Score Distribution</h2>
                        <p className="chart-subtitle">Score distribution by range</p>
                    </div>
                    <div className="chart-content">
                        <Bar data={barChartData} options={barChartOptions} />
                    </div>
                </div>
                <div className="chart-card">
                    <div className="chart-header">
                        <h2>Pass Rate</h2>
                        <p className="chart-subtitle">Percentage of students who passed exams</p>
                    </div>
                    <div className="chart-content pie-chart-container">
                        <Pie data={pieChartData} options={pieChartOptions} />
                        <div className="pie-chart-labels">
                            <div className="pie-label pass">
                                <span className="pie-label-color"></span>
                                <span className="pie-label-text">Pass: {stats.passRate}%</span>
                            </div>
                            <div className="pie-label fail">
                                <span className="pie-label-color"></span>
                                <span className="pie-label-text">Fail: {100 - stats.passRate}%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StatisticsDashboard