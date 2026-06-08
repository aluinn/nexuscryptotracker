import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    // Check if we already generated alerts in the last 30 minutes
    const recent = await base44.entities.Alert.list('-created_date', 1);
    if (recent.length > 0) {
      const lastCreated = new Date(recent[0].created_date).getTime();
      const thirtyMinsAgo = Date.now() - 30 * 60 * 1000;
      if (lastCreated > thirtyMinsAgo) {
        return Response.json({ status: 'skipped', message: 'Alerts are fresh' });
      }
    }

    const body = await req.json().catch(() => ({}));
    const selectedCryptos = body.selected_cryptos || ['BTC', 'ETH'];
    const cryptoList = selectedCryptos.join(', ');

    // Generate fresh alerts from the web
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `You are a crypto push-notification system. Today is ${new Date().toISOString().split('T')[0]}.
Search the web for the very latest news for these specific assets only: ${cryptoList}.
Generate 5 short, punchy alerts — one per asset if possible.
Each alert title must be under 8 words. Each message must be 1 sentence max (under 15 words).
Focus on: price moves, major news, whale moves. Keep it brief like a phone notification.`,
      add_context_from_internet: true,
      response_json_schema: {
        type: 'object',
        properties: {
          alerts: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                title: { type: 'string' },
                message: { type: 'string' },
                type: { type: 'string', enum: ['high_impact', 'price_alert', 'news', 'new_listing', 'whale_alert', 'system'] },
                asset_tag: { type: 'string' },
                priority: { type: 'string', enum: ['high', 'medium', 'low'] }
              }
            }
          }
        }
      }
    });

    const newAlerts = result.alerts || [];

    // Delete old alerts (keep DB clean)
    const oldAlerts = await base44.entities.Alert.list('-created_date', 50);
    for (const old of oldAlerts) {
      await base44.entities.Alert.delete(old.id);
    }

    // Create fresh ones
    for (const alert of newAlerts) {
      await base44.entities.Alert.create({
        title: alert.title,
        message: alert.message,
        type: alert.type || 'news',
        asset_tag: alert.asset_tag || '',
        priority: alert.priority || 'medium',
        is_read: false,
      });
    }

    return Response.json({ status: 'ok', count: newAlerts.length });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});