import mongoose, { Schema, ObjectId } from "mongoose";

const reqString = {
    type: String,
    required: true,
};

const unreqString = {
    type: String,
    required: false,
};

const authorObj = {
    name: reqString,
    image: reqString,
    email: reqString,
    urlName: { type: String, required: false, unique: true, },
    bio: unreqString,
    linkedin: unreqString,
    twitter: unreqString,
    website: unreqString,
};

const commentObj = {
    authorId: ObjectId,
    author: authorObj,
    updateId: ObjectId,
    body: reqString,
};

const subCommentSchema: Schema = new Schema({
    ...commentObj,
}, {
    timestamps: true,
});

const commentSchema: Schema = new Schema({
    ...commentObj,
    subComments: [subCommentSchema],
}, {
    timestamps: true,
});

const updateSchema: Schema = new Schema({
    authorId: ObjectId,
    author: authorObj,
    body: reqString,
    title: {type: String, required: false},
    date: Date,
    readBy: [ObjectId],
    comments: [commentSchema],
}, {
    timestamps: true,
});

const userSchema: Schema = new Schema({
    ...authorObj,
    updates: [updateSchema],
    following: [ObjectId],
    followers: [ObjectId],
});

export const userModel = mongoose.models.user || mongoose.model('user', userSchema);
export const commentModel = mongoose.models.comment || mongoose.model('comment', commentSchema);
export const subCommentModel = mongoose.models.subComment || mongoose.model('subComment', subCommentSchema);
export const updateModel = mongoose.models.update || mongoose.model('update', updateSchema);