import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export const maxDuration = 60;

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const LATEX_PROMPT = String.raw`I have a LaTeX resume template. I want to generate a COMPLETE, CLEAN, PRODUCTION-READY LaTeX (.tex) file by injecting user resume data into this template.

GOAL:
Return a fully filled LaTeX file that can be directly pasted into Overleaf and compiled WITHOUT any errors.

STRICT REQUIREMENTS:

1. OUTPUT FORMAT:
- Return ONLY raw LaTeX code
- Do NOT add explanations, comments, markdown, or text outside LaTeX
- Output must start with \documentclass and end with \end{document}

2. CLEAN DATA INSERTION:
- Replace all placeholder content (like "Random Person", fake emails, dummy data)
- Insert real user data into: Name, Contact info, Summary, Education, Experience, Projects, Skills, Achievements

3. REMOVE ALL TEMPLATE NOISE:
- Remove instructions like "Make Sure to add terms...", "Add all kind of achievements...", "Clickable links..."
- Remove ALL dummy/example content

4. PROFESSIONAL FORMATTING:
- Keep the LaTeX structure intact
- Ensure consistent spacing and indentation
- Use proper bullet points via \resumeItem
- Ensure sections are clean and minimal

5. PROJECT SECTION (IMPORTANT):
- Limit to top 2–3 projects
- Format: Project Name | Tech Stack
  • Strong action-based bullet points
  • Include quantified impact

6. EXPERIENCE SECTION:
- Format properly using \resumeSubheading
- Include role, organization, and duration
- Use strong action verbs

7. ATS-FRIENDLY:
- Keep content concise
- Ensure resume fits within ONE PAGE when compiled
- Avoid unnecessary text or repetition

8. LINKS:
- Replace placeholders with real links if available
- Otherwise REMOVE them completely (no fake links)

9. LATEX SAFETY:
- Escape special characters properly: % -> \%, & -> \&, _ -> \_
- Ensure no compilation errors

10. FINAL QUALITY:
- The output should look like a professional software engineer resume
- Clean, minimal, recruiter-ready

LATEX TEMPLATE TO USE:

%-------------------------
% Resume in Latex
% Author : Jake Gutierrez
% Based off of: https://github.com/sb2nov/resume
% License : MIT
%------------------------

\documentclass[letterpaper,11pt]{article}

\usepackage{latexsym}
\usepackage[empty]{fullpage}
\usepackage{titlesec}
\usepackage{marvosym}
\usepackage[usenames,dvipsnames]{color}
\usepackage{verbatim}
\usepackage{enumitem}
\usepackage[hidelinks]{hyperref}
\usepackage{fancyhdr}
\usepackage[english]{babel}
\usepackage{tabularx}
\usepackage{fontawesome5}
\usepackage{multicol}
\setlength{\multicolsep}{-3.0pt}
\setlength{\columnsep}{-1pt}
\input{glyphtounicode}

\pagestyle{fancy}
\fancyhf{} % clear all header and footer fields
\fancyfoot{}
\renewcommand{\headrulewidth}{0pt}
\renewcommand{\footrulewidth}{0pt}

% Adjust margins
\addtolength{\oddsidemargin}{-0.6in}
\addtolength{\evensidemargin}{-0.5in}
\addtolength{\textwidth}{1.19in}
\addtolength{\topmargin}{-.7in}
\addtolength{\textheight}{1.4in}

\urlstyle{same}

\raggedbottom
\raggedright
\setlength{\tabcolsep}{0in}

% Sections formatting
\titleformat{\section}{
  \vspace{-4pt}\scshape\raggedright\large\bfseries
}{}{0em}{}[\color{black}\titlerule \vspace{-5pt}]

% Ensure that generate pdf is machine readable/ATS parsable
\pdfgentounicode=1

%-------------------------
% Custom commands
\newcommand{\resumeItem}[1]{
  \item\small{
	{#1 \vspace{-2pt}}
  }
}

\newcommand{\classesList}[4]{
	\item\small{
    	{#1 #2 #3 #4 \vspace{-2pt}}
  }
}

\newcommand{\resumeSubheading}[4]{
  \vspace{-2pt}\item
	\begin{tabular*}{1.0\textwidth}[t]{l@{\extracolsep{\fill}}r}
  	\textbf{#1} & \textbf{\small #2} \\
  	\textit{\small#3} & \textit{\small #4} \\
	\end{tabular*}\vspace{-7pt}
}

\newcommand{\resumeSubSubheading}[2]{
	\item
	\begin{tabular*}{0.97\textwidth}{l@{\extracolsep{\fill}}r}
  	\textit{\small#1} & \textit{\small #2} \\
	\end{tabular*}\vspace{-7pt}
}

\newcommand{\resumeProjectHeading}[2]{
	\item
	\begin{tabular*}{1.001\textwidth}{l@{\extracolsep{\fill}}r}
  	\small#1 & \textbf{\small #4}\\
	\end{tabular*}\vspace{-7pt}
}

\newcommand{\resumeSubItem}[1]{\resumeItem{#1}\vspace{-4pt}}

\renewcommand\labelitemi{$\vcenter{\hbox{\tiny$\bullet$}}$}
\renewcommand\labelitemii{$\vcenter{\hbox{\tiny$\bullet$}}$}

\newcommand{\resumeSubHeadingListStart}{\begin{itemize}[leftmargin=0.0in, label={}]}
\newcommand{\resumeSubHeadingListEnd}{\end{itemize}}
\newcommand{\resumeItemListStart}{\begin{itemize}}
\newcommand{\resumeItemListEnd}{\end{itemize}\vspace{-5pt}}

%-------------------------------------------
%%%%%%  RESUME STARTS HERE  %%%%%%%%%%%%%%%%%%%%%%%%%%%%

\begin{document}

\begin{center}
	{\Huge \scshape Random Person} \\ \vspace{1pt}
	Kolkata, West Bengal \\ \vspace{1pt}
	\small \raisebox{-0.1\height}\faPhone\ +91 xxxxxxxxx ~ \href{mailto:x@gmail.com}{\raisebox{-0.2\height}\faEnvelope\  \underline{takeuforward111@gmail.com}} ~
	\href{https://linkedin.com/in//}{\raisebox{-0.2\height}\faLinkedin\ \underline{linkedin.com/in/rvprvp}}
	\vspace{-8pt}
\end{center}

%-----------EDUCATION-----------
\section{Education}
  \resumeSubHeadingListStart
	\resumeSubheading
  	{ABC Engineering College}{August 2016 - June 2020}
  	{Bachelor of Technology in Information Technology(DGPA of 8.07)}{West Bengal, India}
  \resumeSubHeadingListEnd

%-----------EXPERIENCE-----------
\section{Experience}
  \resumeSubHeadingListStart
	\resumeSubheading
  	{Amazon [Make Sure to add terms like 15 as numbers more] }{Feb 2020 -- June 2020}
  	{Software Development Engineer Intern}{Hyderabad, India}
  	\resumeItemListStart
    	\resumeItem{Created a backend + frontend internal tool to see all the statistics related to the Seller with edit functionality, this allowed us to track who made the changes and when. Adding this feature saved the manual hovering time of the SDE's over DB to find these things. On every task related to this, the SDE was saving on an average \textbf{15 minutes}. }
    	\resumeItem{Wrote multiple API's for the team which returned the extracted data from DynamoDB by doing some computations on the basis of business requirement. These API's made the system more feature rich.}
	\resumeItemListEnd
    
  \resumeSubHeadingListEnd
\vspace{-16pt}

%-----------PROJECTS-----------
\section{Projects [Clickable links and as short and crisp as possible, at max 2/3 projects]}
	\vspace{-5pt}
	\resumeSubHeadingListStart
	\resumeProjectHeading
      	{\textbf{Adography} $|$ \emph{Java Spring Boot, React Js, MySQL} $|$ {Clickable Link}}{January 2019}
      	\resumeItemListStart
        	\resumeItem{An interface which will given an option to search on the basis of fullName of regex in Ad, AdGroup and Campaign}
        	\resumeItem{The search option allows the user to see all the matching results related to Ad, AdGroup and Campaign in a paginated way. On selection of any Ad, AdGroup, Campaign, the user is able to see further details.}
      	\resumeItemListEnd
	\vspace{-13pt}
  	\resumeProjectHeading
      	{\textbf{Camping Website} $|$ \emph{NodeJS, MongoDB and Express}  $|$ {Clickable Link}}{January 2019}
      	\resumeItemListStart
        	\resumeItem{An user interactive website which describes different campgrounds from different places and an authorised user can add a campground, edit or delete it using NodeJS, mongoDB and Express for back-end and HTML and CSS for front-end}
      	\resumeItemListEnd
	\resumeSubHeadingListEnd
\vspace{-15pt}

%-----------Achievements-----------
\section{Achievements [Add all kind of achievements that shows your skills]}
 \begin{itemize}[leftmargin=0.15in, label={}]
	\resumeItemListStart
    	\resumeItem{Highest rating of \textbf{ xxxx} at Codeforces, which is the top site in terms of participation of programmers across globe.}
    	\resumeItem{Ranked under \textbf{xyz} at Codechef which ranks among the top sites for competitive programmers. Highest rating of 2299 and rated \textbf{6*}. }
    	\resumeItem{Qualified the prestigious ACM-ICPC regionals \textbf{thrice} and ranked Z in one of the attempts. }
    	\resumeItem{Secured all India rank of \textbf{r, s, t} respectively in Codechef's Long Challenge in the month of February, April and May xyzh among 12k+ participants.}
    	\resumeItem{Secured all India rank of \textbf{uh} in TCS codevita 2019.}
    	\resumeItem{Written over \textbf{0987643} articles at Geeksforgeeks, most of them being on Data Structure and Algorithms}
    	\resumeItem{Solved more than 2000+ problems across platforms.}
    	\resumeItem{Awarded with Geek of the year accolade from GeeksforGeeks for contribution to the community. \href{https://www.geeksforgeeks.org/geek-of-the-year/}{(Link)} }
  	\resumeItemListEnd
 \end{itemize}
 \vspace{-16pt}
 
%-----------Profile Links-----------
\section{Profile Links}
 \begin{itemize}[leftmargin=0.15in, label={}]
	\resumeItemListStart
    	\resumeItem {\href{https://www.codechef.com/users/striver_79/}{Codechef}}
    	\resumeItem {\href{https://codeforces.com/profile/striver_79}{Codeforces}}
    	\resumeItem {\href{https://leetcode.com/striver_79/}{Leetcode}}
    	\resumeItem {\href{https://auth.geeksforgeeks.org/user/Striver/articles}{GeeksforGeeks}}
  	\resumeItemListEnd
 \end{itemize}
 \vspace{-16pt}

%-----------PROGRAMMING SKILLS-----------
\section{Technical Skills [Don't overflood here]}
 \begin{itemize}[leftmargin=0.15in, label={}]
	\small{\item{
 	\textbf{Languages}{: C++, Python, Java, HTML/CSS, JavaScript, SQL} \\
 	\textbf{Technologies/Frameworks/Libraries}{: Spring, Junit, ReactJS} \\
	}}
 \end{itemize}
 \vspace{-16pt}

\end{document}
`;

export async function POST(req: Request) {
	try {
		const { sections } = await req.json();

		if (!sections || !Array.isArray(sections)) {
			return NextResponse.json({ error: "Invalid parsed resume payload format." }, { status: 400 });
		}

		const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite", generationConfig: { responseMimeType: "text/plain" } });

		// Stringify the passed JSON payload explicitly for Gemini context
		const inputJsonData = JSON.stringify(sections, null, 2);

		const FINAL_PROMPT = LATEX_PROMPT + "\n\nINPUT JSON DATA:\n" + inputJsonData;

		const result = await model.generateContent(FINAL_PROMPT);
		const response = await result.response;
		let latextText = response.text();

		// Aggressive cleanup matching explicit requirements to remove markdown artifacts generated by Gemini
		latextText = latextText.replace(/```latex/g, "").replace(/```tex/g, "").replace(/```/g, "").trim();

		return new Response(latextText, {
			headers: {
				"Content-Type": "application/x-tex",
				"Content-Disposition": 'attachment; filename="Mentoria_Optimized_Resume.tex"'
			}
		});

	} catch (error: any) {
		console.error("LaTeX API Error:", error);
		return NextResponse.json({ error: error.message || "Failed to generate LaTeX template via AI." }, { status: 500 });
	}
}
