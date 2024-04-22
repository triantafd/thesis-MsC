// custom.d.ts
import "express";

declare module "express" {
  interface Request {
    multerError?: string;
  }
}
