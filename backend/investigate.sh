#!/bin/bash

echo "=== IDURAR Email Investigation ==="
echo ""

echo "1. Authentication Files:"
ls -la src/controllers/middlewaresControllers/createAuthMiddleware/
echo ""

echo "2. Checking for email configuration:"
grep -r "nodemailer\|sendgrid\|smtp" src/ --include="*.js" | head -5
echo ""

echo "3. Checking for registration/signup:"
find src -name "*register*" -o -name "*signup*" -o -name "*auth*"
echo ""

echo "4. Email-related files:"
find src -type f -name "*.js" | xargs grep -l "verification\|verify" | head -10
echo ""

echo "5. Main directories:"
ls -la src/
echo ""

echo "6. Models:"
find src -path "*/models/*.js" | head -10
echo ""
