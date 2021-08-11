const button = document.createElement('button');

button.textContent = "Login";

button.addEventListener('click', () => {
    // window.location.assign('/api/v1/auth/login')
    console.log('hello world');
});
document.getElementById('root').appendChild(button);

