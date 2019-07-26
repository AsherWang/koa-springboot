import {
  GetMapping, PostMapping, RequestMapping, PatchMapping,
  PathVariable, RequestBody, ResponseBody, PutMapping, DeleteMapping,
  ResponseStatus, HttpStatus
} from '../../dist';
import PersonModel from '../model/person';

@RequestMapping('/persons')
@ResponseBody
export default class Person {

  @GetMapping
  index() {
    return PersonModel.findAll();
  }

  @GetMapping('/:id')
  show(@PathVariable('id') id: string) {
    return PersonModel.findByPk(id);
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  create(@RequestBody body: any) {
    return PersonModel.create(body);
  }

  @PutMapping('/:id')
  update(@PathVariable('id') id: string, @RequestBody body: any) {
    return PersonModel.findByPk(id)
      .then(item => item.update(body));
  }

  @DeleteMapping('/:id')
  @ResponseStatus(HttpStatus.OK)
  destory(@PathVariable('id') id: string) {
    return PersonModel.findByPk(id)
      .then(item => item.destroy());
  }

}
