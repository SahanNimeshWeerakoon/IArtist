const express = require('express');
const connectDB = require("./config/db");
const path = require('path');

const app = express();

//Connect Database
connectDB();

// Init Middleware
app.use(express.json({extended:false}));

/* on production process.env.port auto enawa. production daane nathuwa, localhost nan run wenne, 5000 pennana. 
nattan production env deela thiyena prot eka pawichchi karanna*/
const PORT = process.env.PORT || 5000;

//Define Routes
//the code below mean url "/api/users" will equal url "/" in routes/api/users file
//so if in the routes/api/users file, get method to "/register", which means go to localhost5000/api/users/register 
app.use('/api/users', require("./routes/api/users"));
app.use('/api/profile', require("./routes/api/profile"));
app.use('/api/auth', require("./routes/api/auth"));
app.use('/api/posts', require("./routes/api/posts"));
app.use('/api/items', require("./routes/api/items"));
app.use('/api/video', require("./routes/api/video"));

// Serve static asset in production
if(process.env.NODE_ENV==='production'){
    //Set static folder
    app.use(express.static('client/build'));

    app.get('*', (req,res)=>{
        res.sendFile(path.resolve(__dirname,'client', 'build','index.html'));
    })
}

app.listen(PORT, ()=> console.log(`Server started on port ${PORT}`));