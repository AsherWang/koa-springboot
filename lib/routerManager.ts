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
  resultType?: string;
}

export interface ControllerConfig {
  controller: Function;
  baseUrl?: string;
  routes: Array<RouterConfig>;
}

function prefixSlash(str: string): string {
  return str.startsWith('/') ? str : `/${str}`;
}

// todo: required params may be checked here
function getParams(actionParams: Array<any>, ctx: any): Array<any> {
  const ret: Array<any> = [];
  (actionParams || []).forEach(actionParam => {
    if (actionParam.type === 'PathVariable') {
      ret[actionParam.index] = ctx.params[actionParam.name];
    } else if (actionParam.type === 'RequestParam') {
      ret[actionParam.index] = ctx.query[actionParam.name];
    } else if (actionParam.type === 'RequestBody') {
      ret[actionParam.index] = ctx.request.body;
    }
  });
  ret.push(ctx);
  return ret;
}

function paramsMiddleWare(actionParams: Array<any>): any {
  return async (ctx: any, next: any) => {
    ctx.actionParams = getParams(actionParams, ctx);
    const ret = await next();
    ctx.body = JSON.stringify({
      code: 200,
      data: ret
    });
  };
}

function mountSingleRoute(router: any, baseUrl: string, routerConfig: RouterConfig, controllerInstance: any) {
  const { method, action, pattern, actionParams } = routerConfig;
  (<any>router)[method](
    `${baseUrl}${pattern}`,
    paramsMiddleWare(actionParams),
    (ctx: any) => controllerInstance[action].call(controllerInstance, ...ctx.actionParams)
  );
}

class RouterManager {
  private config: Map<Function, ControllerConfig>;
  constructor() {
    this.config = new Map();
  }

  // todo: perf
  public registerRouteConfig(controller: Function, routeConfig: RouterConfig): void {
    routeConfig.pattern = prefixSlash(routeConfig.pattern);
    let controllerConfig = this.config.get(controller);
    if (controllerConfig) {
      const existedIdx = controllerConfig.routes.findIndex(r => r.action === routeConfig.action);
      if (existedIdx !== -1) {
        controllerConfig.routes[existedIdx] = {
          ...controllerConfig.routes[existedIdx],
          ...routeConfig
        };
      } else {
        controllerConfig.routes.push(routeConfig);
      }
    } else {
      controllerConfig = {
        controller,
        routes: [routeConfig]
      };
      this.config.set(controller, controllerConfig);
    }
  }

  // todo: perf
  public registerParamVariable(controller: Function, action: string, config: ParamConfig) {
    let controllerConfig = this.config.get(controller);
    if (controllerConfig) {
      controllerConfig.routes = controllerConfig.routes || [];
      const routeConfig = controllerConfig.routes.find(r => r.action === action);
      if (routeConfig) {
        routeConfig.actionParams = routeConfig.actionParams || [];
        routeConfig.actionParams.push(config);
      } else {
        controllerConfig.routes.push({
          action: action,
          actionParams: [config]
        });
      }
    } else {
      controllerConfig = {
        controller,
        routes: [{
          action: action,
          actionParams: [config]
        }]
      };
      this.config.set(controller, controllerConfig);
    }
  }

  public registerBaseUrl(controller: Function, baseUrl: string): void {
    const sBaseUrl = prefixSlash(baseUrl);
    let controllerConfig = this.config.get(controller);
    if (controllerConfig) {
      controllerConfig.baseUrl = sBaseUrl;
    } else {
      controllerConfig = {
        controller,
        baseUrl: sBaseUrl,
        routes: []
      };
      this.config.set(controller, controllerConfig);
    }
  }

  public mountRoutes(router: any): void {
    this.config.forEach(({ baseUrl, controller, routes }) => {
      // todo: perf, need a better way to get a instance of a controller
      const cInstance = new (<any>controller)();
      routes.forEach(routerConfig => mountSingleRoute(router, baseUrl, routerConfig, cInstance));
    });
  }
}

export default new RouterManager();
