
let accessmainserver = 'https://squid-app-ug7x6.ondigitalocean.app'　　//メインサーバーのチェックアクセス先
let user
let password
let errormessage
let proccessKubun = 0
let paykubun = 0
let payStatus = 0
let restid=0
let workerid=0
//let menbername = sessionStorage.getItem("name")
let menbername = "Paulo Shigaki"
document.getElementById('name-span').innerText = menbername
var today = new Date();
let yyyy = today.getFullYear();
let mm = ("0"+(today.getMonth()+1)).slice(-2);
let dd = ("00" + today.getDate()).slice(-2);

document.getElementById('calender-input').value = `${yyyy}-${mm}-${dd}`

 function process1(data){
   if(data==1){
     document.getElementById('keihi-select').style = "background:#FF6928"
     document.getElementById('syunyu-select').style = "background:#FFFFFF"
     proccessKubun = 1
   }else{
     document.getElementById('syunyu-select').style = "background:#FF6928"
     document.getElementById('keihi-select').style = "background:#FFFFFF"
     proccessKubun = 2
   }
}

async function savedata(data){//data is pay status 1:paid,2:yet
  let datainput = document.getElementById('calender-input').value
  let memo = document.getElementById('memo-pay').value
  let slectPay = document.getElementById('pay-select').value
  let valuePay = document.getElementById('value-input').value
  if(paykubun==0){
    swallErrorOpen('科目を選択してください')
  }else if(datainput==""){
    swallErrorOpen('支払日を選択してください')
  }else if(slectPay==""){
    swallErrorOpen('決済手段を選択してください')
  }else if(valuePay==""){
    swallErrorOpen('支払い金額を入力してください')
  }else{
    saveToSql(datainput,memo,slectPay,valuePay)
  }
  let url = `https://squid-app-ug7x6.ondigitalocean.app/createCostRest`

  body = {
    d1:restid,
    d2:workerid,
    d3:paykubun,
    d4:(valuePay.split('￥')[1]).replace(",",""),
    d5:`'${datainput}'`,
    d6:memo,
    d7:slectPay,
    d8:data
  }
  console.log(body)
  const reqInsert = await makerequest2(url,body)
  console.log(reqInsert)
}

async function makerequest2(url,data){
  const request = await fetch(url, {//pegar todos dados do table de pagamentos //n]
    method: 'POST',
    body: JSON.stringify(data),
    headers: { "Content-type": "application/json; charset=UTF-8" }
  })
  return request.json()
}

function saveToSql(d1,d2,d3,d4){
  console.log(d1)
  console.log(d2)
  console.log(d3)
  console.log(d4)
}


function selectType(data){
  console.log(data)
  for(let i=1;i<10;i++){
    if(data==i){
      document.getElementById(`type${i}`).style = "background:#FF6928"
      paykubun = i
    }else{
      document.getElementById(`type${i}`).style = "background:#FFFFFF"
    }
  }
}

function swallErrorOpen(data) {
  Swal.fire({
    icon: 'warning',
    showCancelButton: true,
    showConfirmButton: false,
    cancelButtonText: 'back',
    width: 500,
    html: `<span>${data}</span>`,
    customClass: "sweet-alert",
  }).then((result) => {

  });
}

async function kanmaReplase(){
  let data = document.getElementById('value-input')
   let numberAns = (data.value.slice( 1 )).replace(/[^0-9]/g, "");
   kanmaAns = numberAns.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
   data.value = `￥${kanmaAns}`
   //return `￥${kanmaAns}`
};
