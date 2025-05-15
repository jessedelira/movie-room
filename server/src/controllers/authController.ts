import { Request, Response, Router } from "express";
import { registerUser, authenticateUser } from "../services/authService";
import { z } from "zod";
import { HttpStatus } from "../util/httpStatus";

const router = Router();

const RegisterBodySchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
});

const LoginBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

router.post("/register", async (req: Request, res: Response): Promise<void> => {
  const parseResult = RegisterBodySchema.safeParse(req.body);
  if (!parseResult.success) {
    res.status(HttpStatus.BAD_REQUEST).json({
      message: "Invalid request body",
      errors: parseResult.error.flatten(),
    });
    return;
  }
  const { name, email, password } = parseResult.data;
  try {
    const user = await registerUser(name, email, password);
    res.status(HttpStatus.CREATED).json({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  } catch (err: unknown) {
    if (typeof err === "object" && err !== null && "code" in err) {
      res.status(HttpStatus.CONFLICT).json({
        message: "Email already in use",
      });
      return;
    }
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: "Registration failed",
    });
  }
});

router.post("/login", async (req: Request, res: Response): Promise<void> => {
  const parseResult = LoginBodySchema.safeParse(req.body);
  if (!parseResult.success) {
    res.status(HttpStatus.BAD_REQUEST).json({
      message: "Invalid request body",
      errors: parseResult.error.flatten(),
    });
    return;
  }
  const { email, password } = parseResult.data;
  try {
    const result = await authenticateUser(email, password);
    if (!result) {
      res.status(HttpStatus.UNAUTHORIZED).json({
        message: "Invalid credentials",
      });
      return;
    }
    res.status(HttpStatus.OK).json({
      token: result.token,
      user: {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
      },
    });
  } catch {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: "Login failed",
    });
  }
});

export default router;
