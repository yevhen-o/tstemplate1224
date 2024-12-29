class AppError extends Error {
  details: any;
  statusCode: number; // TODO: define all possible status codes, and use that enum
  constructor(details: any, message: string, statusCode: number) {
    super(message);
    this.details = details;
    this.statusCode = statusCode;
  }
}

export default AppError;
