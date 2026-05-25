import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { ComplaintStatus } from '@/types/complaint';

export async function setComplaintStatus(
  id: string,
  status: ComplaintStatus,
  by: string
): Promise<void> {
  const updates: Record<string, unknown> = {
    status,
    updatedAt: serverTimestamp()
  };
  if (status === 'resolved' || status === 'rejected') {
    updates.resolvedBy = by;
    updates.resolvedAt = serverTimestamp();
  }
  await updateDoc(doc(db, 'complaints', id), updates);
  console.log('[COMPLAINTS]', id, '→', status);
}

export async function resolveComplaint(
  id: string,
  resolution: string,
  refundAmount: number | null,
  by: string
): Promise<void> {
  await updateDoc(doc(db, 'complaints', id), {
    status: 'resolved',
    resolution: resolution.trim() || null,
    refundAmount: refundAmount,
    resolvedBy: by,
    resolvedAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  console.log('[COMPLAINTS] resolved', id, 'refund=', refundAmount);
}
