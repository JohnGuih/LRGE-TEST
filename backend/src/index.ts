import express from "express";
import cors from "cors";
import multer from "multer";
import zipfileRouter from "./routes/zipfile";

const port = 8080;
const app = express();

app.use('/public', express.static('src/public/temp'));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
}));

app.use((req, res, next) => {
	let log = [
        `Time: ${new Date().toISOString()}`,
        `Method: ${req.method}`,
        `Path: ${req.path}`,
    ];

    if(req.body) log.push(`Body: ${JSON.stringify(req.body)}`);
    if(req.query) log.push(`Query: ${JSON.stringify(req.query)}`);
    if(req.params) log.push(`Params: ${JSON.stringify(req.params)}`);

    console.log(log.join('\n'));

	next();
});


app.use('/api', zipfileRouter);

app.use((req, res) => {
    res.status(404).json({
        message: 'Not found'
    });
});

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});