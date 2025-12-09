const { readFileSync } = require("fs");
const mammoth = require("mammoth");
const OpenAI = require("openai");

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// =============================
//     FILE READING
// =============================
async function readPDF(filePath) {
  try {
    // Try pdfjs-dist first (most reliable)
    const pdfjsLib = require("pdfjs-dist/legacy/build/pdf.js");
    const dataBuffer = readFileSync(filePath);
    
    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(dataBuffer),
      standardFontDataUrl: null,
      useSystemFonts: true,
    });
    
    const pdfDocument = await loadingTask.promise;
    let fullText = "";
    
    for (let pageNum = 1; pageNum <= pdfDocument.numPages; pageNum++) {
      const page = await pdfDocument.getPage(pageNum);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item) => item.str).join(" ");
      fullText += pageText + "\n";
    }
    
    return fullText;
  } catch (error) {
    console.error("PDF Parse Error:", error.message);
    console.log("⚠️  Trying alternative PDF extraction method...");
    
    try {
      // Use pdf-parse as fallback
      const pdfParse = require("pdf-parse");
      const dataBuffer = readFileSync(filePath);
      const data = await pdfParse(dataBuffer, {
        max: 50, // Limit to first 50 pages
      });
      return data.text;
    } catch (fallbackError) {
      console.error("Fallback PDF Parse Error:", fallbackError.message);
      throw new Error(`Unable to read PDF file. Please try converting to DOCX format.`);
    }
  }
}

async function readDOCX(filePath) {
  try {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  } catch (error) {
    console.error("DOCX Parse Error:", error.message);
    throw new Error(`Failed to read DOCX: ${error.message}`);
  }
}

async function readFile(filePath, mimeType) {
  console.log(`📄 Reading file: ${filePath}, Type: ${mimeType}`);
  
  if (mimeType === "application/pdf") {
    return await readPDF(filePath);
  }
  
  if (
    mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    mimeType === "application/msword"
  ) {
    return await readDOCX(filePath);
  }
  
  if (mimeType === "text/plain") {
    return readFileSync(filePath, "utf-8");
  }

  throw new Error(`Unsupported file type: ${mimeType}. Use PDF, DOCX, or TXT.`);
}

// =============================
//      CLEAN TEXT
// =============================
function clean(text) {
  return text.replace(/\s+/g, " ").trim();
}

// =============================
//   COMPREHENSIVE ANALYSIS (Single AI Call)
// =============================
async function analyzeCVvsJob(cvPath, jobPath, cvMime, jobMime) {
  try {
    console.log("🔍 Starting file analysis...");
    console.log(`   CV: ${cvPath} (${cvMime})`);
    console.log(`   Job: ${jobPath} (${jobMime})`);

    const [cvRaw, jobRaw] = await Promise.all([
      readFile(cvPath, cvMime),
      readFile(jobPath, jobMime),
    ]);

    const cvText = clean(cvRaw);
    const jobText = clean(jobRaw);

    // Limit text length to prevent token overflow (approx 4 chars = 1 token)
    const maxChars = 15000; // ~3750 tokens per document
    const cvTextLimited = cvText.length > maxChars 
      ? cvText.substring(0, maxChars) + "..." 
      : cvText;
    const jobTextLimited = jobText.length > maxChars 
      ? jobText.substring(0, maxChars) + "..." 
      : jobText;

    console.log(`✅ Files read successfully`);
    console.log(`   CV length: ${cvText.length} chars (using ${cvTextLimited.length})`);
    console.log(`   Job length: ${jobText.length} chars (using ${jobTextLimited.length})`);

    if (cvTextLimited.length < 30 || jobTextLimited.length < 30) {
      throw new Error("One of the files seems empty or too short.");
    }

    console.log("🤖 Starting comprehensive AI analysis...");

    // Single comprehensive AI call for all analysis
    const prompt = `You are an expert ATS (Applicant Tracking System) and career coach. Analyze the following resume against the job description.

**RESUME:**
${cvTextLimited}

**JOB DESCRIPTION:**
${jobTextLimited}


**IMPORTANT:**
- Be thorough in skill extraction (technical skills, soft skills, tools, frameworks, methodologies)
- Match skills intelligently (e.g., "React.js" matches "React", "JavaScript" covers "JS")
- Score should reflect overall fit, not just skill count
- Suggestions should be SPECIFIC to this resume and job, not generic advice

**OUTPUT FORMAT (JSON only, no markdown):**
{
  "matchedSkills": ["skill1", "skill2", ...],
  "missingSkills": ["skill3", "skill4", ...],
  "score": 75,
  "suggestions": [
    "Specific suggestion 1 with actionable steps",
    "Specific suggestion 2 based on analysis",
    ...
  ]
}`;

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are an expert ATS system and career coach. Always respond with valid JSON only, no markdown formatting.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.3,
      response_format: { type: "json_object" },
    });

    const rawContent = response.choices[0].message.content.trim();
    console.log("📊 AI Response received");

    // Parse AI response
    let analysis;
    try {
      analysis = JSON.parse(rawContent);
    } catch (parseError) {
      console.error("Failed to parse AI response:", rawContent);
      throw new Error("AI response format error");
    }

    // Validate and sanitize response
    const matchedSkills = Array.isArray(analysis.matchedSkills)
      ? analysis.matchedSkills.filter((s) => s && s.trim())
      : [];
    const missingSkills = Array.isArray(analysis.missingSkills)
      ? analysis.missingSkills.filter((s) => s && s.trim())
      : [];
    const score = Math.min(
      100,
      Math.max(0, parseInt(analysis.score) || 0)
    );
    const suggestions = Array.isArray(analysis.suggestions)
      ? analysis.suggestions.filter((s) => s && s.trim()).slice(0, 10)
      : [
          "Update your resume to better highlight relevant experience",
          "Add quantifiable achievements with specific metrics",
          "Tailor your skills section to match job requirements",
        ];

    console.log("✅ Analysis complete:", {
      score,
      matched: matchedSkills.length,
      missing: missingSkills.length,
      suggestions: suggestions.length,
    });

    return {
      success: true,
      score,
      matchedSkills,
      missingSkills,
      suggestions,
      totalJobSkills: matchedSkills.length + missingSkills.length,
      totalCvSkills: matchedSkills.length,
    };
  } catch (err) {
    console.error("❌ Analysis error:", err);
    return {
      success: false,
      error: err.message || "Analysis failed",
      score: 0,
      matchedSkills: [],
      missingSkills: [],
      suggestions: [err.message || "Error occurred during analysis. Please try again."],
    };
  }
}

module.exports = { analyzeCVvsJob };