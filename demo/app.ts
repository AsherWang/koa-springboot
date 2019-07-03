import * as bodyParser from 'koa-bodyparser';
import { ControllerScan, Application } from '../index';


@ControllerScan(__dirname, 'controller')
export default class App extends Application {
  // override init method to do you own logic
  // or not
  protected init() {
    this.app
    .use(bodyParser())
    .use(this.router.routes())
    .use(this.router.allowedMethods());
  }
}
