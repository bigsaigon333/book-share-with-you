if (process.env.NODE_ENV !== "production") {
	require("dotenv").config();
}

const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const booksRouter = require("./routes/books");

const app = express();

const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const expressEjsLayouts = require("express-ejs-layouts");

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.set("layout", "layouts/layout");
app.use(expressEjsLayouts);

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: false, limit: "10mb" }));
app.use(logger("dev"));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());

// Router
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/books", booksRouter);

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

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// // error handler
// app.use(function (err, req, res, next) {
// 	// set locals, only providing error in development
// 	res.locals.message = err.message;
// 	res.locals.error = req.app.get("env") === "development" ? err : {};

// 	// render the error page
// 	res.status(err.status || 500);
// 	res.render("error");
// });

app.listen(process.env.PORT || 3000, () => {
	console.log(`App listening at PORT:${process.env.PORT}`);
});
