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














// // ריקי
// import { FC, useState } from 'react';
// import SignatureDialog from './SignatureDialog';
// import '../styles/Signature.css';

// type Props = {
//   onSignature: (signature: string) => void;
// };

// const SignatureSection: FC<Props> = ({ onSignature }) => {
//   const [open, setOpen] = useState(false);
//   const [signature, setSignature] = useState<string | null>(null);
  
//   const handleSave = (dataUrl: string) => {
//     setSignature(dataUrl);
//     onSignature(dataUrl);
//     setOpen(false);
//   };
  
//   return (
//     <div className="signature-wrapper">
//       <button 
//         className="signature-button"
//         onClick={() => setOpen(true)}
//       >
//         <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//           <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
//           <polyline points="22 4 12 14.01 9 11.01"></polyline>
//         </svg>
//         {signature ? 'Change Signature' : 'Add Signature'}
//       </button>
      
//       <SignatureDialog
//         open={open}
//         onClose={() => setOpen(false)}
//         onSave={handleSave}
//       />
      
//       {signature && (
//         <div className="signature-preview">
//           <span>Signature added</span>
//           <div className="signature-thumbnail">
//             <img src={signature} alt="Your signature" />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default SignatureSection;