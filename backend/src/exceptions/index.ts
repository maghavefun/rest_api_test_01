export class ErrorCode {
  public static readonly Unauthenticated = 'Unauthenticated';
  public static readonly NotFound = 'NotFound';
  public static readonly AsyncError = 'AsyncError';
  public static readonly UnknownError = 'UnknownError';
  public static readonly ValidationError = 'ValidationError';
}

export class ErrorException extends Error {
  public status: number = null;
  public metaData: any = null;
  constructor(code: string = ErrorCode.UnknownError, metaData: any = null) {
    super(code);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = code;
    this.status = 500;
    this.metaData = metaData;
    switch (code) {
      case ErrorCode.Unauthenticated:
        this.status = 401;
        break;
      case ErrorCode.ValidationError:
        this.status = 400;
        break;
      case ErrorCode.AsyncError:
        this.status = 400;
        break;
      case ErrorCode.NotFound:
        this.status = 404;
        break;
      default:
        this.status = 500;
        break;
    }
  }
}

export class ErrorModel {
  public code: string;

  public status: number;

  public metaData?: any;
}
