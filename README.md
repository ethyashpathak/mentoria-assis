# Mentoria Assignment: Resume Enhancer

A high-performance, intelligent resume analysis and enhancement platform designed to optimize Applicant Tracking System (ATS) compatibility and improve professional presentation.

## Overview

Mentoria Assist streamlines the process of refining resumes by leveraging large language models to provide structural, grammatical, and impact-driven feedback. The application directly parses PDF documents, extracts text content, and returns a detailed, section-by-section breakdown that includes original excerpts alongside enhanced revisions.

## Technical Architecture

The platform is designed with a modern, serverless-ready stack emphasizing performance and fluid user experience.

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Document Processing:** pdf-parse, react-dropzone
- **AI Integration:** @google/generative-ai (Gemini 2.5 Flash)

## Key Features

- **Document Parsing Pipeline:** Native client-side drag-and-drop interface coupled with server-side PDF text extraction, fallback to manual text entry.
- **Dynamic ATS Scoring:** Evaluates the overall structure, language, and readability of the resume to generate a strict ATS compatibility percentage (0-100 scale) displayed via a dynamic SVG progression ring.
- **Micro-Targeted Refactoring:** Analyzes distinct resume sections (Summary, Experience, Skills, Education) and provides alternating UI panes to compare "Original" vs "Enhanced" formulations.
- **Premium Interface:** Built with a dark-mode first design philosophy utilizing glassmorphism, subtle neon gradients, and hardware-accelerated Framer Motion transitions.

## Getting Started

### Prerequisites

Ensure you have the following installed before proceeding:
- Node.js (v18 or higher)
- npm or pnpm
- Valid Google Gemini API Key

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ethyashpathak/mentoria-assis.git
   cd mentoria-assis
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Create a `.env` file in the root directory and append your API credentials.
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Initialize the development server:**
   ```bash
   npm run dev
   ```
   The application will be accessible at `http://localhost:3000`.

## Directory Structure

```text
mentoria-assis/
├── app/
│   ├── api/
│   │   └── enhance/
│   │       └── route.ts         # Secure serverless endpoint for AI parsing
│   ├── globals.css              # Global tokens and Tailwind imports
│   ├── layout.tsx               # Root DOM layout
│   └── page.tsx                 # Primary viewport and landing
├── components/
│   └── ResumeEnhancer.tsx       # Core interactive enhancement interface
├── public/                      # Static assets
└── next.config.ts               # Next.js compiler and experimental directives
```

## Acknowledgments

Built thoughtfully for high-end professional development.
Powered by Mentoria and Shaswat.
