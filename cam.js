var constraints = { video: { facingMode: "environment" }, audio: false };

const cameraView = document.querySelector("#camera--view"),
      cameraOutput = document.querySelector("#camera--output"),
      cameraSensor = document.querySelector("#camera--sensor"),
      cameraTrigger = document.querySelector("#camera--trigger")

function download(){
    var download = document.getElementById("download");
    var image = document.getElementById("CANVAS").toDataURL("image/png")
                    .replace("image/jpg", "image/octet-stream");
        download.setAttribute("href", image);
        //download.setAttribute("download","archive.png");
  }
var i=0;
function myFunction() {
  var x =  document.getElementById("CANVAS") ;
  var ctx = x.getContext("2d");
  ctx.fillStyle = "#FF0000";
  
  ctx.drawImage(video, 0, 0, 400, 350);

  //ctx.fillRect(20, 20, 150, 100);

  if (i <10)
  {
  document.body.appendChild(x);
  i=i+1;
};

function cameraStart() {
    navigator.mediaDevices
        .getUserMedia(constraints)
        .then(function(stream) {
        track = stream.getTracks()[0];
        cameraView.srcObject = stream;
    })
    .catch(function(error) {
        console.error("Oops. Something is broken.", error);
    });
}

cameraTrigger.onclick = function() {
    cameraSensor.width = cameraView.videoWidth;
    cameraSensor.height = cameraView.videoHeight;
    cameraSensor.getContext("2d").drawImage(cameraView, 0, 0);
    cameraOutput.src = cameraSensor.toDataURL("image/webp");
    cameraOutput.classList.add("taken");
};
window.addEventListener("load", cameraStart, false);
