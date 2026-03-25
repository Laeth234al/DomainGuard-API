import { Request, Response } from "express";
import AuthService from "./user.service";
import { AuthRequest } from "../../types/request";
import { logger } from "../../lib/winston";

const service = new AuthService();

export async function register(req: Request, res: Response) {
  try {
    //
    const { email, password } = req.body;
    //
    const result = await service.register(email, password);
    //
    res.status(201).json({ ...result });
    //
  } catch (err: any) {
    //
    logger.error(err.message, { stack: err.stack });
    //
    res.status(400).json({
      message: err.message,
    });
  }
}

export async function login(req: Request, res: Response) {
  try {
    //
    const { email, password } = req.body;
    //
    const result = await service.login(email, password);
    //
    res.status(200).json({ ...result });
    //
  } catch (err: any) {
    //
    logger.error(err.message, { stack: err.stack });
    //
    res.status(401).json({
      message: err.message,
    });
  }
}

export async function me(req: AuthRequest, res: Response) {
  try {
    //
    const id = req.user?.id;
    //
    const result = await service.me(id!);
    //
    res.status(200).json({ ...result });
    //
  } catch (err: any) {
    //
    logger.error(err.message, { stack: err.stack });
    //
    res.status(401).json({
      message: err.message,
    });
  }
}
