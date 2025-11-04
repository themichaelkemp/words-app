# Security Policy

## Overview

Words Matter takes security seriously. This document outlines the security measures implemented in the application and provides guidance for developers and security researchers.

## Reporting Security Issues

If you discover a security vulnerability, please email: **wordsmatterappfeedback@gmail.com** with "SECURITY" in the subject line.

**Please do NOT create public GitHub issues for security vulnerabilities.**

We will respond within 48 hours and work with you to address the issue promptly.

---

## Security Measures Implemented

### 1. Secrets Management ✅

**Environment Variables:**
- All sensitive credentials (Firebase API keys, project IDs) are stored in `.env` files
- `.env` files are excluded from version control via `.gitignore`
- `.env.example` template provided for developers
- Environment variable validation on application startup

**Files:**
- `.env` - Contains actual credentials (NOT committed)
- `.env.example` - Template with placeholder values (committed)
- `src/firebase.js` - Loads credentials from environment variables

**Best Practices:**
- Never hardcode secrets in source code
- Rotate API keys if they are exposed
- Use Firebase Console to restrict API key usage

---

### 2. Authentication & Authorization ✅

**Firebase Authentication:**
- Email/password authentication implemented
- Google OAuth sign-in available
- User sessions managed securely by Firebase Auth
- Password requirements: minimum 6 characters

**Firestore Security Rules:**
- User authentication required for all database operations
- Users can only read/write their own data (userId matching)
- Input validation enforced at database level
- Protection against unauthorized access and data tampering

**Files:**
- `firestore.rules` - Comprehensive security rules for Firestore
- `src/contexts/AuthContext.jsx` - Authentication state management
- `src/components/Auth.jsx` - Login/signup UI

**Authorization Rules:**
```javascript
// Users can only access their own songs
allow read, write: if request.auth.uid == resource.data.userId;
```

---

### 3. Input Validation & Sanitization ✅

**DOMPurify Integration:**
- All user inputs sanitized using DOMPurify library
- Protection against XSS (Cross-Site Scripting) attacks
- HTML tags stripped from text inputs
- URL validation for avatar images

**Sanitization Functions (`src/utils/sanitize.js`):**
- `sanitizeText()` - Remove all HTML tags, keep plain text
- `sanitizeSongTitle()` - Validate and limit title length (200 chars)
- `sanitizeLyrics()` - Sanitize lyrics content (50KB limit)
- `sanitizeDisplayName()` - Validate user display names (100 chars)
- `sanitizeURL()` - Validate URLs (HTTPS only)
- `isValidEmail()` - RFC 5322 compliant email validation
- `sanitizeSearchQuery()` - Prevent SQL injection in queries

**Applied To:**
- Song titles and lyrics (Editor component)
- User display names (Auth component)
- Email addresses (Auth component)
- Search queries (Dictionary component)
- All user-generated content

---

### 4. Secure Communication ✅

**HTTPS Enforcement:**
- Firebase Hosting enforces HTTPS by default
- All API calls use secure connections
- TLS 1.2+ required

**Security Headers (`firebase.json`):**
```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
Content-Security-Policy: [Strict CSP rules]
```

**Content Security Policy:**
- Scripts: Self + Google APIs only
- Styles: Self + inline (for React styling)
- Images: Self + HTTPS only
- Connections: Firebase services only
- Frames: Blocked
- Objects: Blocked

---

### 5. CORS Configuration ✅

**Firebase Hosting:**
- CORS handled by Firebase automatically
- CSP headers restrict cross-origin requests
- Only whitelisted domains can access resources

---

### 6. Code Quality & Auditing ✅

**Dependency Management:**
- Regular `npm audit` scans for vulnerabilities
- Dependencies kept up-to-date
- Current status: **0 vulnerabilities**

**Code Reviews:**
- All AI-generated code manually reviewed
- Security-focused code review checklist
- ESLint configured for code quality

**Monitoring:**
- Firebase Analytics for usage tracking
- Error logging and monitoring (when deployed)
- Security incident response plan

---

### 7. Least Privilege Principle ✅

**Firebase Rules:**
- Users have minimum required permissions
- No admin or elevated privileges by default
- Database rules enforce strict access control

**API Access:**
- Firebase API key restricted to specific domains
- Authentication required for sensitive operations
- Read/write rules scoped to user's own data

---

### 8. Version Control Hygiene ✅

**Gitignore Configuration:**
```
.env
.env.*
firebase-service-account*.json
.firebase/
firebase-debug.log
```

**Commit Practices:**
- No secrets committed to repository
- Security fixes clearly labeled in commits
- Git history reviewed for exposed credentials

---

## Security Checklist for Developers

When contributing to Words Matter, ensure:

- [ ] No secrets hardcoded in source files
- [ ] All user inputs sanitized before use or storage
- [ ] Authentication required for protected routes
- [ ] Firebase security rules enforce authorization
- [ ] Dependencies scanned for vulnerabilities (`npm audit`)
- [ ] Error messages don't expose sensitive information
- [ ] HTTPS used for all external communications
- [ ] Input length limits enforced
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS prevention (sanitized outputs)

---

## Firebase Security Rules

### Songs Collection
```javascript
match /songs/{songId} {
  allow read: if request.auth.uid == resource.data.userId;
  allow create: if request.auth.uid == request.resource.data.userId;
  allow update, delete: if request.auth.uid == resource.data.userId;
}
```

### Users Collection
```javascript
match /users/{userId} {
  allow read, write: if request.auth.uid == userId;
}
```

---

## API Key Restrictions (Manual Setup Required)

### Firebase Console Steps:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services → Credentials**
3. Find your Firebase API key
4. Click "RESTRICT KEY"
5. Add **HTTP referrers**:
   - `localhost:*` (for local development)
   - `https://words-3c7fc.web.app/*` (production domain)
   - `https://words-3c7fc.firebaseapp.com/*` (Firebase hosting)
6. **API restrictions**: Enable Firebase services only
7. Save changes

### ⚠️ IMPORTANT
After rotating exposed API keys, update your local `.env` file with the new key.

---

## Deployment Security

### Before Deploying:
1. Run `npm audit` and fix any vulnerabilities
2. Test authentication flows
3. Verify Firestore security rules in Firebase Console
4. Check that `.env` is not included in build
5. Review security headers in `firebase.json`
6. Test CSP doesn't break functionality

### After Deploying:
1. Verify HTTPS is enforced
2. Test login/signup functionality
3. Check security headers using browser dev tools
4. Verify Firestore rules are active
5. Monitor Firebase console for unusual activity

---

## Security Maintenance

### Monthly Tasks:
- [ ] Run `npm audit` and update dependencies
- [ ] Review Firebase authentication logs
- [ ] Check for suspicious database access patterns
- [ ] Review and update security rules if needed

### Quarterly Tasks:
- [ ] Review and rotate API keys
- [ ] Security audit of new features
- [ ] Update security dependencies (DOMPurify, etc.)
- [ ] Review and update this document

---

## Known Limitations

1. **Client-side validation only** - Backend validation needed for production
2. **No rate limiting** - Firebase quota limits provide basic protection
3. **No CAPTCHA** - Consider adding for signup to prevent bots
4. **Password strength** - Basic requirements (6+ chars); consider stronger policy

---

## Incident Response Plan

If a security breach occurs:

1. **Immediate Actions:**
   - Disable compromised Firebase API keys
   - Change Firebase project permissions
   - Review Firebase logs for unauthorized access
   - Notify affected users if data was compromised

2. **Investigation:**
   - Identify attack vector
   - Determine scope of breach
   - Document findings

3. **Remediation:**
   - Patch vulnerabilities
   - Rotate all credentials
   - Update security rules
   - Deploy fixes

4. **Post-Incident:**
   - Update security documentation
   - Implement additional safeguards
   - Conduct security training
   - Notify stakeholders

---

## Additional Resources

- [Firebase Security Rules Documentation](https://firebase.google.com/docs/rules)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [DOMPurify Documentation](https://github.com/cure53/DOMPurify)
- [Content Security Policy Guide](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)

---

## Security Updates

Last Updated: 2025-11-04

**Recent Changes:**
- Implemented Firebase Authentication
- Added Firestore security rules
- Integrated DOMPurify for input sanitization
- Configured security headers (CSP, X-Frame-Options, etc.)
- Moved credentials to environment variables
- Added comprehensive input validation

---

## Contact

For security concerns or questions:
- Email: wordsmatterappfeedback@gmail.com
- Subject: "SECURITY - [Brief Description]"

We appreciate responsible disclosure and will credit researchers who report valid security issues (with permission).
