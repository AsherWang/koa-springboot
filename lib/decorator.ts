import routeManager, { RouterConfig } from './routerManager';
import Application from './application';
import { RequestMethod, HttpStatus } from './constants';


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
/**
 * setModelScanPath, scanner will search all files in this dir.
 * only support one dir for now
 * @param  {Array<string>} ...paths, \`${dirname}/model\` or (dirname,'model')
 * @returns any
 */
export function ModelScan(...paths: Array<string>): any {
  return function (target: any, propertyKey: string) {
    Application.initParams.modelPath = paths;
    return target;
  };
}

// not as good as i expected
export function KoaApplication<T extends { new(...args: any[]): {} }>(constructor: T): any {
  // return function (target: any, propertyKey: string) {
  //   Application.initParams.controllerPath = paths;
  //   return target;
  // };
  return Application;
}

// useless for now
export function Controller<T extends { new(...args: any[]): {} }>(constructor: T): any {
  // return class extends constructor {
  //   routers: Array<RouterConfig> = tRouters;
  //   baseUrl: string = tBaseUrl;
  // };
  return constructor;
}

function doRequestMapping(target: any, action: string, value: string, method: string) {
  let controller = target;
  // if action is undefined, then RequestMapping is used to decorate a class
  if (action) {
    controller = target.constructor;
    if (value) {
      const config: RouterConfig = {
        pattern: value,
        action,
      };
      if (method) {
        config.method = method;
      }
      routeManager.setRouteConfig(controller, config);
    }
  } else {
    routeManager.setControllerConfig(controller, { baseUrl: value });
  }
  return controller;
}

/**
 * @param  {string} value url pattern
 * @param  {string} method indacates 'method' when decorating an action,
 * and indacates 'baseUrl' when decorating a class
 */
export function RequestMapping(value: any, method?: string, rMethod?: string): any {
  if (typeof value !== 'function' && typeof value !== 'object') {
    return function (target: any, action: string) {
      return doRequestMapping(target, action, value, method);
    };
  }
  // then call @RequestMapping without params or parentheses
  // thus value -> target, method -> action
  const target = value;
  const action = method;
  return doRequestMapping(target, action, '/', rMethod);
}

// for XXXMapping except RequestMapping
function mappingWrapper(value: any = '/', method?: string, rMethod?: string) {
  if (typeof value !== 'object') {
    return RequestMapping(value, rMethod);
  } else {
    return RequestMapping(value, method, rMethod);
  }
}

/**
 * decorates a method.
 * \@GetMapping is the same as \@GetMapping('/')
 * @param  value path pattern
 * @method just ignore this param
 * @returns any
 */
export function GetMapping(value: any = '/', method?: string): any {
  return mappingWrapper(value, method, RequestMethod.GET);
}

/**
 * see GetMapping
 */
export function PostMapping(value: any = '/', method?: string): any {
  return mappingWrapper(value, method, RequestMethod.POST);
}

/**
 * see GetMapping
 */
export function PutMapping(value: any = '/', method?: string): any {
  return mappingWrapper(value, method, RequestMethod.PUT);
}
/**
 * see GetMapping
 */
export function DeleteMapping(value: any = '/', method?: string): any {
  return mappingWrapper(value, method, RequestMethod.DELETE);
}
/**
 * see GetMapping
 */
export function PatchMapping(value: any = '/', method?: string): any {
  return mappingWrapper(value, method, RequestMethod.PATCH);
}

function paramDecorator(type: string, value: string = '', required: boolean = false, defaultValue?: any): any {
  return function (target: any, propertyKey: string | symbol, parameterIndex: number): any {
    routeManager.setParamVariable(target.constructor, propertyKey.toString(), {
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
 * decorate a parameter of a method.
 * @param  {string} name param name
 * @param  {boolean=false} required
 * @param  {any} defaultValue? provide a default value if not required
 */
export function RequestParam(name: string, required: boolean = false, defaultValue?: any): any {
  return paramDecorator('RequestParam', name, required, defaultValue);
}
/**
 * decorate a parameter of a method.
 * Maybe no use, just assign ctx.body to it
 */
export function RequestBody(target: any, propertyKey: string | symbol, parameterIndex: number): any {
  routeManager.setParamVariable(target.constructor, propertyKey.toString(), {
    name: '',
    index: parameterIndex,
    type: 'RequestBody',
    required: false,
  });
}

/**
 * indicates that the result should be a json.
 * it can be used to decorate class or method.
 * e.g. @ResponseBody
 */
export function ResponseBody(target: any, action?: string) {
  let controller = target;
  if (action) {
    // method level
    controller = target.constructor;
    const config: RouterConfig = {
      action,
      responseType: 'json'
    };
    routeManager.setRouteConfig(controller, config);
  } else {
    // class level
    routeManager.setControllerConfig(controller, { responseType: 'json' });
    return controller;
  }
}

/**
 * indicates the result HttpStatus
 * it can be used to method.
 * e.g. @ResponseStatus(HttpStatus.CREATED)
 */
export function ResponseStatus(responseStatus: HttpStatus) {
  return function(target: any, action: string) {
    const config: RouterConfig = {
      action,
      responseStatus,
    };
    routeManager.setRouteConfig(target.constructor, config);
  };
}

export function Model(name: string): any {
  return function(target: any, propertyKey: string) {
    routeManager.setInjectModel(target.constructor, propertyKey, name);
  };
}