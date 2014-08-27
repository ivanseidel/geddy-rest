/*
 * GeddyJs REST Helper
 * Copyright 2014 Ivan Seidel Gomes (ivanseidel@gmail.com)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
*/


var _ = require('lodash');

var RestApi = {};

var methodGenerators = {
	find: require('./find'),
	create: require('./create'),
	update: require('./update'),
	destroy: require('./destroy')
};

RestApi._restfyDefaults = {
	create: {
		action: 'create',
		beforeRender: null,
	},
	update: {
		action: 'update',
		beforeRender: null,
	},
	destroy: {
		action: 'destroy',
		beforeRender: null,
	},
	find: {
		action: 'find',
		beforeRender: null,
		/*
			Nested models (Associations)

			example:

				nested: {
					photos: 'getPhotos',
					owner: 'getOwner'
				}
		*/
		nested: [],
	},
};

RestApi.RESTify = function (controller, model, opts){
	// Force defaults values, or false
	opts = _smartDefaults(opts, RestApi._restfyDefaults);

	// Install method generators
	for(var m in methodGenerators){
		if(!opts[m]) continue;

		// Install method
		methodGenerators[m](controller, model, opts[m]);
	}

};


// Default values for route options
RestApi._routeDefaults = {
	strict: true,

	find: {
		action: 'find',
		method: 'GET',
		nested: false
	},

	create: {
		action: 'create',
		method: 'POST',
	},

	update: {
		action: 'update',
		method: 'PUT',
	},

	destroy: {
		action: 'destroy',
		method: 'DELETE',
	}

};

/*
	Will generate a REST Api for the given Model-Controller

	Options:
		strict
			generate also a GET api for destroy/create/update:
			/[model]/destroy
			/[model]/create
			/[model]/update
			/[model]/find
*/
RestApi.route = function (router, model, opts){

	// Force defaults values, or false
	opts = _smartDefaults(opts, RestApi._routeDefaults);

	var base = '/'+model.toLowerCase();


	// Route Create Endpoint
	var create = opts.create;
	if(create){
		var createAction = model+'.'+create.action;

		router.match(base+'(.:format)', create['method']).to(createAction);

		if(!opts.strict){
			router.get(base+'/'+create.action+'(.:format)').to(createAction);
		}
	}

	// Route Update Endpoint
	var update = opts.update;
	if(update){
		var updateAction = model+'.'+update.action;

		router.match(base+'/:id(.:format)', update['method']).to(updateAction);

		if(!opts.strict){
			router.get(base+'/'+update.action+'/:id(.:format)').to(updateAction);
		}
	}

	// Route Destroy Endpoint
	var destroy = opts.destroy;
	if(destroy){
		var destroyAction = model+'.'+destroy.action;

		router.match(base+'/:id(.:format)', destroy['method']).to(destroyAction);

		if(!opts.strict){
			router.get(base+'/'+destroy.action+'/:id(.:format)').to(destroyAction);
		}
	}
	
	// Route Find Endpoint
	var find = opts.find;
	if(find){
		var findAction = model+'.'+find.action;

		if(!opts.strict){
			if(find.nested)
				router.get(base+'/'+find.action+'/:id/:nestedModel(.:format)').to(findAction);
					
			router.get(base+'/'+find.action+'(.:format)').to(findAction);
			router.get(base+'/'+find.action+'/:id(.:format)').to(findAction);
		}

		router.match(base+'(.:format)', find['method']).to(findAction);
		router.match(base+'/:id(.:format)', find['method']).to(findAction);

		if(find.nested)
			router.match(base+'/:id/:nestedModel(.:format)', find['method']).to(findAction);
	}
}

// Smart defaults for options
function _smartDefaults(opts, defaults){
	// Force defaults values, or false
	opts = _.defaults(opts || {}, defaults);
	for(var k in opts){
		if(_.isObject(opts[k])){
			opts[k] = _.defaults(opts[k], defaults[k]);
		}else{
			// If is set to true, we give the default. Or set to false
			opts[k] = opts[k] ? defaults[k] : false;
		}
	}
	return opts;
}

module.exports = RestApi;