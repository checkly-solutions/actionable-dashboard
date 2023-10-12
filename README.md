# actionable-dashboard
Currently Dashboards are related to tags and are not actionable. You can't mute, deactivate or unmute or activate checks. This will occur over a few phases with V1 being entirely API based with later versions having a UI component for improved navigation.


GET ALL CHECK GROUPS

const options = {
  method: 'GET',
  headers: {accept: 'application/json', 'x-checkly-account': 'asdfasd'}
};

fetch('https://api.checklyhq.com/v1/check-groups?limit=10&page=1', options)
  .then(response => response.json())
  .then(response => console.log(response))
  .catch(err => console.error(err));

LIST ALL CHECK RESULTS


const options = {method: 'GET', headers: {accept: 'application/json', Authorization: 'Bearer'}};

fetch('https://api.checklyhq.com/v1/check-results/asdfasd?limit=10&page=1&resultType=FINAL', options)
  .then(response => response.json())
  .then(response => console.log(response))
  .catch(err => console.error(err));