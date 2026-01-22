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

    // 2. Fetch Proposals (Pending by default)
    // Filter logic can be added via query params
    const snapshot = await db.collection('sites').doc(siteId)
      .collection('proposals')
      .where('status', '==', 'pending_validation')
      .limit(50)
      .get();

    const proposals = [];
    snapshot.forEach(doc => proposals.push(doc.data()));

    return NextResponse.json({ proposals });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

/**
 * POST (Validation)
 * Approve or Reject a proposal
 */
export async function POST(request, { params }) {
  const token = request.headers.get('Authorization')?.split('Bearer ')[1];
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { siteId } = params;
    const { proposalId, action, reason } = await request.json(); // action: 'approve' | 'reject'
    
    if (!['approve', 'reject'].includes(action)) {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    const decodedToken = await auth.verifyIdToken(token);
    const userId = decodedToken.uid;

    // 1. Check Ownership
    const siteDoc = await db.collection('sites').doc(siteId).get();
    if (siteDoc.data().ownerId !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // 2. Update Proposal
    const proposalRef = db.collection('sites').doc(siteId).collection('proposals').doc(proposalId);
    
    const updateData = {
      status: action === 'approve' ? 'approved' : 'rejected',
      updatedAt: admin.firestore.Timestamp.now()
    };
    
    if (action === 'approve') {
      updateData.deploymentInfo = {
        approvedBy: userId,
        approvedAt: admin.firestore.Timestamp.now()
      };
      // Here: Trigger Deployment Webhook or Pub/Sub
    } else {
      updateData.rejectionInfo = {
        rejectedBy: userId,
        rejectedAt: admin.firestore.Timestamp.now(),
        reason: reason || 'No reason provided'
      };
    }

    await proposalRef.update(updateData);

    return NextResponse.json({ success: true, status: updateData.status });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
