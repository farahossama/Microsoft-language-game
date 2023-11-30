//timer
const startingminutes = 0.10;
let time = startingminutes * 60;
const timer = document.getElementById("timer");

// CountUp
function countUp() {
    var t = timer.innerHTML;
    var arr = t.split(":");
    var hour = arr[0];
    var min = arr[1];
    var sec = arr[2];

    if (sec == 59) {
        if (min == 59) {
            hour++;
            min = 0;
            if (hour < 10) hour = "0" + hour;
        } else {
            min++;
        }
        if (min < 10) min = "0" + min;
        sec = 0;
    } else {
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
            var equalWords = {
                text: [],
                index: []
            };
            for (j = 0; j < result.length; j++) {
                var dataWords = result[j].text.split(" ");
                let z = 0;
                let c = i;

                while (dataWords[z] === words[c]) {
                    equalWords.text[z] = wordscpy[c];
                    equalWords.index[z] = c;
                    flag = 1;
                    z++; c++;
                }

            }

            if (!(equalWords.text.length === 0)) {
                jQuery(this).append(
                    `<span id="word${i + 1}" class="words" onclick="clickWord(${i + 1})">
                ${function () {
                        let h = "";
                        for (x = 0; x < equalWords.text.length; x++) {
                            h = h + equalWords.text[x];
                            if (x != (equalWords.text.length - 1)) {
                                h = h + " ";
                            }
                        }

                        return h;
                    }()}
               <span id="dropdown${i + 1}" class="menu">
                   <ul>
                       ${function () {
                        let html = "";
                        categories.forEach((item) => {
                            html += `<li>${item}</li>`
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
                jQuery(this).append(
                    `<span id="word${i + 1}" class="words" onclick="clickWord(${i + 1})">
                ${words[i]}
                   <span id="dropdown${i + 1}" class="menu">
                       <ul>
                       ${function () {
                        let html = "";
                        categories.forEach((item) => {
                            html += `<li>${item}</li>`
                        });
                        return html;
                    }()}
                       </ul>
                   </span>
                </span>`
                );
            } else {
                jQuery(this).append(
                    `<span id="word${i + 1}" class="words" onclick="clickWord(${i + 1})">
                 ${words[i]}
                    <span id="dropdown${i + 1}" class="menu">
                        <ul>
                        ${function () {
                        let html = "";
                        categories.forEach((item) => {
                            html += `<li>${item}</li>`
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
                let html = "";
                Object.entries(numcategories).forEach((item) => {
                    html += `<a>${item[0] + ": " + item[1] + " "}</a>`

                });

                html += `<a class="icon" onclick = "resNavbar()"}> <i class="fa fa-bars"></i> </a>`
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










var paragraph, categories, numcategories;

document.querySelector("#file-input").addEventListener('change', function () {

    // files that user has chosen
    var all_files = this.files;
    if (all_files.length == 0) {
        alert('Error : No file selected');
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
        countUp();

        var data = await NerAPI(paragraph);
        res = data.results.documents[0].entities;

        categories = listCategories(res);

        numcategories = numberCategories(res);
        console.log(numcategories);
        categoryList();
        wrapWords(res);

        //reveal page
        document.querySelector('#logo-container').classList.add('hide');
        document.querySelector('#uploadBtn').classList.add('hide');
        console.log('done');
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
    console.log(x);
    if (x.className === "topnav") {
        x.className += " responsive";
    } else {
        x.className = "topnav";
    }
}

document.querySelector("#close").addEventListener("click", function () {
    document.querySelector(".popup").style.display = "none";
});
