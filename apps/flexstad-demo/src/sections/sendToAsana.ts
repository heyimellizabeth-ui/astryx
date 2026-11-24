// Copyright (c) Meta Platforms, Inc. and affiliates.

/** Which site form a request comes from; each maps to one Asana section. */
export type FormKind = 'interesse' | 'contact' | 'inschrijving' | 'aanmelding';

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
