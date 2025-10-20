# Resume/CV Analyzer

A web application that helps job seekers optimize their resumes by matching them against job descriptions and providing AI-powered improvement suggestions.

## Project Overview

This is a group project where we are building an application named Resume Analyzer. It analyzes resumes/CVs against job descriptions to identify:
- Skills match percentage
- Matched skills present in both resume and job description
- Missing skills that should be added or highlighted
- AI-powered suggestions for improvement

## Team Roles

- **Student A (Frontend Layout)** - `feature/frontend-layout` branch
  - Landing page design with upload functionality
  - Results page layout with score visualization
  - Responsive design and styling
  - Dummy data integration for testing

- **Student B (Backend Logic)** - TBD
  - API endpoints for file processing
  - Resume and job description parsing
  - AI/ML analysis logic
  - Database integration

## Current Status

### ✅ Completed - Frontend Layout
- Landing page with drag-and-drop file upload
- Results page with animated score and analysis
- Responsive design for mobile and desktop
- Complete styling with animations and UX enhancements
- Dummy data JSON for testing
- Integration documentation for backend team

## Quick Start

1. **View Frontend:**
   ```bash
   # Start local server
   python3 -m http.server 8000

   # Open in browser
   open http://localhost:8000/index.html
   ```

2. **Project Structure:**
   ```
   Project_Resume_Analyzer/
   ├── index.html              # Landing page
   ├── results.html            # Results page
   ├── styles.css              # Styles and animations
   ├── app.js                  # Landing page logic
   ├── results.js              # Results page logic
   ├── dummy-data.json         # Sample data for testing
   ├── FRONTEND_README.md      # Detailed frontend docs
   └── README.md               # This file
   ```

3. **Testing:**
   - Upload any PDF/DOCX files on the landing page
   - Click "Analyze Resume Match" to see the results page
   - All data is currently dummy data for frontend testing

## Features

### Landing Page
- Professional header with branding
- Dual file upload system (resume + job description)
- Alternative paste option for job descriptions
- Drag-and-drop support
- File validation (type & size)
- Step-by-step progress indicators
- Tutorial section

### Results Page
- Animated circular match score
- Color-coded skill analysis (matched vs missing)
- AI-powered improvement suggestions
- Download report option (placeholder)
- Responsive layout

## Tech Stack

**Frontend:**
- HTML5
- CSS3 with Tailwind CSS (CDN)
- Vanilla JavaScript
- Google Fonts (Inter)

**Backend (To be implemented):**
- TBD by Student B

## Documentation

See [FRONTEND_README.md](./FRONTEND_README.md) for detailed frontend documentation including:
- Design system
- Integration guide for backend
- API endpoints specification
- Component documentation

## Contributing

Each team member works on their assigned branch:
- `feature/frontend-layout` - Student A
- `feature/backend-logic` - Student B (TBD)

## License

This project is created for educational purposes.
