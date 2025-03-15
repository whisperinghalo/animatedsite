const canvas = document.querySelector("#page>canvas");
const context = canvas.getContext("2d");

// Ensure canvas dimensions match the viewport
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

// Function to get image file paths
function files(index) {
  const basePath = "img/"; // Adjust this path as needed
  const paddedIndex = String(index + 1).padStart(3, '0'); // Ensures index is three digits long
  return `${basePath}${paddedIndex}.png`;
}

const frameCount = 169;
const images = [];
const imageSeq = { frame: 0 };
let loadedImages = 0;

// Preload images before animation starts
for (let i = 0; i < frameCount; i++) {
  const img = new Image();
  img.src = files(i);
  img.onload = () => {
    loadedImages++;
    if (loadedImages === frameCount) {
      startAnimation();
      render(); // Render first frame immediately
    }
  };
  images.push(img);
}

function startAnimation() {
  gsap.to(imageSeq, {
    frame: frameCount - 1,
    snap: "frame",
    ease: "none",
    scrollTrigger: {
      scrub: 0.15,
      trigger: "#page>canvas",
      start: "top top",
      end: "600% top",
    },
    onUpdate: render,
  });

  ScrollTrigger.create({
    trigger: "#page>canvas",
    pin: true,
    start: "top top",
    end: "600% top",
  });
}

// Render function to update canvas
function render() {
  console.log(`Rendering frame: ${imageSeq.frame}`);
  scaleImage(images[imageSeq.frame], context);
}

// Function to scale image to fit canvas
function scaleImage(img, ctx) {
  var canvas = ctx.canvas;
  var width = canvas.width;
  var height = canvas.height;
  var imgWidth = img.width;
  var imgHeight = img.height;

  var scale = Math.min(width / imgWidth, height / imgHeight);
  var x = (width / 2) - (imgWidth / 2) * scale;
  var y = (height / 2) - (imgHeight / 2) * scale;

  ctx.clearRect(0, 0, width, height);
  ctx.drawImage(img, x, y, imgWidth * scale, imgHeight * scale);
}

// Pin additional sections
["#page1", "#page2", "#page3"].forEach((selector) => {
  gsap.to(selector, {
    scrollTrigger: {
      trigger: selector,
      start: "top top",
      end: "bottom top",
      pin: true,
    }
  });
});

