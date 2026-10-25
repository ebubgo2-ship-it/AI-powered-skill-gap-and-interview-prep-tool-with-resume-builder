const mongoose = require("mongoose")

const technicalQuestionSchema = new mongoose.Schema({
    question:{
        type: String,
        required: [ true, "technical question is reqiured"]
    },
    intention: {
        type: String,
        required:[true,"intention is required"]
    },
    answer:{
        type: String,
        required: [ true, "answer is required"]
    }
}, {
    _id: false
})

const behaviouralQuestionSchema = new mongoose.Schema({
    question:{
        type:String,
        required:[ true,"behavioral question is required"]    
    }, 
    intention: {
        type:String,
        required:[ true, "intention is required"]
    },
    answer:{
        type:String,
        required:[true,"answer is required"]
    }
},{
    _id: false
})

const skillGapSchema = new mongoose.Schema({
    skill: {
        type:String,
        required:[ true,"skill is required"]
    },
    severity: {
        type:String,
        enum: ["low", "medium", "high"],
        required: [true,"severity is required"]
    }
},{
    _id: false
})

const preparationPlanSchema = new mongoose.Schema({
    day: {
        type: Number,
        required: [true, "day is required"]
    },
    focus:{
        type:String,
        required: [true,"focus is required"]
    },
    tasks:[{
        type:String,
        required: [true,"task is required"]
    } ]
})

const interviewReportSchema = new mongoose.Schema({
    jobdescription:{
        type:String,
        required:[true,"job description is required"]
    },
    resume: {
        type:String,
    },
    selfDescription: {
        type:String,
    },
    matchScore: {
        type: Number,
        min:0,
        max:100,
    },
    technicalQuestions:[technicalQuestionSchema],
    behaviouralQuestions:[behaviouralQuestionSchema],
    skillGaps: [skillGapSchema],
    preparationPlan: [preparationPlanSchema],
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"users"
    },
    title: { 
        type:String,
        required: [ true, "job title is required"]
    }
}, {
    timestamps: true
})

const interviewReportModel = mongoose.model("InterwiewReport", interviewReportSchema);

module.exports = interviewReportModel;