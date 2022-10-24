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

if(token == 567) {
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

var past={
 jp:{
   buttons:{
   },
   Text:{
     Text1:"入会\nメンバー数",
     Text2:"支払い\n遅延メンバ数",
     Text3:"近々の予定\n昇帯数",
   },
 },
 en:{
  buttons:{
  },
  Text:{
    Text1:"Members",
    Text2:"members who are \nlate in payment",
    Text3:"Graduations \nnear",
  },
},
}

  document.getElementById("gym-name").value=gymname;
  document.getElementById("member-total").value=menbers_active;
  document.getElementById("payment-yet").value=next_graduation;
  document.getElementById("member-total-graduation").value=next_graduation;

function myDivisionCheck(){
  if(my_language==1){
    document.getElementById("menbers-discrtion").innerText=past.jp.Text.Text1;
    document.getElementById("payment-discrtion").innerText=past.jp.Text.Text2;
    document.getElementById("graduation-discrtion").innerText=past.jp.Text.Text3;
  }else if(my_language==2){
    document.getElementById("menbers-discrtion").innerText=past.en.Text.Text1;
    document.getElementById("payment-discrtion").innerText=past.en.Text.Text2;
    document.getElementById("graduation-discrtion").innerText=past.en.Text.Text3;
  }
}

function myLanguageCheck(){
  if(my_division==2){
    document.getElementById("add_member_div").style.display = "none";
    document.getElementById("graduation-discrtion").style.display = "none";
    document.getElementById("payment_div").style.display = "none";
  }
}

function navigator(ref) {
  let path = `https://squid-app-ug7x6.ondigitalocean.app/signature-project-front/pages/${ref}.html`;
   location.href = path;
  }
  ///https://squid-app-ug7x6.ondigitalocean.app/signature-project-front/pages/ficha.html

