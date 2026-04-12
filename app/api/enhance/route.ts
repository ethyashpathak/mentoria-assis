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

    const prompt = `You are an expert ATS and resume reviewer. Review the following resume text and provide actionable feedback.
For each section (Summary, Experience, Skills, Education, Formatting, etc.), you must rewrite the section to be better, while explaining what is good and what can be improved.
Evaluate an overall ATS-compatibility score for the entire resume out of 100.

Return ONLY a valid JSON object matching the exact following structure:
{
  "atsScore": Number (0-100),
  "sections": [
    {
      "category": "String (e.g. Summary, Experience, etc.)",
      "original": "String (The exact or summarized text from the original resume for this section)",
      "enhanced": "String (Your completely rewritten, optimized, and ATS-friendly version of this section)",
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
