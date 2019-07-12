import * as Koa from 'koa';
import * as Router from 'koa-router';
import Scanner from './scanner';

export interface ApplicationInitParams {
  controllerPath?: Array<string>;
}

class Application {
  public static initParams: ApplicationInitParams = {};
  private koaApp: Koa;
  private scanner: Scanner;
  private controllerPath: Array<string>;

  constructor() {
    const { initParams } = Application;
    if (initParams && initParams.controllerPath) {
      this.controllerPath = initParams.controllerPath;
    } else {
      console.warn('controllerPath is not configured');
    }
    this.koaApp = new Koa();
    this.initScanner();
    this.init();
  }

  private initScanner(): void {
    Scanner.controllerPath = this.controllerPath;
    this.scanner = new Scanner();
    // this.scanner.enableLog();
    this.scanner.scan();
  }

  protected get app(): Koa {
    return this.koaApp;
  }
  protected get router(): Router {
    return this.scanner.router;
  }

  /**
   * init app and router
   * u can override init with yours.
   * btw the default init:
   * this.app.use(this.router.routes()).use(this.router.allowedMethods());
   * @returns void
   */
  protected init(): void {
    this.app
      .use(this.router.routes())
      .use(this.router.allowedMethods());
  }
  // /**
  //  * define how to render html page
  //  */
  // protected render(view:string, ): void {

  // }

  /**
   * start running App
   * @param  {number} port optional, default is 3000
   * @returns Koa app instance
   */
  public start(port: number = 3000, mute: boolean = false): any {
    return this.koaApp.listen(port, () => {
      if (!mute)console.log(`Server is running at http://localhost:${port}`);
    });
  }
}

export default Application;
