export class ParamError extends Error {
  public code: number = 400;
  constructor(msg: string) {
    super(msg);
  }
}