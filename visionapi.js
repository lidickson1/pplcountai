const express = require('express');

const app = express();

const vision = require('@google-cloud/vision');


const client = new vision.ImageAnnotatorClient();

const request = {
    
        "image": {
          "source": {
            "imageUri": "gs://poeplecountaiimages/image3.jpg"
          }
        }
      }


function countFaces(){
client.faceDetection(request)
.then(results=>{
    const faces = results[0].faceAnnotations;
    const numFaces = faces.length;
    console.log(`Found ${numFaces} face${numFaces === 1 ? '' : 's'}.`);
    return faces;
})
.catch(err=>{
    console.error('ERROR', err);
});
};


countFaces();


app.listen(5000, ()=>{
    console.log('Express running on port 5000');
});



