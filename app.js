//-------------------------------------Alerts---------------------------------------------------------
//window.alert("Weather of the nearest city in api data will be shown");
//--------------------------------------Variables-------------------------------------------
const cancelBtn = document.querySelector(".cancel");
const hiddenBar = document.querySelector(".hiddenbar");
const units = document.querySelectorAll(".btn");
const searchBtn = document.querySelector(".search");
const searchText = document.querySelector(".textarea input[type=text]");
console.log(searchText);
const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
var myLocation;
var flag = true;
var latlon;

//---------------------------------------Functions----------------------------------------------
const converter = (temp) => {
  return Math.round((temp * 9) / 5 + 32);
};

const render = (object) => {
  console.log("run");
  var weatherarr = object.consolidated_weather;
  var time = new Date(`${object.time}`);

  //sidebar image
  document.querySelector(
    ".weatherimage1"
  ).src = `${weatherarr[0].weather_state_name.replace(/ /g, "")}.png`;

  //sidebar temp
  document.querySelector(".tempnum").innerText = flag
    ? `${Math.floor(weatherarr[0].the_temp)}`
    : `${converter(weatherarr[0].the_temp)}`;
  //sidebar temptype
  document.querySelector(".temptype").innerText = flag ? "°C" : "°F";

  //sidebar status
  document.querySelector(
    ".weathertype"
  ).innerText = `${weatherarr[0].weather_state_name}`;

  //date
  document.querySelector(".date span:nth-child(3)").innerText = `${
    weekdays[time.getDay()]
  }, ${time.getDate()} ${months[time.getMonth()]}`;

  //mylocation
  document.querySelector(".placename").innerText = `${object.title}`;

  //cards
  var i = 1;
  document.querySelectorAll(".day").forEach((elm) => {
    time.setDate(time.getDate() + 1);
    elm.children[0].innerText =
      i == 1
        ? "Tomorrow"
        : `${weekdays[time.getDay()]}, ${time.getDate()} ${
            months[time.getMonth()]
          }`;

    elm.children[1].children[0].src = `${weatherarr[
      i
    ].weather_state_name.replace(/ /g, "")}.png`;
    elm.children[2].children[0].innerText = flag
      ? `${Math.floor(weatherarr[i].max_temp)}°C`
      : `${converter(weatherarr[i].max_temp)}°F`;
    elm.children[2].children[1].innerText = flag
      ? `${Math.floor(weatherarr[i].min_temp)}°C`
      : `${converter(weatherarr[i].min_temp)}°F`;
    i++;
  });
  //wind status
  document.querySelector(".windmag").innerText = `${Math.floor(
    weatherarr[0].wind_speed
  )}`;
  document.querySelector(
    ".wind-direction"
  ).children[0].style.transform = `rotateZ(${
    Math.round(weatherarr[0].wind_direction / 45) * 45
  }deg)`;
  document.querySelector(".wind-direction").children[1].innerText =
    weatherarr[0].wind_direction_compass;
  //Humidity
  document.querySelector(".humidpercent").innerText = weatherarr[0].humidity;
  document.querySelector(".bar2").style.width = `${weatherarr[0].humidity}%`;
  //visibiilty
  document.querySelector(".visibility").innerText = Math.round(
    weatherarr[0].visibility
  );
  //air pressure
  document.querySelector(".airpressure").innerText = weatherarr[0].air_pressure;
};

const weatherLocation = (woeid) => {
  fetch(
    `https://api.allorigins.win/get?url=${encodeURIComponent(
      `https://www.metaweather.com/api/location/${woeid}`
    )}`
  )
    .then((res) => res.json())
    .then((data) => {
      console.log(JSON.parse(data.contents));
      render(JSON.parse(data.contents));
    });
};
const woeidLocation = (latlon) => {
  fetch(
    `https://api.allorigins.win/get?url=${encodeURIComponent(
      `https://www.metaweather.com/api/location/search/?lattlong=${latlon}`
    )}`
  )
    .then((response) => {
      if (response.ok) return response.json();
      throw new Error("Network response was not ok.");
    })
    .then((data) => {
      myLocation = JSON.parse(data.contents)[0];
      weatherLocation(myLocation.woeid);
    });
};

const currentLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((e) => {
      var lat = e.coords.latitude;
      var lon = e.coords.longitude;
      latlon = `${lat},${lon}`;
      console.log(latlon);
      woeidLocation(latlon);
    });
  } else {
    window.alert("Please Allow access to location");
  }
};

//---------------------------------------Eventlisteners------------------------------------------
cancelBtn.addEventListener("click", (e) => {
  hiddenBar.style.transform = "translateX(-110%)";
});
searchBtn.addEventListener("click", (e) => {
  hiddenBar.style.transform = "initial";
});
units.forEach((element) => {
  element.addEventListener("click", (e) => {
    if (e.target.className == "btn inactive") {
      document.querySelector(".active").className = "btn inactive";
      e.target.className = "btn active";
      flag = !flag;
      woeidLocation(latlon);
    }
  });
});
//-----------------------------------------Fuction Calls----------------------------------------------------
currentLocation();
