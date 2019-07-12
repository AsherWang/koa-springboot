import { HttpStatus } from './constants';

export class ParamError extends Error {
  public code: number = HttpStatus.BAD_REQUEST;
  constructor(msg: string) {
    super(msg);
  }
}