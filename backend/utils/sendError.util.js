const sendError = (message, status = 500) => {
  const err = new Error(message);
  err.status = status;
  return err;
};

export default sendError;
