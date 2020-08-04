export interface IResponse {
  code: number;
  message?: string;
  data?: object;
}

export class Response implements IResponse {
  constructor(
    public code: number,
    public message?: string,
    public data?: object,
  ) {}

  static ok(): Response;
  static ok(message: string): Response;
  static ok(message: string, data: object): Response;
  static ok(data: object): Response;
  static ok(arg1?: any, arg2?: any): Response {
    if (typeof arg1 === 'object') {
      return new Response(200, 'ok', arg1);
    }

    if (typeof arg1 === 'string') {
      if (typeof arg2 === 'undefined') {
        return new Response(200, arg1);
      }
      return new Response(200, arg1, arg2);
    }

    return new Response(200, 'ok');
  }
}

export class ErrorResponse extends Error implements IResponse {
  public code: number;

  constructor(code: number, message: string) {
    super(message);
    this.code = code;
    this.name = 'ErrorResponse';
  }

  toJSON(): IResponse {
    return {
      code: this.code,
      message: this.message,
    };
  }

  static badRequest(message: string): ErrorResponse {
    return new ErrorResponse(400, message);
  }

  static internalServerError(message: string): ErrorResponse {
    return new ErrorResponse(500, message);
  }

  static notFound(message: string): ErrorResponse {
    return new ErrorResponse(404, message);
  }
}
