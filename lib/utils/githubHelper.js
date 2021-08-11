
const fetch = require('node-fetch');


const exchangeCodeForToken = async (code) => {
  const res = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      code, 
    }),
  });
  const body = await res.json();
  console.log(body); 
  return body.access_token; 
 
}; 

const getUserProfile = () => {

}; 


module.exports = {
  exchangeCodeForToken, 
  getUserProfile
};
