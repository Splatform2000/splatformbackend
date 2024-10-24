const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const PORT = 5000; // Define the port directly

// Middleware
app.use(express.json({ limit: '10mb' })); // JSON body parser with limit
app.use(cors()); // Enable CORS

// Connect to MongoDB with the direct connection string
//const mongoURI = "mongodb+srv://school:school@school.vjfuq.mongodb.net/school?retryWrites=true&w=majority&appName=school";
const mongoURI ="mongodb+srv://splatform:Splatform2000@splatform.rohck.mongodb.net/?retryWrites=true&w=majority&appName=Splatform"
mongoose
    .connect(mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("NOT CONNECTED TO NETWORK", err));

// Define routes
app.use('/', require("./routes/route.js"));

// Start the server
app.listen(PORT, () => {
    console.log(`Server started at port no. ${PORT}`);
});
