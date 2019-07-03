## koa-springboot
springboot-like koa

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
@RequestMapping('/home')
export default class Home {

  @GetMapping('/api/v1/:id')
  index(@PathVariable('id') id: string, @RequestParam('name', true) name: string) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(`time end! ${id}, ${name}`);
      }, 1000);
    });
  }

  @RequestMapping('/api/v2', RequestMethod.GET)
  index2() {
    return 'api2';
  }

  @PostMapping('/api/v3')
  index3(@RequestBody body: any) {
    return body;
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
