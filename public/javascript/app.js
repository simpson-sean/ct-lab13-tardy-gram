/* eslint-disable no-undef */
const button = document.createElement('button');

button.textContent = 'Login';

button.addEventListener('click', () => {
  window.location.assign('/api/v1/auth/login'); 
});
// eslint-disable-next-line no-undef
document.getElementById('root').appendChild(button);

