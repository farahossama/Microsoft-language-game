var dict = {};
var categoryArray = [];
var documenttttt;
var categoryNumbers={};
documenttttt=`Unpleasant nor diminution excellence apartments imprudence the met new. Draw part them he an to he roof only. Music leave say doors him. Tore bred form if sigh case as do. Staying he no looking if do opinion. Sentiments way understood end partiality and his.Out believe has request not how comfort evident. Up delight cousins we feeling minutes. Genius has looked end piqued spring. Down has rose feel find man. Learning day desirous informed expenses material returned six the. She enabled invited exposed him another. Reasonably conviction solicitude me mr at discretion reasonable. Age out full gate bed day lose.
            
Shewing met parties gravity husband sex pleased. On to no kind do next feel held walk. Last own loud and knew give gay four. Sentiments motionless or principles preference excellence am. Literature surrounded insensible at indulgence or to admiration remarkably. Matter future lovers desire marked boy use. Chamber reached do he nothing be.

Perceived end knowledge certainly day sweetness why cordially. Ask quick six seven offer see among. Handsome met debating sir dwelling age material. As style lived he worse dried. Offered related so visitor we private removed. Moderate do subjects to distance.

Effects present letters inquiry no an removed or friends. Desire behind latter me though in. Supposing shameless am he engrossed up additions. My possible peculiar together to. Desire so better am cannot he up before points. Remember mistaken opinions it pleasure of debating. Court front maids forty if aware their at. Chicken use are pressed removed.

So by colonel hearted ferrars. Draw from upon here gone add one. He in sportsman household otherwise it perceived instantly. Is inquiry no he several excited am. Called though excuse length ye needed it he having. Whatever throwing we on resolved entrance together graceful. Mrs assured add private married removed believe did she.

May indulgence difficulty ham can put especially. Bringing remember for supplied her why was confined. Middleton principle did she procuring extensive believing add. Weather adapted prepare oh is calling. These wrong of he which there smile to my front. He fruit oh enjoy it of whose table. Cultivated occasional old her unpleasing unpleasant. At as do be against pasture covered viewing started. Enjoyed me settled mr respect no spirits civilly.

By spite about do of do allow blush. Additions in conveying or collected objection in. Suffer few desire wonder her object hardly nearer. Abroad no chatty others my silent an. Fat way appear denote who wholly narrow gay settle. Companions fat add insensible everything and friendship conviction themselves. Theirs months ten had add narrow own.

Yourself off its pleasant ecstatic now law. Ye their mirth seems of songs. Prospect out bed contempt separate. Her inquietude our shy yet sentiments collecting. Cottage fat beloved himself arrived old. Grave widow hours among him ﻿no you led. Power had these met least nor young. Yet match drift wrong his our.

Neat own nor she said see walk. And charm add green you these. Sang busy in this drew ye fine. At greater prepare musical so attacks as on distant. Improving age our her cordially intention. His devonshire sufficient precaution say preference middletons insipidity. Since might water hence the her worse. Concluded it offending dejection do earnestly as me direction. Nature played thirty all him.`;
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
        ],      },
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


    
var SetCategory=new Set(categoryArray);

    for(let i=0; i<SetCategory.size;i++){
      categoryNumbers[categoryArray[i]]=0
      for(let j=0; j<Object.keys(dict).length;j++){
        

        if (Object.values(dict)[j]==categoryArray[i]){
          
          categoryNumbers[categoryArray[i]]= categoryNumbers[categoryArray[i]]+1;

        }
      }
    }
    console.log(categoryNumbers);
    console.log(dict);
    console.log(SetCategory);
  }

  console.log(NerAPI(documenttttt));