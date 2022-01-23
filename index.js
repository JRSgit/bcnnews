require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const fileUpload = require('express-fileupload');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const router = require('./src/router');


const app = express();
const uri = process.env.URI

app.use(cors({ origin: 'https://bcnnews.herokuapp.com/*' || 'http://localhost:5000/*'}))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
app.use('/files', express.static(path.resolve(__dirname, "src", "controles", "public", "imagens")))

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use('/public',express.static(path.join(__dirname, './src/public')));
app.set('views', path.join(__dirname, './src/views'));

// Session ========
app.use(session({
    secret: process.env.SESSION_SECRET,
    cookie: {maxAge: 60000},
    resave: true,
    saveUninitialized: false,
}))
// =============
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: path.join(__dirname, 'temp')
}))
//  Rotas =======
app.use(router);


mongoose.connect(
    uri, {
        useNewUrlParser: true,
        useUnifiedTopology:true,
        useFindAndModify: true,
        useCreateIndex: true
    }
).then(() => {
    app.listen(process.env.PORT || 5000, () => {
        console.log('Server Rodando');
    })
}).catch((error) =>{
    console.log('Server sem conecção com o banco de dados');
    console.log(error.message);
})
