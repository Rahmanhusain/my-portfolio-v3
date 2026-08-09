import { getDb, isDbConfigured } from '@/lib/db/mongodb';
import { COLLECTIONS } from '@/lib/db/collections';

export type LeadType = 'contact' | 'booking';
export type LeadStatus = 'new' | 'read' | 'archived';

export interface LeadMeta {
  ip?: string;
  userAgent?: string;
  referrer?: string;
  path?: string;
  timezone?: string;
  language?: string;
  platform?: string;
  deviceType?: string;
  screen?: string;
}

export interface LeadInput {
  type: LeadType;
  name: string;
  email: string;
  phone?: string;
  /** Contact form only. */
  serviceType?: string;
  budget?: string;
  timeline?: string;
  message?: string;
  /** Booking modal only. */
  service?: string;
  details?: string;
  source?: string;
  meta: LeadMeta;
}

export interface LeadDoc extends LeadInput {
  status: LeadStatus;
  createdAt: Date;
}

/**
 * Persists a lead so it shows up in the admin panel's inbox.
 *
 * Every failure is swallowed. A lead that reaches Telegram or email but not
 * the database is a minor annoyance; a 500 on the contact form because Mongo
 * was briefly unreachable is a lost customer. The notification channels remain
 * the system of record — this is a searchable archive on top of them.
 */
export async function saveLead(input: LeadInput): Promise<void> {
  if (!isDbConfigured()) return;

  try {
    const db = await getDb();
    await db.collection<LeadDoc>(COLLECTIONS.leads).insertOne({
      ...input,
      status: 'new',
      createdAt: new Date(),
    });
  } catch (error) {
    console.error('[Leads] Failed to persist lead — notification path unaffected.', error);
  }
}
