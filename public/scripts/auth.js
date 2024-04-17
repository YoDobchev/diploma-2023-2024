const svgCount = 5;
const svgFolder = "/public/icons/authenticate/";
const iconsDiv = document.querySelector(".icons");
const placedAreas = [];
const minDistance = 30;

async function loadAndPlaceSVGs() {
  for (let i = 1; i <= svgCount; i++) {
    try {
      const response = await fetch(`${svgFolder}/${i}.svg`);
      const svgText = await response.text();
      const maxIcons = Math.max(
        1,
        Math.floor((window.innerWidth / 500) * Math.random() * 2)
      );
      for (let j = 0; j < maxIcons; ++j) {
        placeSVG(svgText);
      }
    } catch (error) {
      console.error(`Failed to load SVG ${i}:`, error);
    }
  }
}

function placeSVG(svgText) {
  const container = document.createElement("div");
  container.classList.add("svg-container");
  container.innerHTML = svgText;
  iconsDiv.appendChild(container);

  adjustAndShowSVG(container);
}

function adjustAndShowSVG(container) {
  let x, y, rotation, isOverlapping;
  const viewportWidth = iconsDiv.offsetWidth;
  const viewportHeight = iconsDiv.offsetHeight;

  do {
    x = Math.random() * (viewportWidth - container.offsetWidth);
    y = Math.random() * (viewportHeight - container.offsetHeight);
    rotation = Math.random() * 60;
    rotation *= Math.round(Math.random()) ? 1 : -1;
    isOverlapping = checkOverlap(
      x,
      y,
      container.offsetWidth,
      container.offsetHeight
    );
  } while (isOverlapping);

  placedAreas.push({
    x,
    y,
    width: container.offsetWidth,
    height: container.offsetHeight,
  });

  container.style.transform = `translate(${x}px, ${y}px) rotate(${
    360 - rotation
  }deg)`;
}

function checkOverlap(x, y, width, height) {
  return placedAreas.some((area) => {
    // return !(
    //   x + width < area.x ||
    //   y + height < area.y ||
    //   x > area.x + area.width ||
    //   y > area.y + area.height
    // );
    return !(
      x + width + minDistance < area.x ||
      y + height + minDistance < area.y ||
      x > area.x + area.width + minDistance ||
      y > area.y + area.height + minDistance
    );
  });
  //   });
}

loadAndPlaceSVGs();

function findGetParameter(parameterName) {
  var result = null,
    tmp = [];
  location.search
    .substr(1)
    .split("&")
    .forEach(function (item) {
      tmp = item.split("=");
      if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
    });
  return result;
}
