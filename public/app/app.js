window.app = angular.module('app', ['ngRoute','appCtrls']);
window.appCtrls = angular.module('appCtrls', []);




window.socket = io('http://localhost');
socket.on('connected', function (data) {
	console.log(data);
});