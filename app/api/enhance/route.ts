export const runtime = "nodejs";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
// import * as pdfParse from "pdf-parse";
// const pdf = (pdfParse as any).default || pdfParse;


// Increase max duration for Vercel/Next.js edge and serverless
export const maxDuration = 60;

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    let text = formData.get("text") as string | null;

    if (!file && (!text || text.trim() === "")) {
      return NextResponse.json({ error: "Please provide either a PDF file or paste your resume text." }, { status: 400 });
    }

    if (file) {
      if (file.type !== "application/pdf") {
        return NextResponse.json({ error: "Only PDF files are supported." }, { status: 400 });
      }
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const pdf = (await import("pdf-parse")).default;
      const pdfData = await pdf(buffer);
      text = pdfData.text;
    }

    if (!text || text.trim() === "") {
      return NextResponse.json({ error: "Could not extract text from the file or received empty input." }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash", generationConfig: { responseMimeType: "application/json" } });

    const prompt = `You are an expert ATS optimizer and executive resume writer. Review the following resume text and deeply analyze it.
Evaluate an overall ATS-compatibility score for the entire resume out of 100.
For each distinct resume section (Header, Summary, Experience, Projects, Skills, Education), rewrite the content into an optimal, ATS-friendly, recruiter-ready version.

STRICT ENHANCEMENT RULES FOR THE "enhanced" FIELD:
1. REMOVE ALL NON-RESUME CONTENT: Remove sections like "FORMATTING AND LAYOUT". Remove all feedback, explanations, or instructions from the enhanced text. Remove placeholders inside brackets like [Your LinkedIn URL] or [Dates].
2. FIX FORMATTING ISSUES: Remove all markdown artifacts like *, **, etc. Do NOT use bullets for headings or section titles.
3. CLEAN STRUCTURE:
  - Header: Name at top (larger font implied), one-line contact info below name.
  - Proper spacing between lines and consistent alignment.
4. BULLET RULES: Use bullets (•) ONLY for experience points, project descriptions, and achievements. Do NOT use bullets for section titles, company names, or education titles.
5. PROJECT FORMAT (CRITICAL):
  Project Name | Tech Stack
  • Strong action-based bullet point
  • Quantified impact if possible
6. EXPERIENCE FORMAT (CRITICAL):
  Role | Organization
  Duration
  • Bullet points
7. LENGTH: STRICTLY fit constraints. Keep summary max 2–3 lines. Limit to top 2–3 projects. Keep concise but impactful.
8. STYLE: Professional, clean, recruiter-ready. No extra symbols or clutter. 
9. OUTPUT: The "enhanced" field MUST return ONLY the CLEAN RESUME TEXT for that section. Absolutely no explanations, introductory phrases, or meta-commentary.

Return ONLY a valid JSON object matching the exact following structure:
{
  "atsScore": Number (0-100),
  "sections": [
    {
      "category": "String (e.g. HEADER, SUMMARY, EXPERIENCE, PROJECTS, SKILLS, EDUCATION)",
      "original": "String (The exact text from the original resume for this section)",
      "enhanced": "String (The final clean, formatted resume content for this section following the strict rules. DO NOT wrap with markdown blocks.)",
      "good": "String (What is currently good about this section)",
      "improvements": ["String", "String"]
    }
  ]
}

Resume Text:
${text}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();

    let aiResponse;
    try {
      aiResponse = JSON.parse(responseText);
    } catch (parseError) {
      // Attempt to clean the response if Gemini added code blocks
      const cleaned = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
      aiResponse = JSON.parse(cleaned);
    }

    return NextResponse.json({ result: aiResponse });

  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json({ error: error.message || "An error occurred while analyzing the resume." }, { status: 500 });
  }
}
