const User = require("../models/userModel.js")
const passport = require('passport')
const FoodItem = require("../models/foodItemModel.js")

const addOrder = async(req,res)=>{
    try{
        console.log("User is : ",req.user)
        console.log(req.body)
        const {foodName, quantity,assignedNgo,address} = req.body;
        console.log("Request Body",req.body)
        const newFood = new FoodItem({
            donor:req.user._id,
            foodName:foodName,
            quantity:quantity,
            assignedNgo:assignedNgo,
            address:address
        })

        const result = await newFood.save();
        return res.status(200).send({success:true,msg:"Food Listed Successfully",data:result})
    }
    catch(err){
        return res.status(200).send({success:true,msg:"Food Not Listed Successfully",error:err.message})
    }
}

const claimFoodOrder = async(req,res)=>{
    try{
        const {id} = req.params; 
        console.log(id)
        console.log(req.user)
        const foodItem = await FoodItem.findById(id)
        console.log(foodItem)

        if(!foodItem || foodItem.status === "Claimed"){
           return res.status(404).send({success:false,message:"Food Not Available for claiming"})
        }

        foodItem.claimedBy = req.user._id;
        foodItem.status = "Claimed";

        const result = await foodItem.save()
        return res.status(200).send({success:true,message:"Food Claimed Successfully",data:result})
    }
    catch(err){
        return res.status(500).send({success:false,message:"Error Claiming Food",error:err.message})
    }
}

const getAvailableOders = async(req,res)=>{
    try{
        console.log("Requested User is",req.user)
        const result = await FoodItem.find({status:"Available"}).populate('donor').sort({ createdAt: -1 })
        console.log(result)
        res.status(200).send({success:true,msg:"Fetched all available food",data:result})
    }
    catch(err){
        res.status(500).send({success:false,msg:"Error While Fetching Food",error:err.message})
    }
}

const getFoodItems = async(req,res)=>{
    try{
        const {id} = req.params;
        const result = await FoodItem.find({donor:id})
        .populate('donor', 'username')      // Populate donor's username
        .populate('assignedNgo', 'username') // Populate assigned NGO's username
        .populate('claimedBy', 'username')   // Populate claimant's username
        .sort({createdAt:-1})
        res.status(200).send({success:true,msg:"Food found",data:result})
    }
    catch(err){
        res.status(200).send({success:false,msg:"Food Not found",error:err.message})
    }
}

module.exports = {
    addOrder,
    claimFoodOrder,
    getAvailableOders,
    getFoodItems,
}