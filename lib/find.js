// Generates a smart Find method
var find = function (controller, Model, opts) {
	
	var action = function (req, res, params){
		var id = params.id;

		var nestedModel = params.nestedModel;

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
			
			// If it is a nested model, we have to query it
			if(opts.nested && nestedModel){
				if(id && opts.nested[nestedModel]){
					// Execute query method on model and continue
					var queryMethod = opts.nested[nestedModel];
					// if(typeof queryMethod === 'function'){
						// queryMethod(beforeRender);
					// }else{
						models[queryMethod](beforeRender);
					// }
				}else{
					// Model assoc is inexistent
					throw new geddy.errors.BadRequestError();
				}
			}else{
				// Not an association. Continue
				beforeRender(err, models)
			}
		}

		function beforeRender(err, models){
			if(models === undefined)
				throw new geddy.errors.NotFoundError();

			if(opts.beforeRender){
				// Callback beforeRender
				opts.beforeRender(err, models, finishRender);
			}else{
				// Render if no beforeRender setted
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