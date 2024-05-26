const appHandler = (message, statusCode) => {
  let err = new Error(message);
  err.statusCode = statusCode ? statusCode : 500;
  return err
};

module.exports = appHandler;