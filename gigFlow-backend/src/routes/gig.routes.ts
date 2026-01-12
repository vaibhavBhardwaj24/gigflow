import { Router, Response } from "express";
import Gig from "../models/Gig";
import { authenticate, AuthRequest } from "../middleware/auth";

const router = Router();

router.get("/", async (req: AuthRequest, res: Response) => {
  try {
    const { search } = req.query;
    let query: any = { status: "open" };

    if (search) {
      query.$text = { $search: search as string };
    }

    const gigs = await Gig.find(query)
      .populate("ownerId", "name email")
      .sort({ createdAt: -1 });

    res.json({ gigs });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/:id", async (req: AuthRequest, res: Response) => {
  try {
    const gig = await Gig.findById(req.params.id).populate(
      "ownerId",
      "name email"
    );

    if (!gig) {
      return res.status(404).json({ message: "Gig not found" });
    }

    res.json({ gig });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, budget } = req.body;

    const gig = await Gig.create({
      title,
      description,
      budget,
      ownerId: req.userId,
    });

    await gig.populate("ownerId", "name email");

    res.status(201).json({ gig });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.patch("/:id", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const gig = await Gig.findById(req.params.id);

    if (!gig) {
      return res.status(404).json({ message: "Gig not found" });
    }

    if (gig.ownerId.toString() !== req.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const { title, description, budget } = req.body;

    if (title) gig.title = title;
    if (description) gig.description = description;
    if (budget) gig.budget = budget;

    await gig.save();
    await gig.populate("ownerId", "name email");

    res.json({ gig });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/:id", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const gig = await Gig.findById(req.params.id);

    if (!gig) {
      return res.status(404).json({ message: "Gig not found" });
    }

    if (gig.ownerId.toString() !== req.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await gig.deleteOne();
    res.json({ message: "Gig deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
