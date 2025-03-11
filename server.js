const express = require("express");
const exphbs = require("express-handlebars");
const fs = require("fs");
const session = require("client-sessions");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 4000;


app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.json());

// Setup 
app.engine("hbs", exphbs.engine({
    extname: ".hbs",
    defaultLayout: "main",
    layoutsDir: path.join(__dirname, "views", "layouts")
}));
app.set("view engine", "hbs");


app.use(session({
    cookieName: "session",
    secret: "random_secret_key",
    duration: 30 * 60 * 1000,
    activeDuration: 5 * 60 * 1000,
}));

// Load 
const usersFilePath = path.join(__dirname, "data", "user.json");

if (!fs.existsSync(usersFilePath)) {
    console.error("Error: user.json file not found.");
    process.exit(1);
}

const users = JSON.parse(fs.readFileSync(usersFilePath, "utf-8"));

// Routes
app.get("/", (req, res) => {
    res.render("login", { title: "Login Page" });
});

app.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (!users[username]) {
        return res.render("login", { title: "Login Page", error: "Invalid username" });
    }

    if (users[username] !== password) {
        return res.render("login", { title: "Login Page", error: "Invalid password" });
    }

    // Set
    req.session.user = username;
    res.redirect("/gallery");
});

app.get("/gallery", (req, res) => {
    if (!req.session.user) {
        return res.redirect("/");
    }

    // Read 
    const imageDir = path.join(__dirname, "public", "images");
    let images = [];
    
    if (fs.existsSync(imageDir)) {
        images = fs.readdirSync(imageDir).filter(file => file.endsWith(".jpg") || file.endsWith(".png"));
    }

    res.render("gallery", { title: "Gallery", username: req.session.user, images });
});

app.get("/logout", (req, res) => {
    req.session.reset();
    res.redirect("/");
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});