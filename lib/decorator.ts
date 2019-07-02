import routeManager from './routerManager';
import Application from './application';

export enum RequestMethod {
  GET = 'get',
  HEAD = 'head',
  POST = 'post',
  PUT = 'put',
  PATCH = 'patch',
  DELETE = 'delete',
  OPTIONS = 'options',
  TRACE = 'trace'
}

/**
 * setControllerScanPath, scanner will search all files in this dir.
 * only support one dir for now
 * @param  {Array<string>} ...paths, \`${dirname}/controller\` or (dirname,'controller')
 * @returns any
 */
export function ControllerScan(...paths: Array<string>): any {
  return function (target: any, propertyKey: string) {
    Application.initParams.controllerPath = paths;
    return target;
  };
}

export function KoaApplication<T extends {new(...args: any[]): {}}>(constructor: T): any {
  // return function (target: any, propertyKey: string) {
  //   Application.initParams.controllerPath = paths;
  //   return target;
  // };
  return Application;
}

// useless for now
export function Controller<T extends {new(...args: any[]): {}}>(constructor: T): any {
  // return class extends constructor {
  //   routers: Array<RouterConfig> = tRouters;
  //   baseUrl: string = tBaseUrl;
  // };
  return constructor;
}

/**
 * @param  {string} value url pattern
 * @param  {string} method indacates 'method' when decorating an action,
 * and indacates 'baseUrl' when decorating a class
 */
export function RequestMapping(value: string, method: string= RequestMethod.GET): any {
  return function (target: any, propertyKey: string) {
    let controller = target;
    // if propertyKey is undefined, then RequestMapping is used to decorate a class
    if (propertyKey) {
      controller = target.constructor;
      if (value) {
        const config = {
          controller,
          method,
          pattern: value,
          action: propertyKey
        };
        routeManager.registerRouteConfig(controller, config);
      } else {
        console.warn('prop pattern is required when decorating a method with RequestMapping');
      }
    } else {
      routeManager.registerBaseUrl(controller, value);
    }
    return controller;
  };
}

export function GetMapping(value: string): any {
  return RequestMapping(value, RequestMethod.GET);
}

export function PostMapping(value: string): any {
  return RequestMapping(value, RequestMethod.POST);
}

function paramDecorator(type: string, value: string = '', required: boolean = false, defaultValue?: any): any {
  return function(target: any, propertyKey: string | symbol, parameterIndex: number): any {
    routeManager.registerParamVariable(target.constructor, propertyKey.toString(), {
      name: value,
      index: parameterIndex,
      type,
      required,
      defaultValue
    });
  };
}

export function PathVariable(name: string, required: boolean = false, defaultValue?: any): any {
  return paramDecorator('PathVariable', name, required, defaultValue);
}

/**
 * @param  {string} name param name
 * @param  {boolean=false} required
 * @param  {any} defaultValue? provide a default value if not required
 */
export function RequestParam(name: string, required: boolean = false, defaultValue?: any): any {
  return paramDecorator('RequestParam', name, required, defaultValue);
}
/**
 * Maybe no use, just assign ctx.body to it
 */
export function RequestBody(target: any, propertyKey: string | symbol, parameterIndex: number): any {
  routeManager.registerParamVariable(target.constructor, propertyKey.toString(), {
    name: '',
    index: parameterIndex,
    type: 'RequestBody',
    required: false,
  });
}
// ... other methods
