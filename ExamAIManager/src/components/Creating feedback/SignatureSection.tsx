import { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { ImageRun, TextRun } from "docx";
import SignatureDialog from "./SignatureDialog";
import "../../stylies/SignatureSection.css"
export const createImageFromDataURL = async (dataURL: string): Promise<ImageRun> => {
    const [meta, base64] = dataURL.split(',');

    const byteArray = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
    const isSvg = meta.includes('image/png');
    console.log("Image byte length:", byteArray.length);

    const imageOptions: any = {
        data: byteArray,
        transformation: { width: 200, height: 100 },
    };
    if (isSvg) {
        imageOptions.type = 'PNG';
        imageOptions.fallback = new TextRun('fallback text');
    }
    return new ImageRun(imageOptions);
};

type Props = {
    onSave: (dataUrl: string) => void;
    signature: string | null;
};

const SignatureSection = ({ onSave, signature }: Props) => {
    const [open, setOpen] = useState(false);

    const handleSave = (dataUrl: string) => {
        onSave(dataUrl);
        setOpen(false);
    };

    return (
        <Box p={4}>
            <Button variant="outlined" onClick={() => setOpen(true)}>signed</Button>
            <SignatureDialog open={open} onClose={() => setOpen(false)} onSave={handleSave} />
            {signature && (
                <Box mt={2}>
                    <Typography variant="subtitle1">Your signature:</Typography>
                    <img src={signature} alt="signature" style={{ border: '1px solid #ddd', width: '300px' }} />
                </Box>
            )}
        </Box>
    );
};

export default SignatureSection;


