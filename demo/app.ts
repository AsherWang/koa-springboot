import * as bodyParser from 'koa-bodyparser';
import * as views from 'koa-views';
import { ControllerScan, Application } from '../index';


@ControllerScan(__dirname, 'controller')
export default class App extends Application {
  // override init method to do you own logic
  // or not
  protected init() {
    // use pug as template
    this.app.use(views(__dirname + '/view', { extension: 'pug' }));

    // init router
    this.app
    .use(bodyParser())
    .use(this.router.routes())
    .use(this.router.allowedMethods());
  }

}
