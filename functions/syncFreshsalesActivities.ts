import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

const API_KEY = 'lSTacm1hnwx1fofzXXNZ0w';
const DOMAIN = 'hmadv-org.myfreshworks.com';
const BASE = `https://${DOMAIN}/crm/sales/api`;

async function fetchFS(endpoint) {
  const res = await fetch(`${BASE}${endpoint}`, {
    headers: { "Authorization": `Token ${API_KEY}` }
  });
  if (!res.ok) throw new Error(`${res.status}: ${await res.text()}`);
  return res.json();
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const tenant_id = user.email.split('@')[0];
    let synced = 0;

    // Sync Tasks
    let page = 1, hasMore = true;
    while (hasMore) {
      const data = await fetchFS(`/v2/tasks?page=${page}&per_page=50`);
      const tasks = data.tasks || [];
      if (tasks.length === 0) break;

      for (const task of tasks) {
        const existing = await base44.asServiceRole.entities.FreshsalesActivity.filter({
          freshsales_id: task.id.toString(),
          tenant_id
        });

        const activityData = {
          freshsales_id: task.id.toString(),
          contact_id: task.targetable_id?.toString() || "",
          type: "task",
          title: task.title || "",
          description: task.description || "",
          status: task.is_completed ? "completed" : "pending",
          priority: task.priority || "medium",
          due_date: task.due_date,
          assigned_to: task.user_id?.toString() || "",
          last_synced_at: new Date().toISOString(),
          tenant_id
        };

        if (existing.length > 0) {
          await base44.asServiceRole.entities.FreshsalesActivity.update(existing[0].id, activityData);
        } else {
          await base44.asServiceRole.entities.FreshsalesActivity.create(activityData);
        }
        synced++;
      }

      if (tasks.length < 50) hasMore = false;
      page++;
    }

    // Sync Sales Activities
    page = 1; hasMore = true;
    while (hasMore) {
      const data = await fetchFS(`/v2/sales_activities?page=${page}&per_page=50`);
      const activities = data.sales_activities || [];
      if (activities.length === 0) break;

      for (const activity of activities) {
        const existing = await base44.asServiceRole.entities.FreshsalesActivity.filter({
          freshsales_id: activity.id.toString(),
          tenant_id
        });

        const activityData = {
          freshsales_id: activity.id.toString(),
          contact_id: activity.contact_id?.toString() || "",
          type: activity.activity_type || "note",
          title: activity.subject || activity.activity_type || "",
          description: activity.body || activity.notes || "",
          status: activity.is_completed ? "completed" : "pending",
          priority: "medium",
          due_date: activity.due_date,
          assigned_to: activity.owner_id?.toString() || "",
          outcome: activity.outcome || "",
          duration_minutes: activity.duration_minutes || null,
          last_synced_at: new Date().toISOString(),
          tenant_id
        };

        if (existing.length > 0) {
          await base44.asServiceRole.entities.FreshsalesActivity.update(existing[0].id, activityData);
        } else {
          await base44.asServiceRole.entities.FreshsalesActivity.create(activityData);
        }
        synced++;
      }

      if (activities.length < 50) hasMore = false;
      page++;
    }

    return Response.json({ success: true, synced });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});