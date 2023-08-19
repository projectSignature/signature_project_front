
let accessmainserver = 'https://squid-app-ug7x6.ondigitalocean.app'　　//メインサーバーのチェックアクセス先
let user
let password
let errormessage
let proccessKubun = 0
let paykubun = 0
let payStatus = 0
let restid=sessionStorage.getItem("restid")
let workerid=sessionStorage.getItem("id")
let menbername = sessionStorage.getItem("name")
let language = sessionStorage.getItem("language")
let catelength = 0

let text1 = ["histórico","履歴"]
let text2 = ["gastos","経費"]
let text3 = ["rendas","収入"]
let text4 = ["data","日付"]
let text5 = ["memo","メモ"]
let text6 = ["forma pag.","方法"]
let text7 = ["valor","金額"]
let text8 = ["banco","銀行"]
let text9 = ["cash","現金"]
let text10 = ["crédito","クレジット"]
let text11 = ["pago","支払済"]
let text12 = ["pendente","未払い"]
let text13 = ["selecione a categoria",'科目を選択してください']
let text14 = ["selecione a data",'支払日を選択してください']
let text15 = ["selecione a forma de pagamento",'決済手段を選択してください']
let text16 = ["digite o valor",'支払い金額を入力してください']
let text17 = ["salvando",'登録中']
let text18= ["Aguarde",'しばらくお待ちください']


createSelectepaykuun()

async function createSelectepaykuun(){
    console.log(language)
  let row = ""
    row = await `
    <option value="1">${text9[language]}</option>
    <option value="0">${text8[language]}</option>
    <option value="2">${text10[language]}</option>
    `
 document.getElementById('pay-select').innerHTML = await row
 ////////////////翻訳////////////////////////
 document.getElementById("historybutton").value=text1[language]
 document.getElementById("keihi-select").value=text2[language]
 document.getElementById("syunyu-select").value=text3[language]
 document.getElementById("div0").innerText='PAULOOOOOOO'//text4[language]
 document.getElementById("div1").innerText=text5[language]
 document.getElementById("div2").innerText=text6[language]
 document.getElementById("div3").innerText=text7[language]
 document.getElementById("input1").value=text11[language]
 document.getElementById("input2").value=text12[language]
}
if(restid==null||workerid==null||menbername==null){
  pagechange('loginadminrst')
}

createcategorys()
async function createcategorys(){
    const category = await makerequest(`https://squid-app-ug7x6.ondigitalocean.app/gategorycostGet`)
      catelength = category.clients.length
      let name = ""
      let row = ``
      for(let i=0;i<category.clients.length;i++){
         if(language==0){
           name = category.clients[i].name_pt
         }else{
           name = category.clients[i].name_jp
         }
         row += `
        <div class="category-select-button" id="type${i}" onclick="selectType(${i},'${category.clients[i].control_id}')">
          <img src="../image/ic${category.clients[i].icon_id}.png" width="40"/>
          <div><span>${name}</span></div>
        </div>`
      }
      document.getElementById('categorysdiv').innerHTML = row
}
//let menbername = "Paulo Shigaki"
document.getElementById('name-span').innerText = menbername
var today = new Date();
let yyyy = today.getFullYear();
let mm = ("0"+(today.getMonth()+1)).slice(-2);
let dd = ("00" + today.getDate()).slice(-2);

document.getElementById('calender-input').value = `${yyyy}-${mm}-${dd}`
document.getElementById('keihi-select').style = "background:#FF6928"

 function process1(data){
   if(data==1){
     document.getElementById('keihi-select').style = "background:#FF6928"
     document.getElementById('syunyu-select').style = "background:#FFFFFF"
     proccessKubun = 1
   }else{
     pagechange(`profitfluxo`)
     //document.getElementById('syunyu-select').style = "background:#FF6928"
     //document.getElementById('keihi-select').style = "background:#FFFFFF"
     swallErrorOpen('まだ準備できていません')
     //proccessKubun = 2
   }
}

async function savedata(data){//data is pay status 1:paid,2:yet
if(restid==null||workerid==null||menbername==null){
    pagechange('loginadminrst')
  }
  let datainput = document.getElementById('calender-input').value
  let memo = document.getElementById('memo-pay').value
  let slectPay = document.getElementById('pay-select').value
  let valuePay = document.getElementById('value-input').value
  if(paykubun==0){
    swallErrorOpen(text13[language])
  }else if(datainput==""){
    swallErrorOpen(text14[language])
  }else if(slectPay==""){
    swallErrorOpen(text15[language])
  }else if(valuePay==""){
    swallErrorOpen(text16[language])
  }else{
    saveToSql(datainput,memo,slectPay,valuePay)
    try{

        const swal =  Swal.fire({
                icon:"info",
                title: text17[language],
                html: text18[language],
                allowOutsideClick : false,
                showConfirmButton: false,
                timerProgressBar: true,
                onBeforeOpen: () => {
                Swal.showLoading();
            }
          })
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
        const reqInsert = await makerequestStatus(url,body)

        if(reqInsert!=200){
          swallErrorOpen("Ops, houve erro")
        }else{
            document.getElementById('memo-pay').value = ""
            document.getElementById('value-input').value = ""
            const getRestStatus = await makerequest(`https://squid-app-ug7x6.ondigitalocean.app/restmanegerTimeGet`)
              let payinsert
              let upvalue
              if(slectPay==1){
                payinsert = 0
                upvalue = (getRestStatus[0].cach-0)-((valuePay.split('￥')[1]).replace(",","")-0)
              }else{
                payinsert = 1
                upvalue = (getRestStatus[0].bank-0)-((valuePay.split('￥')[1]).replace(",","")-0)
              }
                const url = 'https://squid-app-ug7x6.ondigitalocean.app/cachChangeonly';
                const body = {
                  d0: payinsert,
                  d1: upvalue,
                };
                const request = await makerequest3(url, body);
                if(request!=200){
                  swallErrorOpen("Ops, houve erro")
                }else{
                await swal.close()
            swallSuccess()
          }
          }
      }catch (error) {
        swallErrorOpen("Ops, houve erro")
      }
  }

}

async function makerequest3(url,data){
  const request = await fetch(url, {//pegar todos dados do table de pagamentos //n]
    method: 'POST',
    body: JSON.stringify(data),
    headers: { "Content-type": "application/json; charset=UTF-8" }
  })
  return request.status
}

async function makerequest2(url,data){
  const request = await fetch(url, {//pegar todos dados do table de pagamentos //n]
    method: 'POST',
    body: JSON.stringify(data),
    headers: { "Content-type": "application/json; charset=UTF-8" }
  })
  return request.JSON()
}

async function makerequestStatus(url,data){
  const request = await fetch(url, {//pegar todos dados do table de pagamentos //n]
    method: 'POST',
    body: JSON.stringify(data),
    headers: { "Content-type": "application/json; charset=UTF-8" }
  })
  return request.status
}
async function makerequest(url){
  const request = await fetch(url)  //esperar aqui
  return request.json()
}
function saveToSql(d1,d2,d3,d4){

}


function selectType(data,id){

  for(let i=0;i<catelength;i++){
    if(data==i){
      document.getElementById(`type${i}`).style = "background:#FF6928"
      paykubun = id
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

async function swallSuccess(){
  const Toast = await Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 2000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer)
    toast.addEventListener('mouseleave', Swal.resumeTimer)
  }
})

Toast.fire({
  icon: 'success',
    title: 'Feito'
})
}

function pagechange(data){
  window.location = `./${data}.html`;
}

async function kanmaReplase(){
  let data = document.getElementById('value-input')
  if(data.value.length==1&&data.value!="￥"){
    data.value = ("￥" + data.value)
  }else{
   let numberAns = (data.value.slice( 1 )).replace(/[^0-9]/g, "");
   kanmaAns = numberAns.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
   data.value = `￥${kanmaAns}`
 }
   //return `￥${kanmaAns}`
};






 function addkamoku(){
   swallErrorOpen("追加の権限がありません")
 }

 function dayChange(data){
   let dt = document.getElementById("calender-input")
   let date = new Date(dt.value.split("-")[0], dt.value.split("-")[1]-1, dt.value.split("-")[2]);
   if(data==2){
     date.setDate(date.getDate() + 1)
   }else{
     date.setDate(date.getDate() - 1)
   }
   let dM = (("0" + (date.getMonth()+1)).slice(-2))
   let dd = (("0" + date.getDate()).slice(-2))
   dt.value = `${date.getFullYear()}-${dM}-${dd}`
 }
