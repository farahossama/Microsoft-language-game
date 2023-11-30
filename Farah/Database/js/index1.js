//timer
window.addEventListener("load", function(event) {
    localStorage.clear();
});

const startingminutes = 0.10;
let time = startingminutes * 60;
const timer = document.getElementById("timer");
var score = {};
var correct = [];
var falsePositive = {}


// Time Variables
var t = timer.innerHTML;
var arr = t.split(":");
var hour = arr[0];
var min = arr[1];
var sec = arr[2];

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
    setTimeout(countUp, 1000);
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
    var wordscpy = $("#textBox p").text().split(" ");
    $("#textBox p").empty().html(function () {

        for (i = 0; i < words.length; i++) {
            correct[i] = "";
            var equalWords = {
                text: [],
                index: []
            };
            var cleanWords = [];
            for (j = 0; j < result.length; j++) {
                var dataWords = result[j].text.split(" ");
                let z = 0;
                let c = i;

                while (dataWords[z] === words[c]) {
                    equalWords.text[z] = wordscpy[c];
                    equalWords.index[z] = c;
                    cleanWords[z] = words[c];
                    flag = 1;
                    z++; c++;
                }

            }

            if (!(equalWords.text.length === 0)) {
                jQuery(this).append(
                    `<span id="word${i}" class="words" onclick="clickWord(${i})">
                ${function () {
                        let h = "";
                        for (x = 0; x < equalWords.text.length; x++) {
                            h = h + equalWords.text[x];
                            correct[i] += cleanWords[x];
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
    $("#myList").html(function () {
        jQuery(this).append(
            `


             <div class="topnav" id="myTopnav">

                        ${function () {
                let html = `<a class="icon" onclick = "resNavbar()"}> <i class="fa fa-bars"></i> </a>`;
                Object.entries(numcategories).forEach((item) => {
                    html += `<a>${"<strong>" + item[0] + ":</strong>" + " " + "(" + item[1] + ")"}</a>`
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
function clickWord(id) {
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
    var list = [];
    var list1 = [];
    data.forEach((item) => {
        list.push(item.text);
        list1.push(item.category);


    });

    for (let i = 0; i < list.length; i++) {


        if (!categoryNumbers.hasOwnProperty(list1[i])) {
            categoryNumbers[list1[i]] = 0;

        } else {
            categoryNumbers[list1[i]] = categoryNumbers[list1[i]] + 1;

        }

    }

    return categoryNumbers;
}

var itemState = {};



function itemPressed(t1, t2) {
    let id = `item${t1}${t2}`;
    var entity = $(`#${id}`).text();
    var checkChoice = res.find((word) => word.text == correct[t1]);

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
                itemState[t1] = { id } ;

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

        console.log(score);
        $(`#${id}`).addClass('change-color');

    } 




    var paragraph, categories, numcategories, res;
    
    document.querySelector("#file-input").addEventListener('change', function () {
        // files that user has chosen
        var all_files = this.files;
        if (all_files.length == 0) {
            console.log('Error : No file selected');
            return;
        }

        // first file selected by user
        var file = all_files[0];

        // files types allowed
        var allowed_types = ['text/plain'];
        if (allowed_types.indexOf(file.type) == -1) {
            alert('Error : Incorrect file type');
            return;
        }

        // Max 2 MB allowed
        var max_size_allowed = 2 * 1024 * 1024
        if (file.size > max_size_allowed) {
            alert('Error : Exceeded size 2MB');
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
            console.log(res);
            categories = listCategories(res);
            numcategories = numberCategories(res);
            categoryList();
            wrapWords(res);
            countUp();
            correct.forEach((item, index) => {
                correct[index] = item.replace(",", "");
            });
            score = categories.reduce((acc, key) => ({ ...acc, [key]: 0 }), {});
            
            
            falsePositive = categories.reduce((acc, key) => ({ ...acc, [key]: 0 }), {});
            //reveal page
            document.querySelector('#logo-container').classList.add('hide');
            document.querySelector('#uploadBtn').classList.add('hide');
            document.querySelector('.page').classList.remove('hide');
            
        });

        // file reading failed
        reader.addEventListener('error', function () {
            alert('Error : Failed to read file');
        });

        // file read progress
        reader.addEventListener('progress', function (e) {

        });

        // read as text file
        reader.readAsText(file);

    });


    function resNavbar() {
        var x = document.getElementById("myTopnav");
        if (x.className === "topnav") {
            x.className += " responsive";
        } else {
            x.className = "topnav";
        }
    }


    function scoreBoard() {
        document.querySelector('.page').classList.add('hide');
        document.querySelector('#scoreBoard1').classList.remove('hide');
        document.querySelector('#scoreBoard2').classList.remove('hide');
        $('.label').removeClass('hide');


        $("#scoreBoard1").empty().html(function () {
            jQuery(this).append(
                `${function () {
                    let i = 0;
                    let html = `<thead><tr><th>Time</th>`
                    let ans = 0;
                    let sum = 0;
                    let percent = 0;
                    for (key in score) {
                        html += `<th scope="col">${key}</th>`;
                    }
                    html += `<th scope="col">Percentage</th></thead><tbody></tr><tr><td data-label="Time">${min}:${sec}</td>`;

                    for (key in score) {
                        html += `<td data-label="${key}">${score[key]} out of ${numcategories[key]}</td>`
                        
                        localStorage.setItem('score', JSON.stringify(score));
                    
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
                    for (key in falsePositive) {
                        html += `<th scope="col">${key}</th>`;
                    }
                    html += `<th scope="col">Percentage</th></tr></thead><tbody><tr>`;

                    for (key in falsePositive) {
                        html += `<td data-label="${key}">${falsePositive[key]} out of ${numcategories[key]}</td>`
                        localStorage.setItem('falsepositive', JSON.stringify(falsePositive));
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
    }

    document.querySelector("#close").addEventListener("click", function () {
        document.querySelector(".popup").style.display = "none";
    });
 
    
    

        
	