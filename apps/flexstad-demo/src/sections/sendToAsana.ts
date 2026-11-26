// Copyright (c) Meta Platforms, Inc. and affiliates.

/** Which site form a request comes from; each maps to one Asana section. */
export type FormKind =
  'interesse' | 'contact' | 'inschrijving' | 'aanmelding' | 'reparatie';

export type SendResult = 'sent' | 'error' | 'not-connected';

const ENDPOINT = '/api/aanvraag.php';

/**
 * Posts a form to the site's own PHP endpoint, which holds the Asana token.
 * `startedAt` and the empty `website` field feed the endpoint's spam checks.
 */
export async function sendToAsana(
  kind: FormKind,
  fields: Record<string, string>,
  meta: {startedAt: number; website: string},
): Promise<SendResult> {
  try {
    const response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        kind,
        fields,
        startedAt: meta.startedAt,
        website: meta.website,
        page: window.location.pathname,
      }),
    });
    if (response.status === 503 || response.status === 404) {
      return 'not-connected';
    }
    return response.ok ? 'sent' : 'error';
  } catch {
    return 'error';
  }
}

/** What a repair report came back with. */
export type RepairResult =
  | {
      status: 'sent';
      /** The code the tenant can quote; empty when the endpoint gave none. */
      reference: string;
      photos: number;
      /** Photos that did not reach Asana (the report itself did). */
      photosFailed: number;
    }
  | {status: 'error'; message?: string}
  | {status: 'not-connected'};

/**
 * Posts a repair report with its photos. Unlike the other forms this is
 * multipart, because the photos are files. The browser sets the content type
 * (with its boundary), so none is given here.
 */
export async function sendRepair(
  fields: Record<string, string>,
  photos: ReadonlyArray<File>,
  meta: {startedAt: number; website: string},
): Promise<RepairResult> {
  const body = new FormData();
  body.append('kind', 'reparatie');
  body.append('startedAt', String(meta.startedAt));
  body.append('website', meta.website);
  body.append('page', window.location.pathname);
  for (const [key, value] of Object.entries(fields)) {
    body.append(`fields[${key}]`, value);
  }
  for (const photo of photos) {
    body.append('photos[]', photo, photo.name);
  }
  try {
    const response = await fetch(ENDPOINT, {method: 'POST', body});
    if (response.status === 503 || response.status === 404) {
      return {status: 'not-connected'};
    }
    const data: unknown = await response.json().catch(() => null);
    const record =
      data !== null && typeof data === 'object'
        ? (data as Record<string, unknown>)
        : {};
    if (!response.ok) {
      // The endpoint's own message is shown only for a request the tenant can
      // fix (too big, wrong file type); anything else stays generic.
      const message =
        (response.status === 413 || response.status === 422) &&
        typeof record.error === 'string'
          ? record.error
          : undefined;
      return {status: 'error', message};
    }
    return {
      status: 'sent',
      reference: typeof record.reference === 'string' ? record.reference : '',
      photos: typeof record.photos === 'number' ? record.photos : photos.length,
      photosFailed:
        typeof record.photosFailed === 'number' ? record.photosFailed : 0,
    };
  } catch {
    return {status: 'error'};
  }
}

/**
 * Posts a form to Formspree (the e-mail copy). Formspree reads `_subject` as
 * the e-mail subject and `_gotcha` as its own spam honeypot.
 */
export async function sendToFormspree(
  endpoint: string,
  fields: Record<string, string>,
  website: string,
): Promise<SendResult> {
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {'Content-Type': 'application/json', Accept: 'application/json'},
      body: JSON.stringify({...fields, _gotcha: website}),
    });
    return response.ok ? 'sent' : 'error';
  } catch {
    return 'error';
  }
}
