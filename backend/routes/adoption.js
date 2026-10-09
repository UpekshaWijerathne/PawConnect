const express = require("express");
const AdoptionRequest = require("../models/AdoptionRequest");
const Pet = require("../models/Pet");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();


// CREATE AN ADOPTION REQUEST

router.post(
    "/",
    authMiddleware,
    roleMiddleware("adopter"),
    async (req, res) => {
        try {
            const { petId } = req.body;

            if (!petId) {
                return res.status(400).json({
                    message: "Pet ID is required"
                });
            }

            const pet = await Pet.findById(petId);

            if (!pet) {
                return res.status(404).json({
                    message: "Pet not found"
                });
            }

            if (pet.status !== "Available") {
                return res.status(400).json({
                    message: "This pet is not available for adoption"
                });
            }

            const existingRequest = await AdoptionRequest.findOne({
                petId: petId,
                userId: req.user.userId,
                status: "Pending"
            });

            if (existingRequest) {
                return res.status(400).json({
                    message:
                        "You already have a pending request for this pet"
                });
            }

            const adoptionRequest =
                await AdoptionRequest.create({
                    petId: petId,
                    userId: req.user.userId
                });

            res.status(201).json({
                message:
                    "Adoption request submitted successfully",
                adoptionRequest
            });

        } catch (error) {
            res.status(500).json({
                message: "Failed to submit adoption request",
                error: error.message
            });
        }
    }
);



// GET MY ADOPTION REQUESTS - ADOPTER

router.get(
    "/my",
    authMiddleware,
    roleMiddleware("adopter"),
    async (req, res) => {
        try {
            const requests = await AdoptionRequest.find({
                userId: req.user.userId
            })
                .populate(
                    "petId",
                    "name species breed age gender imageURL location status"
                )
                .sort({ createdAt: -1 });

            res.status(200).json({
                count: requests.length,
                requests
            });

        } catch (error) {
            res.status(500).json({
                message: "Failed to fetch adoption requests",
                error: error.message
            });
        }
    }
);



// GET ADOPTION REQUESTS - SHELTER

router.get(
    "/shelter",
    authMiddleware,
    roleMiddleware("shelter", "admin"),
    async (req, res) => {
        try {

            const requests = await AdoptionRequest.find()
                .populate({
                    path: "petId",
                    select:
                        "name species breed age gender imageURL location status ownerId"
                })
                .populate(
                    "userId",
                    "name email"
                )
                .sort({ createdAt: -1 });

            // Admin can see all requests.
            // Shelter can only see request for pets owned by that shelter.

            const filteredRequests =
                req.user.role === "admin"
                    ? requests
                    : requests.filter(
                          (request) =>
                              request.petId &&
                              request.petId.ownerId &&
                              request.petId.ownerId.toString() ===
                                  req.user.userId
                      );

            res.status(200).json({
                count: filteredRequests.length,
                requests: filteredRequests
            });

        } catch (error) {
            res.status(500).json({
                message: "Failed to fetch shelter adoption requests",
                error: error.message
            });
        }
    }
);


// UPDATE ADOPTION REQUEST STATUS
// SHELTER / ADMIN

router.put(
    "/:id/status",
    authMiddleware,
    roleMiddleware("shelter", "admin"),
    async (req, res) => {
        try {

            const { status } = req.body;

            // Only these two status changes are allowed
            if (!["Approved", "Rejected"].includes(status)) {
                return res.status(400).json({
                    message:
                        "Status must be either Approved or Rejected"
                });
            }

            const request =
                await AdoptionRequest.findById(req.params.id)
                    .populate("petId");

            if (!request) {
                return res.status(404).json({
                    message: "Adoption request not found"
                });
            }

            if (!request.petId) {
                return res.status(404).json({
                    message: "Pet associated with this request not found"
                });
            }

            // Shelter can only manage requests

            if (
                req.user.role !== "admin" &&
                request.petId.ownerId.toString() !==
                    req.user.userId
            ) {
                return res.status(403).json({
                    message:
                        "You can only manage requests for your own pets"
                });
            }

            // Prevent changing an already processed request
            if (request.status !== "Pending") {
                return res.status(400).json({
                    message:
                        "This adoption request has already been processed"
                });
            }


            // APPROVE REQUEST

            if (status === "Approved") {

                // Make the selected pet adopted
                request.status = "Approved";
                await request.save();

                await Pet.findByIdAndUpdate(
                    request.petId._id,
                    {
                        status: "Adopted"
                    },
                    {
                        new: true
                    }
                );


                await AdoptionRequest.updateMany(
                    {
                        petId: request.petId._id,
                        _id: { $ne: request._id },
                        status: "Pending"
                    },
                    {
                        $set: {
                            status: "Rejected"
                        }
                    }
                );

                return res.status(200).json({
                    message:
                        "Adoption request approved successfully",
                    request
                });
            }


            // REJECT REQUEST

            request.status = "Rejected";

            await request.save();

            res.status(200).json({
                message:
                    "Adoption request rejected successfully",
                request
            });

        } catch (error) {

            res.status(500).json({
                message:
                    "Failed to update adoption request",
                error: error.message
            });
        }
    }
);


module.exports = router;