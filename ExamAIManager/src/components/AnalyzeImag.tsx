import axios from 'axios';

export const analyzeImage = async (base64Image: string): Promise<string | null> => {
    const apiKey = `AIzaSyDvC1ylRFcifTEdiMNcDJt3Ztn2IwvH-Z0`;
    const url = `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`;

    const requestBody = {
        requests: [
            {
                image: {
                    content: base64Image,
                },
                features: [
                    {
                        type: 'DOCUMENT_TEXT_DETECTION',
                    },
                ],
            },
        ],
    };

    try {
        const response = await axios.post(url, requestBody, {
            headers: { 'Content-Type': 'application/json' },
        });
        console.log("API response:", response);
        const textAnnotations = response.data.responses[0].fullTextAnnotation[5];
        console.log(textAnnotations);
        const detectedText = response.data.responses[0]?.fullTextAnnotation?.text || null;
        console.log(detectedText)
        const arr = response.data.responses[0].textAnnotations
        const newArr = arr.slice(1);
        const ss = newArr.findIndex((myname: any) => myname.description.includes("שם"))
        console.log('my name:' + newArr[ss + 2].description + ' ' + newArr[ss + 3].description);
        const myclass = newArr.findIndex((myname: any) => myname.description.includes("כיתה"))
        console.log('my class:' + newArr[myclass + 2].description + newArr[myclass + 3].description);

        console.log(newArr);
        type MyObject = {
            description: string;
            boundingPoly: any; // אם אתה יודע את הטיפוס המדויק של boundingPoly, תוכל להוסיף אותו פה.
        };

        const numbersAfterHeu = arr.reduce((acc: string[], curr: MyObject, i: number): string[] => {
            if (curr.description === 'הוא' && arr[i + 1]?.description === ':') {
                const nextDescription = arr[i + 2]?.description;
                if (nextDescription && !isNaN(Number(nextDescription))) {
                    acc.push(nextDescription);
                }
            }
            return acc;
        }, []);
        console.log(numbersAfterHeu+"------------------");

        return detectedText;
    } catch (error: any) {
        console.error('Error during OCR:', error.response ? error.response.data : error.message);
        return null;
    }
};
