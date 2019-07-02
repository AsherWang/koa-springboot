import * as fs from 'fs';
import * as path from 'path';
import * as Router from 'koa-router';
import routeManager from './routerManager';

export default class Scanner {
  /**
   * scanner will search all files in this dir to find controllers
   */
  public static controllerPath: Array<string>;

  public router: Router = new Router();
  public debug: boolean = false;

  enableLog() {
    this.debug = true;
  }

  scan(): void {
    this.scanController();
  }

  private scanController(): void {
    const controllerPath = path.join(...Scanner.controllerPath);
    if (fs.existsSync(controllerPath) && fs.statSync(controllerPath).isDirectory()) {
      fs.readdirSync(controllerPath)
        .filter(subPath => subPath.endsWith('.js')) // ignore subDir
        .forEach(subPath => {
          const absolutePath = path.join(controllerPath, subPath);
          if (this.debug) {
            console.log(`file load: ${absolutePath}`);
          }
          require(absolutePath);
      });
      routeManager.mountRoutes(this.router);
    }
  }
}