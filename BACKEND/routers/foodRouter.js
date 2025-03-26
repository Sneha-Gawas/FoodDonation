const express = require('express')
const foodRouter = express.Router()
const User = require('../models/userModel.js')
const passport = require('passport')
const {addOrder,claimFoodOrder,getAvailableOders,getFoodItems } = require('../controllers/foodController.js')
const {isDonor, isNgo} = require("../middleware.js")

foodRouter.use(express.json());
foodRouter.use(express.urlencoded({ extended: true }));

foodRouter.post("/add",isDonor,addOrder)
foodRouter.post("/claim/:id",claimFoodOrder)
foodRouter.get("/availableOrders",getAvailableOders)
foodRouter.get("/fooditems/:id",getFoodItems)

module.exports=foodRouter
