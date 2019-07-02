import {
  GetMapping, PostMapping, RequestMapping, RequestMethod,
  PathVariable, RequestParam, RequestBody
} from '../../index';

@RequestMapping('/home')
export default class Home {

  @GetMapping('/api/v1/:id')
  index(@PathVariable('id') id: string, @RequestParam('name', true) name: string) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(`time end! ${id}, ${name}`);
      }, 1000);
    });
  }

  @RequestMapping('/api/v2', RequestMethod.GET)
  index2() {
    return 'api2';
  }

  @PostMapping('/api/v3')
  index3(@RequestBody body: any) {
    return body;
  }
}
