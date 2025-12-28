const express = require('express');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());

// ዳታቤዝ (በጊዜያዊነት በዝርዝር ተቀምጧል)
let jobs = [];
let applications = [];

// --- 1. EMPLOYER: ስራ ይለጥፋል ---
app.post('/api/jobs', (req, res) => {
    const job = { 
        id: jobs.length + 1, 
        ...req.body, 
        status: 'pending' // መጀመሪያ ለአድሚን ፍቃድ ይጠብቃል
    };
    jobs.push(job);
    res.json({ message: "ስራው ተመዝግቧል፣ አድሚን እስኪያጸድቀው ይጠብቁ።", job });
});

// --- 2. ADMIN: ሁሉንም ስራዎች ያያል እና ያጸድቃል ---
app.get('/api/admin/jobs', (req, res) => {
    res.json(jobs);
});

app.put('/api/admin/approve/:id', (req, res) => {
    const job = jobs.find(j => j.id == req.params.id);
    if (job) {
        job.status = 'approved';
        res.json({ message: "ስራው ጸድቆ ለስራ ፈላጊዎች እንዲታይ ተደርጓል።" });
    }
});

// --- 3. JOB SEEKER: የጸደቁ ስራዎችን ያያል ---
app.get('/api/jobs/ads', (req, res) => {
    const approvedJobs = jobs.filter(j => j.status === 'approved');
    res.json(approvedJobs);
});

// --- 4. JOB SEEKER: የመጀመሪያ ፎርም ይሞላል ---
app.post('/api/apply', (req, res) => {
    const appData = { 
        id: applications.length + 1, 
        ...req.body, 
        stage: 1 
    };
    applications.push(appData);
    console.log("ማሳሰቢያ፡ አዲስ ማመልከቻ ለቀጣሪውና ለአድሚኑ ደርሷል!");
    res.json({ message: "የመጀመሪያው ፎርም ተልኳል።", applicationId: appData.id });
});

// --- 5. JOB SEEKER: ሁለተኛ ፎርም (ለማለፍ) ---
app.post('/api/apply/stage2', (req, res) => {
    const { appId, phone, details } = req.body;
    const application = applications.find(a => a.id == appId);
    if (application) {
        application.stage = 2;
        application.phone = phone;
        application.details = details;
        res.json({ message: "ሁለተኛው ፎርም ተሞልቷል። በቅርቡ በስልክ " + phone + " እንገናኛለን!" });
    }
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));