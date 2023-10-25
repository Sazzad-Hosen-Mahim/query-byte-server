import slugify from "slugify";
import businessCardModel from "../models/businessCardModel.js";
import fs from "fs";

export const createBusinessCardController = async (req, res) => {
  try {
    const {
      name,
      companyName,
      country,
      businessNature,
      interest,
      slug,
      email,
      phone,
      address,
      description,
      user,
    } = req.fields;
    const { photo } = req.files;

    //validation
    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name is required" });
      case !companyName:
        return res.status(500).send({ error: "Company Name is required" });
      case !country:
        return res.status(500).send({ error: "Country is required" });
      case !businessNature:
        return res.status(500).send({ error: "Business Nature is required" });
      case !interest:
        return res.status(500).send({ error: "Interested Field is required" });
      case !email:
        return res.status(500).send({ error: "Email is required" });
      case !phone:
        return res.status(500).send({ error: "Phone is required" });
      case !address:
        return res.status(500).send({ error: "Address is required" });
      case !description:
        return res.status(500).send({ error: "Description is required" });
      case !user:
        return res.status(500).send({ error: "User is required" });
      case photo:
        return res.status(500).send({ error: "Photo is required" });
    }
    const businessCard = new businessCardModel({
      ...req.fields,
      slug: slugify(name),
    });
    if (photo) {
      businessCard.photo.data = fs.readFileSync(photo.path);
      businessCard.photo.contentType = photo.type;
    }
    await businessCard.save();
    res.status(201).send({
      success: true,
      message: "Business card saved successfully",
      businessCard,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in creating business card",
    });
  }
};

//get all cards

export const getBusinessCardController = async (req, res) => {
  try {
    const cards = await businessCardModel
      .find({})
      .populate("user")
      .select("-photo")
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      countTotal: cards.length,
      message: "All business card",
      cards,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in getting business cards",
      error,
    });
  }
};

//get single cards
export const getSingleBusinessCardController = async (req, res) => {
  try {
    const card = await businessCardModel
      .findOne({ slug: req.params.slug })
      .select("-photo")
      .populate("user");
    res.status(200).send({
      success: true,
      message: "Single card fetched",
      card,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while getting single cards",
      error,
    });
  }
};

//get photo
export const cardPhotoController = async (req, res) => {
  try {
    const card = await businessCardModel
      .findById(req.params.cid)
      .select("photo");
    if (card.photo.data) {
      res.set("Content-type", card.photo.contentType);
      return res.status(200).send(card.photo.data);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while getting photo",
      error,
    });
  }
};

//delete controller
export const deleteCardController = async (req, res) => {
  try {
    await businessCardModel.findByIdAndDelete(req.params.cid).select("-photo");
    res.status(200).send({
      success: true,
      message: "Card deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while deleting product",
      error,
    });
  }
};

//update controller
export const updateBusinessCardController = async (req, res) => {
  try {
    const {
      name,
      companyName,
      country,
      businessNature,
      interest,
      slug,
      email,
      phone,
      address,
      description,
      user,
    } = req.fields;
    const { photo } = req.files;

    //validation
    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name is required" });
      case !companyName:
        return res.status(500).send({ error: "Company Name is required" });
      case !country:
        return res.status(500).send({ error: "Country is required" });
      case !businessNature:
        return res.status(500).send({ error: "Business Nature is required" });
      case !interest:
        return res.status(500).send({ error: "Interested Field is required" });
      case !email:
        return res.status(500).send({ error: "Email is required" });
      case !phone:
        return res.status(500).send({ error: "Phone is required" });
      case !address:
        return res.status(500).send({ error: "Address is required" });
      case !description:
        return res.status(500).send({ error: "Description is required" });
      case !user:
        return res.status(500).send({ error: "User is required" });
      case photo && photo.size > 1000000:
        return res.status(500).send({ error: "Photo is required" });
    }
    const businessCard = await businessCardModel.findByIdAndUpdate(
      req.params.cid,
      { ...req.fields, slug: slugify(name) },
      { new: true }
    );

    if (photo) {
      businessCard.photo.data = fs.readFileSync(photo.path);
      businessCard.photo.contentType = photo.type;
    }
    await businessCard.save();
    res.status(201).send({
      success: true,
      message: "Business card updated successfully",
      businessCard,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in updating business card",
    });
  }
};

//search controller
export const searchCardController = async (req, res) => {
  try {
    const { keyword } = req.params;
    const results = await businessCardModel
      .find({
        $or: [
          { name: { $regex: keyword, $options: "i" } },
          { companyName: { $regex: keyword, $options: "i" } },
          { country: { $regex: keyword, $options: "i" } },
          { businessNature: { $regex: keyword, $options: "i" } },
          { interest: { $regex: keyword, $options: "i" } },
        ],
      })
      .select("-photo");
    res.json(results);
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error in search api",
      error,
    });
  }
};
