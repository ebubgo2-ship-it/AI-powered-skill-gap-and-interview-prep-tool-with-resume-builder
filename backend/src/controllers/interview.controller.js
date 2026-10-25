const pdfParse = require("pdf-parse")
const { generateInterviewReport, generateResumePdf } = require("../services/ai.service")
const interviewReportModel = require("../models/interviewReport.model")

/**
 * @description controller to generate interview report based on user self description, resume and jon description.
 */

async function generateInterViewReportController ( req, res ) {

    const resumeContent = await ( new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText()
    const {selfDescription, jobDescription } = req.body

    const interviewReportByAi = await generateInterviewReport({
        resume: resumeContent.text,
        selfDescription,
        jobDescription
    })

    const interviewReport = await interviewReportModel.create({

    user: req.user.id,
    resume: resumeContent.text,
    selfDescription,
    jobDescription,
    ...interviewReportByAi
    })

    res.status(201).json({
        message:"interview report generated successfully",
        interviewReport
    })
}

/**
 * @description contoller to get interview report by interview id
 */

async function getInterviewReportByController (req,res){
    
    const{ interviewId } = req.params

    const interviewReport = await interviewReportModel.findOne({_id: interviewId, user: req.user.id})

    if(!interviewReport){
        return res.status(404).json({
            message:"interview report not found"
        })
    }

    res.status(200).json({
        message:"interview report fetched successfully",
        interviewReport
    })
}

/**
 * @description controller to get all interview reports of logged in user
 */

async function getAllInterviewReportsController(req,res){
    const interviewReports = await interviewReportModel.find({ user: req.user.id}).sort({ createdAt: -1}).select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan ")
    
    res.status(200).json({
        message:"Interview reports fetched succesfully",
        interviewReports
    })
}

/**
 * @description controller to generate resume pdf based on user self description, resume, and job description
 */

async function generateResumePdfController(req,res){
    const{ interviewReportId } = req.params

    const interviewReport = await interviewReportModel.findById(interviewReportId)

    if(!interviewReport) {
        return res.status(404).json({
            message:"Interview report not found"
        })
    }

    const{resume, jobDescription, selfDescription} = interviewReport

    const pdfBuffer = await generateResumePdf({ resume, jobDescription, selfDescription })

    res.set({
        "content-Type": "application/pdf",
        "content-Disposition": 'attachment; filrname=resume_${interviewReportId}.pdf'
    })
    res.send(pdfBufffer)
}

module.exports = {generateInterViewReportController, getInterviewReportByController, getAllInterviewReportsController, generateResumePdfController}