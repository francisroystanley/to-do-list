import { PrismaClient } from "@prisma/client";
import cors from "cors";
import express, { Request, Response } from "express";

const app = express();
const prisma = new PrismaClient();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.get("/todos", async (req: Request, res: Response) => {
  try {
    const todos = await prisma.todo.findMany({ orderBy: { id: "asc" } });

    res.json({ todos });
  } catch (error: any) {
    res.status(500).json({ message: error.meta.cause });
  }
});

app.post("/add-todo", async (req: Request, res: Response) => {
  try {
    const newTodo = await prisma.todo.create({
      data: {
        name: req.body.name
      }
    });

    res.json({ todo: newTodo });
  } catch (error: any) {
    res.status(500).json({ message: error.meta.cause });
  }
});

app.post("/toggle-all", async (req: Request, res: Response) => {
  try {
    const todos = await prisma.todo.updateMany({
      data: {
        is_completed: req.body.is_completed
      }
    });

    res.json({ todos });
  } catch (error: any) {
    res.status(500).json({ message: error.meta.cause });
  }
});

app.post("/clear-completed", async (req: Request, res: Response) => {
  try {
    const completedTodos = await prisma.todo.deleteMany({
      where: {
        is_completed: true
      }
    });

    res.json({ todos: completedTodos });
  } catch (error: any) {
    res.status(500).json({ message: error.meta.cause });
  }
});

app.patch(`/update-todo/:id`, async (req: Request, res: Response) => {
  try {
    const updatedTodo = await prisma.todo.update({
      where: { id: +req.params.id },
      data: {
        name: req.body.name,
        is_completed: req.body.is_completed
      }
    });

    res.json({ todo: updatedTodo });
  } catch (error: any) {
    res.status(500).json({ message: error.meta.cause });
  }
});

app.delete(`/delete-todo/:id`, async (req: Request, res: Response) => {
  try {
    const deletedTodo = await prisma.todo.delete({
      where: { id: +req.params.id }
    });

    res.json({ todo: deletedTodo });
  } catch (error: any) {
    res.status(500).json({ message: error.meta.cause });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
