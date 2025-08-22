import express from 'express'

const asyncHandler = <T>(
  fn: (req: express.Request<T>, res: express.Response, next: express.NextFunction) => Promise<any>
) => {
  return (req: express.Request<T>, res: express.Response, next: express.NextFunction) => {
    return Promise.resolve(fn(req, res, next)).catch(next)
  }
}

export default asyncHandler
