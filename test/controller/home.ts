import { GetMapping } from '../../dist';

export default class Home {
  @GetMapping
  index() {
    return {
      pageTitle: 'hi there, thx 4 trying'
    };
  }
  @GetMapping('/index2')
  index2() {
    return {
      pageTitle: 'now here is template page 2'
    };
  }
}
