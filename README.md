## koa-springboot
[![npm version](https://badgen.net/npm/v/koa-springboot)](https://www.npmjs.com/package/koa-springboot)
![node version](https://badgen.net/npm/node/koa-springboot)
![last commit](https://badgen.net/github/last-commit/AsherWang/koa-springboot)
![travis](https://badgen.net/travis/AsherWang/koa-springboot?icon=travis)
![publish size](https://badgen.net/packagephobia/publish/koa-springboot)
![license](https://badgen.net/npm/license/koa-springboot)

## feature
- use decorator to build router
- auto import controller
- validate required params

## install  
`npm i koa koa-router koa-springboot -S`

## demo
controller  
``` typescript
// ...
@RequestMapping('/persons')
@ResponseBody
export default class Person {

  @GetMapping
  index() {
    return list;
  }

  @GetMapping('/:id')
  show(@PathVariable('id') id: string) {
    // ...
    return record;
  }

  @PostMapping
  create(@RequestBody body: any) {
    // ...
    return newRecord;
  }

  @PutMapping('/:id')
  update(@PathVariable('id') id: string, @RequestBody body: any) {
    // ...
  }

  @PatchMapping('/name/:id')
  patch(@PathVariable('id') id: string, @RequestBody body: any) {
    // ...
  }

  @DeleteMapping('/:id')
  destory(@PathVariable('id') id: string) {
    // ...
  }
}

```

app
``` typescript
// ...
@ControllerScan(__dirname, 'controller')
class App extends Application {
  // override init method to do you own logic
  // or not
  protected init() {
    this.app
    .use(bodyParser())
    .use(this.router.routes())
    .use(this.router.allowedMethods());
  }
}

new App().start();
```
see full demo [here](https://github.com/AsherWang/koa-springboot/tree/demo)

### reference
[docs of spring mvc](https://docs.spring.io/spring/docs/current/spring-framework-reference/web.html#mvc-controller)
