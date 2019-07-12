import { GetMapping } from '../../index';

export default class Home {
  @GetMapping
  index() {
    return 'hi there, thx 4 trying';
  }
}
