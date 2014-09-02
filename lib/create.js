// Generates a smart Create method
var create = function (controller, Model, opts) {
	
	var action = function (req, res, params){

		var model = Model.create(params);

		if(!model.isValid()){
			return finishRender(model);
		}

		model.save(afterSave);

		function afterSave(err, model){
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

module.exports = create;