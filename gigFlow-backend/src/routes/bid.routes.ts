import { Router, Response } from "express";
import mongoose from "mongoose";
import Bid from "../models/Bid";
import Gig from "../models/Gig";
import { authenticate, AuthRequest } from "../middleware/auth";
import { emitHireNotification } from "../services/socket.service";

const router = Router();

router.post("/", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { gigId, message, proposedPrice } = req.body;

    const gig = await Gig.findById(gigId);
    if (!gig) {
      return res.status(404).json({ message: "Gig not found" });
    }

    if (gig.ownerId.toString() === req.userId) {
      return res.status(400).json({ message: "Cannot bid on your own gig" });
    }

    if (gig.status === "assigned") {
      return res.status(400).json({ message: "This gig is already assigned" });
    }

    const bid = await Bid.create({
      gigId,
      freelancerId: req.userId,
      message,
      proposedPrice,
    });

    await bid.populate("freelancerId", "name email");

    res.status(201).json({ bid });
  } catch (error: any) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "You have already bid on this gig" });
    }
    res.status(500).json({ message: "Server error" });
  }
});

router.get(
  "/gig/:gigId",
  authenticate,
  async (req: AuthRequest, res: Response) => {
    try {
      const gig = await Gig.findById(req.params.gigId);

      if (!gig) {
        return res.status(404).json({ message: "Gig not found" });
      }

      if (gig.ownerId.toString() !== req.userId) {
        return res.status(403).json({ message: "Not authorized to view bids" });
      }

      const bids = await Bid.find({ gigId: req.params.gigId })
        .populate("freelancerId", "name email")
        .sort({ createdAt: -1 });

      res.json({ bids });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

router.get(
  "/my-bids",
  authenticate,
  async (req: AuthRequest, res: Response) => {
    try {
      console.log("my-bids - req.userId:", req.userId);
      const bids = await Bid.find({ freelancerId: req.userId })
        .populate("gigId")
        .sort({ createdAt: -1 });

      console.log("my-bids - Found bids count:", bids.length);
      console.log("my-bids - Bids:", bids);

      res.json({ bids });
    } catch (error) {
      console.error("my-bids error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

router.patch(
  "/:bidId/hire",
  authenticate,
  async (req: AuthRequest, res: Response) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const bid = await Bid.findById(req.params.bidId)
        .populate("gigId")
        .session(session);

      if (!bid) {
        await session.abortTransaction();
        return res.status(404).json({ message: "Bid not found" });
      }

      const gig = await Gig.findById(bid.gigId).session(session);

      if (!gig) {
        await session.abortTransaction();
        return res.status(404).json({ message: "Gig not found" });
      }

      if (gig.ownerId.toString() !== req.userId) {
        await session.abortTransaction();
        return res.status(403).json({ message: "Not authorized" });
      }

      if (gig.status === "assigned") {
        await session.abortTransaction();
        return res
          .status(400)
          .json({ message: "This gig is already assigned" });
      }

      bid.status = "hired";
      await bid.save({ session });

      gig.status = "assigned";
      await gig.save({ session });

      await Bid.updateMany(
        { gigId: gig._id, _id: { $ne: bid._id } },
        { status: "rejected" },
        { session }
      );

      await session.commitTransaction();

      await bid.populate("freelancerId", "name email");

      emitHireNotification(bid.freelancerId._id.toString(), {
        gigTitle: gig.title,
        gigId: gig._id.toString(),
      });

      res.json({ bid, message: "Freelancer hired successfully" });
    } catch (error) {
      await session.abortTransaction();
      res.status(500).json({ message: "Server error" });
    } finally {
      session.endSession();
    }
  }
);

export default router;
