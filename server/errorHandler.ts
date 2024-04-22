
import { Request, Response } from 'express';
import { CustomError } from './customError';

// an error handling middleware that will run anytime one of the route
// handlers calls `next`, in other words, when an error gets thrown in one of
// the promise chains
const errorHandler = function (err: CustomError, _req: Request, res: Response) {
  // LOG ERRORS

  // don't log errors in a test environment
  if (!process.env.TESTENV) {
    // log a rudimentary timestamp
    console.log('\n', new Date().toTimeString() + ':')
    // log the original error the terminal running Express
    console.error(err)
  }

  // if set a status code above, send that status code
  // otherwise, send 500. Also, send the error message as JSON.
  res.status(err.status || 500).json(err)
}

export default errorHandler