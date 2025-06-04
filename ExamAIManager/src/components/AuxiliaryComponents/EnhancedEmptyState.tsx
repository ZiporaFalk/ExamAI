import { Link } from "react-router-dom";
import "../../stylies/EnhancedEmptyState.css"
const EnhancedEmptyState = () => (
    <div className="empty-state"   >
        <div className="empty-icon" >
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14,2 14,8 20,8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10,9 9,9 8,9" />
            </svg>
        </div>
        <h3 className="empty-title">No exams submitted for processing</h3>
        <p className="empty-subtitle"  >Upload exam files to begin processing</p>
        <Link id="upload-exams-link" to="/upload" onMouseOver={(e) => { e.currentTarget.style.backgroundColor = "#4338ca"; }}
            onMouseOut={(e) => { e.currentTarget.style.backgroundColor = "#4f46e5"; }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: "10px" }}>
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            Upload Exams
        </Link>
    </div>
);
export default EnhancedEmptyState