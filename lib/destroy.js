// Generates a smart Destroy method
var destroy = function (controller, Model, opts) {
	
	var action = function (req, res, params){
		var id = params.id;

		// If undefined, we should search for all items
		if(id === undefined){
			throw new geddy.errors.BadRequestError();
		}else{
			Model.first(id, function(err, model) {
				if(err) { throw err; };

				// Not found?
				if(!model)
					throw new geddy.errors.NotFoundError();

				// Destroy it
				Model.remove(model.id, function(err){
					afterDestroy(err, model);
				});
			});
		}

		function afterDestroy(err, model){
			if(err) { throw err; };

			if(opts.beforeRender){
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

module.exports = destroy;