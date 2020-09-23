if (process.env.NODE_ENV !== "production") {
	require("dotenv").config();
}

const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const mongoose = require("mongoose");
const expressEjsLayouts = require("express-ejs-layouts");
const passport = require("passport");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const booksRouter = require("./routes/books");
const session = require("express-session");
const flash = require("express-flash");
const MongoStore = require("connect-mongo")(session);

const initializePassport = require("./passport-config");
initializePassport(passport);

// connect to DB
mongoose.connect(process.env.DATABASE_URL, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", (error) => console.error(error));
db.once("open", () =>
	console.log(`Connedcted to Mongoose: ${process.env.DATABASE_URL}`)
);

// create server
const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.set("layout", "layouts/layout");
app.use(expressEjsLayouts);

app.use(express.static(path.join(__dirname, "public")));
app.use(logger("dev"));
// app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// session
app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: false,
		store: new MongoStore({ mongooseConnection: mongoose.connection }),
	})
);

// passport
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
	res.locals.user = req.user;
	next();
});

// Router: It should be always later than other middlewares
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/books", booksRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

app.listen(process.env.PORT || 3000, () => {
	console.log(`App listening at PORT:${process.env.PORT || 3000}`);
});
