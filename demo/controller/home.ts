import { GetMapping } from '../../index';

export default class Home {
  @GetMapping
  index() {
    return {
      pageTitle: 'hi there, thx 4 trying'
    };
  }
}
