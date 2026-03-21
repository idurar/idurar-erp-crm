# 🤖 Complete Jenkins Automation Setup

This guide shows you how to set up Jenkins so that **everything happens automatically** when you push code to GitHub!

---

## 📋 What You'll Achieve

```
YOU                GITHUB              JENKINS                 DOCKER
 │                   │                    │                      │
 │ git push         │                    │                      │
 ├──────────────────▶│                    │                      │
 │                   │  Webhook trigger   │                      │
 │                   ├────────────────────▶│                      │
 │                   │                    │ Pull code            │
 │                   │                    │ Build images         │
 │                   │                    │ Run tests            │
 │                   │                    ├──────────────────────▶│
 │                   │                    │ Deploy containers    │
 │                   │                    │◀─────────────────────┤
 │                   │                    │                      │
 │                   │                    │ ✅ Deployment Done!  │
 │   Email/Slack     │                    │                      │
 │◀──────────────────┴────────────────────┤                      │
```

---

## 🎯 Part 1: Install Jenkins

### Option A: Jenkins in Docker (Recommended)

This installs Jenkins itself as a Docker container.

#### 1.1 Create Jenkins Docker Compose File

Create `docker-compose.jenkins.yml` in your project root:

```yaml
version: '3.8'

services:
  jenkins:
    image: jenkins/jenkins:lts
    container_name: jenkins
    privileged: true
    user: root
    ports:
      - "8080:8080"      # Jenkins web interface
      - "50000:50000"    # Jenkins agent port
    volumes:
      - jenkins_home:/var/jenkins_home
      - /var/run/docker.sock:/var/run/docker.sock  # Access to Docker
      - ./:/workspace    # Your project files
    environment:
      - JENKINS_OPTS=--prefix=/jenkins
    restart: unless-stopped

  # Optional: Jenkins agent for distributed builds
  jenkins-agent:
    image: jenkins/inbound-agent
    container_name: jenkins-agent
    depends_on:
      - jenkins
    environment:
      - JENKINS_URL=http://jenkins:8080
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock

volumes:
  jenkins_home:
    driver: local
```

#### 1.2 Start Jenkins

```bash
# Start Jenkins
docker-compose -f docker-compose.jenkins.yml up -d

# Wait for Jenkins to start (takes 1-2 minutes)
# Watch logs:
docker logs -f jenkins
```

#### 1.3 Get Initial Admin Password

```bash
# Windows (PowerShell):
docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword

# Mac/Linux:
docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword
```

**Copy this password!** You'll need it in the next step.

#### 1.4 Access Jenkins

Open your browser:
```
http://localhost:8080
```

**You'll see the "Unlock Jenkins" page.**

---

### Option B: Install Jenkins Directly (Windows/Mac/Linux)

<details>
<summary>Click to expand Windows installation</summary>

#### Windows:

1. **Download Jenkins:**
   - Go to: https://www.jenkins.io/download/
   - Download Windows installer (.msi)

2. **Install:**
   - Run the installer
   - Use default settings
   - Jenkins will start automatically

3. **Access:**
   - Open: http://localhost:8080
   - Get password from: `C:\Program Files\Jenkins\secrets\initialAdminPassword`

</details>

<details>
<summary>Click to expand Mac installation</summary>

#### Mac:

```bash
# Install via Homebrew
brew install jenkins-lts

# Start Jenkins
brew services start jenkins-lts

# Access at: http://localhost:8080
# Password at: /Users/YOUR_USER/.jenkins/secrets/initialAdminPassword
```

</details>

<details>
<summary>Click to expand Linux installation</summary>

#### Linux (Ubuntu/Debian):

```bash
# Add Jenkins repository
curl -fsSL https://pkg.jenkins.io/debian-stable/jenkins.io-2023.key | sudo tee \
  /usr/share/keyrings/jenkins-keyring.asc > /dev/null

echo deb [signed-by=/usr/share/keyrings/jenkins-keyring.asc] \
  https://pkg.jenkins.io/debian-stable binary/ | sudo tee \
  /etc/apt/sources.list.d/jenkins.list > /dev/null

# Install Jenkins
sudo apt-get update
sudo apt-get install jenkins

# Start Jenkins
sudo systemctl start jenkins
sudo systemctl enable jenkins

# Get password
sudo cat /var/lib/jenkins/secrets/initialAdminPassword
```

</details>

---

## 🔧 Part 2: Initial Jenkins Configuration

### 2.1 Unlock Jenkins

1. Open **http://localhost:8080**
2. Paste the **initial admin password**
3. Click **Continue**

### 2.2 Install Plugins

1. Choose **"Install suggested plugins"**
2. Wait for plugins to install (5-10 minutes)

**Additional Required Plugins:**

After initial setup, go to **Manage Jenkins → Plugins → Available plugins**

Install these:
- ✅ **Docker Pipeline**
- ✅ **Docker**
- ✅ **Git**
- ✅ **GitHub Integration**
- ✅ **Pipeline**
- ✅ **Credentials Binding**
- ✅ **Email Extension** (for notifications)
- ✅ **Slack Notification** (optional)

Click **Install without restart**

### 2.3 Create Admin User

1. Fill in the form:
   - Username: `admin`
   - Password: `your-secure-password`
   - Full name: `Your Name`
   - Email: `your-email@example.com`

2. Click **Save and Continue**

3. Jenkins URL: `http://localhost:8080/`

4. Click **Save and Finish**

5. Click **Start using Jenkins**

---

## 🔐 Part 3: Configure Credentials in Jenkins

### 3.1 Add GitHub Credentials

1. **Dashboard → Manage Jenkins → Credentials**
2. Click **System** → **Global credentials** → **Add Credentials**

**Credential 1: GitHub Personal Access Token**

```
Kind: Secret text
Secret: [Your GitHub Personal Access Token]
ID: github-token
Description: GitHub Access Token
```

**How to get GitHub Token:**
- Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
- Generate new token
- Select scopes: `repo`, `admin:repo_hook`, `admin:org_hook`
- Copy the token!

**Credential 2: GitHub Username/Password (Alternative)**

```
Kind: Username with password
Username: your-github-username
Password: your-github-password-or-token
ID: github-credentials
Description: GitHub Credentials
```

### 3.2 Add Docker Registry Credentials (Optional)

Only needed if pushing to Docker Hub or private registry.

```
Kind: Username with password
Username: your-dockerhub-username
Password: your-dockerhub-password
ID: docker-registry-credentials
Description: Docker Hub Credentials
```

### 3.3 Add Application Secrets

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
Description: MongoDB Database Name
```

**JWT Secret:**
```
Kind: Secret text
Secret: your-jwt-secret-key-change-this-in-production-make-it-very-long
ID: JWT_SECRET
Description: JWT Secret Key
```

**Cookie Secret:**
```
Kind: Secret text
Secret: your-cookie-secret-key-change-this-also-make-it-very-long
ID: COOKIE_SECRET
Description: Cookie Secret Key
```

**Backend Server URL:**
```
Kind: Secret text
Secret: http://localhost:8888/
ID: VITE_BACKEND_SERVER
Description: Backend Server URL
```

---

## 🎯 Part 4: Create Jenkins Pipeline Job

### 4.1 Create New Job

1. **Dashboard → New Item**
2. **Item name:** `idurar-erp-crm-pipeline`
3. **Type:** Select **Pipeline**
4. Click **OK**

### 4.2 Configure General Settings

**Description:**
```
Automated build and deployment pipeline for IDURAR ERP CRM
```

**Build Triggers:**
- ✅ Check **GitHub hook trigger for GITScm polling**

This makes Jenkins listen for GitHub webhooks!

### 4.3 Configure Pipeline

**Pipeline Definition:**
- Select: **Pipeline script from SCM**

**SCM:**
- Select: **Git**

**Repository URL:**
```
https://github.com/YOUR_USERNAME/idurar-erp-crm.git
```
(Replace with your actual GitHub repository URL)

**Credentials:**
- Select: **github-credentials** (the one you created earlier)

**Branches to build:**
```
Branch Specifier: */main
```
(Or `*/master` if you use master branch)

**Script Path:**
```
Jenkinsfile
```
(This tells Jenkins to use the Jenkinsfile in your repo)

**Lightweight checkout:**
- ✅ Check this (faster checkout)

Click **Save**

---

## 🔗 Part 5: Set Up GitHub Webhook

This is what triggers Jenkins when you push code!

### 5.1 Expose Jenkins to Internet (For GitHub to reach it)

**Problem:** Jenkins is on `localhost:8080` - GitHub can't reach it!

**Solutions:**

#### Option A: Use ngrok (Quick Testing)

```bash
# Download ngrok: https://ngrok.com/download

# Start ngrok tunnel
ngrok http 8080

# You'll get a URL like:
# https://abc123.ngrok.io → http://localhost:8080
```

**Use this URL for webhook!**

#### Option B: Deploy Jenkins on Cloud Server

- AWS EC2
- DigitalOcean Droplet
- Azure VM
- Your own server with public IP

#### Option C: Use GitHub Actions Instead

If you can't expose Jenkins, use GitHub Actions (see alternative section below).

### 5.2 Configure GitHub Webhook

1. **Go to your GitHub repository**
2. **Settings → Webhooks → Add webhook**

**Payload URL:**
```
http://YOUR_JENKINS_URL:8080/github-webhook/
```

Examples:
- If using ngrok: `https://abc123.ngrok.io/github-webhook/`
- If on server: `http://your-server-ip:8080/github-webhook/`
- If localhost (won't work): `http://localhost:8080/github-webhook/`

**Content type:**
```
application/json
```

**Which events would you like to trigger this webhook?**
- ✅ Select: **Just the push event**

**Active:**
- ✅ Check this

Click **Add webhook**

**Test it:**
- GitHub will send a test payload
- Check the webhook shows a green ✅

---

## 🚀 Part 6: Test the Complete Automation

### 6.1 Make a Code Change

```bash
# In your project directory
cd C:\Users\ASUS\OneDrive\Desktop\next\idurar-erp-crm

# Create a test file
echo "Test automation" > test.txt

# Commit and push
git add test.txt
git commit -m "Test Jenkins automation"
git push origin main
```

### 6.2 Watch Jenkins

1. **Go to Jenkins Dashboard**
2. You should see your job **automatically start building!**
3. Click on the **build number** (e.g., #1)
4. Click **Console Output** to watch in real-time

### 6.3 What Jenkins Does (Automatically)

```
Jenkins Pipeline Stages:

[Stage 1] Checkout
├─ Cloning GitHub repository...
└─ ✅ Code downloaded

[Stage 2] Environment Setup
├─ Creating .env file with secrets...
└─ ✅ Environment configured

[Stage 3] Build Backend
├─ Building Docker image: idurar-backend...
├─ Installing npm packages...
└─ ✅ Backend image built

[Stage 4] Build Frontend
├─ Building Docker image: idurar-frontend...
├─ Building React app...
└─ ✅ Frontend image built

[Stage 5] Test (Parallel)
├─ Backend Tests...
├─ Frontend Tests...
└─ ✅ Tests passed

[Stage 6] Push to Registry (main branch only)
├─ Pushing idurar-backend:1...
├─ Pushing idurar-frontend:1...
└─ ✅ Images pushed

[Stage 7] Deploy
├─ Stopping old containers...
├─ Starting new containers...
└─ ✅ Deployment complete

[Stage 8] Health Check
├─ Testing backend API...
├─ Testing frontend...
└─ ✅ Application healthy

✅ Pipeline SUCCESS!
```

---

## 📧 Part 7: Set Up Notifications

### 7.1 Email Notifications

**Configure Email:**

1. **Manage Jenkins → System**
2. Scroll to **Extended E-mail Notification**

```
SMTP server: smtp.gmail.com
SMTP Port: 587
Use SSL: No
Use TLS: Yes

Credentials:
- Add → Username with password
- Username: your-email@gmail.com
- Password: your-app-password

Default user e-mail suffix: @gmail.com
```

**Get Gmail App Password:**
- Google Account → Security → 2-Step Verification
- App passwords → Generate
- Use this password in Jenkins

### 7.2 Update Jenkinsfile for Notifications

The Jenkinsfile already has notification sections in the `post` block:

```groovy
post {
    success {
        echo 'Pipeline completed successfully!'
        // Uncomment to send email:
        // emailext (
        //     subject: "SUCCESS: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]'",
        //     body: "Job completed successfully!",
        //     to: "your-email@example.com"
        // )
    }
    failure {
        echo 'Pipeline failed!'
        // Uncomment to send email:
        // emailext (
        //     subject: "FAILED: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]'",
        //     body: "Job failed! Check console output.",
        //     to: "your-email@example.com"
        // )
    }
}
```

---

## 📊 Part 8: Jenkins Dashboard Overview

### What You'll See in Jenkins:

```
┌─────────────────────────────────────────────────────────────┐
│ Jenkins Dashboard                                           │
│                                                             │
│ idurar-erp-crm-pipeline                                    │
│ ├─ Last Success: #5 (2 hours ago)                         │
│ ├─ Last Failure: #3 (1 day ago)                           │
│ └─ Currently Running: #6                                    │
│                                                             │
│ Build History:                                              │
│ #6  ▶️ Running...          [Stage: Deploy]                │
│ #5  ✅ Success (5m 23s)     main branch                    │
│ #4  ✅ Success (5m 18s)     main branch                    │
│ #3  ❌ Failed  (2m 45s)     Test stage failed              │
│ #2  ✅ Success (5m 32s)     main branch                    │
│ #1  ✅ Success (8m 12s)     Initial build                  │
│                                                             │
│ Stage View:                                                 │
│ ┌───────┬──────┬──────┬──────┬────────┬────────┐          │
│ │Checkout│Build │Build │Test │Push    │Deploy  │          │
│ │   ✅   │  ✅   │  ✅   │ ✅   │   ✅    │   ▶️   │          │
│ └───────┴──────┴──────┴──────┴────────┴────────┘          │
└─────────────────────────────────────────────────────────────┘
```

### Useful Links in Jenkins:

- **Console Output**: See detailed logs
- **Pipeline Steps**: Visual representation of stages
- **Changes**: See what code changed
- **Test Results**: View test reports
- **Artifacts**: Download build artifacts

---

## 🔄 Part 9: Your Daily Workflow

### Developer Workflow:

```bash
# 1. Make code changes
code backend/src/app.js

# 2. Commit changes
git add .
git commit -m "Added new feature"

# 3. Push to GitHub
git push origin main

# 4. Jenkins automatically:
#    ✅ Detects push (GitHub webhook)
#    ✅ Pulls latest code
#    ✅ Builds Docker images
#    ✅ Runs tests
#    ✅ Deploys to containers
#    ✅ Sends notification

# 5. You receive email: "Build #42 SUCCESS"

# 6. Check your app: http://localhost
#    New features are live!
```

**No manual deployment needed!** 🎉

---

## 🛠️ Part 10: Troubleshooting

### Problem: Jenkins doesn't trigger on push

**Solution:**
```bash
# Check webhook status on GitHub
Repository → Settings → Webhooks → Your webhook
- Should have green checkmark
- Check "Recent Deliveries" for errors

# In Jenkins:
Manage Jenkins → System Log
- Look for webhook-related errors

# Test webhook manually:
curl -X POST http://your-jenkins-url:8080/github-webhook/
```

### Problem: Build fails at Docker stage

**Solution:**
```bash
# Jenkins needs Docker access
# If Jenkins in Docker, make sure docker.sock is mounted:
docker-compose -f docker-compose.jenkins.yml down
# Edit docker-compose.jenkins.yml
# Add volume: - /var/run/docker.sock:/var/run/docker.sock
docker-compose -f docker-compose.jenkins.yml up -d
```

### Problem: Permission denied errors

**Solution:**
```bash
# Give Jenkins user Docker permissions
# On host machine:
sudo usermod -aG docker jenkins
sudo systemctl restart jenkins

# Or if Jenkins in Docker:
docker exec -u root jenkins chmod 666 /var/run/docker.sock
```

### Problem: Can't access localhost from Jenkins

**Solution:**
```
In Jenkinsfile, change:
- http://localhost:8888 → http://host.docker.internal:8888 (Docker Desktop)
- Or use Docker network: http://backend:8888
```

---

## 📚 Part 11: Advanced Configuration

### Multi-Branch Pipeline

For multiple branches (dev, staging, production):

1. **New Item → Multibranch Pipeline**
2. **Branch Sources → GitHub**
3. Configure to scan all branches
4. Each branch gets its own pipeline!

### Parameterized Builds

Add parameters to trigger specific actions:

```groovy
parameters {
    choice(name: 'ENVIRONMENT', choices: ['dev', 'staging', 'production'])
    booleanParam(name: 'SKIP_TESTS', defaultValue: false)
}
```

### Blue Ocean UI

For a modern, visual pipeline interface:

1. **Manage Jenkins → Plugins**
2. Install **Blue Ocean**
3. Access at: `http://localhost:8080/blue`

---

## ✅ Checklist: Is Everything Set Up?

- [ ] Jenkins installed and accessible
- [ ] Required plugins installed
- [ ] GitHub credentials configured
- [ ] Application secrets added
- [ ] Pipeline job created
- [ ] Jenkinsfile in repository
- [ ] GitHub webhook configured
- [ ] Test push triggers build
- [ ] Build completes successfully
- [ ] Application deploys
- [ ] Notifications working

**If all checked, you're done!** ✅

---

## 🎉 Success!

You now have **full CI/CD automation**:

```
Code Change → GitHub → Jenkins → Docker → Live Application
```

**Every time you push code, Jenkins:**
1. ✅ Builds it
2. ✅ Tests it
3. ✅ Deploys it
4. ✅ Notifies you

**No manual work required!** 🚀

---

## 📖 Quick Reference

```bash
# Access Jenkins
http://localhost:8080

# Start Jenkins (if Docker)
docker-compose -f docker-compose.jenkins.yml up -d

# View Jenkins logs
docker logs -f jenkins

# Restart Jenkins
docker restart jenkins

# Trigger build manually
Jenkins Dashboard → Your Job → Build Now

# View build logs
Build #X → Console Output
```

