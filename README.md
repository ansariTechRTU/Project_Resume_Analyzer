

**administrator:** `Abdullah_Ansari`  
---

##  VERY IMPORTANT RULES (FOR TEAM INTEGRATION)

> While editing or integrating frontend with backend:

-  **Do NOT change** the logic of the backend.  
-  **If removing any code**, comment it out and clearly mention the reason.  
-  **If replacing code snippets**, leave the original commented with the reason for replacement.  


---

##  HOW IT WORKS

| Step | Description |
|------|--------------|
| **1. File Upload** | Handled via **Multer** |
| **2. Text Extraction** | Converts PDF / DOCX → Plain text |
| **3. Skill Extraction** | Filters extracted text using a verified skill list |
| **4. Matching** | Compares Resume vs Job Description via **Fuse.js** fuzzy matching |
| **5. Scoring** | Calculates `(Matched JD Skills / Total JD Skills) × 100` |
| **6. Storage** | Saves analysis results in **MongoDB Atlas** |

---

##  PROJECT STRUCTURE

```text
backend/
│
├── server.js                 # Entry point
├── .env                      # Environment variables
├── package.json
│
├── src/
│   ├── config/
│   │   └── index.js
│   │
│   ├── controllers/
│   │   └── analyzeController.js   # Handles POST /api/analyze
│   │
│   ├── routes/
│   │   └── analyze.js             # Express routes
│   │
│   ├── models/
│   │   └── Analysis.js            # Mongo schema for results
│   │
│   ├── services/
│   │   ├── parserService.js       # Extracts text from PDF/DOCX/TXT
│   │   └── analysisService.js     # Skill extraction + match logic
│   │
│   └── utils/
│       └── sanitize.js            # Text cleaning utilities
│
└── uploads/                       # Temporary uploaded files

```
*Public folder is dummy frontend which i made to test  backend.

---

##  TECHNOLOGIES USED

| Category | Libraries / Tools |
|-----------|-------------------|
| **Core** | Node.js, Express.js |
| **Database** | MongoDB Atlas, Mongoose |
| **File Handling** | Multer |
| **Matching Logic** | Fuse.js |
| **Text Extraction** | pdf-parse, mammoth |
| **Security / Config** | dotenv, helmet, cors, morgan |

---

##  SETUP & RUN INSTRUCTIONS

### 1️ Setup MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) → **Try Free** or **Sign In**
2. Click **Build a Database** → choose **Free Shared Cluster (M0)**  
   - Cloud Provider: AWS / Azure / GCP  
   - Region: nearest to you  
   - Click **Create Deployment**
3. Go to **Database Access** → Add New Database User  
   - Username: `admin`  
   - Password: `Admin123`  
   - Role: Read & Write to any database  
4. Go to **Network Access** → Add IP Address → select **Allow Access from Anywhere (0.0.0.0/0)**
5. Go to **Clusters → Connect → Connect your application**  
   - Driver: Node.js (v4.0 or later)  
   - Copy your connection string

---

### 2️ Configure Environment File

Create a `.env` file in the root folder:

PORT=5000
MONGO_URI=your_mongodb_connection_link_here


---

### 3️ Install Dependencies

Run these commands inside your **backend** folder:

```bash
npm install
npm install express mongoose multer helmet cors morgan dotenv fuse.js pdf-parse mammoth
```

Then:

npm run dev

Server will start at:
http://localhost:5000



