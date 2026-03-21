# ⚡ COPY AND PASTE THESE COMMANDS

Just copy and paste these commands one by one!

---

## 🚀 STEP 1: Start Jenkins

Open **PowerShell** and run:

```powershell
# Navigate to your project
cd C:\Users\ASUS\OneDrive\Desktop\next\idurar-erp-crm

# Start Jenkins
docker-compose -f docker-compose.jenkins.yml up -d

# Wait 60 seconds
timeout /t 60

# Get password
docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword
```

**Copy the password that appears!**

---

## 🌐 STEP 2: Open Jenkins

Open your browser and go to:
```
http://localhost:8080
```

Paste the password and click **Continue**

---

## 🔌 STEP 3: Install Plugins

1. Click **"Install suggested plugins"**
2. Wait 5-10 minutes
3. When done, create admin user:
   - Username: `admin`
   - Password: `admin123`
   - Name: `Admin`
   - Email: `admin@localhost`
4. Click **Save and Continue** → **Save and Finish** → **Start using Jenkins**

---

## 🔐 STEP 4: Get GitHub Token

1. Open new tab: https://github.com/settings/tokens
2. Click **"Generate new token"** → **"Generate new token (classic)"**
3. Token name: `Jenkins`
4. Select scopes:
   - ✅ `repo` (check the main box, it checks all sub-boxes)
   - ✅ `admin:repo_hook`
5. Click **"Generate token"** at bottom
6. **COPY THE TOKEN!** (You won't see it again)

---

## 🔑 STEP 5: Add Credentials in Jenkins

In Jenkins, click:
**Manage Jenkins → Credentials → System → Global credentials → Add Credentials**

### Add these 7 credentials (one by one):

**1. GitHub Credentials:**
```
Kind: Username with password
Username: YOUR_GITHUB_USERNAME
Password: PASTE_YOUR_TOKEN_HERE
ID: github-credentials
Description: GitHub
```
Click **Create**

**2. MongoDB Username:**
```
Kind: Secret text
Secret: admin
ID: MONGO_USERNAME
Description: MongoDB User
```
Click **Create**

**3. MongoDB Password:**
```
Kind: Secret text
Secret: admin123
ID: MONGO_PASSWORD
Description: MongoDB Pass
```
Click **Create**

**4. MongoDB Database:**
```
Kind: Secret text
Secret: idurar
ID: MONGO_DATABASE
Description: MongoDB DB
```
Click **Create**

**5. JWT Secret:**
```
Kind: Secret text
Secret: jwt-secret-key-make-this-very-long-at-least-64-characters-abc123xyz
ID: JWT_SECRET
Description: JWT
```
Click **Create**

**6. Cookie Secret:**
```
Kind: Secret text
Secret: cookie-secret-key-make-this-very-long-at-least-64-characters-def456
ID: COOKIE_SECRET
Description: Cookie
```
Click **Create**

**7. Backend URL:**
```
Kind: Secret text
Secret: http://localhost:8888/
ID: VITE_BACKEND_SERVER
Description: Backend URL
```
Click **Create**

You should now see **7 credentials**!

---

## 📦 STEP 6: Create Jenkins Job

1. Click **Dashboard** (top left logo)
2. Click **New Item**
3. Name: `idurar-erp-crm`
4. Type: **Pipeline**
5. Click **OK**

**Configure:**

**Build Triggers:**
- ✅ Check: **GitHub hook trigger for GITScm polling**

**Pipeline section:**
- Definition: **Pipeline script from SCM**
- SCM: **Git**
- Repository URL: `https://github.com/YOUR_USERNAME/idurar-erp-crm.git`
  *(Replace YOUR_USERNAME!)*
- Credentials: **github-credentials**
- Branch: `*/main`
- Script Path: `Jenkinsfile`

Click **Save**

---

## 🎯 STEP 7: Test Manual Build

1. Click **Dashboard → idurar-erp-crm**
2. Click **Build Now** (left sidebar)
3. Click **#1** (the build number that appears)
4. Click **Console Output**
5. Watch it build! (Takes 5-10 minutes first time)

**Wait for:** `Finished: SUCCESS` ✅

---

## 🎣 STEP 8: Set Up Automation

### A. Download ngrok

Download from: https://ngrok.com/download

Unzip to: `C:\ngrok`

### B. Start ngrok

Open **NEW PowerShell window** and run:

```powershell
cd C:\ngrok
.\ngrok.exe http 8080
```

**Copy the URL** that appears! Example:
```
https://abc123.ngrok.io
```

**KEEP THIS WINDOW OPEN!**

### C. Add Webhook on GitHub

1. Go to your GitHub repo
2. **Settings → Webhooks → Add webhook**
3. Payload URL: `https://YOUR-NGROK-URL.ngrok.io/github-webhook/`
   *(Use your actual ngrok URL + /github-webhook/)*
4. Content type: `application/json`
5. Events: **Just the push event**
6. ✅ Active
7. Click **Add webhook**

Should see green checkmark ✅

---

## 🎉 STEP 9: Test Automation!

In **PowerShell**, run:

```powershell
# Go to project
cd C:\Users\ASUS\OneDrive\Desktop\next\idurar-erp-crm

# Make a test file
echo "Test" > automation-test.txt

# Commit
git add automation-test.txt
git commit -m "Test automation"

# Push
git push origin main
```

**Now watch Jenkins!**

Go to: http://localhost:8080

You should see **build #2 start automatically!** 🎉

---

## ✅ SUCCESS!

If build #2 starts automatically after your push, **IT WORKS!** 🚀

From now on, every time you:
```powershell
git push origin main
```

Jenkins will **automatically**:
1. ✅ Build your code
2. ✅ Create Docker images
3. ✅ Run tests
4. ✅ Deploy application

---

## 🌐 Access Your App

- **Frontend:** http://localhost
- **Backend:** http://localhost:8888/api
- **Jenkins:** http://localhost:8080

---

## 🛠️ Daily Commands

### When you make changes:
```powershell
git add .
git commit -m "Your message"
git push origin main
# Jenkins does the rest automatically!
```

### View Jenkins builds:
```
http://localhost:8080
```

### View application logs:
```powershell
docker-compose logs -f
```

### Restart Jenkins:
```powershell
docker restart jenkins
```

### Stop everything:
```powershell
# Stop Jenkins
docker-compose -f docker-compose.jenkins.yml down

# Stop application
docker-compose down
```

### Start everything:
```powershell
# Start Jenkins
docker-compose -f docker-compose.jenkins.yml up -d

# Start application (or let Jenkins do it)
docker-compose up -d
```

---

## 🎊 You're Done!

You now have:
- ✅ Jenkins running
- ✅ GitHub integration
- ✅ Automatic builds
- ✅ Automatic deployment
- ✅ Full CI/CD pipeline

**Every code push = Automatic deployment!** 🚀

---

## 📚 Need Help?

See these guides:
- **QUICK_JENKINS_START.md** - Detailed walkthrough
- **JENKINS_COMPLETE_SETUP.md** - Complete reference
- **START_HERE.md** - Manual Docker setup
- **DOCKER_SETUP.md** - Docker deep dive

