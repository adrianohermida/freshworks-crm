// Shared utilities for Freshdesk API integration

const FRESHDESK_DOMAIN = Deno.env.get("FRESHDESK_DOMAIN");
const FRESHDESK_BASIC_TOKEN = Deno.env.get("FRESHDESK_BASIC_TOKEN");

export function getFreshDeskHeaders() {
  return {
    'Authorization': `${FRESHDESK_BASIC_TOKEN}`,
    'Content-Type': 'application/json'
  };
}

export function getFreshDeskUrl(endpoint) {
  const domain = FRESHDESK_DOMAIN.endsWith('/') ? FRESHDESK_DOMAIN : `${FRESHDESK_DOMAIN}/`;
  return `${domain}api/v2/${endpoint}`;
}

export function mapFreshDeskStatus(fdStatus) {
  const statusMap = {
    2: 'open',
    3: 'pending',
    4: 'resolved',
    5: 'closed'
  };
  return statusMap[fdStatus] || 'open';
}

export function mapToBD44Status(bdStatus) {
  const statusMap = {
    'open': 2,
    'pending': 3,
    'resolved': 4,
    'closed': 5
  };
  return statusMap[bdStatus] || 2;
}

export function mapFreshDeskPriority(fdPriority) {
  const priorityMap = {
    1: 'low',
    2: 'medium',
    3: 'high',
    4: 'urgent'
  };
  return priorityMap[fdPriority] || 'medium';
}

export function mapToBD44Priority(bdPriority) {
  const priorityMap = {
    'low': 1,
    'medium': 2,
    'high': 3,
    'urgent': 4
  };
  return priorityMap[bdPriority] || 2;
}

export function validateFreshDeskCredentials() {
  if (!FRESHDESK_DOMAIN || !FRESHDESK_BASIC_TOKEN) {
    throw new Error('Freshdesk credentials not configured');
  }
}

export async function handleFreshDeskResponse(response) {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw {
      status: response.status,
      message: error.description || error.message || response.statusText,
      details: error
    };
  }
  return response.json();
}

export function validateTicketData(data) {
  const errors = [];
  if (!data.subject || data.subject.trim() === '') errors.push('subject is required');
  if (!data.description || data.description.trim() === '') errors.push('description is required');
  return errors.length > 0 ? { valid: false, errors } : { valid: true };
}