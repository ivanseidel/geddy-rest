// Generates a smart Find method
var find = function (controller, Model, opts) {
	
	var action = function (req, res, params){
		var id = params.id;

		// If undefined, we should search for all items
		if(id === undefined){
			Model.all(afterFound);
		}else{
			Model.first(id, afterFound);
		}

		function afterFound(err, models){
			if(err) { throw err; };

			if(models === undefined)
				throw new geddy.errors.NotFoundError();
			
			if(opts.beforeRender){
				// Callback beforeRender
				opts.beforeRender(err, models, finishRender);
			}else{
				// Render if no beforeRender setted
				console.log('err: ', models);
				finishRender(models);
			}
		}

		function finishRender(models){
			controller.respondWith(models, {type: Model.modelName});
		}
	};

	// Register method in controller
	controller[opts.action] = action;
}

module.exports = find;