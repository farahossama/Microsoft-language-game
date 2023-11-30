import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, child, get } from "firebase/database";
import { config } from "./config"
//var $ = require( "jquery" );

let intro = document.querySelector(".intro");
let logo = document.querySelector(".logo-header");
let logospan = document.querySelectorAll(".logy");


window.addEventListener("DOMContentLoaded", ()=>{
  setTimeout(()=>{
    logospan.forEach((span, idx) => {
      setTimeout(()=>{
        span.classList.add("active");
      },(idx+1)*400)
    });
    setTimeout(()=>{
      logospan.forEach((span, idx) => {
        setTimeout(()=>{
          span.classList.remove("active");
          span.classList.add("fade");
        },(idx+1)*50)
      })
    }, 2000)

    setTimeout(()=>{
      intro.style.top = "-100vh";
    }, 2300)

  })
})


window.description = function() {
    var modal2 = document.getElementById("myModal2");
    var span = document.getElementsByClassName("close")[1];
    modal2.style.display = "block";
    document.querySelector('.page').classList.add('hide');
    span.onclick = function() {
    modal2.style.display = "none";
  }
}

var chartSc, chartFp, chartFn, dbSc, dbFp, dbFn, docsNo, wordNo, dbDoc, dbWord;
var docsLabeled = 1;

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD9XCMD3SxMjgy7iG_WSp6PWTn4-CXr6TQ",
  authDomain: "language-test-3927f.firebaseapp.com",
  projectId: "language-test-3927f",
  storageBucket: "language-test-3927f.appspot.com",
  messagingSenderId: "677707086447",
  appId: "1:677707086447:web:429840c9d242d28da1ab9a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getDatabase();



function writeUserData(sc, fp, fn, docs, words) {
  set(ref(db, 'test/'), {
    score: sc,
    falsePositive: fp,
    falseNegative: fn,
    docsLabeled: docs,
    wordNo: words
  });
}


const dbRef = ref(getDatabase());

async function updateDb() {
  get(child(dbRef, `test/`)).then((snapshot) => {
    if (snapshot.exists()) {
      chartSc = snapshot.val().score;
      chartFp = snapshot.val().falsePositive;
      chartFn = snapshot.val().falseNegative;
      docsNo = snapshot.val().docsLabeled;
      wordNo = snapshot.val().wordNo;
      wordNo += wordscpy.length;
      docsNo++;
      updateData(chartSc, chartFp, chartFn);
      writeUserData(chartSc, chartFp, chartFn, docsNo, wordNo);

    } else {
      writeUserData(score, falsePositive, falseNegative, docsLabeled, wordscpy.length);
    }
  }).catch((error) => {
    console.error(error);
  });
}

async function readDb() {
  await get(child(dbRef, `test/`)).then((snapshot) => {
    if (snapshot.exists()) {
      dbSc = snapshot.val().score;
      dbFp = snapshot.val().falsePositive;
      dbFn = snapshot.val().falseNegative;
      dbDoc = snapshot.val().docsLabeled;
      dbWord = snapshot.val().wordNo;


    } else {
      console.log("No data available");
    }
  }).catch((error) => {
    console.error(error);
  });
}

function updateData(sc, fp, fn) {
  for (let key in score) {
    if (!sc.hasOwnProperty(key)) {
      sc[key] = score[key];
    } else {
      sc[key] += score[key];
    }
    
    if (!fp.hasOwnProperty(key)) {
      fp[key] = falsePositive[key];
    } else {
      fp[key] += falsePositive[key];
    }

    if (!fn.hasOwnProperty(key)) {
      fn[key] = falseNegative[key];
    } else {
      fn[key] += falseNegative[key];
    }
  }

}

//timer
const startingminutes = 0.10;
let time = startingminutes * 60;
const timer = document.getElementById("timer");
var score = {};
var correct = [];
var falsePositive = {};
var falseNegative = {};
var wordMap;
var myChart, myChart_a, myChart_b, myChart2, myChart3, myChart4;
var paragraph, categories, numcategories, res, wordscpy;



// Time Variables
var t = timer.innerHTML;
var arr = t.split(":");
var hour = arr[0];
var min = arr[1];
var sec = arr[2];
var timeout;

// CountUp
function countUp() {
  if (sec == 59) {
    if (min == 59) {
      hour++;
      min = 0;
      if (hour < 10) hour = "0" + hour;
    }
    else {
      min++;
    }
    if (min < 10) min = "0" + min;
    sec = 0;
  }
  else {
    sec++;
    if (sec < 10) sec = "0" + sec;
  }
  if (sec == 0) {
    sec = "00";
  }
  timer.innerHTML = hour + ":" + min + ":" + sec;
  timeout = setTimeout(countUp, 1000);
}

// fetch data
const NerAPI = async (document, x) => {
  let data = await fetch(
    "https://naeim-test.cognitiveservices.azure.com/language/:analyze-text?api-version=2022-05-01",
    {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        "ocp-apim-subscription-key": config.MY_API_TOKEN,
      },
      body: JSON.stringify({
        kind: "EntityRecognition",

        analysisInput: {
          documents: [
            {
              id: "id_1",
              text: document,
              language: "en"
            },
          ],
        },
      }),
    }
  ).catch((error) => console.log(error));

  let dataJson = await data.json();

  if (data.ok) {
    console.log("HTTP request successful");
  } else {
    console.log("HTTP request unsuccessful");
  }

  return dataJson;
}

//wrap words in span tags
function wrapWords(result) {
  var words = $("#textBox p").text().split(/[. ]+/);
  words.forEach((item, index) => {
    words[index] = item.replace(",", "");
  });
  wordscpy = $("#textBox p").text().split(" ");
  $("#textBox p").empty().html(function () {

    for (let i = 0; i < words.length; i++) {
      correct[i] = "";
      var equalWords = {
        text: [],
        index: []
      };
      var doubleWords = [];
      for (let j = 0; j < result.length; j++) {
        var dataWords = result[j].text.split(" ");
        let z = 0;
        let c = i;

        while (dataWords[z] === words[c]) {
          equalWords.text[z] = wordscpy[c];
          equalWords.index[z] = c;
          doubleWords[z] = words[c];
          // flag = 1;
          z++; c++;
        }

      }

      if (!(equalWords.text.length === 0)) {
        jQuery(this).append(
          `<span id="word${i}" class="words" onclick="clickWord(${i})">
                ${function () {
            let h = "";
            for (let x = 0; x < equalWords.text.length; x++) {
              h = h + equalWords.text[x];
              correct[i] += doubleWords[x];
              if (x != (equalWords.text.length - 1)) {
                h = h + " ";
                correct[i] += " ";
              }
            }
            return h;
          }()}
               <span id="dropdown${i}" class="menu">
                   <ul>
                       ${function () {
            let html = "";
            categories.forEach((item, j) => {
              html += `<li id="item${i}${j}" onclick="itemPressed(${i},${j})">${item}</li>`
            });
            return html;
          }()}
                   </ul>
               </span>
             </span>`
        );
        i = equalWords.index[equalWords.index.length - 1];
      }


      else if (i == 0) {
        correct[i] = words[i];
        jQuery(this).append(
          `<span id="word${i}" class="words" onclick="clickWord(${i})">
                ${words[i]}
                   <span id="dropdown${i}" class="menu">
                       <ul>
                       ${function () {
            let html = "";
            categories.forEach((item, j) => {
              html += `<li id="item${i}${j}" onclick="itemPressed(${i},${j})">${item}</li>`
            });
            return html;
          }()}
                       </ul>
                   </span>
                </span>`
        );
      } else {
        correct[i] = words[i];
        jQuery(this).append(
          `<span id="word${i}" class="words" onclick="clickWord(${i})">
                 ${words[i]}
                    <span id="dropdown${i}" class="menu">
                        <ul>
                        ${function () {
            let html = "";
            categories.forEach((item, j) => {
              html += `<li id="item${i}${j}" onclick="itemPressed(${i},${j})">${item}</li>`
            });
            return html;
          }()}
                        </ul>
                    </span>
                 </span>`
        );
      }
    }
  })
}




function categoryList(result) {

    $("#myList").empty().html(function () {
      jQuery(this).append(
        `
               <div class="topnav showUp" id="myTopnav">
                  ${function () {
          let html = `<a class="icon" onclick = "resNavbar()"}> <i class="fa fa-bars"></i> </a>`;
          Object.entries(numcategories).forEach((item) => {
            html += `<a class="fadeIn">${"<strong>" + item[0] + ":</strong>" + " " + "(" + item[1] + ")"}</a>`
          });
          return html;
        }()}
                  </div>
               `
      );
    })

}


var state = {
  pressed: false,
  previous: ""
}

//word clicked
window.clickWord = function(id) {
  //no active dropdowns
  if (!state.pressed) {
    $(`#word${id}`).addClass("change-color");
    document.getElementById(`dropdown${id}`).style.display = "block";
    state.pressed = true;
    state.previous = id;
  }
  //pressed the same word
  else if (state.previous == id) {
    //close menu
    document.getElementById(`dropdown${state.previous}`).style.display = "none";
    state.pressed = false;
  }
  else {
    //hide privious menu and show new
    $(`#word${id}`).addClass("change-color");
    document.getElementById(`dropdown${state.previous}`).style.display = "none";
    document.getElementById(`dropdown${id}`).style.display = "block";
    state.previous = id;
  }
}

function listCategories(data) {
  var list = [];
  data.forEach((item) => {

    if (!list.includes(item.category)) {
      list.push(item.category);

    }
  });

  return list;
}



function numberCategories(data) {

  var categoryNumbers = {};

  categoryNumbers = categories.reduce((acc, key) => ({ ...acc, [key]: 0 }), {});

  wordMap.forEach((item) => {
    if (item.hasOwnProperty('tag')) {
      categoryNumbers[item.category]++;
    }
  });

  return categoryNumbers;
}

var itemState = {};

function tagWords(res) {
  var wordMap = res;
  let flagj = [];
  let flagi = [];
  correct.forEach((item, i) => {
    for (let j = 0; j < wordMap.length; j++) {
      if (wordMap[j].text === correct[i] && !flagj.includes(j) && !flagi.includes(i)) {
        wordMap[j].tag = i;
        flagj.push(j);
        flagi.push(i);
      }
    }
  });
  return wordMap;
}

window.itemPressed = function(t1, t2) {
  let id = `item${t1}${t2}`;
  var entity = $(`#${id}`).text();
  var checkChoice = wordMap.find((word) => word.tag == t1);

  if (itemState.hasOwnProperty(t1)) {
    $(`#${itemState[t1].id}`).removeClass('change-color');
    if (checkChoice && entity == checkChoice.category) {
      if (itemState[t1].previous != entity) {
        score[entity]++;
        falsePositive[checkChoice.category]--;
      }
      itemState[t1] = { id, previous: entity };

    }


    else {
      if (itemState[t1].previous) {
        score[itemState[t1].previous]--;
        falsePositive[checkChoice.category]++;
      }
      itemState[t1] = { id };

    }

  } else if (checkChoice && entity == checkChoice.category) {
    score[entity]++;
    itemState[t1] = { id, previous: entity };
  }

  else if (checkChoice && entity != checkChoice.category) {
    itemState[t1] = { id };
    falsePositive[checkChoice.category]++;
  }

  else {
    itemState[t1] = { id };
  }

  $(`#${id}`).addClass('change-color');

}


document.querySelector("#file-input").addEventListener('change', function () {
  // files that user has chosen
  var all_files = this.files;


  // first file selected by user
  var file = all_files[0];

  // files types allowed
  var allowed_types = ['text/plain'];
  if (allowed_types.indexOf(file.type) == -1) {
    var modal = document.getElementById("myModal");
    var span = document.getElementsByClassName("close")[0];
    modal.style.display = "block";
    span.onclick = function () {
      modal.style.display = "none";
      $("#file-input").val("");
    }
    document.getElementById("ops").innerHTML = "Error";
    document.getElementById("error").innerHTML = "Incorrect file type.";
    return;
  }

  // Max 2 MB allowed
  var max_size_allowed = 2 * 1024 * 1024;
  if (file.size > max_size_allowed) {

    var modal = document.getElementById("myModal");
    var span = document.getElementsByClassName("close")[0];
    modal.style.display = "block";
    span.onclick = function () {
      modal.style.display = "none";
      $("#file-input").val("")
    }
    document.getElementById("ops").innerHTML = "Error";
    document.getElementById("error").innerHTML = "Exceeded file size allowed '2MB'";
    return;
  }

  // file validation is successfull
  // we will now read the file

  var reader = new FileReader();

  // file reading finished successfully
  reader.addEventListener('load', async function (e) {
    var text = e.target.result;

    // fill page with text
    paragraph = text;
    $('#textBox p').text(paragraph);

    // make words clickable
    var data = await NerAPI(paragraph);
    res = data.results.documents[0].entities;
    categories = listCategories(res);
    wrapWords(res);
    wordMap = tagWords(res);
    numcategories = numberCategories(res);
   // document.querySelector('#myTopnav').classList.remove('hide');
   // $('#')
    categoryList();
    countUp();
    score = categories.reduce((acc, key) => ({ ...acc, [key]: 0 }), {});
    falsePositive = categories.reduce((acc, key) => ({ ...acc, [key]: 0 }), {});
    falseNegative = categories.reduce((acc, key) => ({ ...acc, [key]: 0 }), {});


    correct.forEach((item, index) => {
      correct[index] = item.replace(",", "");
    });
    score = categories.reduce((acc, key) => ({ ...acc, [key]: 0 }), {});
    falsePositive = categories.reduce((acc, key) => ({ ...acc, [key]: 0 }), {});
    falseNegative = categories.reduce((acc, key) => ({ ...acc, [key]: 0 }), {});
    //reveal page
    document.querySelector('#logo-container').classList.add('hide');
    document.querySelector('#uploadBtn').classList.add('hide');
    document.querySelector('.page').classList.remove('hide');
  });

  // file reading failed
  reader.addEventListener('error', function () {
    var modal = document.getElementById("myModal");
    var span = document.getElementsByClassName("close")[0];
    modal.style.display = "block";
    span.onclick = function () {
      modal.style.display = "none";
      $("#file-input").val("")
    }
    document.getElementById("error").innerHTML = "Opsss, Failed to read file";
    return;
  });

  // file read progress
  reader.addEventListener('progress', function (e) {

  });

  // read as text file
  reader.readAsText(file);

});


window.resNavbar = function() {
  var x = document.getElementById("myTopnav");
  if (x.className === "topnav") {
    x.className += " responsive";
  } else {
    x.className = "topnav";
  }
}

window.scoreBoard = function() {
  updateDb();
  $('table').removeClass('hide');
  $('.label').removeClass('hide');
  $('.navBtns').removeClass('hide');

  document.querySelector('.page').classList.add('hide');
  document.querySelector('#backBtn').classList.add('hide');

  // myChart.update();
  // addData(myChart);

  wordMap.forEach((item) => {
    if (!(itemState.hasOwnProperty(item.tag)) && item.hasOwnProperty('tag')) {
      falseNegative[item.category]++;
    }
  });

  $("#scoreBoard1").empty().html(function () {
    jQuery(this).append(
      `${function () {
        let html = `<thead><tr><th>Time</th>`
        let ans = 0;
        let sum = 0;
        let percent = 0;
        for (let key in score) {
          html += `<th scope="col">${key}</th>`;
        }
        html += `<th scope="col">Percentage</th></thead><tbody></tr><tr><td data-label="Time">${min}:${sec}</td>`;
        for (let key in score) {
          html += `<td data-label="${key}">${score[key]} out of ${numcategories[key]}</td>`
          ans += score[key];
          sum += numcategories[key];
        }
        if (ans != 0 && sum != 0) {
          percent = (ans / sum) * 100;
        }
        html += `<td data-label="Percentage">${Math.round(percent)}%</td></tr></tbody>`
        return html;
      }()}`
    );
  });

  $("#scoreBoard2").empty().html(function () {
    jQuery(this).append(
      `${function () {
        let html = `<thead><tr>`
        let ans = 0;
        let sum = 0;
        let percent = 0;
        for (let key in falsePositive) {
          html += `<th scope="col">${key}</th>`;
        }
        html += `<th scope="col">Percentage</th></tr></thead><tbody><tr>`;
        for (let key in falsePositive) {
          html += `<td data-label="${key}">${falsePositive[key]} out of ${numcategories[key]}</td>`
          ans += falsePositive[key];
          sum += numcategories[key];
        }
        if (ans != 0 && sum != 0) {
          percent = (ans / sum) * 100;
        }
        html += `<td data-label="Percentage">${Math.round(percent)}%</td></tr></tbody>`
        return html;
      }()}`
    );
  });
  $("#scoreBoard3").empty().html(function () {
    jQuery(this).append(
      `${function () {
        let html = `<thead><tr>`
        let ans = 0;
        let sum = 0;
        let percent = 0;
        for (let key in falseNegative) {
          html += `<th scope="col">${key}</th>`;
        }
        html += `<th scope="col">Percentage</th></tr></thead><tbody><tr>`;

        for (let key in falseNegative) {
          html += `<td data-label="${key}">${falseNegative[key]} out of ${numcategories[key]}</td>`
          ans += falseNegative[key];
          sum += numcategories[key];
        }

        if (ans != 0 && sum != 0) {
          percent = (ans / sum) * 100;
        }

        html += `<td data-label="Percentage">${Math.round(percent)}%</td></tr></tbody>`
        return html;

      }()}`
    );
  });
}

window.analysis = function() {
  var modal = document.getElementById("myModal");
  var span = document.getElementsByClassName("close")[0];
  modal.style.display = "block";
  span.onclick = function () {
    modal.style.display = "none";
  }
  document.getElementById("ops").style.color = "yellow";
  document.getElementById("ops").innerHTML = "Warning ⚠️⚠️";
  document.getElementById("error").innerHTML = "This is not the Final Version";
  return;
}

// document.querySelector("#close").addEventListener("click", function () {
//   document.querySelector(".popup").style.display = "none";
// });


window.back = function() {
  $('.label').removeClass('hide');
  $('table').removeClass('hide');
  $('.chartBox').addClass('hide');
  $('.label-a').addClass('hide');
  $('.navBtns').removeClass('hide');
  

  document.querySelector('#backBtn').classList.add('hide');


}

window.home_page = function() {
  $('.label').addClass('hide');
  $('.navBtns').addClass('hide');
  $('table').addClass('hide');


  

  document.querySelector('#game').classList.add('hide');
  document.querySelector('#myTopnav').classList.add('hide');
  document.querySelector('#logo-container').classList.remove('hide');
  document.querySelector('#uploadBtn').classList.remove('hide');
  // clearTimeout(timeout);
  sec = "00";
  min = "00";
  hour = "00";
  document.getElementById("timer").innerHTML = hour + ":" + min + ":" + sec;
  $("#file-input").val("");
  $("#textBox").val("");
  $("#scoreBoard1").val("");
  $("#scoreBoard2").val("");
  var score = {};
  var correct = [];
  var falsePositive = {};
  var wordMap;
  // data = [];
  itemState = {};
}


function allAreEqual(obj) {
  return new Set(Object.values(obj)).size === 1 && obj[Object.keys(obj)[0]] == 0;
}

window.pie_chart = async function() {

  await readDb();

  $('.label').addClass('hide');
  $('table').addClass('hide');
  $('.chartBox').removeClass('hide');
  $('#docData').removeClass('hide');
  $('.label-a').removeClass('hide');
  $('.navBtns').addClass('hide');


  document.querySelector('#backBtn').classList.remove('hide');

  if (myChart) {
    myChart.destroy();
    myChart_a.destroy();
    myChart_b.destroy();
    myChart2.destroy();
    myChart3.destroy();
    myChart4.destroy();
  }

  if ( allAreEqual(dbSc)) {
    $('#myChart').addClass('hide');
    $('#sc').removeClass('spacing');   
  } else {
    $('#myChart').removeClass('hide');
    $('#sc').addClass('spacing');   
  }

  if ( allAreEqual(dbFp) ) {
    $('#myChart_pi_f_p').addClass('hide');
    $('#fp').removeClass('spacing');   
  } else {
    $('#myChart_pi_f_p').removeClass('hide');
    $('#fp').addClass('spacing');  
  }

  if ( allAreEqual(dbFn) ) {
    $('#myChart_pi_f_n').addClass('hide');
    $('#fn').removeClass('spacing');
  } else {
    $('#myChart_pi_f_n').removeClass('hide');
    $('#fn').addClass('spacing');  
  }

  $('#docNo').empty().html(function() {
    jQuery(this).append(
      `<strong>Number of documents labeled:</strong> ${dbDoc}`
    );
  });

  $('#wordNo').empty().html(function() {
    jQuery(this).append(
      `<strong>Total number of words:</strong> ${dbWord}`
    );
  });

  dbSc = sortObject(dbSc);
  dbFp = sortObject(dbFp);
  dbFn = sortObject(dbFn); 


  var dataSc = {
    labels: Object.keys(dbSc),
    datasets: [{
      label: "# of correct answers of each category",
      backgroundColor: ["#0074D9", "#FF4136", "#2ECC40", "#FF851B", "#7FDBFF", "#B10DC9", "#FFDC00", "#001f3f", "#39CCCC", "#01FF70", "#85144b", "#F012BE", "#3D9970", "#111111", "#AAAAAA"],
      borderColor: '#fff',
      data: Object.values(dbSc),
      tension: 0.1,
      fill: false,
    }]
  };

  var configSc = {
    type: 'pie',
    data: dataSc,
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Score',
          padding: {
            top: 10,
          }
        }
      }
    }
  };

  myChart = new Chart(
    document.getElementById('myChart'),
    configSc
  );

  var data_a = {
    labels: Object.keys(dbFn),
    datasets: [{
      label: "False Negative",
      backgroundColor: ["#0074D9", "#FF4136", "#2ECC40", "#FF851B", "#7FDBFF", "#B10DC9", "#FFDC00", "#001f3f", "#39CCCC", "#01FF70", "#85144b", "#F012BE", "#3D9970", "#111111", "#AAAAAA"],
      borderColor: '#fff',
      data: Object.values(dbFn),
      tension: 0.1,
      fill: false,
    }]
  };

  var config_a = {
    type: 'pie',
    data: data_a,
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'False Negative',
          padding: {
            top: 50,
          }
        }
      }
    }
  };

  myChart_a = new Chart(
    document.getElementById('myChart_pi_f_n'),
    config_a
  );

  var data_b = {
    labels: Object.keys(dbFp),
    datasets: [{
      label: "False Positive",
      backgroundColor: ["#0074D9", "#FF4136", "#2ECC40", "#FF851B", "#7FDBFF", "#B10DC9", "#FFDC00", "#001f3f", "#39CCCC", "#01FF70", "#85144b", "#F012BE", "#3D9970", "#111111", "#AAAAAA"],
      borderColor: '#fff',
      data: Object.values(dbFp),
      tension: 0.1,
      fill: false,
    }]
  };

  var config_b = {
    type: 'pie',
    data: data_b,
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'False Positives',
          padding: {
            top: 50,
          }
        }
      }
    }
  };

  myChart_b = new Chart(
    document.getElementById('myChart_pi_f_p'),
    config_b
  );



  var data2 = {
    labels: Object.keys(dbSc),
    datasets: [{
      label: "correct values",
      backgroundColor: ["#0074D9", "#FF4136", "#2ECC40", "#FF851B", "#7FDBFF", "#B10DC9", "#FFDC00", "#001f3f", "#39CCCC", "#01FF70", "#85144b", "#F012BE", "#3D9970", "#111111", "#AAAAAA"],
      borderColor: '#fff',
      data: Object.values(dbSc),
      tension: 0.1,
      fill: false,
    }]
  };

  var config2 = {
    type: 'bar',
    data: data2,
    options: {
      responsive: true,
    }
  };

  myChart2 = new Chart(
    document.getElementById('myChart2'),
    config2
  );


  var data3 = {
    labels: Object.keys(dbFp),
    datasets: [{
      label: "False Positive",
      backgroundColor: ["#0074D9", "#FF4136", "#2ECC40", "#FF851B", "#7FDBFF", "#B10DC9", "#FFDC00", "#001f3f", "#39CCCC", "#01FF70", "#85144b", "#F012BE", "#3D9970", "#111111", "#AAAAAA"],
      borderColor: '#fff',
      data: Object.values(dbFp),
      tension: 0.1,
      fill: false,
    }]
  };

  var config3 = {
    type: 'bar',
    data: data3,
    options: {
      responsive: true,
    }
  };

  myChart3 = new Chart(
    document.getElementById('myChart3'),
    config3
  );

  var data4 = {
    labels: Object.keys(dbFn),
    datasets: [{
      label: "False Negative",
      backgroundColor: ["#0074D9", "#FF4136", "#2ECC40", "#FF851B", "#7FDBFF", "#B10DC9", "#FFDC00", "#001f3f", "#39CCCC", "#01FF70", "#85144b", "#F012BE", "#3D9970", "#111111", "#AAAAAA"],
      borderColor: '#fff',
      data: Object.values(dbFn),
      tension: 0.1,
      fill: false,
    }]
  };

  var config4 = {
    type: 'bar',
    data: data4,
    options: {
      responsive: true,
    }
  };

  myChart4 = new Chart(
    document.getElementById('myChart4'),
    config4
  );


}


function sortObject(obj) {
  var arr = [];
  for (var prop in obj) {
      if (obj.hasOwnProperty(prop)) {
          arr.push({
              'key': prop,
              'value': obj[prop]
          });
      }
  }
  arr.sort(function(a, b) { return b.value - a.value; });

  var sorted = arr.reduce(
    (object, item) => Object.assign(object, { [item.key]: item.value }), {});

  return sorted; // returns array
}
