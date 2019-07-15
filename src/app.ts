import * as bodyParser from 'koa-bodyparser';
import { ControllerScan, Application } from 'koa-springboot';
// import * as views from 'koa-views';

@ControllerScan(__dirname, 'controller')
class App extends Application {
  // override init method to do you own logic
  // or not
  protected init() {
    // if you want to use pug to render html in koa
    // use pug as template
    // this.app.use(views(__dirname + '/view', { extension: 'pug' }));
    // homecontroller#index => view/home/index.pug


    this.app
    .use(bodyParser())
    .use(this.router.routes())
    .use(this.router.allowedMethods());
  }
}

export default App;
