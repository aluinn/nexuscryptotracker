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

    // Generate fresh alerts from the web
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `You are a crypto news alert system. Today is ${new Date().toISOString().split('T')[0]}.
Search the web for the latest (today's) cryptocurrency news and generate 6 relevant alerts.
Focus on: price movements, major news events, whale activity, new listings, regulatory news.
Return a JSON array of alert objects.`,
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