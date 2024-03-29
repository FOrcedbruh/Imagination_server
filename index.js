const express = require('express');
const dotenv = require('dotenv');
const mongoose =  require('mongoose');
const authRouter = require('./auth/authRouter');
const cors = require('cors');
const User = require('./models/User');
const Note = require('./models/Note');

dotenv.config();

const PORT = 8080;


const app = express();

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    next();
});

app.use(cors());

app.use(express.urlencoded());
app.use(express.json());
app.use('/auth', authRouter);

app.get('/', (req, res) => {
    return res.json({
        message: 'hi, go to another routes)'
    });
})

app.post('/editNote', async (req, res) => {
    const {_id, text, title} = req.body;

    try {
        await Note.updateOne({_id}, { $set: {text: text, title: title}});
    }
    catch (error) {
        console.error(error);
        return res.json({message: 'Error, try it another time'});
    }

    return res.json({message: 'Successfully updated'})
})


app.post('/getUser', async ( req, res) => {
    const { username } = req.body;

    const users = await User.find();

    const currentUser = await users.filter(user => user.username == username);
    
    res.json(currentUser);
});




const db_url = process.env.MONGO_DB_URL;


const start = async () => {
    try {
        await mongoose.connect(db_url).then(() => console.log('подключено к базе данных'))
        app.listen(PORT, () => {
            console.log(`сервер запущен на порте http://localhost:${PORT}`);
        })
    } catch(error) {
        console.log(error)
    }
}

start();


