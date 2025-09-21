import { DocumentProcessorServiceClient } from '@google-cloud/documentai';
import { GoogleGenAI } from '@google/genai';
import { Storage } from '@google-cloud/storage';
import { promises as fs } from 'fs';
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { QdrantVectorStore } from "@langchain/qdrant";
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
import File from '../models/File.js';
import User from '../models/User.js';

dotenv.config();

// Configuration logging function
function logConfiguration() {
  console.log('\n⚙️  ====== CONFIGURATION STATUS ======');
  console.log(`🆔 [CONFIG] Project ID: ${process.env.PROJECT_ID ? '✅ Set' : '❌ Missing'}`);
  console.log(`🌍 [CONFIG] Location: ${process.env.GOOGLE_CLOUD_LOCATION || 'us-central1 (default)'}`);
  console.log(`🔑 [CONFIG] Service Account Key: ${process.env.GOOGLECLOUDSERVICEACCOUNTKEY ? '✅ Set' : '❌ Missing'}`);
  console.log(`🤖 [CONFIG] Processor ID: ${process.env.GOOGLECLOUDPROCESSORID ? '✅ Set' : '❌ Missing'}`);
  console.log(`☁️  [CONFIG] GCS Bucket: ${process.env.GCS_BUCKET_NAME ? '✅ Set' : '❌ Missing'}`);
  console.log(`🌐 [CONFIG] Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('⚙️  ====== CONFIGURATION END ======\n');
}

// Log configuration on module load
logConfiguration();

// Initialize Google Cloud services
const documentAIClient = new DocumentProcessorServiceClient({
  keyFilename: process.env.GOOGLECLOUDSERVICEACCOUNTKEY,
});

const storage = new Storage({
  keyFilename: process.env.GOOGLECLOUDSERVICEACCOUNTKEY,
});

// Set up Gemini AI
const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY
});

// Legal Document Analysis Prompt
const LEGAL_DOCUMENT_PROMPT = `
Role and Goal:
You are "Lexi," an AI Legal Document Assistant powered by Google Cloud's generative AI. Your mission is to help everyday users—including individuals and small businesses—with little or no legal background—to understand, interpret, and navigate complex legal documents such as contracts, agreements, rental terms, loan forms, or service terms.

You should:
- Translate legal jargon into clear, practical, and empathetic explanations.
- Focus on helping users understand what they are agreeing to, highlighting important clauses, potential risks, and user-specific implications.
- Encourage users to ask clarifying questions and seek professional advice when needed.
- Create a safe, private, and supportive environment, assuring users that you are here to assist—not to replace legal counsel.

Important Notes:
- Always ensure that your output is structured and machine-readable as a single JSON object.
- Prioritize clarity, brevity, and relevance while covering key aspects of the document.
- Avoid overwhelming users with unnecessary details—focus on what matters most for decision-making.
- If terms are ambiguous, explain them in simple, step-by-step fashion.
- Your explanations must be empathetic, trustworthy, and non-alarming.

Core Task:
When a user provides you with text from a legal document, analyze it comprehensively and generate a single, valid JSON object containing your full analysis. Do not include any text or explanations outside of the JSON object itself.

Analysis Requirements:
Provide a thorough analysis covering all aspects of the legal document including:
- Summary and parties involved
- Payment terms, duration, and termination conditions
- Privacy, liability, and dispute resolution
- Warranties, compliance, and intellectual property
- Red flags and additional considerations
- Actionable questions for the user

JSON Output Format:
Your response must strictly adhere to the comprehensive JSON structure with all required fields populated based on the document content. If a section doesn't apply to the document, provide "Not applicable" or "Not specified in this document" as appropriate.

Now analyze the following legal document text:

`;

// Response schema for Gemini AI
const responseSchema = {
  type: "object",
  properties: {
    summary: {
      type: "string",
      description: "A concise, high-level summary of the document's purpose and how it affects the user in simple terms."
    },
    parties: {
      type: "array",
      items: {
        type: "object",
        properties: {
          role: { type: "string", description: "Role or title of the party involved" },
          details: { type: "string", description: "Explanation of this party's involvement and obligations." }
        },
        required: ["role", "details"]
      },
      description: "List of parties involved in the agreement with their roles and responsibilities."
    },
    paymentDetails: {
      type: "object",
      properties: {
        amount: { type: "string", description: "How much is involved, payment terms, and schedules." },
        penalties: { type: "string", description: "Potential fines or consequences for missing payments." },
        refunds: { type: "string", description: "Conditions under which payments may be refunded or canceled." }
      },
      required: ["amount", "penalties", "refunds"],
      description: "Detailed information on payment terms and related conditions."
    },
    durationAndTermination: {
      type: "object",
      properties: {
        startDate: { type: "string", description: "When the agreement starts." },
        endDate: { type: "string", description: "When the agreement ends or how long it runs." },
        renewal: { type: "string", description: "Automatic renewal terms, if any." },
        termination: { type: "string", description: "How and when the contract can be ended." }
      },
      required: ["startDate", "endDate", "renewal", "termination"],
      description: "Terms related to the duration and termination of the agreement."
    },
    confidentialityAndPrivacy: {
      type: "object",
      properties: {
        dataHandling: { type: "string", description: "How personal or sensitive information is handled." },
        restrictions: { type: "string", description: "Limitations on sharing or usage of data." }
      },
      required: ["dataHandling", "restrictions"],
      description: "Privacy protections and confidentiality rules."
    },
    liabilityAndIndemnity: {
      type: "object",
      properties: {
        responsibility: { type: "string", description: "Who is responsible for damages or losses." },
        limits: { type: "string", description: "Limitations or exclusions to liability." }
      },
      required: ["responsibility", "limits"],
      description: "Liability clauses and indemnity responsibilities."
    },
    disputeResolution: {
      type: "object",
      properties: {
        process: { type: "string", description: "How disagreements will be resolved." },
        jurisdiction: { type: "string", description: "Which laws or courts apply." }
      },
      required: ["process", "jurisdiction"],
      description: "Dispute resolution terms and applicable legal frameworks."
    },
    warrantiesAndGuarantees: {
      type: "object",
      properties: {
        promises: { type: "string", description: "What assurances or guarantees are provided." },
        coverage: { type: "string", description: "What is included or excluded from guarantees." }
      },
      required: ["promises", "coverage"],
      description: "Warranties and guarantees that are offered in the agreement."
    },
    forceMajeure: {
      type: "object",
      properties: {
        events: { type: "string", description: "Uncontrollable events that affect obligations." },
        impact: { type: "string", description: "How obligations change during such events." }
      },
      required: ["events", "impact"],
      description: "Clauses regarding uncontrollable events and their impact."
    },
    intellectualProperty: {
      type: "object",
      properties: {
        ownership: { type: "string", description: "Who owns the content or inventions." },
        usage: { type: "string", description: "Terms for how intellectual property can be used." }
      },
      required: ["ownership", "usage"],
      description: "Intellectual property rights and usage terms."
    },
    complianceAndRegulations: {
      type: "object",
      properties: {
        requirements: { type: "string", description: "Legal rules or licenses needed to comply." },
        penalties: { type: "string", description: "Consequences of non-compliance." }
      },
      required: ["requirements", "penalties"],
      description: "Compliance rules and penalties for violating them."
    },
    amendmentsAndModifications: {
      type: "object",
      properties: {
        process: { type: "string", description: "How changes to the document are made." },
        consent: { type: "string", description: "Who must approve changes." }
      },
      required: ["process", "consent"],
      description: "Terms for amending or modifying the contract."
    },
    assignmentAndTransfer: {
      type: "object",
      properties: {
        conditions: { type: "string", description: "When responsibilities or rights can be transferred." }
      },
      required: ["conditions"],
      description: "Rules around transferring obligations or rights."
    },
    insuranceRequirements: {
      type: "object",
      properties: {
        coverage: { type: "string", description: "Insurance needed and who pays for it." }
      },
      required: ["coverage"],
      description: "Insurance clauses relevant to the agreement."
    },
    signaturesAndWitnesses: {
      type: "object",
      properties: {
        protocols: { type: "string", description: "How signatures are collected and validated." }
      },
      required: ["protocols"],
      description: "Rules for validating signatures and witnesses."
    },
    accessibilityAndLanguage: {
      type: "object",
      properties: {
        jargon: { type: "string", description: "Complex terms or legal language that may confuse the user." },
        clarifications: { type: "string", description: "Sections where further explanation is needed." }
      },
      required: ["jargon", "clarifications"],
      description: "Language accessibility and areas needing clarification."
    },
    redFlags: {
      type: "array",
      items: {
        type: "object",
        properties: {
          title: { type: "string", description: "Potential risk or unfavorable clause title." },
          explanation: { type: "string", description: "Why this clause could negatively impact the user." }
        },
        required: ["title", "explanation"]
      },
      description: "Potential risks or problematic clauses in the document."
    },
    actionableQuestions: {
      type: "array",
      items: { type: "string" },
      description: "Questions the user could ask to clarify or negotiate terms."
    },
    additionalConsiderations: {
      type: "array",
      items: {
        type: "object",
        properties: {
          title: { type: "string", description: "A specific issue or point users should review carefully." },
          explanation: { type: "string", description: "Why this is important and how it could affect them." }
        },
        required: ["title", "explanation"]
      },
      description: "Additional considerations for the user to be aware of."
    },
    disclaimer: {
      type: "string",
      description: "A statement informing users that this is AI-generated information and not a substitute for legal advice."
    }
  },
  required: [
    "summary",
    "parties",
    "paymentDetails",
    "durationAndTermination",
    "confidentialityAndPrivacy",
    "liabilityAndIndemnity",
    "disputeResolution",
    "warrantiesAndGuarantees",
    "forceMajeure",
    "intellectualProperty",
    "complianceAndRegulations",
    "amendmentsAndModifications",
    "assignmentAndTransfer",
    "insuranceRequirements",
    "signaturesAndWitnesses",
    "accessibilityAndLanguage",
    "redFlags",
    "actionableQuestions",
    "additionalConsiderations",
    "disclaimer"
  ]
};

// Helper function to process document with Document AI
async function processDocumentWithAI(file) {
  const projectId = process.env.PROJECT_ID;
  const location = process.env.GOOGLE_CLOUD_LOCATION || 'us';
  const processorId = process.env.GOOGLECLOUDPROCESSORID;

  const name = `projects/${projectId}/locations/${location}/processors/${processorId}`;

  const encodedImage = Buffer.from(file.buffer).toString('base64');

  const request = {
    name,
    rawDocument: {
      content: encodedImage,
      mimeType: 'application/pdf',
    },
  };

  const [result] = await documentAIClient.processDocument(request);

  if (!result || !result.document) {
    throw new Error('No document found in the response');
  }

  // Extract text from the processed document
  const documentText = result.document.text || '';
  const entities = result.document.entities || [];
  const pages = result.document.pages || [];

  return {
    extractedText: documentText,
    entities: entities,
    pages: pages,
  };
}

// Helper function to upload file to Google Cloud Storage
async function uploadToGCS(file, fileName) {
  if (!file) throw new Error('No file provided');

  const bucketName = process.env.GCS_BUCKET_NAME;
  const bucket = storage.bucket(bucketName);
  const blob = bucket.file(fileName);

  const blobStream = blob.createWriteStream({
    resumable: false,
    contentType: file.mimetype,
  });

  return new Promise((resolve, reject) => {
    blobStream.on('error', (err) => {
      reject(err);
    });
    blobStream.on('finish', async () => {
      try {
        const [signedUrl] = await blob.getSignedUrl({
          action: 'read',
          expires: Date.now() + 60 * 60 * 1000, // 1 hour
        });

        resolve({
          signedUrl,
          fileName,
          mimeType: file.mimetype,
          filePath: `gs://${bucketName}/${fileName}`
        });
      } catch (err) {
        reject(err);
      }
    });

    blobStream.end(file.buffer);
  });
}

// Helper function to analyze document with Gemini AI
async function analyzeWithGemini(documentText) {
  try {
    const fullPrompt = LEGAL_DOCUMENT_PROMPT + documentText;

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: [
        {
          role: "user",
          parts: [{ text: fullPrompt }],
        }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.1,
      }
    });

    const responseText = response.text;

    // Parse the JSON response
    let analysisResult;
    try {
      analysisResult = JSON.parse(responseText);
    } catch (parseError) {
      // Fallback: try to extract JSON from the response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysisResult = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Unable to parse Gemini response as valid JSON');
      }
    }

    return analysisResult;
  } catch (error) {
    throw error;
  }
}

// Helper function to create combined text file
function createCombinedTextFile(extractedText, aiAnalysis, originalFileName) {
  const separator = '\n' + '='.repeat(80) + '\n';
  
  let combinedText = `LEGAL DOCUMENT ANALYSIS REPORT\n`;
  combinedText += `Generated on: ${new Date().toLocaleString()}\n`;
  combinedText += `Original Document: ${originalFileName}\n`;
  combinedText += separator;

  combinedText += `ORIGINAL DOCUMENT CONTENT\n`;
  combinedText += separator;
  combinedText += extractedText;
  combinedText += separator;

  combinedText += `AI LEGAL ANALYSIS\n`;
  combinedText += separator;

  // Format the AI analysis in a readable text format
  combinedText += `SUMMARY:\n${aiAnalysis.summary}\n\n`;

  if (aiAnalysis.parties && aiAnalysis.parties.length > 0) {
    combinedText += `PARTIES INVOLVED:\n`;
    aiAnalysis.parties.forEach((party, index) => {
      combinedText += `${index + 1}. ${party.role}: ${party.details}\n`;
    });
    combinedText += '\n';
  }

  if (aiAnalysis.paymentDetails) {
    combinedText += `PAYMENT DETAILS:\n`;
    combinedText += `Amount: ${aiAnalysis.paymentDetails.amount}\n`;
    combinedText += `Penalties: ${aiAnalysis.paymentDetails.penalties}\n`;
    combinedText += `Refunds: ${aiAnalysis.paymentDetails.refunds}\n\n`;
  }

  if (aiAnalysis.durationAndTermination) {
    combinedText += `DURATION AND TERMINATION:\n`;
    combinedText += `Start Date: ${aiAnalysis.durationAndTermination.startDate}\n`;
    combinedText += `End Date: ${aiAnalysis.durationAndTermination.endDate}\n`;
    combinedText += `Renewal: ${aiAnalysis.durationAndTermination.renewal}\n`;
    combinedText += `Termination: ${aiAnalysis.durationAndTermination.termination}\n\n`;
  }

  if (aiAnalysis.confidentialityAndPrivacy) {
    combinedText += `CONFIDENTIALITY AND PRIVACY:\n`;
    combinedText += `Data Handling: ${aiAnalysis.confidentialityAndPrivacy.dataHandling}\n`;
    combinedText += `Restrictions: ${aiAnalysis.confidentialityAndPrivacy.restrictions}\n\n`;
  }

  if (aiAnalysis.liabilityAndIndemnity) {
    combinedText += `LIABILITY AND INDEMNITY:\n`;
    combinedText += `Responsibility: ${aiAnalysis.liabilityAndIndemnity.responsibility}\n`;
    combinedText += `Limits: ${aiAnalysis.liabilityAndIndemnity.limits}\n\n`;
  }

  if (aiAnalysis.disputeResolution) {
    combinedText += `DISPUTE RESOLUTION:\n`;
    combinedText += `Process: ${aiAnalysis.disputeResolution.process}\n`;
    combinedText += `Jurisdiction: ${aiAnalysis.disputeResolution.jurisdiction}\n\n`;
  }

  if (aiAnalysis.warrantiesAndGuarantees) {
    combinedText += `WARRANTIES AND GUARANTEES:\n`;
    combinedText += `Promises: ${aiAnalysis.warrantiesAndGuarantees.promises}\n`;
    combinedText += `Coverage: ${aiAnalysis.warrantiesAndGuarantees.coverage}\n\n`;
  }

  if (aiAnalysis.redFlags && aiAnalysis.redFlags.length > 0) {
    combinedText += `RED FLAGS AND RISKS:\n`;
    aiAnalysis.redFlags.forEach((flag, index) => {
      combinedText += `${index + 1}. ${flag.title}: ${flag.explanation}\n`;
    });
    combinedText += '\n';
  }

  if (aiAnalysis.actionableQuestions && aiAnalysis.actionableQuestions.length > 0) {
    combinedText += `ACTIONABLE QUESTIONS:\n`;
    aiAnalysis.actionableQuestions.forEach((question, index) => {
      combinedText += `${index + 1}. ${question}\n`;
    });
    combinedText += '\n';
  }

  if (aiAnalysis.additionalConsiderations && aiAnalysis.additionalConsiderations.length > 0) {
    combinedText += `ADDITIONAL CONSIDERATIONS:\n`;
    aiAnalysis.additionalConsiderations.forEach((consideration, index) => {
      combinedText += `${index + 1}. ${consideration.title}: ${consideration.explanation}\n`;
    });
    combinedText += '\n';
  }

  combinedText += separator;
  combinedText += `DISCLAIMER:\n${aiAnalysis.disclaimer}\n`;
  
  return combinedText;
}

// Helper function to chunk text and store in Qdrant with user-based partitioning
async function storeInVectorDatabase(combinedText, userId, documentId) {
  // Split text into chunks
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 800,
    chunkOverlap: 100,
  });

  const textChunks = await splitter.splitText(combinedText);

  // Initialize embeddings
  const embeddings = new GoogleGenerativeAIEmbeddings({
    apiKey: process.env.GOOGLE_API_KEY,
    model: "text-embedding-004",
  });

  // Connect to Qdrant vector store
  const vectorStore = await QdrantVectorStore.fromExistingCollection(embeddings, {
    url: process.env.QDRANT_URL || "http://localhost:6333",
    collectionName: "LegalDocsCollection",
  });

  // Map chunks to documents with user-based partitioning metadata
  const documents = textChunks.map((chunk, idx) => ({
    pageContent: chunk,
    metadata: { 
      id: `${documentId}_chunk_${idx}`,
      userId: userId,
      documentId: documentId,
      chunkIndex: idx,
      timestamp: new Date().toISOString()
    },
  }));

  await vectorStore.addDocuments(documents);
  
  return {
    vectorStore,
    documentsStored: documents.length,
    userId,
    documentId
  };
}

// RAG Chat function with user-based filtering
// RAG Chat function with user-based filtering
// RAG Chat function with enhanced debugging
export const ragChatWithPDF = async (req, res) => {
  const startTime = Date.now();
  
  try {
    const { question, documentId } = req.body;

    if (!question) {
      return res.status(400).json({
        error: 'Question is required for RAG chat'
      });
    }

    // Get authenticated user from middleware
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        error: 'Authentication required for RAG chat'
      });
    }

    if (!documentId) {
      return res.status(400).json({
        error: 'Document ID is required for RAG chat'
      });
    }

    // Initialize embeddings model
    const embeddings = new GoogleGenerativeAIEmbeddings({
      apiKey: process.env.GOOGLE_API_KEY,
      model: "text-embedding-004",
    });

    // Connect to existing vector store
    const vectorStore = await QdrantVectorStore.fromExistingCollection(embeddings, {
      url: process.env.QDRANT_URL || "http://localhost:6333",
      collectionName: process.env.QDRANT_COLLECTION_NAME || "LegalDocsCollection",
    });

    // First try without filter to see total documents
    const allDocsRetriever = vectorStore.asRetriever({ k: 10 });
    const allDocs = await allDocsRetriever.invoke(question);

    // Manual filtering since Qdrant filter might have issues
    console.log(`[RAG DEBUG] Looking for documents with userId: ${userId} (type: ${typeof userId}) and documentId: ${documentId} (type: ${typeof documentId})`);
    
    const relevantDocs = allDocs.filter(doc => {
      const docUserId = doc.metadata?.userId;
      const docDocumentId = doc.metadata?.documentId;
      const userMatch = docUserId === userId;
      const documentMatch = docDocumentId === documentId;
      console.log(`[RAG DEBUG] Document userId: ${docUserId} (match: ${userMatch}), documentId: ${docDocumentId} (match: ${documentMatch})`);
      return userMatch && documentMatch;
    });

    console.log(`[RAG DEBUG] Found ${relevantDocs.length} relevant docs out of ${allDocs.length} total docs for user ${userId} and document ${documentId}`);

    if (relevantDocs.length === 0) {
      return res.status(200).json({
        success: true,
        question: question,
        answer: `I couldn't find any content from the specified document. Please make sure the document has been properly processed and try again.`,
        relevantChunks: 0,
        totalChunksInDB: allDocs.length,
        userId: userId,
        documentId: documentId,
        processingTime: `${Date.now() - startTime}ms`,
        timestamp: new Date().toISOString()
      });
    }

    // Prepare context for Gemini
    const context = relevantDocs.map(doc => doc.pageContent).join('\n\n');

    // Generate response using Gemini with context
    const ragPrompt = `You are a helpful legal document assistant. Based on the provided document context, answer the user's question accurately and clearly.

Context from the legal document:
${context}

User Question: ${question}

Please provide a clear, helpful answer based on the document context above. If something is not covered in the document, try referring to general knowledge but clarify that it's outside the provided context. Try saying something relevant but don't say the document does not provide information on that topic.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: [
        {
          role: "user",
          parts: [{ text: ragPrompt }]
        }
      ],
      config: {
        temperature: 0.3,
        maxOutputTokens: 1000,
      }
    });

    const answer = response.text;
    const processingTime = Date.now() - startTime;

    res.status(200).json({
      success: true,
      question: question,
      answer: answer,
      relevantChunks: relevantDocs.length,
      totalChunksInDB: allDocs.length,
      userId: userId,
      documentId: documentId,
      processingTime: `${processingTime}ms`,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    const processingTime = Date.now() - startTime;
    
    res.status(500).json({
      success: false,
      error: 'Error processing RAG chat request',
      processingTime: `${processingTime}ms`,
      timestamp: new Date().toISOString(),
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Main document processing function with improved flow
export const processLegalDocument = async (req, res) => {
  const startTime = Date.now();
  console.log('\n🚀 ====== LEGAL DOCUMENT PROCESSING STARTED ======');

  try {
    // Step 1: Validate file upload and get authenticated user
    if (!req.file) {
      console.error('❌ [VALIDATION] No file uploaded');
      return res.status(400).json({
        error: 'No file uploaded. Please upload a PDF document.'
      });
    }

    // Get authenticated user from middleware
    const userId = req.user?.id;
    if (!userId) {
      console.error('❌ [AUTH] No authenticated user found');
      return res.status(401).json({
        error: 'Authentication required. Please log in.'
      });
    }

    const documentId = uuidv4();

    // Validate file type
    if (req.file.mimetype !== 'application/pdf') {
      console.error(`❌ [VALIDATION] Invalid file type: ${req.file.mimetype}`);
      return res.status(400).json({
        error: 'Invalid file type. Please upload a PDF document.'
      });
    }

    
    // Step 2: Extract text using Document AI
    console.log('\n🤖 [MAIN] Step 2: Extracting text with Document AI...');
    const documentResult = await processDocumentWithAI(req.file);

    // Step 3: Upload original file to GCS
    console.log('\n📤 [MAIN] Step 3: Uploading original file to Google Cloud Storage...');
    const originalFileName = `${Date.now()}_${req.file.originalname}`;
    const originalUploadResult = await uploadToGCS(req.file, originalFileName);

    // Step 4: Analyze with Gemini AI
    console.log('\n🧠 [MAIN] Step 4: Analyzing with Gemini AI...');
    const aiAnalysis = await analyzeWithGemini(documentResult.extractedText);

    // Step 5: Create combined text file
    console.log('\n📄 [MAIN] Step 5: Creating combined text file...');
    const combinedTextContent = createCombinedTextFile(
      documentResult.extractedText, 
      aiAnalysis, 
      req.file.originalname
    );

    // Step 6: Store in vector database directly (skip GCS upload for speed)
    console.log('\n🔍 [MAIN] Step 6: Storing in vector database with user partitioning...');
    const vectorStoreResult = await storeInVectorDatabase(combinedTextContent, userId, documentId);

    // Step 7: Save file information to MongoDB
    console.log('\n💾 [MAIN] Step 7: Saving file information to MongoDB...');
    
    // Find authenticated user
    const user = await User.findById(userId);
    if (!user) {
      console.error(`❌ [MONGO] Authenticated user not found: ${userId}`);
      return res.status(404).json({
        error: 'User not found in database.'
      });
    }

    console.log(`✅ [MONGO] Found authenticated user: ${user.email}`);

    // Map AI analysis to File schema fields
    const fileData = {
      fileName: req.file.originalname,
      fileUrl: originalUploadResult.signedUrl,
      uploadedBy: user._id,
      documentId: documentId,
      size: req.file.size,
      summary: aiAnalysis.summary || '',
      partiesInvolved: aiAnalysis.parties ? aiAnalysis.parties.map(party => `${party.role}: ${party.details}`) : [],
      paymentDetails: aiAnalysis.paymentDetails ? 
        `${aiAnalysis.paymentDetails.amount} | Penalties: ${aiAnalysis.paymentDetails.penalties} | Refunds: ${aiAnalysis.paymentDetails.refunds}` : '',
      durationAndTermination: aiAnalysis.durationAndTermination ? 
        `Start: ${aiAnalysis.durationAndTermination.startDate} | End: ${aiAnalysis.durationAndTermination.endDate} | Renewal: ${aiAnalysis.durationAndTermination.renewal} | Termination: ${aiAnalysis.durationAndTermination.termination}` : '',
      confidentialityAndPrivacy: aiAnalysis.confidentialityAndPrivacy ? 
        `Data Handling: ${aiAnalysis.confidentialityAndPrivacy.dataHandling} | Restrictions: ${aiAnalysis.confidentialityAndPrivacy.restrictions}` : '',
      liabilityAndIndemnity: aiAnalysis.liabilityAndIndemnity ? 
        `Responsibility: ${aiAnalysis.liabilityAndIndemnity.responsibility} | Limits: ${aiAnalysis.liabilityAndIndemnity.limits}` : '',
      disputeResolution: aiAnalysis.disputeResolution ? 
        `Process: ${aiAnalysis.disputeResolution.process} | Jurisdiction: ${aiAnalysis.disputeResolution.jurisdiction}` : '',
      warrantiesAndGuarantees: aiAnalysis.warrantiesAndGuarantees ? 
        `Promises: ${aiAnalysis.warrantiesAndGuarantees.promises} | Coverage: ${aiAnalysis.warrantiesAndGuarantees.coverage}` : '',
      forceMajeure: aiAnalysis.forceMajeure ? 
        `Events: ${aiAnalysis.forceMajeure.events} | Impact: ${aiAnalysis.forceMajeure.impact}` : '',
      intellectualProperty: aiAnalysis.intellectualProperty ? 
        `Ownership: ${aiAnalysis.intellectualProperty.ownership} | Usage: ${aiAnalysis.intellectualProperty.usage}` : '',
      complianceAndRegulations: aiAnalysis.complianceAndRegulations ? 
        `Requirements: ${aiAnalysis.complianceAndRegulations.requirements} | Penalties: ${aiAnalysis.complianceAndRegulations.penalties}` : '',
      amendmentsAndModifications: aiAnalysis.amendmentsAndModifications ? 
        `Process: ${aiAnalysis.amendmentsAndModifications.process} | Consent: ${aiAnalysis.amendmentsAndModifications.consent}` : '',
      assignmentAndTransfer: aiAnalysis.assignmentAndTransfer ? 
        `Conditions: ${aiAnalysis.assignmentAndTransfer.conditions}` : '',
      insuranceRequirements: aiAnalysis.insuranceRequirements ? 
        `Coverage: ${aiAnalysis.insuranceRequirements.coverage}` : '',
      signaturesAndWitnesses: aiAnalysis.signaturesAndWitnesses ? 
        `Protocols: ${aiAnalysis.signaturesAndWitnesses.protocols}` : '',
      accessibilityAndLanguage: aiAnalysis.accessibilityAndLanguage ? 
        `Jargon: ${aiAnalysis.accessibilityAndLanguage.jargon} | Clarifications: ${aiAnalysis.accessibilityAndLanguage.clarifications}` : '',
      redFlags: aiAnalysis.redFlags ? aiAnalysis.redFlags.map(flag => `${flag.title}: ${flag.explanation}`) : [],
      actionableQuestions: aiAnalysis.actionableQuestions || [],
      additionalConsiderations: aiAnalysis.additionalConsiderations ? 
        aiAnalysis.additionalConsiderations.map(consideration => `${consideration.title}: ${consideration.explanation}`) : [],
      disclaimer: aiAnalysis.disclaimer || ''
    };

    // Save to MongoDB
    const savedFile = await File.create(fileData);
    console.log(`✅ [MONGO] File saved to MongoDB with ID: ${savedFile._id}`);

    // Step 8: Prepare and return comprehensive response
    console.log('\n📊 [MAIN] Step 8: Preparing response...');
    const processingTime = Date.now() - startTime;

    const response = {
      success: true,
      processingTime: `${processingTime}ms`,
      userId: userId,
      documentId: documentId,
      fileInfo: {
        originalName: req.file.originalname,
        fileName: originalUploadResult.fileName,
        fileUrl: originalUploadResult.signedUrl,
        mimeType: originalUploadResult.mimeType,
        size: req.file.size
      },
      documentProcessing: {
        extractedTextLength: documentResult.extractedText.length,
        pageCount: documentResult.pages.length,
        entityCount: documentResult.entities.length,
        combinedTextLength: combinedTextContent.length
      },
      vectorStorage: {
        documentsStored: vectorStoreResult.documentsStored,
        userId: vectorStoreResult.userId,
        documentId: vectorStoreResult.documentId
      },
      mongoDB: {
        fileId: savedFile._id,
        uploadedBy: savedFile.uploadedBy,
        savedAt: savedFile.createdAt
      },
      legalAnalysis: aiAnalysis,
      timestamp: new Date().toISOString()
    };

    console.log(`✅ [MAIN] Response prepared successfully`);
    console.log(`📊 [MAIN] Total processing time: ${processingTime}ms`);
    console.log(`🔐 [MAIN] User data isolated with ID: ${userId}`);
    console.log(`📄 [MAIN] Document stored with ID: ${documentId}`);
    console.log(`💾 [MAIN] MongoDB file saved with ID: ${savedFile._id}`);

    res.status(200).json(response);

  } catch (error) {
    const processingTime = Date.now() - startTime;
    console.error('\n💥 ====== ERROR OCCURRED ======');
    console.error(`❌ [ERROR] Processing failed after ${processingTime}ms`);
    console.error(`❌ [ERROR] Error type: ${error.constructor.name}`);
    console.error(`❌ [ERROR] Error message: ${error.message}`);
    console.error(`❌ [ERROR] Stack trace: ${error.stack}`);

    // Return appropriate error response
    let statusCode = 500;
    let errorMessage = 'Internal server error during document processing';
    let errorCategory = 'UNKNOWN';

    if (error.message.includes('No file')) {
      statusCode = 400;
      errorMessage = error.message;
      errorCategory = 'FILE_VALIDATION';
    } else if (error.message.includes('Document AI') || error.message.includes('processDocument')) {
      statusCode = 502;
      errorMessage = 'Error processing document with AI service';
      errorCategory = 'DOCUMENT_AI';
    } else if (error.message.includes('Gemini') || error.message.includes('generateContent')) {
      statusCode = 502;
      errorMessage = 'Error analyzing document with AI service';
      errorCategory = 'GEMINI_AI';
    } else if (error.message.includes('GCS') || error.message.includes('storage')) {
      statusCode = 502;
      errorMessage = 'Error uploading file to cloud storage';
      errorCategory = 'CLOUD_STORAGE';
    } else if (error.message.includes('Vector') || error.message.includes('Qdrant')) {
      statusCode = 502;
      errorMessage = 'Error storing data in vector database';
      errorCategory = 'VECTOR_STORAGE';
    }

    res.status(statusCode).json({
      success: false,
      error: errorMessage,
      errorCategory: errorCategory,
      processingTime: `${processingTime}ms`,
      timestamp: new Date().toISOString(),
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get user's uploaded files
export const getUserFiles = async (req, res) => {
  try {
    // Get user ID from authenticated request (set by middleware)
    const userId = req.user?.id;

    if (!userId) {
      return res.status(400).json({
        error: 'User ID is required'
      });
    }

    // Find user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    // Get all files uploaded by this user
    const files = await File.find({ uploadedBy: user._id })
      .sort({ createdAt: -1 })
      .select('-__v');

    res.status(200).json({
      success: true,
      userId: user._id,
      email: user.email,
      totalFiles: files.length,
      files: files,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fetching user files:', error);
    res.status(500).json({
      success: false,
      error: 'Error fetching user files',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get specific file by ID
export const getFileById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        error: 'Authentication required'
      });
    }

    // Find the file and ensure it belongs to the authenticated user
    const file = await File.findOne({
      _id: id,
      uploadedBy: userId
    }).select('-__v');

    if (!file) {
      return res.status(404).json({
        error: 'File not found or access denied'
      });
    }

    res.status(200).json({
      success: true,
      file: file,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fetching file:', error);
    res.status(500).json({
      success: false,
      error: 'Error fetching file',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export default {
  processLegalDocument,
  ragChatWithPDF,
  getUserFiles,
  getFileById
};