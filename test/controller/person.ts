import {
  GetMapping, PostMapping, RequestMapping, PatchMapping,
  PathVariable, RequestBody, ResponseBody, PutMapping, DeleteMapping,
  ResponseStatus, HttpStatus
} from '../../dist';

// rest api


const dataSource = [
  {id: 1, name: 'asher'},
  {id: 2, name: 'soul'},
  {id: 3, name: 'writer'},
  {id: 4, name: 'john'},
  {id: 5, name: 'asherly'},
  {id: 6, name: 'susan'},
  {id: 7, name: 'leo'},
];

@RequestMapping('/persons')
@ResponseBody
export default class Person {

  @GetMapping
  index() {
    return dataSource;
  }

  @GetMapping('/:id')
  show(@PathVariable('id') id: string) {
    return dataSource.find(item => item.id.toString() === id);
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  create(@RequestBody body: any) {
    const id = Math.max(...dataSource.map(item => item.id)) + 1;
    const newRecord = {
      id,
      name: body.name
    };
    dataSource.push(newRecord);
    return newRecord;
  }

  @PutMapping('/:id')
  update(@PathVariable('id') id: string, @RequestBody body: any) {
    const itemIdx = dataSource.findIndex(item => item.id.toString() === id);
    if (itemIdx !== -1) {
      dataSource[itemIdx] = body;
    }
  }

  @PatchMapping('/:id')
  patch(@PathVariable('id') id: string, @RequestBody body: any) {
    const item = dataSource.find(item => item.id.toString() === id);
    Object.assign(item, body);
  }

  @DeleteMapping('/:id')
  destory(@PathVariable('id') id: string) {
    const idx = dataSource.findIndex(item => item.id.toString() === id);
    if (idx !== -1) {
      dataSource.splice(idx, 1);
    }
  }

}
