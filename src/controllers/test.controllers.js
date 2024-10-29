import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {Comment} from "../models/comment.model.js"
import {Video} from "../models/video.model.js"



const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
})
    


export {getLikedVideos}