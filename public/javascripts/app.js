(function ($) {
    $(function () {
    	// StackOverFlow
		$.fn.serializeObject = function()
		{
		   var o = {};
		   var a = this.serializeArray();
		   $.each(a, function() {
		       if (o[this.name]) {
		           if (!o[this.name].push) {
		               o[this.name] = [o[this.name]];
		           }
		           o[this.name].push(this.value || '');
		       } else {
		           o[this.name] = this.value || '';
		       }
		   });
		   return o;
		};

    	var Todos = Backbone.Collection.extend({
    		url: '/todos'
    	});
    	var Todo = Backbone.Model.extend({
    		urlRoot: '/todos'
    	});

    	var TodosView = Backbone.View.extend({
    		el: '.page',
    		render: function () {
    			var todos = new Todos(),
    				$el = this.$el;
    			todos.fetch({
    				success: function (todos) {
    					var tpl = _.template($('#todos').html(), {
    						todos: todos.models
    					});
    					$el.html(tpl);
    				}
    			});
    			return this;
    		},
    		events: {
    			'click .delete': 'deleteTodo',
    			'click input[type=checkbox]': 'updateTodo'
    		},
    		updateTodo: function (ev) {
    			ev.preventDefault();
    			var todo = new Todo({
    				id: $(ev.currentTarget).val()
    			}), $el = this.$el;
    			todo.save('checked', $(ev.currentTarget).is(':checked'), {
    				success: function (mdl) {
		    			var todos = new Todos();
		    			todos.fetch({
		    				success: function (todos) {
    							console.log(ev.currentTarget);
		    					var tpl = _.template($('#todos').html(), {
		    						todos: todos.models
		    					});
		    					$el.html(tpl);
		    				}
		    			});
    				}
    			});
    		},
    		deleteTodo: function (ev) {
    			ev.preventDefault();
    			var todo = new Todo({
    				id: $(ev.currentTarget).data().id
    			}),
					$el = this.$el;
    			if (!confirm('Are you sure?')) {
    				return;
    			}
    			todo.destroy({
    				success: function () {
		    			var todos = new Todos();
		    			todos.fetch({
		    				success: function (todos) {
		    					var tpl = _.template($('#todos').html(), {
		    						todos: todos.models
		    					});
		    					$el.html(tpl);
		    				}
		    			});
    				}
    			});
    		}
    	});

    	var TodosNewView = Backbone.View.extend({
    		el: '.page',
    		render: function () {
				var tpl = _.template($('#todos-new').html(), {});
				this.$el.html(tpl);
    			return this;
    		},
    		events: {
    			'submit form.form-todos-new': 'saveTodo'
    		},
    		saveTodo: function (ev) {
    			ev.preventDefault();
    			var data = $(ev.currentTarget).serializeObject(),
    				todo = new Todo();
    			todo.save(data, {
    				success: function (todo) {
    					router.navigate('', {trigger: true});
    				}
    			});
    		}
    	});

    	var TodosEditView = Backbone.View.extend({
    		el: '.page',
    		render: function (options) {
    			if (options.id) {
    				var todo = new Todo({id: options.id}),
    					$el = this.$el;
    				todo.fetch({
    					success: function (todo) {
							var tpl = _.template($('#todos-edit').html(), {
								todo: todo
							});
							console.log(todo);
							$el.html(tpl);
    					}
    				});
    			} else {
					var tpl = _.template($('#todos-new').html(), {});
					this.$el.html(tpl);
    			}
    			return this;
    		},
    		events: {
    			'submit form.form-todos-edit': 'saveTodo'
    		},
    		saveTodo: function (ev) {
    			ev.preventDefault();
    			var data = $(ev.currentTarget).serializeObject(),
    				todo = new Todo({id: data.id});
    			todo.save(data, {
    				success: function (todo) {
    					router.navigate('', {trigger: true});
    				}
    			});
    		}
    	});

    	var todosView = new TodosView(),
    		todosNewView = new TodosNewView(),
    		todosEditView = new TodosEditView();

        var Router = Backbone.Router.extend({
        	routes: {
        		'': 'indexAction',
        		'todos/new': 'newAction',
        		'todos/:id': 'editAction',
        		'todos': 'indexAction'
        	},
        	indexAction: function () {
        		todosView.render();
        	},
        	newAction: function () {
        		todosNewView.render();
        	},
        	editAction: function (id) {
        		todosEditView.render({
        			id: id
        		});
        	}
        });
        var router = new Router();

        Backbone.history.start();
    });
}) (jQuery);