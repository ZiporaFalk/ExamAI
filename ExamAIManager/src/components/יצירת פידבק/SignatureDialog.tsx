

import React, { useRef } from 'react';
import SignaturePad from 'react-signature-canvas';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

interface SignatureDialogProps {
    open: boolean;
    onClose: () => void;
    onSave: (dataUrl: string) => void;
}

const SignatureDialog: React.FC<SignatureDialogProps> = ({ open, onClose, onSave }) => {
    const sigPadRef = useRef<SignaturePad>(null);

    const clear = () => {
        sigPadRef.current?.clear();
    };

    const save = () => {
        if (sigPadRef.current && !sigPadRef.current.isEmpty()) {
            //   const dataUrl = sigPadRef.current.getTrimmedCanvas().toDataURL('image/png');
            const dataUrl = sigPadRef.current.getCanvas().toDataURL('image/png');
            onSave(dataUrl);
            onClose();
        }
    };

    return (
        <Dialog open={open} onClose={onClose} >
            <DialogTitle>חתום כאן</DialogTitle>
            <DialogContent>
                <SignaturePad
                    ref={sigPadRef}
                    canvasProps={{
                        width: 500,
                        height: 200,
                        className: 'signature-canvas',
                        style: { border: '1px solid #ccc' },
                    }}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={clear}>נקה</Button>
                <Button onClick={onClose}>בטל</Button>
                <Button onClick={save} variant="contained" color="primary">שמור</Button>
            </DialogActions>
        </Dialog>
    );
};

export default SignatureDialog;