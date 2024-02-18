const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require("../models/User");
const Note = require('../models/Note');
const secret = require('./config');





const generateAccesToken = (id, username, email) => {
    const payload = {
        id, 
        username,
        email
    }
    return jwt.sign(payload, secret, {expiresIn: 60 * 60})
}





class authController {

    async registration(req, res) {
        try {
            const {username, password, email} = req.body;
            const UsernameCandidate = await User.findOne({username});
            const EmailCandidate = await User.findOne({email});
            
            if (UsernameCandidate) {
                return res.status(404).json({error: `User ${username} already exists `})
            } else if (EmailCandidate) {
                return res.status(404).json({error: `User with ${email} already exists`})
            }

            const hashPassword = bcrypt.hashSync(password, 10);
            const user = new User({
                username, password: hashPassword, email
            });
            user.save();
            return res.json({
                message:   'User successfully created'
            })
                
            
        } catch(error) {
            console.log(error);
            res.status(404).json({message: 'Registration error'})
        }
    }   
    async login(req, res) {
        try {
            const {username, password} = req.body;
            const user = await User.findOne({username});
            if (!user) {
                return res.status(404).json({message: `User ${username} does not exist`})
            }
            const validPassowrd = bcrypt.compareSync(password, user.password);
            if (!validPassowrd) {
                return res.status(404).json({message: 'Incorrect password entered'})
            }
            const token = generateAccesToken(user._id, user.username, user.email);

            return res.json({token: token, message: 'Successfull authorization'});
        } catch (error) {
            console.log(error);
            res.status(404).json({message: 'Authorization error'})
        }
        
    }
    async decodeToken(req, res) {
        try {
            const {token} = req.body;
            if (!token) {
                res.status(401).json({
                    message: 'Токен отсутствует'
                })
            }
            jwt.verify(token, secret, (err, decoded) => {
                if (err) {
                  return res.status(401).json({ error: 'Неверный токен' });
                }
            
                const userData = decoded; 
                res.json({ userData });
              });
        } catch(e) {
            console.log('error', e)
        }
    }
    async createNote(req, res) {
        const {text, title, username} = req.body;
        const note = new Note({
            text,
            title,
            user: username
        });
        note.save();
        return res.json({message: 'Note successfully created '})
    }
    async getNotes(req, res) {
        const {username} = req.body;

        const allNotes = await Note.find();

        const filteredNotes = await allNotes.filter(note => note.user == username);

        res.json({
            filteredNotes
        })
    }
}

module.exports = new authController();