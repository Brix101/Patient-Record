import { NextFunction, Request, Response } from 'express';

class IndexController {
  public index = (req: Request, res: Response, next: NextFunction) => {
    try {
      res.status(200).json({ msg: 'Connected' });
    } catch (error) {
      next(error);
    }
  };
}

export default IndexController;
