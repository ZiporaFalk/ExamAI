import { Link } from "react-router-dom";
import "../../stylies/UnregisteredStudentMessage.css"

const UnregisteredStudentMessage = ({ students }: { students: { name: string }[] }) => (
    <div className="error-container" style={{
        padding: "24px",
        backgroundColor: "#fef2f2",
        borderRadius: "8px",
        border: "1px solid #fecaca",
        marginBottom: "20px",
        textAlign: "center",
        maxWidth: "600px",
        margin: "20px auto"
    }}>
        <div style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "16px"
        }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" style={{ marginRight: "8px" }}>
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
        </div>
        <h3 style={{
            fontSize: "18px",
            fontWeight: "600",
            color: "#b91c1c",
            marginBottom: "12px"
        }}>
            Registration Error
        </h3>
        {students.map((student, index) => (
            <div key={index} id="exam">
                <p id="exam_p"> The student <strong>{student.name}</strong> is not registered.<br />
                    An email with a registration link has been sent to the student.</p>
                <p id="error-msg">A reminder will be sent to you.</p> </div>))}
        <div style={{ marginTop: "20px" }}>
            <Link id="return-home-link" to="/" onMouseOver={(e) => { e.currentTarget.style.backgroundColor = "#4338ca"; }}
                onMouseOut={(e) => { e.currentTarget.style.backgroundColor = "#4f46e5"; }} >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: "8px" }}>
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
                Return to homepage
            </Link>
        </div>
    </div>
);
export default UnregisteredStudentMessage