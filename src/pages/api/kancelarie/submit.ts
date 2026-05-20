export const prerender = false;

import type { APIRoute } from 'astro';
import { tursoExecute } from '../../../utils/turso';

export const POST: APIRoute = async ({ request }) => {
  let body: Record<string, unknown>;

  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Nieprawidłowe dane.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim() : '';
  const description = typeof body.description === 'string' ? body.description.trim() : '';

  if (!name) {
    return new Response(JSON.stringify({ error: 'Nazwa kancelarii jest wymagana.' }), {
      status: 422,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!email || !email.includes('@')) {
    return new Response(JSON.stringify({ error: 'Podaj prawidłowy adres email.' }), {
      status: 422,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!description || description.length <= 30) {
    return new Response(
      JSON.stringify({ error: 'Opis musi mieć co najmniej 31 znaków.' }),
      { status: 422, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    await tursoExecute(
      `INSERT INTO kancelarie (name, email, description, city, voivodeship, specializations, since_year, status)
       VALUES (?, ?, ?, '', '', '', NULL, 'pending')`,
      [name, email, description]
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[submit kancelarie]', msg);
    return new Response(
      JSON.stringify({ error: 'Błąd serwera. Spróbuj ponownie za chwilę.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
