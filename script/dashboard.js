var gymname = ""
var menbers_active = ""
var next_graduation = ""
var my_division = ""
var my_language = ""
let yetpayment = []
var membersCount = ""
let membersarry = []
var next_graduation = 0

var token = sessionStorage.getItem("token");
const addMemberDiv = document.querySelector('#add_member_div');
const memberDiv = document.querySelector('#member_div');
const paymentDiv = document.querySelector('#payment_div');
const graduacaoDiv = document.querySelector('#graduacao_div');

//処理中ダイアログ
Swal.fire({
  icon:"info",
  title: 'Processing'
, html: 'Wait'
, allowOutsideClick : false
, showConfirmButton: false,
  timerProgressBar: true
, onBeforeOpen: () => {
    Swal.showLoading();
  }
}).then({
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





})




if (token == 567) {
  addMemberDiv.style.display = 'none';
  memberDiv.style.display = 'none';
  paymentDiv.style.display = 'none';
  graduacaoDiv.style.display = 'none';
}

document.getElementById('paydiv').addEventListener('click', payswall)

function payswall(){
  let yetmemberswall = []
  const months = ["0","Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
  yetmemberswall.push(`<tr><th class="_sticky z-02">Nome</th><th class="_sticky">Ano</th><th  class="_sticky">Mês</th></tr>`)
  for (let index = 0; index < yetpayment.length; index++) {
    console.log(yetpayment[index])
  let row = `<tr><th class="_sticky" name="_sticky_name">${yetpayment[index].nm_member}</th><td class="_sticky_y">${yetpayment[index].year}</td><td class="_sticky_y">${months[yetpayment[index].month]}</td></tr>`
  yetmemberswall.push(row)
    }
    if(yetpayment.length==0){
      Swal.fire({
        title: 'Não há pagamento atrasado',
        showCancelButton: true,
        showConfirmButton: false,
        cancelButtonText: 'Voltar',
        width: 550,
      })
    }else{
    Swal.fire({
      title: 'Membros com o pagamento atrasado',
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: 'Tabela',
      cancelButtonText: 'Voltar',
      width: 550,
      html: `<div class="twrapper">
        <table>
          <tbody>${yetmemberswall}</tbody>
        </table>
      </div>

      <style>
      .twrapper{
        overflow-y:scroll;
        height:500px !important;
      }

      table {
        border-collapse: collapse;
        border-spacing: 0;
      }
      th, td {
        vertical-align: middle;
        padding: 20px 15px;
        font-size: 14px;
        text-align: center;
      }
      th {
        color: #EEEEEE;
        background: #222222;
      }
      td{
        border: 1px solid #ccc;
      }
      ._sticky {
        position: sticky;
        top: 0;
        left: 0;
        z-index: 1;
        width:80px !important;
        height:5px !important;
      }

      ._sticky:before {
        content: "";
        position: absolute;
        top: -1px;
        left: -1px;
        width: 100%;
        height: 100%;
        border: 1px solid #ccc;
      }
      ._sticky.z-02 {
        z-index: 2;
        width: 200px !important;
      }
      th[name="_sticky_name"]{
        background: #00BFFF;
      }

      @media only screen and (max-width: 700px) {
        ._sticky.z-02 {
          width: 15px !important;
        }
        ._sticky {
          width:60px !important;
        }

}

   </style>`,
    }).then((result) => {
     if (result.isConfirmed) {
       let path = `https://squid-app-ug7x6.ondigitalocean.app/signature-project-front/pages/payment.html`;
       location.href = path;
      }
    });
    }
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
              case "PLAN A":
              flugA = true;
            　 planA ++
            break;
              case "PLAN B":
                flugB = true;
               planB ++
                 break;
              case "PLAN C":
                flugC = true;
                planC ++
                break;
              case "PLAN D":
                flugD = true;
                planD ++
                break;
              case "PLAN E":
                flugE = true;
                planE ++
                break;
              case "PLAN F":
                flugF = true;
               planF ++
               break;
              case "PLAN G":
                flugG = true;
                planG ++
                break;
              case "PLAN H":
                flugH = true;
                planH ++
                break;
              case "PLAN I":
                flugI = true;
                planI ++
                break;
              case "PLAN J":
                flugJ = true;
                planJ ++
                break;
              case "PLAN K":
                flugK = true;
                planK ++
                break;
              case "PLAN L":
              planL ++
              flugL = true;
              break;
              case "PLAN M":
                flugM = true;
                planM ++
                break;
              case "PLAN N":
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
        display:true,
        text: "Alunos por plano"
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
//paymentGet------------------------------------------------->
  axios.get('https://squid-app-ug7x6.ondigitalocean.app/paymentall')
    .then(function (response) {
      for (let i=0;i<response.data.length;i++){
        if(response.data[i].plan!="PLAN free"){
          yetpayment.push(response.data[i])
        }
      }
      document.querySelector('#payment-yet').innerHTML = yetpayment.length;
    });

    //create line chart--------------------------------->
    axios.get('https://squid-app-ug7x6.ondigitalocean.app/info')
      .then(function (response) {
        document.querySelector('#member-total').innerHTML = response.data; //input total de alunos registrados
        membersCount = response.data
        line_chart(membersCount)
      });
  }

    function line_chart(membersCount){
      let day = new Date();
      var ctx1 = document.getElementById('ex_chart');
      let kongetsu = day.getMonth()
      let kotoshi = day.getFullYear()
      let mystartyear
      let mystartmonth
      let month_name = []//months[day.getMonth()];
      let month_answer = []//{0:0,1:0,2:0,3:0,4:0,5:0,6:0,7:0,8:0,9:0,10:0,11:0,12:0}//months[day.getMonth()];
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      if(kongetsu==11){
          for (let index = 0 ; index < kongetsu; index++) {
            month_name.push(months[index])
          }
          mystartyear = kotoshi
          mystartmonth = "1"
          myfinishmonth = "12"

        }else{
          for (let index = 1 + kongetsu ; index < 12; index++) {
            month_name.push(months[index])
          }

          for (let index = 0 ; index < kongetsu; index++) {
            month_name.push(months[index])
          }
          mystartyear = (kotoshi-0)-1
          mystartmonth = 2 + kongetsu
          myfinishmonth = "12"

        }
       month_name.push(months[kongetsu])
       for (let i=0;i<membersarry.length;i++){
         if(membersarry[i].inactive_date!="0"){
           if(membersarry[i].inactive_date.split("-")[0]>=mystartyear&&membersarry[i].inactive_date.split("-")[1]>=mystartmonth){
               month_answer.push(membersarry[i].inactive_date.split("-")[1])
           }
         }
       }
       let firstanswer = 0
       let linevalue = []
         for (let i=mystartmonth;i<=12;i++){
               for(let ii=0; ii<month_answer.length;ii++){
                 if(month_answer[ii]==i){
                   firstanswer ++
                 }
               }
                 linevalue.push(firstanswer)
                 firstanswer= 0
             }
             if(kongetsu!=11){
               for (let i=1;i<=kongetsu+1;i++){
                     for(let ii=0; ii<month_answer.length;ii++){
                       if(month_answer[ii]==i){
                         firstanswer ++
                       }
                     }
                       linevalue.push(firstanswer)
                       firstanswer= 0
                   }
             }
             let inactivecount = 0
      for(let i=10;i>=0;i--){
         inactivecount = linevalue[i] + inactivecount
        linevalue[i] = membersCount + inactivecount
      }
      linevalue[11]=membersCount
      var data = {
          labels: month_name,//["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dez"],
          datasets: [{
              label: 'Quantidade de alunos ',
              data: linevalue,
              borderColor: '#00BFFF'
          }]
      };
      var options = {};
      var ex_chart = new Chart(ctx1, {
          type: 'line',
          data: data,
          options: {
          scales: {
          yAxes: [{
            ticks: {
              suggestedMin: 0,
              stepSize: 10,
            }
          }]
       },
     },
      });
    }
