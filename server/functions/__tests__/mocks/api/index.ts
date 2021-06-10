import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.status(200).send("it's alive!");
});

app.post('/client', (req, res) => {
    const data = req.body;
    if (!data.id) {
        res.status(400).send({
            message: 'Missing id field',
        });
    } else {
        res.status(201).send({
            message: 'Created',
        });
    }
});

app.get('/client/:clientId', (req, res) => {
    res.status(200).send({
        id: req.params.clientId,
    });
});


export type PostedLog = {
    clientID: string,
    data: SurveyPiece,
};

export type SurveyPiece = {
    subtype?: string;
    value: number;
    date: number;
    source: string;
};

app.post('/measurement', (req, res) => {
    const data: PostedLog = req.body;
    if (!data.clientID
        || !data.data
        || !data.data.date || !data.data.source || !data.data.value) {
        res.status(400).send({
            message: 'Missing data fields',
        });
    } else if (isNaN(data.data.date)) {
        res.status(400).send({
            message: 'date must be a number',
        });
    } else {
        res.status(201).send({
            message: 'Created',
        });
    }
});

const port = parseInt(process.env.BACKEND_API_PORT, 10);
const host = process.env.API_ADDR;

const server = app.listen(port, host, () => {
    console.log(`Mock app listening at http://${host}:${port}`);
});

process.on('SIGINT', async () => {
    server.close(() => {
        console.log('\n\nBye.');
        process.exit();
    });
});