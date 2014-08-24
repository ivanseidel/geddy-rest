# GeddyJs REST Helper

Use this simple library to avoid code repetition for Controllers REST actions. With one single line, you provide all the methods you need for your controller, in order to have a fully REST api.

It is made to be used with [GeddyJs](http://geddyjs.org/).

## Instalation

1. Run: `npm install --save geddy-rest`
2. Add the folowing line inside your controller:
   
  ```
  require('geddy-test').RESTify(this, MyModel);
  ```

3. Add the folowing line inside `/config/routes.js`:

  ```
  require('geddy-test').route(router, 'mymodel');
  ```

4. You are done, and you can access trough:
  ```
  GET /:model         ---> Find All
  GET /:model/:id     ---> Find First
  POST /:model/:id    ---> Create
  PUT /:model/:id     ---> Update
  DELETE /:model/:id  ---> Destroy
  ```
  
  _If you want `named` paths with `GET` method, read below._


## Advanced usage

- `RESTify(controller, model, opts)`

  Restify creates methods inside your given `controller`. It uses the `model` to _create/find/delete/update_.
  
  You can also assign some options:
    - `opts.[create|find|update|destroy]`: [`false` | `Object`]
      If set to false, will not generate the method.
      
      example:
      ```
      // Only enables find method
      RESTify(this, MyModel, {
        create: false,
        destroy: false,
        update: false,
      });
      ```
      
    - `opts.[create|find|update|destroy].action`: `String`
      Use this to change the desired method to be saved. You can, for example, generate it and use it the way you want:
      ```
      RESTify(this, MyModel, {
        find: {
          action: 'myFindAction'
        }
      });
      
      this.find = function (req, res, params){
        // Do whatever you want....
        var a = 2*9;
        // Delegate it to the REST find method
        this.myFindAction(req, res, params);
      }
      ```
      
      
    - `opts.[create|find|update|destroy].beforeRender`: `function`
      
      Use this property to receive actions just before rendering the data. You can either render it yourself (just don't call the `next` function), or process something before rendering and delegate it to the REST action egain:
      ```
      this._checkDbFirst = function (err, models, next){
        // You render the content here. Just don't call next.
        respond(models);
        
        // But if you do, pass the models to render
        next(models);
      }
      
      RESTify(this, MyModel, {
        create: {
          action: 'find',
          beforeRender: this._checkDbFirst
        }
      });
      ```
      
    - GeddyJs is a well tought Framework. If you need to perform actions either `before` or `after` a call to the REST endpoint, use the methods `.before` and `.after`:
      ```
      // Calls prepareThings before find and create
      this.before(prepareThings, {only: ['find', 'create']});
      // Calls finishThingsUp after update and destroy
      this.after(finishThingsUp, {only: ['update', 'destroy']});
      ```
      
- `route(Router, ModelName, opts)`
  
  This will generate routes acordingly to your needs. It should be placed inside `/config/routes.js`.

  If you need to alter the `default routes`, or `HTTP methods` you can access it exacly like the `RESTify` method:
  ```
  // Change the default route of 'find' to 'get'
  // Change the destroy method to 'GET'
  // Disables update route
  route(router, MyModelName, {
    find: {
      action: 'get'
    },
    destroy: {
      method: 'GET'
    },
    update: false
  });
  ```
    
  One last usefull option, is the `opts.strict`, which defaults is set to `true`.
  
  If set to false, will generate PATHS to facilitate your life (during development?):
  ```
  GET /:model/find
  GET /:model/find/:id
  GET /:model/create
  GET /:model/destroy/:id
  GET /:model/update/:id
  ```
