import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {Video} from "../models/video.model.js"
import { Tweet } from "../models/tweet.model.js";


const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params;

    if(!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video id")
    }
    const video = await Video.findbyId(videoId);

    if(!video) {
        throw new ApiError(404, "Video not found")
    }

    let like = await Like.findOne({
        likedBy: req.user._id,
        video: videoId
        });

    if(like) {
        await like.deleteOne();
        video.likeCount -= 1;
    } else {
        like = new Like({likedBy: req.user._id,video: videoId});
        await like.save();
        video.likeCount += 1;
    }

    await video.save();

    return res
    .status(200)
    .json(
        new ApiResponse(
            200, {likeCount: video.likeCount}, 
            "Like toggled successfully"
        )
    )

})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params

    if(!isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid comment id")
    }

    const comment = await Comment.findById(commentId);

    if(!comment) {
        throw new ApiError(404, "Comment not found")
    }

    let like = await Like.findOne({
        likedBy: req.user._id,
        comment: commentId
        });

    if(like) {
        await like.deleteOne();
        comment.likeCount -= 1;
    } else {
        like = new Like({likedBy: req.user._id,comment: commentId});
        await like.save();
        comment.likeCount += 1;
    }

    await comment.save();

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {likeCount: comment.likeCount}, 
            "Like toggled successfully"
        )
    )

})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    
    if(!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweet id")
    }
    const tweet = await Tweet.findById(tweetId);

    if(!tweet) {
        throw new ApiError(404, "Tweet not found")
    }
    
    let like = await Like.findOne({ likedBy: req.user._id, tweet: tweetId });

    if(like) {
        await like.deleteOne();
        tweet.likeCount -= 1;
    } else {
        like = new Like({likedBy: req.user._id, tweet: tweetId});
        await like.save();
        tweet.likeCount += 1;
    }

    await tweet.save();

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {likeCount: tweet.likeCount}, 
            "Like toggled successfully"
        )
    )
})

const getLikedVideos = asyncHandler(async (req, res) => {
    
    const likedVideosId = await Like.find({likedBy: req.user._id, targetType: "Video"}).distinct("videoId");

    if(!likedVideosId.length) {
        return res.status(200).json(new ApiResponse(200, 'No liked videos found', []));
    }

    const likedVideos = await Video.find({
        _id: {
            $in: likedVideosId
        }
    });

    return res
    .status(200)
    .json(
        new ApiResponse(
            200, {likedVideos}, 
            "Liked videos fetched successfully"
        )
    )
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}