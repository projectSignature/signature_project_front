
let accessmainserver = 'https://squid-app-ug7x6.ondigitalocean.app'　　//メインサーバーのチェックアクセス先]
//let accessmainserver = 'http://localhost:3000'
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
//language texts
let text1 = ["histórico","履歴"]
let text2 = ["gastos","経費"]
let text3 = ["rendas","収入"]
let text4 = ["data","日付"]
let text5 = ["memo","メモ"]
let text6 = ["forma pag.","方法"]
let text7 = ["valor","金額"]
let text8 = ["banco","銀行"]
let text9 = ["bolsa1","バッグ1"]
let text10 = ["crédito","クレジット"]
let text11 = ["pago","支払済"]
let text12 = ["pendente","未払い"]
let text13 = ["selecione a categoria",'科目を選択してください']
let text14 = ["selecione a data",'支払日を選択してください']
let text15 = ["selecione a forma de pagamento",'決済手段を選択してください']
let text16 = ["digite o valor",'支払い金額を入力してください']
let text17 = ["salvando",'登録中']
let text18= ["Aguarde",'しばらくお待ちください']
let text19=["número da notinha","レシート番号"]
let text20=["bolsa2","バッグ2"]
let text21=["Fornecedor","仕入先"]
let langsName=['name_pt','name_jp']


createSelectepaykuun()

async function createSelectepaykuun(){
  if(restid==null||workerid==null){
      pagechange('loginadminrst')
    }
  let row = ""
    row = await `
    <option value="1">${text9[language]}</option>
    <option value="4">${text20[language]}</option>
    <option value="0">${text8[language]}</option>
    <option value="2">${text10[language]}</option>
    `
 document.getElementById('pay-select').innerHTML = await row
 ////////////////翻訳////////////////////////
 document.getElementById("historybutton").value=text1[language]
 document.getElementById("keihi-select").value=text2[language]
 document.getElementById("syunyu-select").value=text3[language]
 document.getElementById("div0").innerText=text4[language]
 document.getElementById("div1").innerText=text5[language]
 document.getElementById("div2").innerText=text6[language]
 document.getElementById("div3").innerText=text7[language]
 document.getElementById("input1").value=text11[language]
 document.getElementById("input2").value=text12[language]
 document.getElementById("div4").innerText=text21[language]
}
//if(restid==null||workerid==null||menbername==null){
  //pagechange('loginadminrst')
//}

createcategorys()
async function createcategorys(){
    const category = await makerequest(`${accessmainserver}/gategorycostGet`)
    let supplieres = await makerequest(`${accessmainserver}/getsupplires`)
    let options = ``
    for(let i=0;i<supplieres.length;i++){
      options += `<option value="${supplieres[i].id}">${supplieres[i][langsName[language]]}</option>`
    }
      catelength = category.clients.length
      let name = ""
      let row = ``
      for(let i=0;i<category.clients.length;i++){
         row += `
        <div class="category-select-button" id="type${i}" onclick="selectType(${i},'${category.clients[i].control_id}')">
          <img src="../image/ic${category.clients[i].icon_id}.png" width="40"/>
          <div><span>${category.clients[i][langsName[language]]}</span></div>
        </div>`
      }
      document.getElementById('categorysdiv').innerHTML = row
      document.getElementById('Suppliers-select').innerHTML = options
}

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
   }
}

async function savedata(data){//data is pay status 1:paid,2:yet
  console.log('paystart')
if(restid==null||workerid==null){
    pagechange('loginadminrst')
  }else{
    let datainput = document.getElementById('calender-input').value
    let memo = document.getElementById('memo-pay').value
    let slectPay = document.getElementById('pay-select').value
    let valuePay = document.getElementById('value-input').value
    let suppliere = document.getElementById('Suppliers-select').value
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

             let seq = await makerequest(`${accessmainserver}/costRestGet?id=0`)
             let seqs = 0
             if(seq.length!=0){
               seqs = seq[seq.length-1].seq+1
             }

            let url = `${accessmainserver}/createCostRest`
            body = {
              d1:restid,
              d2:workerid,
              d3:paykubun,
              d4:(valuePay.split('￥')[1]).replace(",",""),
              d5:`'${datainput}'`,
              d6:memo,
              d7:slectPay,
              d8:data,
              d9:seqs,
              d10:suppliere
            }
          const reqInsert = await makerequestStatus(url,body)
          await console.log(reqInsert)
          if(reqInsert!=200){
            swallErrorOpen("Ops, houve erro")
          }else{
              document.getElementById('memo-pay').value = ""
              document.getElementById('value-input').value = ""
              const getRestStatus = await makerequest(`${accessmainserver}/restmanegerTimeGet`)
                let payinsert
                let upvalue
                if(slectPay==1){
                  payinsert = 0
                  upvalue = (getRestStatus[0].cach-0)-((valuePay.split('￥')[1]).replace(",","")-0)
                }else if(slectPay==4){
                  payinsert = 4
                  upvalue = (getRestStatus[0].cach2-0)-((valuePay.split('￥')[1]).replace(",","")-0)
                }else{
                  payinsert = 1
                  upvalue = (getRestStatus[0].bank-0)-((valuePay.split('￥')[1]).replace(",","")-0)
                }
                  const url = `${accessmainserver}/cachChangeonlykaikei`;
                  const body = {
                    d0: payinsert,
                    d1: upvalue,
                  };
                  const request = await makerequest3(url, body);
                  if(request!=200){
                    swallErrorOpen("Ops, houve erro")
                  }else{
                  await swal.close()
               await swallSuccess()
              await swalreshitenumber(seqs)
            }
            }
        }catch (error) {
          swallErrorOpen("Ops, houve erro")
        }
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

function swalreshitenumber(data) {
  Swal.fire({
    showConfirmButton: true,
    cancelButtonText: 'ok',
    width: 500,
    html: `<div>${text19[language]}</div>
           <div class="number-reshite">${data}</div>
           <style>
            .number-reshite{
              background-color:orange;
              font-size:3vh;
              font-weight:bold
            }
            `,
    customClass: "sweet-alert",
  }).then((result) => {

  });
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
