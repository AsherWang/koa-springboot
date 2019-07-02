# koa-springboot
springboot风格的koa项目`developing`

# feature
- 使用 `decorator` 构建路由
- 自动引入controller

# demo
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
    console.log('so init myself');
    this.app
    .use(bodyParser())
    .use(this.router.routes())
    .use(this.router.allowedMethods());
  }
}

new App().start();
```
[source files](https://github.com/AsherWang/koa-springboot/tree/master/demo)
---

# koa-springboot
springboot-like koa

# feature
- use decorator to build router
- auto import controller


