import { GetMapping, ResponseBody } from 'koa-springboot';

@ResponseBody
export default class Home {

  @GetMapping
  index() {
    return 'hi there, thx 4 trying';
  }
}
