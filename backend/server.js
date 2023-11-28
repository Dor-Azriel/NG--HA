const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');
const { extractTextFromPDF, deleteFile } = require('./Logic');
const multer = require('multer');

const MONGO_URL = `mongodb://127.0.0.1:27017/applicantsDB`;

const app = express();
app.use(cors());
app.use(express.json());

let client;
// Connection to MongoDB
async function connectToMongoDB() {
    client = new MongoClient(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect();
        console.log('Connected to MongoDB');
        return client.db('applicantsDB').collection('applicants');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
}

// Handle file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '/applicants_resume'));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.originalname + '-' + uniqueSuffix + '.pdf');
    }
});


const upload = multer({ storage: storage });

/**
 * Handles the GET request for the main page, returning all applicants from the database.
 */

app.get('/', async (req, res) => {
    try {
        const collection = await connectToMongoDB();
        const data = await collection.find({}).toArray();
        res.send({ status: true, data: data });
    } catch (error) {
        console.error("Error get all applicants from DB");
        res.status(500).send({ status: false, message: 'Internal server error.' });
    } finally {
        await client.close();
        console.log('Disconnected from MongoDB');
    }
});


/**
 * Handles a file upload POST request, saves the file on the server,
 * analyzes a PDF, and saves the extracted data to the database.
 */
app.post('/uploadcv', upload.single('file'), async (req, res) => {
    try {
        console.log('File uploaded:', req.file);
        const collection = await connectToMongoDB();
        const data = await extractTextFromPDF(req.file.path);
        const result = await collection.insertOne(data);
        console.log('Saved:', result);

        res.send({ status: true, message: 'Applicant saved successfully.' });

    } catch (error) {
        console.error('Error uploading CV:', error);
        res.status(500).send({ status: false, message: 'Internal server error.' });
    }
    finally {
        // Close the MongoDB connection.
        await client.close();
        console.log('Disconnected from MongoDB');
    }
});

/**
 * Handles a DOWNLOAD request, receiving an applicant ID, and responds with the applicant's CV file.
 */

app.get('/download/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const collection = await connectToMongoDB();
        const result = await collection.findOne({ _id: new ObjectId(id) });
        const filePath = result.filePath;

        res.download(filePath, id, (err) => {

            if (err) {
                console.error('Error downloading file:', err);
                res.status(500).send('Error downloading file');
            }
        });

    } catch (error) {
        console.error('Error downloading CV:', error);
        res.status(500).send({ status: false, message: 'Internal server error.' });
    } finally {
        // Close the MongoDB connection.
        await client.close();
        console.log('Disconnected from MongoDB');
    }


});



/**
 * Handles a DELETE request, removes the file from the server,
 * and deletes the corresponding applicant record from the database.
 */


app.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const collection = await connectToMongoDB();
        const result = await collection.findOneAndDelete({ _id: new ObjectId(id) });

        if (!result.value) {
            // No document found with the specified ID
            res.status(404).send({ status: false, message: 'User not found.' });
            return;
        }

        const path = result.value.filePath;

        await deleteFile(path);
        res.send({ status: true, message: 'User successfully deleted' });

    } catch (error) {
        console.error('Error deleting applicant:', error);
        res.status(500).send({ status: false, message: 'Internal server error.' });
    } finally {
        await client.close();
        console.log('Disconnected from MongoDB');
    }
});





const PORT = 8000;

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});



