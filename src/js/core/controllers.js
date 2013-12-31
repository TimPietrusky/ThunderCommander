'use strict';

/* Controllers */

var ThunderCommander = angular.module('ThunderCommander', []);

// Control the command center
ThunderCommander.controller('CommandCenterController', ['$scope', '$http',

  function($scope, $http) {

    // The missiles
    $scope.missiles = [
      {
        active: true
      },
      {
        active: true
      },
      {
        active: true
      },
      {
        active: true
      }
    ];

    // The current command which was send to the device
    $scope.currentCommand = '';

    // ID of the current missile
    $scope.currentMissile = 0;

    // Are we connected to the USB device?
    $scope.connected = false;

    // The message to show
    $scope.connectionMessage = '';

    // The last keyboard event
    $scope.lastKeyEvent = null;




    // Send a command to the server
    $scope.sendCommand = function(command) {

      // Set the current command for UI interactions
      $scope.currentCommand = command;

      // Send an HTTP request to the server
      $http.get('/?action='+command).success(function(data) {

        // Deactivate a fired missile
        if (data.action === 'fire' && data.result !== 'not connected' && $scope.currentMissile < $scope.missiles.length) {
          $scope.missiles[$scope.currentMissile].active = false;
          $scope.currentMissile++;
        }

        // Could not connect to device
        if (data.result === 'not connected') {
          $scope.connected = false;
          $scope.connectionMessage = 'offline';
        }

        // Connection to device was successful
        if (data.result === 'connected') {

          // Turn on the LED the first time we get a connection to the device
          if (!$scope.connected) {
            $scope.sendCommand('ledOn');
          }

          $scope.connected = true;
          $scope.connectionMessage = data.result;
        }
      });
    };




    // Try to connect for the first time
    $scope.sendCommand('connect');





    // Retrieve a key event and send an action
    $scope.sendKey = function(event) {
      var isKeyup = event.type === 'keyup',
          isSpace = event.keyCode === 32,
          isSupportedKey = false;

      // Don't send the same event again if the user keeps pressing the key
      if ($scope.lastKeyEvent && $scope.lastKeyEvent.keyCode === event.keyCode) {
        isSupportedKey = true;

      // Send the command on keyDown
      } else {
        $scope.lastKeyEvent = event;

        // Send a command based on the pressed key
        switch (event.keyCode) {

        // Left arrow
        case 37 : 
          $scope.sendCommand('left');
          isSupportedKey = true;
          break;

        // Up arrow
        case 38 : 
          $scope.sendCommand('up');
          isSupportedKey = true;
          break;

        // Right arrow
        case 39 : 
          $scope.sendCommand('right');
          isSupportedKey = true;
          break;

        // Down arrow
        case 40 : 
          $scope.sendCommand('down');
          isSupportedKey = true;
          break;

        // Space
        case 32 : 
          $scope.sendCommand('fire');
          isSupportedKey = true;
          break;

        // Only do something if the key is one of the supported ones
        default : 
          isSupportedKey = false;
          break;
        }
      }

      // Prevent the default key actions on supported keys
      if (isSupportedKey) {
        event.preventDefault();
      } else {
        // Reset last keyEvent if the key is not supported
        $scope.lastKeyEvent = null;
      }

      // Send stop command if the event is of type keyup
      if (isSupportedKey && isKeyup && !isSpace) {
        $scope.lastKeyEvent = null;
        $scope.sendCommand('stop');
      }

      // If the user triggers a keyUp on space the lastKeyEvent gets resetted
      // and the currentCommand is set to "stop"
      if (isKeyup && isSpace) {
        $scope.lastKeyEvent = null;
        $scope.currentCommand = 'stop';
      }
    };




    // Refresh the missiles 
    $scope.refreshMissiles = function() {
      // Set the active-property of every missile to true
      $scope.missiles.forEach(function(element, index) {
        $scope.missiles[index].active = true;
      });

      // Reset the current missile to 0
      $scope.currentMissile = 0;
    };





    // Refresh the connection status
    $scope.refreshStatus = function() {
      // Send the "connect" command
      $scope.sendCommand('connect');
    };
  }

]);