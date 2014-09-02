// Generates a smart Update method
var update = function (controller, Model, opts) {
	
	var action = function (req, res, params, next){
		var id = params.id;

		Model.first(id, function(err, model) {
			if(err) { throw err; };

			// Not found?
			if(!model)
				throw new geddy.errors.NotFoundError();

			// Update properties
			model.updateProperties(params);

			// Validates model
			if (!model.isValid()) {
				return afterUpdate(model);
			}

			// Save it
			model.save(afterUpdate);
		});

		function afterUpdate(err, model){
			if(err) { throw err; };

			if(next){
				// Callback custom callback
				next(err, model, finishRender);
			}else if(opts.beforeRender){
				// Callback beforeRender
				opts.beforeRender(err, model, finishRender);
			}else{
				// Render if no beforeRender setted
				finishRender(model);
			}
		}

		function finishRender(models){
			controller.respondWith(models, {type: Model.modelName});
		}
	};

	// Register method in controller
	controller[opts.action] = action;
}

module.exports = update;