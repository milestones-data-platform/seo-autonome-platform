const { chromium } = require('playwright');
const admin = require('firebase-admin');
const { Storage } = require('@google-cloud/storage');
const path = require('path');
const os = require('os');
const fs = require('fs');

// Initialize Firebase Admin
// Uses ADC (Application Default Credentials) in Cloud Run
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();
const storage = new Storage();

// Environment Variables
const SITE_ID = process.env.SITE_ID;
const TARGET_URL = process.env.TARGET_URL;
const BUCKET_NAME = process.env.BUCKET_NAME || 'seo-raw-data';

// Validation
if (!SITE_ID || !TARGET_URL) {
  console.error('❌ Missing required environment variables: SITE_ID or TARGET_URL');
  process.exit(1);
}

/**
 * Main Crawler Function
 */
async function runCrawler() {
  console.log(`🚀 Starting crawl for Site: ${SITE_ID}, URL: ${TARGET_URL}`);
  
  const auditId = `audit_${Date.now()}`;
  const startTime = Date.now();
  let browser = null;
  let status = 'failed';
  let error = null;
  let rawHtmlStorageUrl = null;
  let metrics = {};
  let extractedData = {};

  try {
    // 1. Launch Browser
    browser = await chromium.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const context = await browser.newContext({
      userAgent: 'SEO-Autonome-Bot/1.0 (+https://seo-autonome.com/bot)'
    });
    const page = await context.newPage();

    // 2. Navigate
    console.log('Visiting page...');
    const response = await page.goto(TARGET_URL, { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });

    const httpStatus = response.status();
    console.log(`HTTP Status: ${httpStatus}`);

    // Measure performance metrics from Navigation Timing API
    const timing = await page.evaluate(() => {
      const entry = performance.getEntriesByType('navigation')[0];
      return {
        loadTime: entry.loadEventEnd - entry.startTime,
        domInteractive: entry.domInteractive - entry.startTime,
      };
    });

    // 3. Extract SEO Data
    extractedData = await page.evaluate(() => {
      // Helper to clean text
      const cleanText = (txt) => txt ? txt.trim().replace(/\s+/g, ' ') : '';

      // Meta tags
      const title = document.title;
      const metaDesc = document.querySelector('meta[name="description"]')?.content || '';
      const metaRobots = document.querySelector('meta[name="robots"]')?.content || '';
      
      // Headings
      const h1s = Array.from(document.querySelectorAll('h1')).map(el => cleanText(el.innerText));
      const h2s = Array.from(document.querySelectorAll('h2')).map(el => cleanText(el.innerText));
      const h3s = Array.from(document.querySelectorAll('h3')).map(el => cleanText(el.innerText));

      // Links
      const links = Array.from(document.querySelectorAll('a[href]')).map(el => ({
        text: cleanText(el.innerText),
        href: el.href,
        rel: el.getAttribute('rel')
      }));

      // Content (Main text content for AI analysis)
      // Removing scripts, styles, etc. for cleaner text extraction
      const clone = document.body.cloneNode(true);
      const toRemove = clone.querySelectorAll('script, style, noscript, iframe, svg');
      toRemove.forEach(el => el.remove());
      const mainContent = cleanText(clone.innerText).substring(0, 50000); // Limit size

      return {
        title,
        metaDesc,
        metaRobots,
        headings: { h1: h1s, h2: h2s, h3: h3s },
        links: links.slice(0, 100), // Limit number of links returned
        mainContent
      };
    });

    // 4. Calculations (Mock scores for now - in real world would use Lighthouse lib)
    metrics = {
      seoScore: calculateSimpleScore(extractedData),
      performance: httpStatus === 200 ? 90 : 0,
      accessibility: 85, // Placeholder
      bestPractices: 88, // Placeholder
      seo: 92 // Placeholder
    };

    // 5. Save Raw HTML to Cloud Storage
    const html = await page.content();
    const fileName = `${SITE_ID}/${auditId}.html`;
    
    // Simulate GCS upload in dry-run/local mode if no credentials might fail
    try {
      if (process.env.NODE_ENV !== 'local_test') {
        const bucket = storage.bucket(BUCKET_NAME);
        const file = bucket.file(fileName);
        await file.save(html, {
          contentType: 'text/html',
          metadata: { siteId: SITE_ID, url: TARGET_URL }
        });
        rawHtmlStorageUrl = `gs://${BUCKET_NAME}/${fileName}`;
        console.log(`✅ Saved HTML to ${rawHtmlStorageUrl}`);
      } else {
        console.log('📝 Local Test: Skipping Cloud Storage upload');
        rawHtmlStorageUrl = 'local-test-no-upload';
      }
    } catch (gcsError) {
      console.warn('⚠️ GCS Upload failed (check permissions/bucket):', gcsError.message);
      rawHtmlStorageUrl = 'upload-failed';
    }

    status = 'completed';

  } catch (err) {
    console.error('❌ Crawl Error:', err);
    error = err.message;
    status = 'failed';
  } finally {
    if (browser) {
      await browser.close();
    }
  }

  const duration = Date.now() - startTime;

  // 6. Save Audit Result to Firestore
  try {
    const auditData = {
      id: auditId,
      date: admin.firestore.Timestamp.now(),
      status,
      error: error || null,
      targetUrl: TARGET_URL,
      httpStatus: status === 'completed' ? 200 : 0, // Simplified
      duration,
      metrics,
      coreWebVitals: {
        // In a real implementation, getting CWV requires more complex Playwright setup or Lighthouse
        lcp: 2.5, // Mock value
        cls: 0.05,
        fid: 40
      },
      extractedData: {
        title: extractedData.title || '',
        metaDesc: extractedData.metaDesc || '',
        headings: extractedData.headings || {},
        linkCount: extractedData.links?.length || 0
      },
      rawHtmlStorageUrl
    };

    // Save to sites/{siteId}/audits/{auditId}
    await db.collection('sites').doc(SITE_ID)
      .collection('audits').doc(auditId)
      .set(auditData);
    
    console.log(`✅ Audit saved to Firestore: sites/${SITE_ID}/audits/${auditId}`);

    // 7. Update Parent Site Document
    await db.collection('sites').doc(SITE_ID).update({
      lastCrawledAt: admin.firestore.Timestamp.now(),
      currentSeoScore: metrics.seoScore || 0,
      'settings.lastAuditStatus': status
    });
const { notifyAuditCompletion } = require('./pubsub-notifier');

// ... (existing code)

    console.log(`✅ Site document updated`);

    // 8. Notify Analysis Service via Pub/Sub
    await notifyAuditCompletion(SITE_ID, auditId, status === 'completed' ? 'success' : 'failed', {
      duration,
      seoScore: metrics.seoScore
    });

  } catch (dbError) {
    console.error('❌ Firestore Save Error:', dbError);
    // If this fails, the job fails
    process.exit(1);
  }

  process.exit(status === 'completed' ? 0 : 1);
}

/**
 * Simple heuristic scoring based on presence of basic SEO tags
 */
function calculateSimpleScore(data) {
  if (!data) return 0;
  let score = 0;
  
  if (data.title && data.title.length > 0 && data.title.length < 60) score += 20;
  if (data.metaDesc && data.metaDesc.length > 50 && data.metaDesc.length < 160) score += 20;
  if (data.headings?.h1?.length === 1) score += 20; // Exactly one H1
  if (data.headings?.h2?.length > 0) score += 10;
  if (data.mainContent && data.mainContent.length > 300) score += 30;

  return score;
}

// Start
runCrawler();
