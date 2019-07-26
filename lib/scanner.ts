import * as fs from 'fs';
import * as path from 'path';
import * as Router from 'koa-router';
import routeManager from './routerManager';

export default class Scanner {
  /**
   * scanner will search all files in this dir to find controllers
   */
  public static controllerPath: Array<string>;
  public static modelPath: Array<string>;

  public router: Router = new Router();
  // tslint:disable-next-line: no-null-keyword
  public models = Object.create(null);
  public debug: boolean = false;

  enableLog() {
    this.debug = true;
  }

  scan(): void {
    this.scanModel();
    this.scanController();
  }

  private scanController(): void {
    const controllerPath = path.join(...Scanner.controllerPath);
    if (fs.existsSync(controllerPath) && fs.statSync(controllerPath).isDirectory()) {
      fs.readdirSync(controllerPath)
        .filter(subPath => subPath.endsWith('.js')) // ignore subDir for now
        .forEach(subPath => {
          const absolutePath = path.join(controllerPath, subPath);
          if (this.debug) {
            console.log(`controller file load: ${absolutePath}`);
          }
          require(absolutePath);
        });
      routeManager.mountRoutes(this.router, this.models);
    }
  }

  private scanModel(): Array<any> {
    if (!Scanner.modelPath)return;
    const modelPath = path.join(...Scanner.modelPath);
    if (fs.existsSync(modelPath) && fs.statSync(modelPath).isDirectory()) {
      fs.readdirSync(modelPath)
        .filter(subPath => subPath.endsWith('.js')) // ignore subDir for now
        .forEach(subPath => {
          const absolutePath = path.join(modelPath, subPath);
          if (this.debug) {
            console.log(`model file load: ${absolutePath}`);
          }
          const model = require(absolutePath).default;
          this.models[model.name] = model;
        });
    }
  }

}