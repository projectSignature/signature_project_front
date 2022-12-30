var gymname = ""
var menbers_active = ""
var next_graduation = ""
var my_division = ""
var my_language = ""
let yetpayment = []
var membersCount = ""
let membersarry = []

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

document.getElementById('paydiv').addEventListener('click', payswall)

function payswall(){
  let yetmemberswall = []
  for (let index = 0; index < yetpayment.length; index++) {
    let yetmember = `<div><p>${yetpayment[index].nm_member}</p></div>`
        yetmemberswall=  yetmemberswall + yetmember
    }
    Swal.fire({
      title: 'Membros com o pagamento atrasado',
      showCancelButton: false,
      showConfirmButton: true,
      ConfirmButtonText: 'OK',
      width: 1000,
      html: `<div id="maindiv">${yetmemberswall}</div>
      <style>
      #maindiv{
        display:block;
        border:3px solid gray;
      }
      </style>`,
      customClass: "sweet-alert",
    }).then((result) => {
      if (result.isConfirmed) {
        addClient_again(swall_add_existentes)
      }
    });
}


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
      for (let index = 0; index < clients1.length; index++) {
        if(clients1[index].lesson_after>=39){
          next_graduation ++
        }
      }
      document.getElementById("member-total-graduation").innerHTML = next_graduation
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
          console.log(membersarry)
          var flugA = false;
          var flugB = false;
          var flugC = false;
          var flugD = false;
          var flugE = false;
          var flugF = false;
          var flugG = false;
          var flugH = false;
          var flugI = false;
          var flugJ = false;
          var flugK = false;
          var flugL = false;
          var flugM = false;
          var flugN = false;
          for (let index = 0; index < membersarry.length; index++) {
            switch(membersarry[index].plans){
              case "Plan A":
              flugA = true;
            　 planA ++
            break;
              case "Plan B":
                flugB = true;
               planB ++
                 break;
              case "Plan C":
                flugC = true;
                planC ++
                break;
              case "Plan D":
                flugD = true;
                planD ++
                break;
              case "Plan E":
                flugE = true;
                planE ++
                break;
              case "Plan F":
                flugF = true;
               planF ++
               break;
              case "Plan G":
                flugG = true;
                planG ++
                break;
              case "Plan H":
                flugH = true;
                planH ++
                break;
              case "Plan I":
                flugI = true;
                planI ++
                break;
              case "Plan J":
                flugJ = true;
                planJ ++
                break;
              case "Plan K":
                flugK = true;
                planK ++
                break;
              case "Plan L":
              planL ++
              flugL = true;
              break;
              case "Plan M":
                flugM = true;
                planM ++
                break;
              case "Plan N":
                flugN = true;
                planN ++
                break;
                default:
              }
            }
            data1 =[]
            data = []
            datacontents = []
            datacolor = []
            data1.push(planA,planB,planC,planD,planE,planF,planG,planH,planI,planJ,planK,planL,planM,planN)
              for (let index = 0; index < data1.length; index++) {
                     if(data1[index]){
                       data.push(data1[index])
                     }
              }
              if(flugA){
                datacontents.push("Plan A")
                datacolor.push("#D0B0FF")
              }
              if (flugB){
                datacontents.push("Plan B")
                datacolor.push("#A4C6FF")
              }
              if (flugC){
                datacontents.push("Plan C")
                datacolor.push("#FFABCE")
              }
              if (flugD){
                datacontents.push("Plan D")
                datacolor.push("#A7F1FF")
              }
              if (flugE){
                datacontents.push("Plan E")
                datacolor.push("#E9FFA5")
              }
               if (flugF){
                datacontents.push("Plan F")
                datacolor.push("#9BF9CC")
              }
              if (flugG){
                datacontents.push("Plan G")
                datacolor.push("#AEFFBD")
              }
              if (flugH){
                datacontents.push("Plan H")
                datacolor.push("#CCCCCC")
              }
              if (flugI){
                datacontents.push("Plan I")
                datacolor.push("#FA8072")
              }
              if (flugJ){
                datacontents.push("Plan J")
                datacolor.push("#E9967A")
              }
              if (flugK){
                datacontents.push("Plan K")
                datacolor.push("#FF00FF")
              }
              if (flugL){
                datacontents.push("Plan L")
                datacolor.push("#90EE90")
              }
              if (flugM){
                datacontents.push("Plan M")
                datacolor.push("#48D1CC")
              }
              if (flugN){
                datacontents.push("Plan N")
                datacolor.push("#9ACD32")
              }
            create_chart(data,datacontents,datacolor)
        });

  }



function create_chart(data,datacontents,datacolor){
   var ctx = document.getElementById("graph-area")//.getContext("2d");
  // window.myPie = new Chart(ctx).Pie(pieData);
  var graph_area = new Chart(ctx,{
    type: 'pie',
    data:{
      labels:datacontents,
      datasets:[{
        backgroundColor:datacolor,
        data: data
      }]
    },
    options:{
      title:{
        display:false,
        text: "Plan ratio chart1"
      },
legend:{
  display:false ,
},
pieceLabel: {
  render: "label",
  fontSize: 12,
  fontColor: "black",
  position: "outside"
  },
}
  });

  ///https://squid-app-ug7x6.ondigitalocean.app/signature-project-front/pages/ficha.html
  axios.get('https://squid-app-ug7x6.ondigitalocean.app/info')
    .then(function (response) {
      document.querySelector('#member-total').innerHTML = response.data;
      membersCount = response.data
      console.log(membersCount)
      line_chart(membersCount)
    });
}
//paymentGet------------------------------------------------->
  axios.get('https://squid-app-ug7x6.ondigitalocean.app/paymentall')
    .then(function (response) {
      document.querySelector('#payment-yet').innerHTML = response.data.length;
      yetpayment = response.data
    });
    function line_chart(membersCount){
      let day = new Date();
      var ctx1 = document.getElementById('ex_chart');
      console.log(membersarry.length)
      let kongetsu = day.getMonth()+1
      let kotoshi = day.getFullYear()
      let mystartyear
      let mystartmonth
      if(kongetsu==12){
        mystartyear=kotoshi
        mystartmonth=kongetsu
      }else{
        mystartyear=(kotoshi-0)-1
        mystartmonth=1+(kongetsu-0)
      }
      console.log(mystartyear)
      console.log(mystartmonth)

    //  var kongetsu = document.querySelector('#member-total').innerHTML
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];


      for (let index = 0; index < membersarry.length; index++) {
        console.log(membersarry[index].inactive_date.split("-")[0])
          if(membersarry[index].inactive_date==0){
            if(membersarry[index].active_date.split("-")[0]==kotoshi){
              //if(membersarry[index].active_date.split("-")[0]==kotoshi)
            }
          //console.log(membersarry[index].inactive_date.split("-")[0])
        //  console.log(membersarry[index].inactive_date.split("-")[1])
          //console.log(membersarry[index].active_date.split("-")[0])
        //  console.log(membersarry[index].active_date.split("-")[1])
          }
      }
     let month_name = []//months[day.getMonth()];
     for (let index = 11; index > 0; index--) {
            month_name.push(months[day.getMonth()-index])
     }
      month_name.push(months[day.getMonth()])
      var data = {
          labels: month_name,//["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dez"],
          datasets: [{
              label: 'メンバー入会推移',
              data: [membersCount, membersCount, membersCount, membersCount, membersCount,membersCount, membersCount, membersCount, membersCount, membersCount,membersCount,membersCount],
              borderColor: '#00BFFF'
          }]
      };
      var options = {};
      var ex_chart = new Chart(ctx1, {
          type: 'line',
          data: data,
          options: options
      });
    }
