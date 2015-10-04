// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('cinstagram', ['ionic', 'cinstagram.controllers'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/app.html'
  })

  // Each tab has its own nav history stack:

  .state('app.home', {
    url: '/home',
    views: {
      'app-home': {
        templateUrl: 'templates/app-home.html',
        controller: 'HomeCtrl'
      }
    }
  })

  .state('app.search', {
    url: '/search',
    views: {
      'app-search': {
        templateUrl: 'templates/app-search.html',
        controller: 'SearchCtrl'
      }
    }
  })

  .state('app.camera', {
    url: '/camera',
    views: {
      'app-camera': {
        templateUrl: 'templates/app-camera.html',
        controller: 'CameraCtrl'
      }
    }
  })

  .state('app.activity', {
    url: '/activity',
    views: {
      'app-activity': {
        templateUrl: 'templates/app-activity.html',
        controller: 'ActivityCtrl'
      }
    }
  })

  .state('app.activity.following', {
    url: '/following',
    views: {
      'activity-following': {
        templateUrl: 'templates/activity-following.html',
        controller: 'ActivityCtrl'
      }
    }
  })

  .state('app.activity.you', {
    url: '/you',
    views: {
      'activity-you': {
        templateUrl: 'templates/activity-you.html',
        controller: 'ActivityCtrl'
      }
    }
  })

  .state('app.profile', {
    url: '/profile',
    views: {
      'app-profile': {
        templateUrl: 'templates/app-profile.html',
        controller: 'ProfileCtrl'
      }
    }
  })

  .state('welcome', {
    url: '/welcome',
    absract: true,
    templateUrl: 'templates/welcome.html'
  })

  .state('welcome.signin', {
    url: '/signin',
    views: {
      'welcome-signin': {
        templateUrl: 'templates/welcome-signin.html',
        controller: 'WelcomeCtrl'
      }
    }
  })

  .state('welcome.signup', {
    url: '/signup',
    views: {
      'welcome-signup': {
        templateUrl: 'templates/welcome-signup.html',
        controller: 'WelcomeCtrl'
      }
    }
  })

  ;

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('welcome/signin');

});