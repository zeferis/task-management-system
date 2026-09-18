import express from 'express';
import 'dotenv/config';
import router from './routes/taskRoutes.js'; 

const app=express();
const port=process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/tasks',router);

app.listen(port,()=>{
    console.log(`Server running at http://localhost:${port}`);
})
