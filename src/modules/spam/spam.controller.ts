import { NextFunction, Response } from "express";
import SpamService from "./spam.service";
import { AuthRequest } from "../../types/request";

const service = new SpamService();

export async function addSpam(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    //
    const { domain } = req.body;
    //
    const spam = await service.add(domain, req.user!.id);
    //
    return res.status(201).json(spam);
    //
  } catch (err: any) {
    //
    res.status(400).json({
      //
      message: err.message,
    });
  }
}

export async function deleteSpam(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    //
    const id = req.params.id;
    //
    await service.delete(id as string);
    //
    return res.sendStatus(204);
    //
  } catch (err: any) {
    //
    res.status(400).json({
      //
      message: err.message,
    });
  }
}

export async function checkSpam(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    //
    const { domain } = req.query;
    //
    const result = await service.check(domain as string);
    //
    return res.status(200).json(result);
    //
  } catch (err: any) {
    //
    res.status(400).json({
      //
      message: err.message,
    });
  }
}
