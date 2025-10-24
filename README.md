Administrator- Abdullah_Ansari
--------------------------------------
VERY IMPORTANT RULES
For integration, while editing any part of this backend program:
-DON'T CHANGE THE LOGIC OF backend (only try to edit snippets which are required for integration)
-DON'T DELETE ANY CODE SNIPPET (YOU CAN COMMENT THAT PART IF HINDERING OR IN CASE OF NO-USE)
-IF REPLACING ANY CODE SNIPPET (MAKE SURE TO COMMENT OUT THE REASON)



------------------------------------------------------------------
HOW IT WORKS

File Upload: handled via Multer
Text Extraction: PDF/DOCX → plain text
Skill Extraction: filters text against a large verified skill list
Matching: compares resume vs JD using fuzzy matching (Fuse.js)
Score: (matched / total JD skills) × 100
Storage: analysis saved in MongoDB for reuse
-------------------------------------------------------------------


STRUCTURE

backend/
│
├── server.js                    # Entry point
├── .env                         # Environment variable template
├── package.json
│
├── src/
|   ├── config/
|   |   └── index.js
|   |
│   ├── controllers/
│   │   └── analyzeController.js # Handles POST /api/analyze logic
│   │
│   ├── routes/
│   │   └── analyze.js           # Express router definitions
│   │
│   ├── models/
│   │   └── Analysis.js          # Mongo schema for results
│   │
│   ├── services/
│   │   ├── parserService.js     # Extracts text from PDF/DOCX/TXT
│   │   └── analysisService.js   # Skill extraction + match logic
│   │
│   ├── utils/
│      └── sanitize.js          # Text cleaning utilities
│   
│   
│       
│
└── uploads/                     # Temp folder for uploaded files


---------------------------------------------------------------------------------------------------------------------------------

TECH USED

Node.js + Express.js
MongoDB + Mongoose
Multer – File uploads
Fuse.js – Fuzzy skill matching
dotenv, helmet, cors, morgan – Config & security
pdf-parse, mammoth – Extract text from files


----------------------------------------------------------------------------------------------------------------------------------

HOW TO RUN


Setup MongoDB ATLAS account and get your link :

1️- Go to MongoDB Atlas
https://www.mongodb.com/cloud/atlas
Click “Try Free” or Sign In.

2️- Create a Free Cluster

Click “Build a Database”
Choose Free Shared Cluster (M0)Cloud Provider: AWS / Azure / Google Cloud
Region: pick one near you (e.g., Frankfurt, Mumbai, etc.)
Click “Create Deployment”

3️- Create a Database User
Go to Database Access → Add New Database User
Username: e.g., admin
Password: e.g., Admin123
Role: keep as Read and Write to any database
Click “Add User”

4️- Allow Network Access

Go to Network Access → Add IP Address
Choose Allow Access from Anywhere (0.0.0.0/0)
(or restrict to your IP for security)


5️- Get Your Connection String

Go to Clusters → Connect → Connect your application
Choose:
Driver: Node.js
Version: 4.0 or later
Copy the connection string


-Then Edit .env file by putting your link to Mongodb

-Then Install All Dependencies
Run this single command in your backend folder 👇 via terminal or git bash
-npm install
-npm install express mongoose multer helmet cors morgan dotenv fuse.js pdf-parse mammoth

Then for running - npm run dev (Note: if terminal ask to install other dependancies : please install it : may be i forget some as it was alot.)

Backend will run on http://localhost:5000

---------------------------------------------------------------------------------------------------------------------------------