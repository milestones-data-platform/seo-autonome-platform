import { NextResponse } from 'next/server';
import { db, auth } from '@/lib/firebase-admin';
import { PubSub } from '@google-cloud/pubsub';

const pubSubClient = new PubSub();
const TRIGGER_TOPIC = 'trigger-audit';

/**
 * GET /api/sites
 * Fetch all sites for the authenticated user
 */
export async function GET(request) {
  // 1. Authenticate Request
  const token = request.headers.get('Authorization')?.split('Bearer ')[1];
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const decodedToken = await auth.verifyIdToken(token);
    const userId = decodedToken.uid;

    // 2. Query Firestore
    // Note: Requires composite index if sorting by multiple fields
    const snapshot = await db.collection('sites')
      .where('ownerId', '==', userId)
      .orderBy('updatedAt', 'desc')
      .get();

    const sites = [];
    snapshot.forEach(doc => sites.push({ id: doc.id, ...doc.data() }));

    return NextResponse.json({ sites });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

/**
 * POST /api/sites
 * Create new site and trigger initial audit
 */
export async function POST(request) {
  const token = request.headers.get('Authorization')?.split('Bearer ')[1];
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const decodedToken = await auth.verifyIdToken(token);
    const userId = decodedToken.uid;
    const body = await request.json();

    if (!body.domainUrl) {
      return NextResponse.json({ error: 'Missing domainUrl' }, { status: 400 });
    }

    // 1. Create Site in Firestore
    const newSiteRef = db.collection('sites').doc();
    const siteData = {
      id: newSiteRef.id,
      ownerId: userId,
      domainUrl: body.domainUrl,
      name: body.name || new URL(body.domainUrl).hostname,
      settings: body.settings || { frequency: 'weekly', toneOfVoice: 'professional' },
      currentSeoScore: 0,
      createdAt: admin.firestore.Timestamp.now(),
      updatedAt: admin.firestore.Timestamp.now(),
      lastCrawledAt: null
    };

    await newSiteRef.set(siteData);

    // 2. Trigger Initial Audit via Pub/Sub
    if (process.env.NODE_ENV !== 'development') { // Skip in dev if no pubsub
      try {
        const messageJson = JSON.stringify({ siteId: newSiteRef.id, url: body.domainUrl });
        await pubSubClient.topic(TRIGGER_TOPIC).publishMessage({ data: Buffer.from(messageJson) });
        console.log(`Triggered audit for ${newSiteRef.id}`);
      } catch (pubErr) {
        console.warn('Failed to publish to Pub/Sub:', pubErr);
      }
    }

    return NextResponse.json({ site: siteData }, { status: 201 });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
