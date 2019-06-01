"use strict";

const googleApiKey = "AIzaSyCFlgvXsaF3aL5dJ_KTmlKG3SbqsL2vrb8";
const dataDemographKey = "k_0218e326c3fa2590382dd9482ac43f95";
const usCensusKey = "cd61f085312fedfc60923ae2605d954d1a7e3363";
const usCensus_URL = "https://api.census.gov/data/2017/acs/acs1/profile?";
const dataUSA_URL = "https://datausa.io/api/data?drilldowns=Place&measures=";
const dataDemograph_URL = "https://api.datademograph.com/v1/";
const geoCoding_URL = "https://maps.googleapis.com/maps/api/geocode/json";
const googlePlacesSearch_URL =
  "https://maps.googleapis.com/maps/api/place/findplacefromtext/json";

const inptElm = $("input[type='number']");

function formatQueryParams(params) {
  const queryItems = Object.keys(params).map(
    key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
  );
  return queryItems.join("&");
}

// Formats specific data numbers
function formatInteger(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function getData(county, state) {
  // Because US CENSUS BUREAU API is going through backend changes,
  // some data urls may throw 500 internal error during this time (or lag in fetch). Thus, all these fetches must
  // have individual catches or else no data renders.
  const nativePop = fetch(
    encodeURI(
      `${usCensus_URL}get=DP02_0087PE,NAME&for=county:${county}&in=state:${state}&key=${usCensusKey}`
    )
  )
    .then(res => res.json())
    .catch(error => console.error("Error:", error));

  const foreignPop = fetch(
    encodeURI(
      `${usCensus_URL}get=DP02_0092PE,NAME&for=county:${county}&in=state:${state}&key=${usCensusKey}`
    )
  )
    .then(res => res.json())
    .catch(error => console.error("Error:", error));

  const someCollege = fetch(
    encodeURI(
      `${usCensus_URL}get=DP02_0061PE,NAME&for=county:${county}&in=state:${state}&key=${usCensusKey}`
    )
  )
    .then(res => res.json())
    .catch(error => console.error("Error:", error));

  const inCollege = fetch(
    encodeURI(
      `${usCensus_URL}get=DP02_0057PE,NAME&for=county:${county}&in=state:${state}&key=${usCensusKey}`
    )
  )
    .then(res => res.json())
    .catch(error => console.error("Error:", error));

  const graduated = fetch(
    encodeURI(
      `${usCensus_URL}get=DP02_0065PE,NAME&for=county:${county}&in=state:${state}&key=${usCensusKey}`
    )
  )
    .then(res => res.json())
    .catch(error => console.error("Error:", error));

  const unemployed = fetch(
    encodeURI(
      `${usCensus_URL}get=DP03_0009PE,NAME&for=county:${county}&in=state:${state}&key=${usCensusKey}`
    )
  )
    .then(res => res.json())
    .catch(error => console.error("Error:", error));

  const belowPoverty = fetch(
    encodeURI(
      `${usCensus_URL}get=DP03_0119PE,NAME&for=county:${county}&in=state:${state}&key=${usCensusKey}`
    )
  )
    .then(res => res.json())
    .catch(error => console.error("Error:", error));

  const occupiedHomes = fetch(
    encodeURI(
      `${usCensus_URL}get=DP04_0002PE,NAME&for=county:${county}&in=state:${state}&key=${usCensusKey}`
    )
  )
    .then(res => res.json())
    .catch(error => console.error("Error:", error));

  const vacantHomes = fetch(
    encodeURI(
      `${usCensus_URL}get=DP04_0003PE,NAME&for=county:${county}&in=state:${state}&key=${usCensusKey}`
    )
  )
    .then(res => res.json())
    .catch(error => console.error("Error:", error));

  const homeownerVacancy = fetch(
    encodeURI(
      `${usCensus_URL}get=DP04_0004E,NAME&for=county:${county}&in=state:${state}&key=${usCensusKey}`
    )
  )
    .then(res => res.json())
    .catch(error => console.error("Error:", error));

  const rentalVacancy = fetch(
    encodeURI(
      `${usCensus_URL}get=DP04_0005E,NAME&for=county:${county}&in=state:${state}&key=${usCensusKey}`
    )
  )
    .then(res => res.json())
    .catch(error => console.error("Error:", error));

  const totalPop = fetch(
    encodeURI(
      `${usCensus_URL}get=DP02_0078E,NAME&for=county:${county}&in=state:${state}&key=${usCensusKey}`
    )
  )
    .then(res => res.json())
    .catch(error => console.error("Error:", error));

  const totalHousing = fetch(
    encodeURI(
      `${usCensus_URL}get=DP04_0006E,NAME&for=county:${county}&in=state:${state}&key=${usCensusKey}`
    )
  )
    .then(res => res.json())
    .catch(error => console.error("Error:", error));

  const householdInc = fetch(
    encodeURI(
      `${usCensus_URL}get=DP03_0062E,NAME&for=county:${county}&in=state:${state}&key=${usCensusKey}`
    )
  )
    .then(res => res.json())
    .catch(error => console.error("Error:", error));

  const rentExpense = fetch(
    encodeURI(
      `${usCensus_URL}get=DP04_0134E,NAME&for=county:${county}&in=state:${state}&key=${usCensusKey}`
    )
  )
    .then(res => res.json())
    .catch(error => console.error("Error:", error));

  let promiseArray = [
    nativePop,
    foreignPop,
    someCollege,
    inCollege,
    graduated,
    unemployed,
    belowPoverty,
    occupiedHomes,
    vacantHomes,
    homeownerVacancy,
    rentalVacancy,
    totalPop,
    totalHousing,
    householdInc,
    rentExpense
  ];
  // Renders all data at same time. If a fetch fails and an "undefined" is placed in data array,
  // ternary operator in nested template strings will return "N/A" if data is missing.
  Promise.all(promiseArray)
    .then(data => {
      $("#population-container").append(`<div class="stat">
          <div class="stat-title"><p role="heading">Total Population</p></div>
            <div class="stat-value"><p>${
              data[11] ? `${formatInteger(data[11][1][0])}` : "N/A"
            }</p></div>
        </div>
        <div class="stat">
          <div class="stat-title"><p role="heading">Native Population</p></div>
            <div class="stat-value"><p>%${
              data[0] ? `${data[0][1][0]}` : "N/A"
            }</p></div>
        </div>
         <div class="stat">
          <div class="stat-title"><p role="heading">Foreign Population</p></div>
            <div class="stat-value"><p>%${
              data[1] ? `${data[1][1][0]}` : "N/A"
            }</p></div>
        </div>`);

      $("#education-container").append(`<div class="stat">
          <div class="stat-title"><p role="heading">Some College</p></div>
            <div class="stat-value"><p>%${
              data[2] ? `${data[2][1][0]}` : "N/A"
            }</p></div>
        </div>
        <div class="stat">
          <div class="stat-title"><p role="heading">In College</p></div>
            <div class="stat-value"><p>%${
              data[3] ? `${data[3][1][0]}` : "N/A"
            }</p></div>
        </div>
         <div class="stat">
          <div class="stat-title"><p role="heading">Grad. College</p></div>
            <div class="stat-value"><p>%${
              data[4] ? `${data[4][1][0]}` : "N/A"
            }</p></div>
        </div>`);

      $("#labor-container").append(`<div class="stat">
          <div class="stat-title"><p role="heading">Unemployed</p></div>
            <div class="stat-value"><p>%${
              data[5] ? `${data[5][1][0]}` : "N/A"
            }</p></div>
        </div>
        <div class="stat">
          <div class="stat-title"><p role="heading">Below Poverty</p></div>
            <div class="stat-value"><p>%${
              data[6] ? `${data[6][1][0]}` : "N/A"
            }</p></div>
        </div>
         <div class="stat">
          <div class="stat-title"><p role="heading">Household Inc.</p></div>
            <div class="stat-value"><p>$${
              data[13] ? `${formatInteger(data[13][1][0])}` : "N/A"
            }</p></div>
        </div>`);

      $("#housing-container-1").append(`<div class="stat">
          <div class="stat-title"><p role="heading">Housing Units</p></div>
            <div class="stat-value"><p>${
              data[12] ? `${formatInteger(data[12][1][0])}` : "N/A"
            }</p></div>
        </div>
        <div class="stat">
          <div class="stat-title"><p role="heading">Occupied Homes</p></div>
            <div class="stat-value"><p>%${
              data[7] ? `${data[7][1][0]}` : "N/A"
            }</p></div>
        </div>
         <div class="stat">
          <div class="stat-title"><p role="heading">Vacant Homes</p></div>
            <div class="stat-value"><p>%${
              data[8] ? `${data[8][1][0]}` : "N/A"
            }</p></div>
        </div>`);

      $("#housing-container-2").append(`<div class="stat">
          <div class="stat-title"><p role="heading">Home Vacancy</p></div>
            <div class="stat-value"><p>%${
              data[9] ? `${data[9][1][0]}` : "N/A"
            }</p></div>
        </div>
        <div class="stat">
          <div class="stat-title"><p role="heading">Rental Vacancy</p></div>
            <div class="stat-value"><p>%${
              data[10] ? `${data[10][1][0]}` : "N/A"
            }</p></div>
        </div>
         <div class="stat">
          <div class="stat-title"><p role="heading">Rent Expense</p></div>
            <div class="stat-value"><p>$${
              data[14] ? `${formatInteger(data[14][1][0])}` : "N/A"
            }</p></div>
        </div>`);
    })
    .catch(e => {
      console.log(e);
    });
}

// Translate locations names to longitude/latitude for google maps API
function translateLocationCodes(county, state) {
  fetch(
    encodeURI(
      `${usCensus_URL}get=NAME&for=county:${county}&in=state:${state}&key=${usCensusKey}`
    )
  )
    .then(response => response.json())
    .then(responseJson => {
      return responseJson[1][0];
    })
    .then(location => {
      getGeoCode(location);
    })
    .catch(e => {
      console.log(e);
    });
}

function getGeoCode(location) {
  const params = {
    key: googleApiKey,
    address: `${location}`
  };

  const queryString = formatQueryParams(params);
  const url = encodeURI(geoCoding_URL + "?" + queryString);

  fetch(url)
    .then(response => response.json())
    .then(responseJson => {
      let location = responseJson.results[0].geometry.location;
      initMap(location);
    })
    .catch(e => {
      console.log(e);
    });
}

function initMap(location) {
  let map, service, infowindow, marker, request;

  map = new google.maps.Map(document.getElementById("map"), {
    center: location,
    zoom: 10
  });
  marker = new google.maps.Marker({ position: location, map: map });
  request = {
    location: location,
    radius: 2000,
    type: ["point of interest"]
  };
  service = new google.maps.places.PlacesService(map);

  service.nearbySearch(request, function(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      for (let i = 0; i < results.length; i++) {
        $("#results-locations-list").append(
          `<li>${results[i].name}: ${results[i].vicinity}</li>`
        );
      }
      map.setCenter(results[0].geometry.location);
    }
  });
}

function allowIntegerInputOnly(elm) {
  elm
    .on("keydown", function(event) {
      var e = event || window.event,
        key = e.keyCode || e.which,
        ruleSetArr_1 = [8, 9, 46], // backspace,tab,delete
        ruleSetArr_2 = [48, 49, 50, 51, 52, 53, 54, 55, 56, 57], // for keyboard num keys
        ruleSetArr_3 = [96, 97, 98, 99, 100, 101, 102, 103, 104, 105], // for side keyboard num keys
        ruleSetArr_4 = [17, 67, 86], // Disallow use of ctrl + v
        ruleSetArr = ruleSetArr_1.concat(
          ruleSetArr_2,
          ruleSetArr_3,
          ruleSetArr_4
        ); // merge arrays of keys

      if (ruleSetArr.indexOf() !== "undefined") {
        // checks if browser supports indexOf() : IE8 and earlier
        var retRes = ruleSetArr.indexOf(key);
      } else {
        var retRes = $.inArray(key, ruleSetArr);
      }
      if (retRes == -1) {
        // if returned key not found in array, return false
        return false;
      } else if (key == 67 || key == 86) {
        // account for paste events
        event.stopPropagation();
      }
    })
    .on("paste", function(event) {
      var $thisObj = $(this),
        origVal = $thisObj.val(), // orig value
        newVal = event.originalEvent.clipboardData.getData("Text"); // paste clipboard value
      if (newVal.replace(/\D+/g, "") == "") {
        // if paste value is not a number, insert orig value and return false
        $thisObj.val(origVal);
        return false;
      } else {
        $thisObj.val(newVal.replace(/\D+/g, ""));
        return false;
      }
    });
}

function renderFormAgain() {
  $("#search-button").on("click", function() {
    $(
      "#search-button, .data-head, #map, #results-locations,#arrow-icon, #container-data"
    ).addClass("hidden");
    $("#js-form, .instructions").removeClass("hidden");
    $(
      "#population-container, #education-container, #labor-container, #housing-container-1, #housing-container-2, #results-locations-list"
    ).empty();
  });
}

function renderLoadingAnimation() {
  setTimeout(() => {
    $("body").removeClass("spinner-3");
    $(
      "#results, .data-head, #search-button, #results-locations, #arrow-icon, #map, #container-data"
    ).removeClass("hidden");
  }, 4000);
}

function changeBackgroundImg() {
  let images = [
    "images/family1.jpeg",
    "images/family2.jpeg",
    "images/family3.jpeg",
    "images/family4.jpeg",
    "images/couple1.jpeg",
    "images/couple2.jpeg",
    "images/couple3.jpeg",
    "images/couple4.jpeg",
    "images/painting.jpeg",
    "images/woman.jpeg",
    "images/living-room.jpeg"
  ];

  let index = Math.floor(Math.random() * 10);
  setTimeout(() => {
    $("#background").css({
      background: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${
        images[index]
      })`,
      "background-size": "cover",
      padding: "0",
      margin: "0",
      border: "0",
      position: "relative"
    });
  }, 4000);
}

function handleSubmit() {
  $("form").on("submit", function(e) {
    e.preventDefault();
    $(
      "#population-container, #education-container, #labor-container, #housing-container-1, #housing-container-2, #results-locations-list"
    ).empty();
    let county = $("#js-search-county").val();
    let state = $("#js-search-state").val();
    translateLocationCodes(county, state);
    getData(county, state);
    changeBackgroundImg();
    $("#js-search-county, #js-search-state").val("");
    $("body").addClass("spinner-3");
    renderLoadingAnimation();
    $("#js-form, .instructions").addClass("hidden");
  });
}

$(function() {
  handleSubmit();
  renderFormAgain();
  allowIntegerInputOnly(inptElm);
});
