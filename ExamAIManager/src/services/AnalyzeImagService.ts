// import axiosInstance from '../utils/axiosInstance';

import axiosInstance from "../utils/axiosInstance";

const AnalyzeImageService ={
    
    analyzeImage : async (base64Image: string) => {
       console.log(base64Image);
       console.log("base64Image");
       
       try {
           const response = await axiosInstance.post(`/Ocr/analyze-image`, { base64Image: base64Image })
           console.log(response.data);
           return response.data.responses[0]?.textAnnotations.slice(1) || null
       } catch (error: any) {
           console.error('Error calling server OCR endpoint:', error);
           return null;
       } 
   }
}
export default AnalyzeImageService 
