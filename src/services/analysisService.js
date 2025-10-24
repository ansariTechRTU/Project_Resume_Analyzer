const Fuse = require('fuse.js');

/**
 * Universal skill list — real-world verified skills.
 * (You can later move this to a JSON or DB for scalability.)
 */
const SKILL_DICTIONARY = [
  // ===== PROGRAMMING LANGUAGES =====
  'python', 'java', 'javascript', 'typescript', 'c', 'c++', 'c#', 'r', 'ruby', 'php', 'perl',
  'swift', 'objective c', 'go', 'kotlin', 'scala', 'matlab', 'shell scripting', 'bash', 'powershell',
  'assembly', 'rust', 'dart', 'elixir', 'fortran', 'lua', 'vba', 'haskell',

  // ===== WEB & MOBILE DEVELOPMENT =====
  'html', 'css', 'sass', 'less', 'xml', 'json', 'react', 'react native', 'angular', 'vue',
  'next.js', 'nuxt.js', 'svelte', 'jquery', 'bootstrap', 'tailwind css', 'node.js', 'express',
  'django', 'flask', 'fastapi', 'laravel', 'spring boot', 'asp.net', 'dotnet core', 'wordpress',
  'drupal', 'magento', 'shopify', 'woocommerce', 'rest api', 'graphql', 'firebase', 'ionic', 'flutter',
  'android', 'ios', 'swiftui', 'xamarin', 'cordova',

  // ===== DATABASE & DATA ENGINEERING =====
  'sql', 'mysql', 'postgresql', 'oracle', 'mariadb', 'mssql', 'sqlite', 'mongodb', 'firebase firestore',
  'redis', 'cassandra', 'couchdb', 'dynamodb', 'elasticsearch', 'neo4j', 'data warehousing',
  'data modeling', 'etl', 'snowflake', 'bigquery', 'hive', 'hadoop', 'spark', 'pyspark', 'airflow',
  'kafka', 'redshift', 'ssrs', 'ssis', 'databricks',

  // ===== CLOUD & DEVOPS =====
  'aws', 'amazon web services', 'azure', 'microsoft azure', 'google cloud', 'gcp', 'digitalocean',
  'heroku', 'netlify', 'vercel', 'devops', 'ci cd', 'jenkins', 'github actions', 'gitlab ci',
  'terraform', 'ansible', 'chef', 'puppet', 'docker', 'kubernetes', 'openshift', 'linux', 'nginx',
  'apache', 'load balancing', 'networking', 'bash scripting', 'shell scripting', 'elastic beanstalk',

  // ===== DATA SCIENCE / MACHINE LEARNING =====
  'machine learning', 'deep learning', 'artificial intelligence', 'ai', 'data analysis', 'data visualization',
  'data mining', 'predictive modeling', 'neural networks', 'nlp', 'natural language processing',
  'computer vision', 'reinforcement learning', 'time series', 'recommendation systems', 'feature engineering',
  'model training', 'model evaluation', 'classification', 'regression', 'clustering', 'supervised learning',
  'unsupervised learning', 'pandas', 'numpy', 'scipy', 'scikit learn', 'tensorflow', 'keras', 'pytorch',
  'opencv', 'matplotlib', 'seaborn', 'plotly', 'statsmodels', 'anaconda', 'jupyter', 'google colab',

  // ===== ANALYTICS / BUSINESS INTELLIGENCE =====
  'excel', 'advanced excel', 'pivot tables', 'power bi', 'tableau', 'qlikview', 'qliksense',
  'looker', 'data studio', 'sas', 'r programming', 'statistics', 'hypothesis testing', 'data storytelling',
  'data reporting', 'business analysis', 'business analytics', 'market research', 'data-driven decision making',

  // ===== SOFTWARE ENGINEERING =====
  'software development', 'software design', 'system architecture', 'oop', 'object-oriented programming',
  'functional programming', 'agile', 'scrum', 'kanban', 'jira', 'git', 'github', 'gitlab', 'bitbucket',
  'version control', 'tdd', 'bdd', 'unit testing', 'integration testing', 'selenium', 'junit',
  'pytest', 'mocha', 'chai', 'jest', 'cypress', 'postman', 'swagger', 'uml', 'design patterns',
  'microservices', 'api development', 'api testing', 'api integration',

  // ===== UI/UX & DESIGN =====
  'ui design', 'ux design', 'product design', 'wireframing', 'prototyping', 'user research',
  'user testing', 'interaction design', 'information architecture', 'figma', 'adobe xd', 'sketch',
  'invision', 'photoshop', 'illustrator', 'canva', 'adobe after effects', 'adobe premiere', 'motion graphics',
  'branding', 'visual design', 'typography', 'color theory',

  // ===== ENGINEERING / ELECTRONICS =====
  'mechanical engineering', 'civil engineering', 'electrical engineering', 'electronics',
  'embedded systems', 'microcontrollers', 'arduino', 'raspberry pi', 'pcb design', 'matlab',
  'solidworks', 'autocad', 'catia', 'creo', 'ansys', 'fusion 360', 'simulink', 'mechanical design',
  'finite element analysis', 'structural analysis', 'manufacturing', 'cad', 'cam', 'robotics', 'control systems',

  // ===== BUSINESS, FINANCE & MANAGEMENT =====
  'finance', 'accounting', 'bookkeeping', 'taxation', 'financial analysis', 'budgeting',
  'forecasting', 'auditing', 'investment analysis', 'portfolio management', 'cost accounting',
  'risk management', 'ms office', 'ms word', 'ms powerpoint', 'microsoft teams', 'erp', 'sap',
  'sap hana', 'oracle financials', 'business intelligence', 'business strategy', 'supply chain management',
  'logistics', 'procurement', 'inventory management', 'operations management', 'crm', 'salesforce',
  'zoho crm', 'hubspot', 'marketing strategy', 'digital marketing', 'seo', 'sem', 'google ads', 'facebook ads',
  'content marketing', 'email marketing', 'social media marketing', 'analytics', 'branding', 'market analysis',

  // ===== HEALTHCARE, SCIENCE & EDUCATION =====
  'biology', 'chemistry', 'biotechnology', 'bioinformatics', 'clinical research', 'data entry',
  'pharmacology', 'nursing', 'patient care', 'medical terminology', 'public health', 'healthcare management',
  'nutrition', 'diet planning', 'laboratory analysis', 'microbiology', 'molecular biology', 'physics',
  'genetics', 'quality assurance', 'qa', 'gmp', 'iso standards',

  // ===== PROJECT MANAGEMENT =====
  'project planning', 'project execution', 'stakeholder management', 'risk assessment',
  'project coordination', 'ms project', 'asana', 'trello', 'monday.com', 'leadership', 'resource management',
  'change management', 'performance monitoring', 'strategic planning', 'pmo', 'reporting', 'agile methodology',

  // ===== SECURITY =====
  'cybersecurity', 'network security', 'penetration testing', 'ethical hacking', 'firewall management',
  'encryption', 'cryptography', 'security auditing', 'iso 27001', 'risk analysis', 'incident response',
  'identity management', 'access control', 'vulnerability assessment',

  // ===== SOFT SKILLS =====
  'communication', 'public speaking', 'presentation skills', 'leadership', 'teamwork', 'collaboration',
  'problem solving', 'critical thinking', 'creativity', 'innovation', 'adaptability', 'decision making',
  'emotional intelligence', 'conflict resolution', 'negotiation', 'organization', 'time management',
  'attention to detail', 'self motivation', 'resilience', 'multitasking', 'interpersonal skills',

  // ===== TOOLS & PLATFORMS =====
  'visual studio code', 'intellij', 'eclipse', 'pycharm', 'android studio', 'xcode', 'notion', 'jira',
  'slack', 'microsoft teams', 'zoom', 'google workspace', 'confluence', 'figma', 'postman', 'swagger ui',
  'notepad++', 'vscode', 'docker compose', 'virtualization', 'vmware', 'vagrant', 'git bash', 'terminal',

  // ===== LANGUAGES (OPTIONAL) =====
  'english', 'spanish', 'french', 'german', 'italian', 'portuguese', 'russian', 'arabic', 'hindi',
  'mandarin', 'japanese', 'korean', 'turkish', 'urdu'
];


/**
 * Clean text by removing emails, links, numbers, and non-letters
 */
function cleanText(text) {
  return text
    .toLowerCase()
    .replace(/[\d@#%*()_\-=/\\|[\]{}<>:,.;!?]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Extract skills from any text (JD or Resume)
 */
function extractSkills(text) {
  if (!text) return [];

  const clean = cleanText(text);

  // Split into tokens
  const tokens = clean.split(/\s+/).filter(t => t.length > 2);

  // Check against skill dictionary
  const found = new Set();

  for (const skill of SKILL_DICTIONARY) {
    // Match either exact word or multi-word phrases
    const skillTokens = skill.split(' ');
    if (skillTokens.length === 1) {
      if (tokens.includes(skill)) found.add(skill);
    } else if (clean.includes(skill)) {
      found.add(skill);
    }
  }

  return Array.from(found);
}

/**
 * Main analysis
 */
function analyze(resumeText, jdText) {
  // ✅ Extract skills only
  const jdSkills = extractSkills(jdText);
  const resumeSkills = extractSkills(resumeText);

  const fuse = new Fuse(jdSkills, { includeScore: true, threshold: 0.3 });

  const matches = jdSkills.map(skill => {
    const present =
      resumeSkills.includes(skill) ||
      fuse.search(skill).some(r => resumeSkills.includes(r.item));
    return { skill, present };
  });

  const matchedSkills = matches.filter(m => m.present).map(m => m.skill);
  const missingSkills = matches.filter(m => !m.present).map(m => m.skill);

  const score = jdSkills.length === 0
    ? 0
    : Math.round((matchedSkills.length / jdSkills.length) * 100);

  console.log('🧾 JD Skills:', jdSkills);
  console.log('🧠 Resume Skills:', resumeSkills);
  console.log('✅ Matched:', matchedSkills);
  console.log('❌ Missing:', missingSkills);
  console.log('📊 Score:', score, '%');

  return {
    score,
    matches,
    extractedSkills: jdSkills, 
    missingSkills
  };
}

module.exports = { analyze };
