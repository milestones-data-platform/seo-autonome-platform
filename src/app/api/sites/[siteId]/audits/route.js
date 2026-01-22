import { NextResponse } from 'next/server';
import { db, auth } from '@/lib/firebase-admin';

export async function GET(request, { params }) {
  const token = request.headers.get('Authorization')?.split('Bearer ')[1];
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { siteId } = params;
    const decodedToken = await auth.verifyIdToken(token);
    const userId = decodedToken.uid;

    // 1. Verify Ownership
    const siteDoc = await db.collection('sites').doc(siteId).get();
    if (!siteDoc.exists || siteDoc.data().ownerId !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // 2. Fetch Audits
    const snapshot = await db.collection('sites').doc(siteId)
      .collection('audits')
      .orderBy('date', 'desc')
      .limit(20)
      .get();

    const audits = [];
    snapshot.forEach(doc => audits.push(doc.data()));

    return NextResponse.json({ audits });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
