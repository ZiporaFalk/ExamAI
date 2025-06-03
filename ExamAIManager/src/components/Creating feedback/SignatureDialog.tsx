import type React from "react"
import { useRef } from "react"
import SignaturePad from "react-signature-canvas"
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material"
import "../../stylies/SignatureDialog.css"
interface SignatureDialogProps {
    open: boolean
    onClose: () => void
    onSave: (dataUrl: string) => void
}

const SignatureDialog: React.FC<SignatureDialogProps> = ({ open, onClose, onSave }) => {
    const sigPadRef = useRef<SignaturePad>(null)

    const clear = () => {
        sigPadRef.current?.clear()
    }

    const save = () => {
        if (sigPadRef.current && !sigPadRef.current.isEmpty()) {
            const dataUrl = sigPadRef.current.getCanvas().toDataURL("image/png")
            onSave(dataUrl)
            onClose()
        }
    }

    return (
        <Dialog
            open={open}
            onClose={onClose}
            className="signature-dialog"  
            PaperProps={{
                style: {
                    borderRadius: "var(--radius)",
                    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
                    maxWidth: "600px",
                    width: "100%",
                    background: "linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(240, 245, 255, 0.95))",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                },
            }}
        >
            <DialogTitle
                style={{
                    textAlign: "center",
                    fontSize: "1.5rem",
                    fontWeight: 600,
                    background: "linear-gradient(to right, var(--primary), var(--secondary))",
                    color: "white",
                    padding: "1.5rem",
                }}
            >
                Sign here
            </DialogTitle>
            <DialogContent style={{ padding: "2rem" }}>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "column",
                    }}
                >
                    <p
                        className="signature-instruction"
                        style={{
                            marginBottom: "1rem",
                            color: "white",
                            opacity: 0.7,
                            textAlign: "center",
                        }}
                    >
                        Sign using mouse or touchscreen
                    </p>
                    <SignaturePad
                        ref={sigPadRef}
                        canvasProps={{
                            width: 500,
                            height: 200,
                            className: "signature-canvas",
                            style: {
                                border: "2px solid var(--border)",
                                borderRadius: "var(--radius)",
                                backgroundColor: "white",
                                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.05)",
                            },
                        }}
                    />
                </div>
            </DialogContent>
            <DialogActions
                style={{
                    padding: "1.5rem",
                    borderTop: "1px solid rgba(139, 92, 246, 0.1)",
                    justifyContent: "space-between",
                }}
            >
                <Button
                    onClick={clear}
                    className="clear-button"
                    style={{
                        color: "var(--foreground)",
                        opacity: 0.7,
                        transition: "all 0.3s ease",
                    }}
                    onMouseOver={(e) => {
                        e.currentTarget.style.opacity = "1"
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.opacity = "0.7"
                    }}
                >
                    Clear
                </Button>
                <div style={{ display: "flex", gap: "1rem" }} className="action-buttons">
                    <Button
                        onClick={onClose}
                        className="cancel-button"
                        style={{
                            color: "var(--foreground)",
                            opacity: 0.7,
                            transition: "all 0.3s ease",
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.opacity = "1"
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.opacity = "0.7"
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={save}
                        variant="contained"
                        className="save-button"
                        style={{
                            background: "linear-gradient(to right, var(--primary), var(--secondary))",
                            color: "white",
                            transition: "all 0.3s ease",
                            boxShadow: "0 4px 14px rgba(58, 134, 255, 0.4)",
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.background = "linear-gradient(to right, var(--primary-dark), var(--secondary-dark))"
                            e.currentTarget.style.transform = "translateY(-2px)"
                            e.currentTarget.style.boxShadow = "0 6px 20px rgba(58, 134, 255, 0.5)"
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.background = "linear-gradient(to right, var(--primary), var(--secondary))"
                            e.currentTarget.style.transform = "translateY(0)"
                            e.currentTarget.style.boxShadow = "0 4px 14px rgba(58, 134, 255, 0.4)"
                        }}
                    >
                        Save
                    </Button>
                </div>
            </DialogActions>
        </Dialog>
    )
}

export default SignatureDialog


