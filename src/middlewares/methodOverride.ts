import { NextFunction, Request, Response } from "express";


export default function methodOverride(req: Request, res: Response, next: NextFunction) {
  if (req.body && typeof req.body === "object" && "_method" in req.body) {
    req.method = req.body._method.toUpperCase(); // override the HTTP method
    delete req.body._method; // optional: remove it from body
  }
  next();
}
