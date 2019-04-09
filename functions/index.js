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
    const email = admin.database().ref(`/employee/${workerid}/email`).once('value').then((snapshot) => snapshot.val());
    res.send(email);
})