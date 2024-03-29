const axios = require('axios');
require('dotenv').config({ path: '.env.local' });
const apiKey = process.env.NEXT_PUBLIC_API_KEY;
const accountID = process.env.NEXT_PUBLIC_ACCOUNT_ID;

const api = axios.create({
  baseURL: 'https://api.checklyhq.com/v1/',
  headers: {
    Authorization: `Bearer ${apiKey}`,
    'x-checkly-account': `${accountID}`,
    'Content-Type': 'application/json',
  },
});

async function getAllChecks() {
  try {
    const response = await api.get('checks');
    console.log(response.data, 'checks');
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function getAllCheckGroups() {
  try {
    const response = await api.get('check-groups');
    console.log(response.data, 'groups');
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function getAllCheckStatuses() {
  try {
    const response = await api.get('check-statuses');
    console.log(response.data, 'check statuses');
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function getAnalyticsBrowser(id) {
  try {
    const response = await api.get(
      `analytics/browser-checks/${id}?quickRange=thisWeek&metrics=availability`
    );
    console.log(response.data, 'browser analytics');
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function getAnalyticsApi(id) {
  try {
    const response = await api.get(
      `analytics/api-checks/${id}?quickRange=thisMonth&metrics=availability`
    );
    console.log(response.data, 'api analytics');
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function updateCheck(checkId, updateData) {
  try {
    const response = await api.put(`checks/${checkId}`, updateData);
    console.log(response.data, 'updated check');
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

module.exports = {
  getAllCheckGroups,
  getAllChecks,
  getAllCheckStatuses,
  updateCheck,
  getAnalyticsApi,
  getAnalyticsBrowser,
};
