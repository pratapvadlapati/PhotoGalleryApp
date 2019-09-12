const express = require('express');
const multer = require('multer');
const path  = require('path');

//set storage engine
const storage = multer.diskStorage({
    destination: './public',
    filename: function(req, file, cb){
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

//Init Upload
const upload = multer({
    storage: storage,
    limits: {fileSize: 2000000},
    fileFilter: function(req, file, cb){
        checkFileType(file, cb);
    }
}).single('myimage')

//check fileType 
function checkFileType(file, cb){
    //create exp for file-type allowed
    const filetypes = /jpeg|jpg|png|gif/;
    //check ext
    const extname =filetypes.test(path.extname(file.originalname).toLowerCase());
    //check mime
    const mimetype = filetypes.test(file.mimetype);

    if(mimetype && extname){
        return cb(null, true);
    }else{
        cb('Error: Images only')
    }
}

//Init app

const app = express();

//enable cors
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Access-Control-Request-Method, Content-Type, Accept, Authorization, *");
    next();
  });

//routes
app.get('/', (req, res)=>{
res.send('Image uploader');
})

app.post('/upload', (req, res)=>{
upload(req, res, (err)=>{
    if(err){
        console.log(err);
        res.send('there is an error');
    }else{
        console.log(req.file);
        res.send({'status': 'file uploaded'});
    }
});
})

const port = 3003;

app.listen(port, ()=>{
    `server started on port ${port}`
});