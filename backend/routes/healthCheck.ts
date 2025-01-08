import { Router, Request, Response } from "express";
import { tryCatch } from "../utils/tryCatch";

const router = Router();

/**
 * @openapi
 * /:
 *  get:
 *     tags:
 *     - Status
 *     description: Check respond default string
 *     responses:
 *       200:
 *         description: App working well
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Hi there
 */
router.get(
  "/",
  tryCatch((req: Request, res: Response) => {
    res.send("Hi there");
  })
);

/**
 * @openapi
 * /status:
 *  get:
 *     tags:
 *     - Status
 *     description: Responds if the app is up and running
 *     responses:
 *       200:
 *         description: App is up and running
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 */
router.get(
  "/status",
  tryCatch((req: Request, res: Response) => {
    res.json({ status: "connected!" });
  })
);

export default router;
