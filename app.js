var express = require('express'),
  methodOverride = require('method-override'),
  expressSanitizer = require('express-sanitizer'),
  bodyParser = require('body-parser'),
  mongoose = require('mongoose'),
  app = express();

mongoose.connect('mongodb://localhost/restful_blog_app_v1', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.set('view engine', 'ejs');
app.use(expressSanitizer());
app.use(methodOverride('_method'));
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
// MONGOOSE/MODEL CONFIG
var blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  created: { type: Date, default: Date.now },
});
var Blog = mongoose.model('Blog', blogSchema);

// RESTFUL ROUTES

app.get('/', function (req, res) {
  res.redirect('/blogs');
});

// INDEX ROUTE
app.get('/blogs', function (req, res) {
  Blog.find({}, function (err, blogs) {
    if (err) {
      console.log('ERROR!');
    } else {
      res.render('index', { blogs: blogs });
    }
  });
});

// NEW ROUTE
app.get('/blogs/new', (req, res) => {
  res.render('new');
});

app.post('/blogs', (req, res) => {
  req.body.blog.body = req.sanitize(req.body.blog.body);
  Blog.create(req.body.blog, (err, newBlog) => {
    if (err) {
      res.render('new');
    } else {
      res.redirect('/blogs');
    }
  });
});

app.get('/blogs/:id', (req, res) => {
  Blog.findById(req.params.id, (err, foundBlog) => {
    if (err) res.redirect('/blogs');
    else res.render('show', { blog: foundBlog });
  });
});

app.get('/blogs/:id/edit', (req, res) => {
  Blog.findById(req.params.id, (err, foundBlog) => {
    if (err) {
      res.render('/blogs');
    } else {
      res.render('edit', { blog: foundBlog });
    }
  });
});

app.put('/blogs/:id', (req, res) => {
  req.body.blog.body = req.sanitize(req.body.blog.body);
  Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, updateBlog) => {
    if (err) {
      res.redirect('/blogs');
    } else {
      res.redirect('/blogs/' + req.params.id);
    }
  });
});

app.delete('/blogs/:id', (req, res) => {
  Blog.findByIdAndDelete(req.params.id, (err) => {
    if (err) {
      res.redirect('/blogs');
    } else {
      res.redirect('/blogs');
    }
  });
});

app.listen(process.env.PORT || 5000, process.env.IP, function () {
  console.log('Server has started');
});
