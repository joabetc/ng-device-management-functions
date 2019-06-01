const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

exports.addEmployee = functions.database.ref('/user/{userId}')
    .onCreate((snapshot, context) => {
        console.log('User created:', context.params.userId);
        const user = snapshot.val();
        return admin.database().ref('/employee').child(user.workerid).set({ 'email': user.email });
    });

exports.employeeEmail = functions.https.onRequest((req, res) => {
    const workerid = req.query.id;
    console.log(workerid);
    return admin.database().ref('/employee/'+ workerid).once('value')
        .then((snapshot) => res.send(snapshot.val().email));
});

exports.addAdminRole = functions.https.onCall((data, context) => {
    if (context.auth.token.isAdmin !== true) {
        return {
            error: "Request not authorized. User must be an administrator to fullfill request."
        }
    };
    const email = data.email;
    return grantRoleByEmail(email, { isAdmin: true }).then(() => {
        return {
            result: "Request fullfilled! " + email + " is noew an administrator;"
        };
    });
});
