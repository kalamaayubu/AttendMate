import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import * as djwt from "https://deno.land/x/djwt@v2.8/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}
 
serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { tokens, title, body, data } = await req.json()

    // 1. Get Google Access Token
    const accessToken = await getGoogleAccessToken()
    const projectId = Deno.env.get('FIREBASE_PROJECT_ID')
    const fcmUrl = `https://fcm.googleapis.com/v1/projects/${projectId}/messages:send`

    // 2. Dispatch to FCM
    const results = await Promise.all(tokens.map(async (token: string) => {
      const res = await fetch(fcmUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          message: {
            token,
            notification: { title, body },
            data: data || {},
            android: {
              priority: 'high',
              notification: {
                channel_id: 'default',
                sound: 'default',
                default_vibrate_timings: true,
                visibility: 'public',
              }
            }
          },
        }),
      })
      return res.json()
    }))

    return new Response(JSON.stringify({ success: true, results }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})

async function getGoogleAccessToken() {
  const clientEmail = Deno.env.get('FIREBASE_CLIENT_EMAIL')
  const privateKey = Deno.env.get('FIREBASE_PRIVATE_KEY')?.replace(/\\n/g, '\n')

  if (!clientEmail || !privateKey) {
    throw new Error('Missing Firebase Secrets in Supabase Environment')
  }

  // 1. Prepare the JWT
  const now = Math.floor(Date.now() / 1000)
  const payload = {
    iss: clientEmail,
    scope: 'https://www.googleapis.com/auth/firebase.messaging',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now,
  }

  const header: djwt.Header = { alg: 'RS256', typ: 'JWT' }

  // 2. Parse the Private Key
  const pemContents = privateKey.replace(/---+(BEGIN|END) PRIVATE KEY---+/g, "").replace(/\s+/g, "")
  const binaryDer = Uint8Array.from(atob(pemContents), (c) => c.charCodeAt(0))

  // 3. Sign the JWT using Deno's native crypto
  const key = await crypto.subtle.importKey(
    "pkcs8",
    binaryDer,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"]
  )

  const jwt = await djwt.create(header, payload, key)

  // 4. Exchange JWT for Token
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  })

  const resData = await response.json()
  return resData.access_token
}