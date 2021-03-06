import { ParamError } from './errors';
import { HttpStatus, RequestMethod } from './constants';

export interface ParamConfig {
  name: string;
  index: number;
  type: string;
  required: boolean;
  defaultValue?: any;
}

export interface RouterConfig {
  method?: string;     // e.g. get or post
  pattern?: string;    // e.g. /api/home
  action: string;     // controller's action method name
  actionParams?: Array<ParamConfig>; // control on how to pass args to action method
  responseType?: string;
  responseStatus?: HttpStatus;
}

export interface ControllerConfig {
  controller?: Function;
  baseUrl?: string;
  routes?: Array<RouterConfig>;
  injectModels?: Map<string, string>; // property name -> model name
  responseType?: string;
}

function prefixSlash(str: string): string {
  return str.startsWith('/') ? str : `/${str}`;
}

/**
 * retrieve params value from ctx and validate values
 * @param  {Array<ParamConfig>} actionParams config of how to retrieve values
 * @param  {any} ctx main context of an requrest
 * @returns Array, can be passed directly to action method
 * @throw ParamError when required param
 */
function getParams(actionParams: Array<ParamConfig>, ctx: any): Array<any> {
  const ret: Array<any> = [];
  (actionParams || []).forEach(actionParam => {

    // retrieve param value
    if (actionParam.type === 'PathVariable') {
      ret[actionParam.index] = ctx.params[actionParam.name];
    } else if (actionParam.type === 'RequestParam') {
      ret[actionParam.index] = ctx.query[actionParam.name];
    } else if (actionParam.type === 'RequestBody') {
      ret[actionParam.index] = ctx.request.body || ctx.body;
    }

    // handle default value
    if (actionParam.defaultValue !== undefined) {
      ret[actionParam.index] = ret[actionParam.index] || actionParam.defaultValue;
    }

    // check required param
    if (actionParam.required && ret[actionParam.index] === undefined) {
      throw new ParamError(`param ${actionParam.name} is required`);
    }
  });
  ret.push(ctx);
  return ret;
}

function paramsMiddleWare(actionParams: Array<ParamConfig>, responseType: string, responseStatus: HttpStatus, viewPath?:string): any {
  return async (ctx: any, next: any) => {
    // try get params and validate
    try {
      ctx.actionParams = getParams(actionParams, ctx);
    } catch (error) {
      if (error instanceof ParamError) {
        ctx.body = JSON.stringify({
          code: error.code,
          data: error.message
        });
        return;
      } else {
        throw error;
      }
    }
    const ret = await next();
    ctx.status = responseStatus;
    // 临时打个补丁= =，这里还要看http状态码的约定以及是否要渲染模板的逻辑
    if(ret && typeof ret === 'object'){
      if (responseType === 'json') {
        ctx.set('Content-Type', 'application/json');
        ctx.body = JSON.stringify(ret);
      } else {
        // render with template
        await ctx.render(viewPath, ret);
      }
    }
  };
}

function mountSingleRoute(router: any, baseUrl: string, routerConfig: RouterConfig, controllerInstance: any, baseResponseType: string) {
  const { method, action, pattern, actionParams, responseType, responseStatus } = routerConfig;
  let path = baseUrl === '/' ? pattern : baseUrl + pattern;
  if (path.length > 1) {
    path = path.replace(/\/$/, '');
  }
  const rResponseType = responseType || baseResponseType;
  const viewPath = `${controllerInstance.constructor.name.toLowerCase()}/${action}`;
  // console.log(`route ${method.toUpperCase()} ${path} -> ${controllerInstance.constructor.name}#${action}:${rResponseType}`);
  (<any>router)[method](
    path,
    paramsMiddleWare(actionParams, rResponseType, responseStatus || HttpStatus.OK,  viewPath),
    (ctx: any) => controllerInstance[action].call(controllerInstance, ...ctx.actionParams)
  );
}

class RouterManager {
  // controller -> ControllerConfig
  private config: Map<Function, ControllerConfig>;
  constructor() {
    this.config = new Map();
  }

  public setRouteConfig(controller: Function, routeConfig: RouterConfig): void {
    const preRouteConfig = this.getRouteConfig(controller, routeConfig.action);
    routeConfig.pattern = prefixSlash(routeConfig.pattern || preRouteConfig.pattern || '');
    Object.assign(preRouteConfig, routeConfig);
  }

  public setParamVariable(controller: Function, action: string, config: ParamConfig) {
    const preRouteConfig = this.getRouteConfig(controller, action);
    preRouteConfig.actionParams.push(config);
  }

  // no use for now
  public setInjectModel(controller: Function, name: string, propertyKey: string) {
    const preRouteConfig = this.getControllerConfig(controller);
    preRouteConfig.injectModels = preRouteConfig.injectModels || new Map();
    preRouteConfig.injectModels.set(propertyKey, name);
  }

  public setControllerConfig(controller: Function, config: ControllerConfig): void {
    const controllerConfig = this.getControllerConfig(controller);
    Object.assign(controllerConfig, config);
  }

  /**
   * get config of a controller, if not exist, create one and return
   * @param  {Function} controller
   * @returns ControllerConfig
   */
  private getControllerConfig(controller: Function): ControllerConfig {
    if (!this.config.has(controller)) {
      const controllerConfig: ControllerConfig = {
        controller,
        baseUrl: '',
        routes: [],
        responseType: 'template'
      };
      this.config.set(controller, controllerConfig);
    }
    return this.config.get(controller);
  }

  /**
   * get a route config of a controller config, if not exist, create one and return
   * @param  {Function} controller
   * @returns ControllerConfig
   */
  private getRouteConfig(controller: Function, action: string): RouterConfig {
    const controllerConfig = this.getControllerConfig(controller);
    let ret: RouterConfig = controllerConfig.routes.find(r => r.action === action);
    if (!ret) {
      ret = {
        method: RequestMethod.ALL,
        action,
        actionParams: []
      };
      controllerConfig.routes.push(ret);
    }
    return ret;
  }

  /**
   * mountRoutes
   * @param  {any} router
   * @returns void
   */
  public mountRoutes(router: any, models: any = {}): void {
    this.config.forEach(({ baseUrl, controller, routes, responseType, injectModels }) => {
      // todo: perf, need a better way to get a instance of a controller
      const cInstance = new (<any>controller)();
      if (injectModels && injectModels.size > 0) {
        injectModels.forEach((propName, modelName) => {
          cInstance[propName] = models[modelName];
          // console.log(`controller.name#${propName} -> ${modelName}`, models[modelName], models);
        });
      }
      routes.forEach(routerConfig => mountSingleRoute(router, baseUrl, routerConfig, cInstance, responseType));
    });
  }
}

export default new RouterManager();
