import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';
import {
  getFreshDeskHeaders,
  getFreshDeskUrl,
  validateFreshDeskCredentials,
  handleFreshDeskResponse
} from './freshDeskHelper.js';

Deno.serve(async (req) => {
  try {
    validateFreshDeskCredentials();
    const base44 = createClientFromRequest(req);
    
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch ticket fields
    const fieldsResponse = await fetch(
      getFreshDeskUrl('ticket_fields'),
      { headers: getFreshDeskHeaders() }
    );

    const fieldsData = await handleFreshDeskResponse(fieldsResponse);
    const fields = fieldsData.ticket_fields || [];

    // Separate custom from built-in fields
    const customFields = fields.filter(f => f.custom_field === true);
    const builtinFields = fields.filter(f => f.custom_field === false);

    const formatted = fields.map(field => ({
      id: field.id,
      name: field.name,
      label: field.label,
      type: field.field_type,
      required: field.required_for_agents || false,
      customers_can_edit: field.customers_can_edit || false,
      default_value: field.default_value,
      choices: field.choices || [],
      is_custom: field.custom_field || false,
      position: field.position
    }));

    return Response.json({
      success: true,
      summary: {
        total_fields: formatted.length,
        custom_fields: customFields.length,
        builtin_fields: builtinFields.length
      },
      fields: formatted
    });
  } catch (error) {
    console.error('getCustomFieldsMetadata error:', error);
    return Response.json({
      error: error.message || 'Failed to fetch custom fields',
      details: error.details || error
    }, { status: error.status || 500 });
  }
});