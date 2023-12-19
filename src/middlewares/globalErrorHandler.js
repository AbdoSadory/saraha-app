const globalErrorHandler = (err, req, res, next) => {
  if (err) {
    return res
      .status(err['cause'])
      .json({ message: 'Error', error: err.message, stack: err.stack })
  }
}

export default globalErrorHandler
