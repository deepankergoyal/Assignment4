var express = require("express");
var mongoose = require("mongoose");
var app = express();
var database = require("./q2/config/database");
var bodyParser = require("body-parser");
const exphbs = require("express-handlebars");

const hbs = exphbs.create({
  extname: ".hbs",
  defaultLayout: "main",
  // Add runtime options to control prototype access
  runtimeOptions: {
    allowProtoMethodsByDefault: true,
    allowProtoPropertiesByDefault: true,
  },
});

// app.engine(".hbs", exphbs.engine({ extname: ".hbs", defaultLayout: "main" }));
// app.set("view engine", "hbs");

app.engine(".hbs", hbs.engine);
app.set("view engine", ".hbs");
var port = process.env.PORT || 8000;

// Body-parser middleware setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

// Connecting to the MongoDB database
mongoose.connect(database.url);

// Book model from the schema definition
var Book = require("./q2/models/books");

// Get all books data from the database
app.get("/api/books", function (req, res) {
  Book.find(function (err, books) {
    if (err) res.send(err);
    res.json(books); // Return all books in JSON format
  });
});

// Get a book by its ID
app.get("/api/books/:book_id", function (req, res) {
  let id = req.params.book_id;
  Book.findById(id, function (err, book) {
    if (err) res.send(err);
    res.json(book);
  });
});

// Create a new book and return all books after creation
app.post("/api/books", function (req, res) {
  console.log(req.body);

  Book.create(
    {
      ISBN: req.body.ISBN,
      img: req.body.img,
      title: req.body.title,
      author: req.body.author,
      inventory: req.body.inventory,
      category: req.body.category,
    },
    function (err, book) {
      if (err) res.send(err);
      Book.find(function (err, books) {
        if (err) res.send(err);
        res.json(books);
      });
    }
  );
});

// Update a book by its ID
app.put("/api/books/:book_id", function (req, res) {
  let id = req.params.book_id;
  var data = {
    ISBN: req.body.ISBN,
    img: req.body.img,
    title: req.body.title,
    author: req.body.author,
    inventory: req.body.inventory,
    category: req.body.category,
  };

  Book.findByIdAndUpdate(id, data, function (err, book) {
    if (err) res.send(err);
    res.send("Successfully! Book updated - " + book.title);
  });
});

// Delete a book by its ID
app.delete("/api/books/:book_id", function (req, res) {
  let id = req.params.book_id;
  Book.remove({ _id: id }, function (err) {
    if (err) res.send(err);
    else res.send("Successfully! Book has been Deleted.");
  });
});

// Route to display book info based on user input ISBN
app.get("/book", (req, res) => {
  res.render("bookInfo"); // Render the HTML form to input ISBN
});

app.post("/book", (req, res) => {
  try {
    const { isbn } = req.body; // Assuming the ISBN is sent in the request body
    Book.findOne({ ISBN: isbn }, (err, book) => {
      if (err) {
        res.status(500).send("Error fetching book info");
      } else {
        res.render("bookDetails", { book }); // Render book details view if book found
      }
    });
  } catch (err) {
    res.status(500).send("Error fetching book info");
  }
});

app.get("/books/new", (req, res) => {
  res.render("newBook"); // Render the HTML form to input ISBN
});

// Route to handle form submission for adding a new book
app.post("/books/new", async (req, res) => {
  try {
    const { ISBN, img, title, author, inventory, category } = req.body;
    const newBook = new Book({ ISBN, img, title, author, inventory, category });
    await newBook.save(); // Save the new book to the database
    res.send("Book added successfully!");
  } catch (err) {
    res.status(500).send("Error adding new book");
  }
});

// Start the server
app.listen(port, function () {
  console.log("App listening on port: " + port);
});
