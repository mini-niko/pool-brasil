export class InternalServerError extends Error {
  constructor({ message, action, statusCode, stack }) {
    super();
    this.name = "InternalServerError";
    this.message = message || "Something went wrong in our server";
    this.action =
      action || "Try again or contact the support if the error persist";
    this.statusCode = statusCode || 500;
    this.stack = stack;
  }
}

export class DuplicateError extends Error {
  constructor({ message, action, statusCode, stack }) {
    super();
    this.name = "DuplicateError";
    this.message = message || "Some data is already in use.";
    this.action = action || "Try change your data and try again";
    this.statusCode = statusCode || 409;
    this.stack = stack;
  }
}

export class ValidationError extends Error {
  constructor({ message, action, statusCode, stack }) {
    super();
    this.name = "ValidationError";
    this.message = message || "Something went wrong validating this object.";
    this.action = action || "Try adjust your data and try again";
    this.statusCode = statusCode || 400;
    this.stack = stack;
  }
}

export class UnauthorizedError extends Error {
  constructor({ message, action, statusCode, stack }) {
    super();
    this.name = "UnauthorizedError";
    this.message = message || "You don't have authorization to do this.";
    this.action = action || "Get an authorization.";
    this.statusCode = statusCode || 401;
    this.stack = stack;
  }
}

export class NotFoundError extends Error {
  constructor({ message, action, statusCode, stack }) {
    super();
    this.name = "NotFoundError";
    this.message = message || "The resource you request was not found.";
    this.action =
      action || "Send an valid indentifier or create a new resource.";
    this.statusCode = statusCode || 404;
    this.stack = stack;
  }
}
