var gymname = ""
var menbers_active = ""
var next_graduation = ""
var my_division = ""
var my_language = ""

var token = sessionStorage.getItem("token");
const addMemberDiv = document.querySelector('#add_member_div');
const memberDiv = document.querySelector('#member_div');
const paymentDiv = document.querySelector('#payment_div');
const graduacaoDiv = document.querySelector('#graduacao_div');

if (token == 567) {
  addMemberDiv.style.display = 'none';
  memberDiv.style.display = 'none';
  paymentDiv.style.display = 'none';
  graduacaoDiv.style.display = 'none';
}


/* const caminho = "http://localhost:8098/linestatus/"; //route 1
axios.get(caminho)
  .then(function (response) {
   console.log(response.data);
 })

 const caminho2 = "http://localhost:8098/linestatus/"; //route 2
 axios.get(caminho)
   .then(function (response) {
    console.log(response.data);
  }) */

var past = {
  jp: {
    buttons: {
    },
    Text: {
      Text1: "入会\nメンバー数",
      Text2: "支払い\n遅延メンバ数",
      Text3: "近々の予定\n昇帯数",
    },
  },
  en: {
    buttons: {
    },
    Text: {
      Text1: "Members",
      Text2: "members who are \nlate in payment",
      Text3: "Graduations \nnear",
    },
  },
}

document.getElementById("gym-name").value = gymname;
document.getElementById("member-total").value = menbers_active;
document.getElementById("payment-yet").value = next_graduation;
document.getElementById("member-total-graduation").value = next_graduation;

function myDivisionCheck() {
  if (my_language == 1) {
    document.getElementById("menbers-discrtion").innerText = past.jp.Text.Text1;
    document.getElementById("payment-discrtion").innerText = past.jp.Text.Text2;
    document.getElementById("graduation-discrtion").innerText = past.jp.Text.Text3;
  } else if (my_language == 2) {
    document.getElementById("menbers-discrtion").innerText = past.en.Text.Text1;
    document.getElementById("payment-discrtion").innerText = past.en.Text.Text2;
    document.getElementById("graduation-discrtion").innerText = past.en.Text.Text3;
  }
}

function myLanguageCheck() {
  if (my_division == 2) {
    document.getElementById("add_member_div").style.display = "none";
    document.getElementById("graduation-discrtion").style.display = "none";
    document.getElementById("payment_div").style.display = "none";
  }
}

//função para navegar entre as páginas do sistema, o arquivo principal é passado por param pelo front
function navigator(ref) {
  let path = `https://squid-app-ug7x6.ondigitalocean.app/signature-project-front/pages/${ref}.html`;
  location.href = path;
}
///https://squid-app-ug7x6.ondigitalocean.app/signature-project-front/pages/ficha.html

axios.get('https://squid-app-ug7x6.ondigitalocean.app/info')
  .then(function (response) {
    document.querySelector('#member-total').innerHTML = response.data;
  });

document.querySelector('#gym-name').innerHTML = sessionStorage.getItem("gym");

var next_graduation = 0
//pagar todas do table de graduação-------------------------------->
  fetch("https://squid-app-ug7x6.ondigitalocean.app/graduationlist", {
    method: "POST",
    body: JSON.stringify({ opt1: "", opt2: "" }),
    headers: { "Content-type": "application/json; charset=UTF-8" },
  })
    .then((x) => x.json())
    .then((res) => {
      clients1 = res;
      console.log(clients1)
      for (let index = 0; index < clients1.length; index++) {
        if(clients1[index].lesson_after>=39){
          next_graduation ++
        }
      }
      document.getElementById("member-total-graduation").innerHTML = next_graduation
      console.log(next_graduation)
      memberget_chart()
    });
//pagar todas do table de member------------------------------->
    function memberget_chart(){
      const filter1 = "";
      const filter2 = "";
      let planA = 0
      let planB = 0
      let planC = 0
      let planD = 0
      let planE = 0
      let planF = 0
      let planG = 0
      let planH = 0
      let planI = 0
      let planJ = 0
      let planK = 0
      let planL = 0
      let planM = 0
      let planN = 0

      const obj = { opt1: filter1, opt2: filter2 };
      fetch("https://squid-app-ug7x6.ondigitalocean.app/list", {
        method: "POST",
        body: JSON.stringify(obj),
        headers: { "Content-type": "application/json; charset=UTF-8" },
      })
        .then((x) => x.json())
        .then((res) => {
          membersarry = res;

          for (let index = 0; index < membersarry.length; index++) {
                  console.log(membersarry[index].plans);
            switch(membersarry[index].plans){
              case "Plan A":
            　 planA ++
            break;
              case "Plan B":
               planB ++
                 break;
              case "Plan C":
                planC ++
                break;
              case "Plan D":
                planD ++
                break;
              case "Plan E":
                planE ++
                break;
              case "Plan F":
               planF ++
               break;
              case "Plan G":
                planG ++
                break;
              case "Plan H":
                planH ++
                break;
              case "Plan I":
                planI ++
                break;
              case "Plan J":
                planJ ++
                break;
              case "Plan K":
                planK ++
                break;
              case "Plan L":
              planL ++
              break;
              case "Plan M":
                planM ++
                break;
              case "Plan N":
                planN ++
                break;
                default:
              }

            }
            console.log(planA,planB,planC,planD,planE,planF,planG,planH,planI,planJ,planK,planL,planM,planN)
            create_chart(planA,planB,planC,planD,planE,planF,planG,planH,planI,planJ,planK,planL,planM,planN)
        });
  }


function create_chart(planA,planB,planC,planD,planE,planF,planG,planH,planI,planJ,planK,planL,planM,planN){
    var pieData = [
   {
      value: planA,            // 値
      color:"#F7464A",       // 色
      highlight: "#FF5A5E",  // マウスが載った際の色
      label: "Plan A"        // ラベル
   },
   {
      value: planB,
      color: "#41C44E",
      highlight: "#6CD173",
      label: "PLAN B"
   },
   {
      value: planC,
      color: "#FDB45C",
      highlight: "#FFC870",
      label: "PLAN C"
   },
   {
      value: planD,
      color: "#AA49B8",
      highlight: "#C583CF",
      label: "PLAN D"
   },
   {
      value: planE,
      color: "#4D5360",
      highlight: "#616774",
      label: "PLAN E"
   }

];
   var ctx = document.getElementById("graph-area").getContext("2d");
   window.myPie = new Chart(ctx).Pie(pieData);


}
