angular.module('cinstagram.constants', [])
.constant('URL', {
    base: 'http://cinstagram.herokuapp.com',
    // base: 'http://localhost:5000',
    authenticate: '/auth',
    users: '/users',
    posts: '/posts',
    comments: '/comments'
});
