import { Router } from "express";
import { getAllUsers, getUserById } from "../services/userService";

const router = Router();

router.get("/", async (req, res): Promise<void> => {
  const users = await getAllUsers();
  res.json(users);
});

router.get("/:id", async (req, res): Promise<void> => {
  const user = await getUserById(req.params.id);
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

export default router;
