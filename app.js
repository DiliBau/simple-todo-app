
/**
 * Module dependencies.
 */

var express = require('express'),
	routes = require('./routes'),
	http = require('http'),
	path = require('path'),
	app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
// ensure todos exists in the session
app.all('*', function (req, res, next) {
	req.session.todos = req.session.todos || [];
	next();
});

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/todos', function (req, res) {
	res.json(req.session.todos);
});
app.get('/todos/:id', function (req, res) {
	for (var c = 0; c < req.session.todos.length; c++) {
		if (req.session.todos[c].id == req.params.id) {
			return res.json(req.session.todos[c]);
		}
	}
	res.json([]);
});
app.put('/todos/:id', function (req, res) {
	for (var c = 0; c < req.session.todos.length; c++) {
		if (req.session.todos[c].id == req.params.id) {
			// Maybe update the entire object at some point?
			// req.session.todos[c] = req.body;
			if ('todo' in req.body) {
				req.session.todos[c].todo = req.body.todo;
			}
			if ('checked' in req.body) {
				req.session.todos[c].checked = req.body.checked;
			}
			return res.json(req.session.todos[c]);
		}
	}
	res.json([]);
});
app.delete('/todos/:id', function (req, res) {
	var newTodos = [];
	for (var c = 0; c < req.session.todos.length; c++) {
		if (req.session.todos[c].id != req.params.id) {
			newTodos.push(req.session.todos[c]);
		}
	}
	req.session.todos = newTodos;
	res.json(req.session.todos);
});
app.post('/todos', function (req, res) {
	var todo = {
		id: (new Date()).getTime(),
		todo: req.body.todo,
		checked: false
	};
	req.session.todos.push(todo);
	res.json(todo);
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
