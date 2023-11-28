const fs = require('fs');
const pdf = require('pdf-parse');
const axios = require('axios');


const TEXT_ANALYTICS_URL ='https://microsoft-text-analytics1.p.rapidapi.com/entities/recognition/general'
const API_KEY ='e2cba22eb5msh374cb9498276cbap112a5bjsnecdbd27c442d';
const API_HOST ='microsoft-text-analytics1.p.rapidapi.com';



const extractTextFromPDF = async (pdfPath) => {
    try {
        const pdfBuffer = fs.readFileSync(pdfPath);
        const data = await pdf(pdfBuffer);

        const toknizeData = await toknizePDF(data.text);
        return {
            ...modelDataBeforeSave(toknizeData),
            filePath: pdfPath,
        };
    } catch (error) {
        console.error('Error extracting text from PDF:', error);
        throw error;
    }
}


// Using external API - Microsoft Text Analytics to tokenize the data
const toknizePDF = async (data) => {

    const options = {
        method: 'POST',
        url: TEXT_ANALYTICS_URL,
        headers: {
            'content-type': 'application/json',
            'X-RapidAPI-Key': API_KEY,
            'X-RapidAPI-Host': API_HOST
        },
        data: {
            documents: [
                {
                    id: '1',
                    language: 'en',
                    text: data
                },

            ]
        }
    };

    try {
        return axios.request(options).then((res) => {
            console.log(res.data.documents[0].entities);
            const tokenizedData = res.data.documents[0].entities;
            return tokenizedData;
        })
    } catch (error) {
        console.error(error);
    }
}

// Build rawData field in DB object
const buildRawData = (tokenizedData)=>{
    const organizedData = tokenizedData.reduce((acc, { category, text }) => {
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(text);
        return acc;
      }, {});
      return organizedData;
}

// Filter and validate tokenized data
const filterAndValidTokens = (tokens, category, validationRules) => {
    const validTokens = tokens.filter(token => {
        let validationOutput = true;
        if (validationRules != null) {
            validationRules.forEach(validFunc => {
                if (!validFunc(token.text)) validationOutput = false;
            });
        }
        return token.category === category && validationOutput
    })
    return validTokens.length > 0 ? validTokens.map(token => token.text) : [null];
}

//Function to Transforms raw data for database storage.

const modelDataBeforeSave = (tokenizedData) => {

    const name = filterAndValidTokens(tokenizedData, "Person", null);
    const phone = filterAndValidTokens(tokenizedData, "PhoneNumber", []);
    const email = filterAndValidTokens(tokenizedData, "Email", [isValidMail]);
    const skills = new Set(filterAndValidTokens(tokenizedData, "Skill", []));
    const linkedin = filterAndValidTokens(tokenizedData, "URL", [isLinkedinLink]);
    const id = filterAndValidTokens(tokenizedData, "Quantity", [isValidId]);
    const rawData = buildRawData(tokenizedData);


    const dbObject = {
        id: id[0],
        name: name[0],
        phone: phone[0],
        email: email[0],
        linkedin: linkedin[0],
        skills: Array.from(skills),
        rawData:rawData

    }
    return dbObject;

}

// Function to delete resume file from the system
const deleteFile = (filePath) => {
    fs.unlink(filePath, (err) => {
        if (err) {
            console.error('Error deleting file:', err);
        } else {
            console.log('File deleted successfully.');
        }
    });
};






// Function to check if a string contains only letters
const isStringOnlyLetters = (str) => /^[a-zA-Z]+$/.test(str.trim());

// Function to check if a string is empty
const isEmptyString = (str) => str.trim().length === 0;


const isValidId = str => /^[1-9]\d{8}$/.test(str);

const isValidMail = str => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str);

const isLinkedinLink = str => str.toLowerCase().includes('linkedin');

module.exports = {
    isEmptyString,
    isStringOnlyLetters,
    extractTextFromPDF,
    deleteFile,
};
