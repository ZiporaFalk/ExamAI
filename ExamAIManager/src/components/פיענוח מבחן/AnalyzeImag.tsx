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
        // const textAnnotations = response.data.responses[0].fullTextAnnotation[5];
        // console.log(textAnnotations+"oooooo");
        const detectedText = response.data.responses[0]?.fullTextAnnotation?.text || null;
        console.log("כל הטקסט מסודר בשורות:" + detectedText)

        const arr = response.data.responses[0].textAnnotations.slice(1)
        const name = arr.findIndex((myname: any) => myname.description.includes("שם"))
        console.log('my name:' + arr[name + 2].description + ' ' + arr[name + 3].description);

        const myclass = arr.findIndex((myname: any) => myname.description.includes("כיתה"))
        console.log('my class:' + arr[myclass + 2].description + arr[myclass + 3].description);

        // console.log(arr);
        type MyObject = {
            description: string;
            boundingPoly: any; // אם אתה יודע את הטיפוס המדויק של boundingPoly, תוכל להוסיף אותו פה.
        };



        // אותיות אנגלית בלבד
        const lettersAfterHeu = arr.reduce((acc: string[], curr: MyObject, i: number): string[] => {
            if (curr.description === 'הוא' && arr[i + 1]?.description === ':') {
                const nextDescription = arr[i + 2]?.description;
                // if (nextDescription && /^[A-Za-z]+$/.test(nextDescription)) {
                    acc.push(nextDescription);
                // }
            }
            return acc;
        }, []);
        console.log("התשובות הם" + lettersAfterHeu);
        // מספרים בלבד
        // const numbersAfterHeu = arr.reduce((acc: string[], curr: MyObject, i: number): string[] => {
        //     if (curr.description === 'הוא' && arr[i + 1]?.description === ':') {
        //         const nextDescription = arr[i + 2]?.description;
        //         if (nextDescription && !isNaN(Number(nextDescription))) {
        //             acc.push(nextDescription);
        //         }
        //     }
        //     return acc;
        // }, []);
        // console.log(numbersAfterHeu + "------------------");

        return detectedText;
    } catch (error: any) {
        console.error('Error during OCR:', error.response ? error.response.data : error.message);
        return null;
    }
};



////GPt



// import axios from 'axios';

// type MyObject = {
//     description: string;
//     boundingPoly: {
//         vertices: { x: number; y: number }[];
//     };
// };

// export const analyzeImage = async (base64Image: string): Promise<string | null> => {
//     const apiKey = `AIzaSyDvC1ylRFcifTEdiMNcDJt3Ztn2IwvH-Z0`;
//     const url = `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`;

//     const requestBody = {
//         requests: [
//             {
//                 image: { content: base64Image },
//                 features: [{ type: 'DOCUMENT_TEXT_DETECTION' }],
//                 imageContext: {
//                     languageHints: ['he', 'en'], // רמזים לזיהוי שפה
//                     // languageHints: ['en'], // רמזים לזיהוי שפה
//                 },
//             },
//         ],
//     };

//     try {
//         const response = await axios.post(url, requestBody, {
//             headers: { 'Content-Type': 'application/json' },
//         });

//         const fullText = response.data.responses[0]?.fullTextAnnotation?.text || null;
//         const textAnnotations: MyObject[] = response.data.responses[0]?.textAnnotations || [];
//         const newArr = textAnnotations.slice(1);

//         let name: string | null = null;
//         let className: string | null = null;

//         const nameIdx = newArr.findIndex(item => item.description.includes("שם"));
//         if (nameIdx !== -1 && newArr[nameIdx + 2] && newArr[nameIdx + 3]) {
//             name = `${newArr[nameIdx + 2].description} ${newArr[nameIdx + 3].description}`;
//         }

//         const classIdx = newArr.findIndex(item => item.description.includes("כיתה"));
//         if (classIdx !== -1 && newArr[classIdx + 2] && newArr[classIdx + 3]) {
//             className = `${newArr[classIdx + 2].description}${newArr[classIdx + 3].description}`;
//         }

//         const numbersAfterHeu = textAnnotations.reduce((acc: string[], curr, i) => {
//             if (curr.description === 'הוא' && textAnnotations[i + 1]?.description === ':') {
//                 const possibleNumber = textAnnotations[i + 2]?.description;
//                 if (possibleNumber && !isNaN(Number(possibleNumber))) {
//                     acc.push(possibleNumber);
//                 }
//             }
//             return acc;
//         }, []);

//         const summary = [
//             `סיכום ניתוח תמונה:`,
//             `-----------------------------`,
//             `👤 שם: ${name ?? "לא זוהה"}`,
//             `🏫 כיתה: ${className ?? "לא זוהתה"}`,
//             `🔢 מספרים אחרי "הוא:": ${numbersAfterHeu.length > 0 ? numbersAfterHeu.join(', ') : "לא נמצאו"}`,
//             `📄 טקסט מלא (חלקי):`,
//             fullText?.substring(0, 100).replace(/\n/g, ' ') ?? "לא נמצא טקסט",
//             `-----------------------------`,
//         ].join('\n');

//         return summary;
//     } catch (error: any) {
//         console.error('Error during OCR:', error.response ? error.response.data : error.message);
//         return null;
//     }
// };



