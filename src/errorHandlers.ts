import mongoose from "mongoose"
import { ErrorRequestHandler } from "express"

export const badRequestHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err.status === 400 || err instanceof mongoose.Error.ValidationError) {
    res.status(400).send({ message: err.message })
  } else {
    next(err)
  }
}

export const genericErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.log(err)
  res.status(500).send({ message: "We gonna fix it asap!" })
}
