import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
    fileName:{
        type: String,
        required: true,
    },
    fileUrl:{
        type: String,
        required: true,
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    documentId: {
        type: String,
        required: true,
        unique: true,
    },
    size: {
        type: Number,
        required: true,
    },
    summary:{
        type: String,
        required: false,
    },
    partiesInvolved:{
        type: [String],
        required: false,
    },
    paymentDetails:{
        type: String,
        required: false,
    },
    durationAndTermination:{
        type: String,
        required: false,
    },
    confidentialityAndPrivacy:{
        type: String,
        required: false,
    },
    liabilityAndIndemnity:{
        type: String,
        required: false,
    },
    disputeResolution:{
        type: String,
        required: false,
    },
    warrantiesAndGuarantees:{
        type: String,
        required: false,
    },
    forceMajeure:{
        type: String,
        required: false,
    },
    intellectualProperty:{
        type: String,
        required: false,
    },
    complianceAndRegulations:{
        type: String,
        required: false,
    },
    amendmentsAndModifications:{
        type: String,
        required: false,
    },
    assignmentAndTransfer:{
        type: String,
        required: false,
    },
    insuranceRequirements:{
        type: String,
        required: false,
    },
    signaturesAndWitnesses:{
        type: String,
        required: false,
    },
    accessibilityAndLanguage:{
        type: String,
        required: false,
    },
    redFlags:{
        type: [String],
        required: false,
    },
    actionableQuestions:{
        type: [String],
        required: false,
    },
    additionalConsiderations:{
        type: [String],
        required: false,
    },
    disclaimer:{
        type: String,
        required: false,
    },
    documentType: {
        type: String,
        enum: ['legal', 'expense'],
        default: 'legal',
        required: false,
    },
    expenseData: {
        documentText: {
            type: String,
            required: false,
        },
        entities: {
            type: mongoose.Schema.Types.Mixed,
            required: false,
        },
        entityCount: {
            type: Number,
            required: false,
        }
    }
}, {
    timestamps: true
})

// Index for faster lookups by uploadedBy
fileSchema.index({ uploadedBy: 1, createdAt: -1 });

const File = mongoose.model('File', fileSchema);

export default File;

// "summary",
//     "parties",
//     "paymentDetails",
//     "durationAndTermination",
//     "confidentialityAndPrivacy",
//     "liabilityAndIndemnity",
//     "disputeResolution",
//     "warrantiesAndGuarantees",
//     "forceMajeure",
//     "intellectualProperty",
//     "complianceAndRegulations",
//     "amendmentsAndModifications",
//     "assignmentAndTransfer",
//     "insuranceRequirements",
//     "signaturesAndWitnesses",
//     "accessibilityAndLanguage",
//     "redFlags",
//     "actionableQuestions",
//     "additionalConsiderations",
//     "disclaimer"