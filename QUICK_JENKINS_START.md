# ⚡ Quick Jenkins Setup - Step by Step

Follow these exact steps to get Jenkins automation working!

---

## 🚀 Step 1: Start Jenkins

```bash
# Make sure you're in the project directory
cd C:\Users\ASUS\OneDrive\Desktop\next\idurar-erp-crm

# Start Jenkins
docker-compose -f docker-compose.jenkins.yml up -d

# Wait for Jenkins to start (1-2 minutes)
docker logs -f jenkins
```

**Wait until you see:**
```
Jenkins is fully up and running
```

Press **Ctrl+C** to stop viewing logs.

---

## 🔓 Step 2: Get Jenkins Password

```bash
# Get the initial admin password
docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword
```

**Copy this password!** Example: `a1b2c3d4e5f6g7h8i9j0`

---

## 🌐 Step 3: Access Jenkins

Open your browser:
```
http://localhost:8080
```

1. **Paste the password** you copied
2. Click **Continue**

---

## 🔌 Step 4: Install Plugins

1. Choose **"Install suggested plugins"**
2. Wait for installation (5-10 minutes)
3. **Don't close the browser!**

---

## 👤 Step 5: Create Admin User

Fill in the form:
```
Username: admin
Password: admin123 (or your choice)
Full name: Your Name
Email: your-email@example.com
```

Click **Save and Continue** → **Save and Finish** → **Start using Jenkins**

---

## 🔐 Step 6: Add Credentials

### 6.1 Go to Credentials

**Dashboard → Manage Jenkins → Credentials → System → Global credentials → Add Credentials**

### 6.2 Add GitHub Credentials

**First, get GitHub Personal Access Token:**
1. Go to GitHub.com
2. Settings → Developer settings → Personal access tokens → Tokens (classic)
3. **Generate new token**
4. Check these permissions:
   - ✅ `repo` (all)
   - ✅ `admin:repo_hook`
5. Click **Generate token**
6. **Copy the token!** (You won't see it again)

**Back in Jenkins:**
```
Kind: Username with password
Username: your-github-username
Password: paste-your-token-here
ID: github-credentials
Description: GitHub Access
```

Click **Create**

### 6.3 Add Application Secrets

Add these secrets **one by one** (same way as above):

**MongoDB Username:**
```
Kind: Secret text
Secret: admin
ID: MONGO_USERNAME
Description: MongoDB Username
```

**MongoDB Password:**
```
Kind: Secret text  
Secret: admin123
ID: MONGO_PASSWORD
Description: MongoDB Password
```

**MongoDB Database:**
```
Kind: Secret text
Secret: idurar
ID: MONGO_DATABASE
Description: MongoDB Database
```

**JWT Secret:**
```
Kind: Secret text
Secret: your-jwt-secret-key-change-this-in-production-make-it-very-long-abc123
ID: JWT_SECRET
Description: JWT Secret
```

**Cookie Secret:**
```
Kind: Secret text
Secret: your-cookie-secret-key-change-this-also-make-it-very-long-xyz789
ID: COOKIE_SECRET
Description: Cookie Secret
```

**Backend Server URL:**
```
Kind: Secret text
Secret: http://localhost:8888/
ID: VITE_BACKEND_SERVER
Description: Backend Server URL
```

After adding all credentials, you should see 7 credentials total.

---

## 📦 Step 7: Create Pipeline Job

### 7.1 Create New Item

1. Click **Dashboard** (top left)
2. Click **New Item** (left sidebar)
3. Enter name: `idurar-erp-crm`
4. Select: **Pipeline**
5. Click **OK**

### 7.2 Configure the Job

**Description:**
```
Automated CI/CD pipeline for IDURAR ERP CRM
```

**Build Triggers:**
- ✅ Check: **GitHub hook trigger for GITScm polling**

**Pipeline:**
- Definition: Select **Pipeline script from SCM**
- SCM: Select **Git**

**Repository URL:**
```
https://github.com/YOUR_USERNAME/idurar-erp-crm.git
```
*Replace YOUR_USERNAME with your actual GitHub username!*

**Credentials:**
- Select: **github-credentials**

**Branches to build:**
```
*/main
```

**Script Path:**
```
Jenkinsfile
```

Click **Save**

---

## 🔗 Step 8: Push Code to GitHub (If Not Already)

If your code isn't on GitHub yet:

```bash
# In your project directory
cd C:\Users\ASUS\OneDrive\Desktop\next\idurar-erp-crm

# Initialize git (if not done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit with Jenkins setup"

# Create repository on GitHub first, then:
git remote add origin https://github.com/YOUR_USERNAME/idurar-erp-crm.git

# Push
git push -u origin main
```

---

## 🎯 Step 9: Test Manual Build

Let's test without webhook first:

1. **Dashboard → idurar-erp-crm → Build Now**
2. Watch the build progress
3. Click on **#1** (build number)
4. Click **Console Output**
5. Watch the magic happen! ✨

**Expected output:**
```
Started by user admin
Checking out git repository...
Building backend image...
Building frontend image...
Running tests...
Deploying containers...
✅ BUILD SUCCESS
```

---

## 🎣 Step 10: Set Up GitHub Webhook (For Automatic Builds)

### 10.1 Expose Jenkins to Internet

**Problem:** Jenkins is on `localhost` - GitHub can't reach it!

**Solution - Use ngrok (Quick & Easy):**

1. **Download ngrok:**
   - Go to: https://ngrok.com/download
   - Download for Windows
   - Unzip somewhere (e.g., C:\ngrok)

2. **Start ngrok:**
   ```cmd
   cd C:\ngrok
   ngrok http 8080
   ```

3. **Copy the URL:**
   ```
   Forwarding: https://abc123.ngrok.io → http://localhost:8080
   ```
   
   **Copy this URL!** Example: `https://abc123.ngrok.io`

**Keep ngrok running!** Don't close this window.

### 10.2 Configure Webhook on GitHub

1. **Go to your GitHub repository**
2. **Settings → Webhooks → Add webhook**

**Payload URL:**
```
https://abc123.ngrok.io/github-webhook/
```
*(Use YOUR ngrok URL + /github-webhook/)*

**Content type:**
```
application/json
```

**Which events:**
- ✅ Select: **Just the push event**

**Active:**
- ✅ Checked

Click **Add webhook**

You should see a **green checkmark** ✅ after a few seconds!

---

## 🎉 Step 11: Test Full Automation!

### Make a test change:

```bash
# In your project
cd C:\Users\ASUS\OneDrive\Desktop\next\idurar-erp-crm

# Create a test file
echo "Testing Jenkins automation" > test-automation.txt

# Commit
git add test-automation.txt
git commit -m "Test Jenkins webhook automation"

# Push to GitHub
git push origin main
```

### Watch Jenkins:

1. **Go to Jenkins Dashboard**
2. You should see **build #2 starting automatically!** 🎉
3. Click **Console Output** to watch

**If it works:**
- ✅ Jenkins detected the push
- ✅ Started building automatically
- ✅ Built Docker images
- ✅ Deployed containers

**Success! You have full automation!** 🚀

---

## 🎮 Daily Usage

From now on, every time you push code:

```bash
git add .
git commit -m "Added new feature"
git push origin main
```

**Jenkins automatically:**
1. ✅ Detects push via webhook
2. ✅ Pulls latest code
3. ✅ Builds Docker images
4. ✅ Runs tests
5. ✅ Deploys application
6. ✅ You get notification!

**No manual deployment ever again!** 🎉

---

## 🛠️ Troubleshooting

### Build fails at "Setup Environment"

**Fix:** Check credentials are added correctly
```
Dashboard → Manage Jenkins → Credentials
Should see all 7 credentials
```

### "Permission denied" Docker errors

**Fix:** Give Jenkins Docker access
```bash
docker exec -u root jenkins chmod 666 /var/run/docker.sock
```

### GitHub webhook shows error

**Fix:** 
1. Make sure ngrok is running
2. Use correct URL: `https://YOUR-URL.ngrok.io/github-webhook/`
3. Include `/github-webhook/` at the end!

### Build success but can't access app

**Fix:** 
```bash
# Make sure your application is running:
docker ps

# Should see:
# idurar-mongodb
# idurar-backend
# idurar-frontend
```

---

## ✅ Success Checklist

- [ ] Jenkins running at http://localhost:8080
- [ ] All 7 credentials added
- [ ] Pipeline job created
- [ ] Manual build works
- [ ] ngrok running
- [ ] GitHub webhook configured
- [ ] Test push triggers automatic build
- [ ] Application deploys successfully

**All checked? You're done!** ✅

---

## 📚 What's Next?

### Access Your App:
- **Frontend:** http://localhost:80
- **Backend API:** http://localhost:8888/api
- **Jenkins:** http://localhost:8080

### View Logs:
```bash
# Jenkins logs
docker logs -f jenkins

# Application logs  
docker-compose logs -f
```

### Stop Everything:
```bash
# Stop Jenkins
docker-compose -f docker-compose.jenkins.yml down

# Stop application
docker-compose down
```

### Start Everything:
```bash
# Start Jenkins
docker-compose -f docker-compose.jenkins.yml up -d

# Application will start automatically via Jenkins!
# Or start manually:
docker-compose up -d
```

---

## 🎉 Congratulations!

You now have **professional-grade CI/CD automation!**

Every code push = Automatic deployment! 🚀

