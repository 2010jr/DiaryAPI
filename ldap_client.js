'use strict';

var ldap = require('ldapjs');
var client = ldap.createClient({
		url: 'ldap://127.0.0.1:389'
});

function authenticate(userName, password, errorHandle) {
	var dn = 'sn=' + userName + ',ou=Users,dc=musashi,dc=com';
	console.log("dn is " + dn);
	client.bind(dn,password, errorHandle);
}

module.exports = {
	authenticate: authenticate
}
