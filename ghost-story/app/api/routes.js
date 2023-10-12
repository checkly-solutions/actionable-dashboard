const axios = require('axios');

const apiKey = 'sv_e3b289cd144c4aba9b94259dbe50562b';
const accountID = '70a705d3-488c-4ade-8f54-376ae7e974ba';

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

async function getAllCheckGroups() {
  try {
    const response = await api.get('check-groups');
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

module.exports = {
  getAllCheckGroups,
  getAllChecks,
  getAllCheckStatuses,
  updateCheck,
};
