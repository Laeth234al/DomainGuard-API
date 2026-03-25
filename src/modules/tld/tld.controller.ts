import { NextFunction, Response } from "express";
import TLDService from "./tld.service";
import { AuthRequest } from "../../types/request";

const service = new TLDService();

export async function addTLD(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    //
    const { tld } = req.body;
    //
    const result = await service.add(tld, req.user!.id);
    //
    return res.status(201).json(result);
    //
  } catch (err: any) {
    //
    res.status(400).json({
      //
      message: err.message,
    });
  }
}

export async function deleteTLD(
  req: AuthRequest,
  res: Response,
  next: NextFunction
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

export async function checkTLD(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    //
    const { domain } = req.body;
    //
    const result = await service.check(domain);
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
