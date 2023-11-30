
var dict = {};
var categoryArray = [];
//var documenttttt;
//documenttttt= localStorage.paragraph;
function NerAPI(document)
{
fetch(
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
            text:document,
            language:"en" },
        ],
      },
    }),
  }
)

  .then((res) => {
    if (res.ok) {
      console.log("HTTP request successful");
    } else {
      console.log("HTTP request unsuccessful");
    }
    return res;
  })
  .then((res) => res.json())
  .then((data) =>parseData(data) )
  .catch((error) => console.log(error));
}



function parseData(data){
    for (
      let i = 0;
      i < data["results"]["documents"]["0"]["entities"].length;
      i++
    ) {
      dict[data["results"]["documents"]["0"]["entities"][i]["text"]] =
        data["results"]["documents"]["0"]["entities"][i]["category"];
      categoryArray.push(
        data["results"]["documents"]["0"]["entities"][i]["category"]
      );
    }
   
    var item=[];
    var array=[];
    var counter=0;
   
    new Set(categoryArray).forEach((value) => {
      console.log(value);
      array += value + "," ;
      counter++;
      
      })
    
    array = array.slice(0,-1);
    for(i=0; i<counter;i++)
    {
    var split = array.split(",")[i];
    item[i] = split;
    console.log(item[i]);
    document.getElementById('category').innerHTML += item[i] + " ";
    
    //console.log(dict);
    //console.log(new Set(categoryArray));
    
    } 
  
}



  //console.log(NerAPI(documenttttt));