import mongoose from "mongoose";
import {userModel} from "../models/models";

export function getUpdateRequest(username: string, url: string) {
    mongoose.connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    });

    return userModel.findOne({ "urlName": username, "updates.url": encodeURIComponent(url) });
}

export function getCurrUserRequest(email: string) {
    mongoose.connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    });

    return userModel.findOne({ email: email });
}

export async function getCurrUserFeedRequest(email: string) {
    mongoose.connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    });

    const userData = await userModel.findOne({ email: email });

    if (userData.following.length === 0) return {userData: userData, feedData: null};

    console.log(userData.following);

    const feedData = await userModel.find({ "_id": { $in: userData.following}});

    return {userData: userData, feedData: feedData};
}