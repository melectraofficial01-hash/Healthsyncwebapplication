# HealthSync - Troubleshooting Guide

## Common Issues and Solutions

### 1. Login Issues

#### Problem: "Invalid login credentials"
**Solution:**
- Use the demo doctor account: `sarah.johnson@healthsync.com` / `demo123`
- Or create a new patient account via the signup form
- Ensure email format is valid
- Password must be at least 6 characters

#### Problem: "User session not found"
**Solution:**
- Clear browser cache and cookies
- Try logging out and logging back in
- Check browser console for specific errors

### 2. File Upload Issues

#### Problem: "Failed to upload report"
**Solution:**
- Ensure file is an image (JPG, PNG) or PDF
- Check file size (should be under 10MB)
- Verify you're logged in as a patient
- Check browser console for detailed error message

#### Problem: "No vitals extracted"
**Solution:**
- This is expected - OCR is simulated with random sample data
- Upload will succeed but vitals are pre-generated
- In demo mode, vitals are automatically added

### 3. Chart/Dashboard Issues

#### Problem: "No vitals data yet"
**Solution:**
- Upload at least one medical report
- Vitals are automatically extracted on upload
- Refresh the page after uploading

#### Problem: Charts not displaying
**Solution:**
- Ensure you have uploaded reports with vitals
- Check that you're on the Dashboard tab
- Try refreshing the browser

### 4. Doctor Search Issues

#### Problem: "No doctors found"
**Solution:**
- Try selecting "All Specializations" and "All Cities"
- The app has 8 pre-seeded doctors
- Clear the search box
- Refresh the page to reload doctor data

### 5. Appointment Booking Issues

#### Problem: "Booking failed"
**Solution:**
- Ensure you're logged in as a patient
- Fill all required fields (date, time slot, reason)
- Select a future date
- Choose an available time slot

#### Problem: "No appointments showing"
**Solution:**
- Book an appointment first
- Refresh the page
- Check you're viewing the correct tab

### 6. Chat Issues

#### Problem: "Messages not sending"
**Solution:**
- Ensure you have an active appointment
- Check your internet connection
- Wait a few seconds - chat uses 3-second polling
- Refresh the page

#### Problem: "Chat not updating in real-time"
**Solution:**
- Chat updates every 3 seconds (polling)
- Wait up to 3 seconds for new messages
- For true real-time, WebSocket implementation needed

### 7. Backend/Server Issues

#### Problem: "Failed to fetch" or "Network error"
**Solution:**
- Check browser console for detailed errors
- Ensure Supabase backend is running
- Verify internet connection
- Try refreshing the page

#### Problem: "Unauthorized" errors
**Solution:**
- Log out and log back in
- Session may have expired
- Clear browser storage and try again

### 8. Performance Issues

#### Problem: "App is slow"
**Solution:**
- Clear browser cache
- Check internet connection speed
- Reduce number of uploaded reports
- Use modern browser (Chrome, Firefox, Safari)

#### Problem: "Images not loading"
**Solution:**
- Signed URLs expire after 24 hours
- Refresh the page to get new URLs
- Check Supabase storage bucket permissions

## Browser Compatibility

### Supported Browsers
✅ Chrome 90+
✅ Firefox 88+
✅ Safari 14+
✅ Edge 90+

### Not Supported
❌ Internet Explorer (any version)
❌ Opera Mini

## Developer Debugging

### Check Console Logs
```javascript
// Open browser console (F12)
// Look for:
- "HealthSync server started" - Backend is running
- "Seeded doctors data" - Doctors loaded
- "Created medical reports bucket" - Storage ready
```

### API Endpoint Testing

Test endpoints directly:
```bash
# Get doctors (replace with your project ID)
curl https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-62259918/doctors/search

# Get filters
curl https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-62259918/doctors/filters
```

### Check Supabase Status

1. Login to Supabase dashboard
2. Check project status
3. Verify Edge Functions are deployed
4. Check Storage bucket exists

## Known Limitations (Not Bugs)

1. **OCR is simulated** - No real text extraction
2. **Chat polling** - 3-second delay for messages
3. **Demo data** - Vitals are randomly generated
4. **No real-time updates** - Manual refresh needed for some features
5. **24-hour file URLs** - Signed URLs expire daily

## Getting Help

### Before Asking for Help:

1. ✅ Check browser console for errors
2. ✅ Try logging out and back in
3. ✅ Clear browser cache
4. ✅ Refresh the page
5. ✅ Check this troubleshooting guide
6. ✅ Verify you're using supported browser

### Reporting Issues:

Include:
- Browser and version
- Steps to reproduce
- Console error messages
- Screenshots if applicable
- Account type (patient/doctor)

## Emergency Reset

If nothing works:

1. **Clear all browser data**
   - Chrome: Settings > Privacy > Clear browsing data
   - Select "All time"
   - Check all boxes

2. **Hard refresh**
   - Windows: Ctrl + Shift + R
   - Mac: Cmd + Shift + R

3. **Try incognito/private mode**
   - Test if issue persists
   - Rules out extension conflicts

4. **Create new account**
   - If patient account is broken
   - Use different email

## Production Deployment Issues

### Vercel Deployment

**Problem:** Build fails
```bash
# Solution: Ensure package.json has correct scripts
npm run build
```

**Problem:** Environment variables missing
```bash
# Add in Vercel dashboard:
SUPABASE_URL
SUPABASE_ANON_KEY
```

### Netlify Deployment

**Problem:** 404 on routes
```bash
# Add netlify.toml:
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## API Rate Limiting

If you see "Too many requests":
- Wait 60 seconds
- Reduce polling frequency
- Implement exponential backoff

## Data Storage Limits

- Maximum 1000 reports per user (recommended)
- File size limit: 10MB per file
- Total storage: Based on Supabase plan

## Still Having Issues?

1. Check the main README.md
2. Review server logs in Supabase dashboard
3. Verify all dependencies are installed
4. Ensure using latest code version

---

**Remember:** This is a demo application. Many features are simplified for demonstration purposes.
