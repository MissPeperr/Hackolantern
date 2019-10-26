const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp();

exports.onImageUploaded = functions
  .storage
  .object()
  .onFinalize(fileObject => {
    const fileBucket = fileObject.bucket; // The Storage bucket that contains the file.
    const filePath = fileObject.name; // File path in the bucket.
    const contentType = fileObject.contentType; // File content type.

    console.log(fileBucket);
    console.log(filePath);
    console.log(contentType);
  });
