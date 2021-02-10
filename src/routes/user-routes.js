const express = require("express");
const multer = require("multer");
const path = require("path");

const UserController = require("../controllers/UserController");
const EventController = require("../controllers/EventController");
const PTController = require("../controllers/PTController");
const DashboardController = require("../controllers/DashboardController");
const RegistrationController = require("../controllers/RegistrationController");
const PTRegistrationController = require("../controllers/PTRegistrationController");
const LoginController = require("../controllers/LoginController");
const ApprovalController = require("../controllers/ApprovalController");
const RejectionController = require("../controllers/RejectionController");
const verifyToken = require("../../config/verifyToken");
const uploadToS3 = require("../../config/s3Uploads");

const router = express.Router();

router.get("/endpoints", (req, res) => {
  res.sendFile(
    path.resolve(__dirname, "..", "..", "config", "fitness-app.json")
  );
});

// TODO: SUBSCRIBE CONTROLLER
// TODO: MEMBERSHIP CONTROLLER

//Login
router.post("/login", LoginController.store);

//Event Registration
router.post(
  "/registration/:eventId",
  verifyToken,
  RegistrationController.create
);
router.get(
  "/registration/:registration_id",
  RegistrationController.getRegistration
);
router.get(
  "/registration",
  verifyToken,
  RegistrationController.getMyRegistrations
);
router.post(
  "/registration/:registration_id/approval",
  verifyToken,
  ApprovalController.approval
);
router.post(
  "/registration/:registration_id/rejection",
  verifyToken,
  RejectionController.rejection
);

router.delete(
  "/registration/:registration_id",
  verifyToken,
  RegistrationController.deleteRegistration
);

//PT Session Registration
router.post("/ptregistration/:sessionId", PTRegistrationController.create);
router.get(
  "/ptregistration/:registration_id",
  PTRegistrationController.getRegistration
);

//Dashboard
router.get("/events", verifyToken, DashboardController.getAllEvents);
router.get("/events/:sport", verifyToken, DashboardController.getAllEvents);
router.get("/user/events", verifyToken, DashboardController.getEventsByUserId);

//Event
router.post(
  "/events",
  verifyToken,
  uploadToS3.single("thumbnail"),
  EventController.createEvent
);
router.delete("/events/:eventId", verifyToken, EventController.deleteEvent);
router.get("/events/:eventId", verifyToken, EventController.getEventById);

//Personal Training
router.get("/sessions", verifyToken, PTController.getAllSessions);
router.get("/sessions/:sessionId", verifyToken, PTController.getSessionById);
router.post(
  "/sessions",
  verifyToken,
  uploadToS3.fields([{ name: "video" }, { name: "thumbnail" }]),
  PTController.createPTSession
);

router.post("/user/register", UserController.createUser);
router.get("/user/:userId", UserController.getUserById);
router.get("/users", UserController.getAllUsers);

module.exports = router;
