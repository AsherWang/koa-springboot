import * as Koa from 'koa';
import * as Router from 'koa-router';
import Scanner from './scanner';

export interface ApplicationInitParams {
  controllerPath?: Array<string>;
  modelPath?: Array<string>;
}

class Application {
  public static initParams: ApplicationInitParams = {};
  private koaApp: Koa;
  private scanner: Scanner;
  private controllerPath: Array<string>;
  private modelPath: Array<string>;

  constructor() {
    const { initParams } = Application;
    if (initParams && initParams.controllerPath) {
      this.controllerPath = initParams.controllerPath;
    } else {
      console.warn('controllerPath is not configured');
    }
    if (initParams && initParams.modelPath) {
      this.modelPath = initParams.modelPath;
    }
    this.koaApp = new Koa();
    this.initScanner();

    if (Scanner.modelPath) {
      this.app.use(async (ctx, next) => {
        ctx.models = this.models;
        await next();
      });
    }
    this.init();
  }

  private initScanner(): void {
    Scanner.controllerPath = this.controllerPath;
    Scanner.modelPath = this.modelPath;
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
  protected get models(): any {
    return this.scanner.models;
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

  /**
   * start running App
   * @param  {number} port optional, default is 3000
   * @returns Koa app instance
   */
  public start(port: number = 3000, mute: boolean = false): any {
    return this.app.listen(port, () => {
      if (!mute) console.log(`Server is running at http://localhost:${port}`);
    });
  }
}

export default Application;
