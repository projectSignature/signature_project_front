var gymname = ""
var menbers_active = ""
var next_graduation = ""
var my_division = ""
let yetpayment = []
var membersCount = ""
let membersarry = []
let division
const error1 = ["O campo do nome não pode está em branco","Enter name of the representative", "代表者名を入力してください"];
const error2 = ["O campo do nome da academia não pode está em branco","Enter gym name", "ジム名を入力してください"];
const error3 = ["O campo do email não pode está em branco","Enter  email", "メールアドレスを入力してください"];
const error4 = ["O campo do telefone não pode está em branco","Enter phone", "電話番号を入力してください"];
const error5 = ["O campo do nome do plano não pode está em branco","Enter plan name", "プラン名を入力してください"];
const error6 = ["O campo do valor não pode está em branco","Enter plan price", "金額を入力してください"];
const error7 = ["O campo da discrição 1 não pode está em branco","Enter plan discretion 1", "プラン説明1を入力してください"];
const error8 = ["O campo do nome para controle não pode está em branco","Enter name for control", "管理用の名称を入力してください"];
const error9 = ["Por favor, digite sua senha atual","Please enter your current password", "現在のパスワードを入力してください"];
const error10 = ["por favor digite uma nova senha","please enter a new password", "新しいパスワードを入力してください"];
const error11 = ["Insira uma senha de confirmação","Please enter a confirmation password", "確認パスワードを入力してください"];
const error12 = ["A nova senha e a senha de confirmação estão diferentes","New password and confirmation password are different", "新しいパスワードと確認パスワードが違ってます"];
const error13 = ["Erro na senha atual","Error in current password", "現在のパスワードに誤りがあります"];
const error14 = ["Erro na alteração, tente novamente","Change error, try again", "変更に失敗しました,　再度お試しください"];
const error15 = ["Senha inválida, senha tem que ter no mínimo 8 dígitos","Invalid password, password must have at least 8 digits", "無効なパスワード、パスワードは少なくとも8桁でなければなりません"];

const language = ["PT","EN","JP"]
const stext1 = ["Nome do representant","Name of the representative","代表者名"]
const stext2 = ["Nome da academia","Gym name","ジム名"]
const stext3 = ["Email","Email","メールアドレス"]
const stext4 = ["Telefone","Telephone","電話番号"]
const stext5 = ["Idioma","Language","言語"]
const stext6 = ["Meus dados","My data","個人情報"]
const stext7 = ["Senha","Password","パスワード"]
const stext8 = ["Planos","Plans","プラン"]
const stext9 = ["Salvar","Save","保存"]
const stext10 = ["Voltar","Back","戻る"]
const stext11=["Alteração foi feita com sucesso","Change was successfully made","変更が完了しました"]
const stext12=["Pronto","Success","完了"]
const stext13=["Nome","Name","名称"]
const stext14=["Valor","Price","価格"]
const stext15=["Discrição1","Discretion1","説明1"]
const stext16=["Discrição2","Discretion2","説明2"]
const stext17=["Discrição3","Discretion3","説明3"]
const stext18=["Discrição4","Discretion4","説明4"]
const stext19=["Discrição5","Discretion5","説明5"]
const stext20=["Divizão","Division","区分"]
const stext21=["Ação","Action","変更・削除"]
const stext22=["Alterar o plano","Change the plan","プランの変更"]
const stext23=["Deletar o plano","Delete the plan","プランの削除"]
const stext24 = ["Deletar","Delete","削除"]
const stext25 = ["Nome para controle","name for control","管理用の名称"]
const stext26 = ["Início","Home","ホーム"]
const stext27 = ["Alterar a senha","Change the password","パスワードの変更をします"]
const stext28 = ["Senha atual","Current Password","現在のパスワード"]
const stext29 = ["Nova Senha","New Password","新しいパスワード"]
const stext30 = ["Confirme a Senha","Confirm password","パスワードの確認入力"]
const stext31 = ["Letras inválidas","invalid character","半角英数字で入力してください"]
var token = sessionStorage.getItem("token");
const addMemberDiv = document.querySelector('#add_member_div');
const memberDiv = document.querySelector('#member_div');
const paymentDiv = document.querySelector('#payment_div');
const graduacaoDiv = document.querySelector('#graduacao_div');
let clients
let gymid = 4
var my_language = 0
const regex = /^(?=.*[A-Z])[a-zA-Z0-9.?/-]{8,24}/;


Swal.fire({
  icon:"info",
  title: 'Processing'
, html: 'Wait'
, allowOutsideClick : false
, showConfirmButton: false,
  timer: 5000,
  timerProgressBar: true
, onBeforeOpen: () => {
    Swal.showLoading();
  }
});


if (token == 567) {
  addMemberDiv.style.display = 'none';
  memberDiv.style.display = 'none';
  paymentDiv.style.display = 'none';
  graduacaoDiv.style.display = 'none';
}



document.getElementById('paydiv').addEventListener('click', payswall)

document.getElementById("configration").addEventListener("click",config_main)
  function config_main(){
 my_language = ""
  axios.get(`https://squid-app-ug7x6.ondigitalocean.app/clientesDados/${gymid}`)
    .then(function (response) {
      if(response.status==200){
        console.log(response.data)
      }else{
        console.log('ng')
      }
      if(response.data[0].LANGUAGE=="PT"){
        my_language =0
        languageNow ="Português"
        division = ["Adulto-homem","Adulto-mulher", "Menores", "Plano familiar","Plan free"]
      }else if(response.data[0].LANGUAGE=="JP"){
        languageNow ="日本語"
        my_language =2
          division = ["男性-成人","女性-成人", "未成年", "ﾌｧﾐﾘｰﾌﾟﾗﾝ","ﾌﾘｰﾌﾟﾗﾝ"]
      }else{
        languageNow ="Inglês"
        my_language =1
          division = ["Male-adult","Famale-adult", "underage", "Family plan","Free plan"]
      }

  Swal.fire({
   html: `
           <div class="div-flex">
            <input class="button-input" type="button" value="${stext6[my_language]}"/>
            <input class="button-input" type="button" id="select-pass" value="${stext7[my_language]}" onclick="password_change()"/>
            <input class="button-input" type="button" id="select-plans" onclick="config_plan()" value="${stext8[my_language]}"/>
           </div>
           <hr class="underbar" />
           <div class="div-flex">
            <div id="left-div" class="div-block">
               <div><span>${stext1[my_language]}</span></div>
               <div><span>${stext2[my_language]}</span></div>
               <div><span>${stext3[my_language]}</span></div>
               <div><span>${stext4[my_language]}</span></div>
               <div><span>${stext5[my_language]}</span></div>
            </div>
            <div id="right-div" class="div-block">
              <div class="div-text-input"><input class="text-input" type="text" id="representant" value="${response.data[0].REPRESENTATIVE}"/></div>
              <div class="div-text-input"><input class="text-input" type="text" id="gymname"  value="${response.data[0].GYM_NAME}"/></div>
              <div class="div-text-input"><input class="text-input" type="text" id="tel"  value="${response.data[0].TEL}"/></div>
              <div class="div-text-input"><input class="text-input" type="text" id="email"  value="${response.data[0].EMAIL}"/></div>
              <div class="div-text-input-language">
                <select class="text-input-language" id="selectlanguage">
                <option value="PT">Português</option>
                <option value="JP">日本語</option>
                <option value="EN">English</option>
                <option value="${response.data[0].LANGUAGE}" selected>${languageNow}</option>
                </select>
              </div>
            </div>
           </div>
           <style>
           .text-input-language:hover{
             transform: scale(1.1);
           }
           .div-flex{
             display:flex;
             width:100%;
           }
           .button-input{
             border-radius:50px;
             background-color: #4169E1 !important;
             color:white;
             width:25%;
             height:70px;
             margin-left:15px;
             cursor:pointer;
             font-size:2vw;
           }
           .swal2-popup {
               width: 60% !important;
               height:650px !important;
           }
           .div-block{
             display:block;
           }
           #left-div{
             width:40%
           }
           #right-div{
             width:60%;
           }
           .div-block div{
             text-align: left;
             height:50px;
             margin-top:30px;
           }
           .div-block div span{
             font-size:1.5vw;
           }
           .div-block div input{
             height:100%;
             margin-left:50px;
             width:100%;
             height:50px;
           }
           .div-text-input{
             width:70%;
           }
           .div-text-input-language{
             margin-left:50px;
             display:flex;
             width:70%;
           }
           .text-input-language{
             width:40% !important;
             margin-left:3px !important;
             font-size:1.2vw;
           }
           #select-pass ,#select-plans{
             background-color:#CCCCCC !important;
             color:#555555 !important;
           }
           .button-input:hover{
             transform: scale(1.1);
           }
           @media only screen and (max-width: 700px) {
             .swal2-popup {
             width: 100% !important;
              height:600px !important;
            }
            .button-input{
              width:30%;
              font-size:3vw;
            }
            .div-block div span{
              font-size:3vw;
            }
            .text-input-language{
              width:75% !important;
              font-size:2vw;
            }
           }


           </style>
          `
  , allowOutsideClick : false     //枠外をクリックしても画面を閉じない
  , showConfirmButton: true
  ,showCancelButton: true
  ,confirmButtonText: stext9[my_language]
  ,cancelButtonText: stext10[my_language]
  }).then((result) => {
   if (result.isConfirmed) {
     representant = document.getElementById("representant").value;
     gymname = document.getElementById("gymname").value;
     email = document.getElementById("email").value;
     tel = document.getElementById("tel").value;

     if(representant==""){
       swallerror(error1[my_language],1)
     }else if(gymname==""){
       swallerror(error2[my_language],1)
     }else if(email==""){
       swallerror(error3[my_language],1)
     }else if(tel==""){
       swallerror(error4[my_language],1)
     }else{
       try{
       fetch("https://squid-app-ug7x6.ondigitalocean.app/clientUpdate", {
         method: 'POST',
         body: JSON.stringify({
           id:response.data[0].id,
           name1:representant,
           name2:gymname,
           email:email,
           tel:tel,
           language:document.getElementById("selectlanguage").value
         }),
         headers: { "Content-type": "application/json; charset=UTF-8" }
       })
       .then((x) => x.json())
       .then((res) => {
         console.log(res)
         swall_success()
       })

       }catch (error) {
         console.log(error)
       }
     }
   }
})
  })
}



function password_change() {
    Swal.fire({
        html: `
             <div id="title">${stext27[my_language]}</div>
             <div id="client">
                 <div id="passdiv" class="right-div">
                     <input  type="password" pattern="^[0-9a-zA-Z]{8,16}" placeholder="${stext28[my_language]}"  id="password" />
                     <span id="buttonEye1" class="fa fa-eye" onclick="pushHideButton(1)"></span>
                 </div>
                 <span class="error-red" id="atention-color1">${stext31[my_language]}</span>
                 <div class="right-div">
                     <input  type="password" pattern="^[0-9a-zA-Z]{8,16}" placeholder="${stext29[my_language]}"  id="newPassword" />
                     <span id="buttonEye2" class="fa fa-eye" onclick="pushHideButton(2)"></span>

                 </div>
                 <span class="error-red" disabled>${stext31[my_language]}</span>
                 <div class="right-div">
                     <input  type="password" pattern="^[0-9a-zA-Z]{8,16}" placeholder="${stext30[my_language]}"  id="confirmpassword" />
                     <span id="buttonEye3" class="fa fa-eye" onclick="pushHideButton(3)"></span>
                 </div>
                 <span class="error-red" disabled>${stext31[my_language]}</span>
             </div>
             <style>
             .swal2-popup {
                 width: 40% !important;
             }
                 #title{
                   font-size:4vh;
                 }
                 #client{
                     width: 100%;
                 }
                 #client div{
                     width: 100%;
                 }
                 #client input {
                     border-radius: 10px;
                     height: 5vh;
                     border: 1px solid gray;
                     text-indent: 10px;
                 }
                 #textPassword {
                         border: none; /* デフォルトの枠線を消す */
                       }
                       #fieldPassword {
                         border-width: thin;
                         border-style: solid;
                         width: 200px;
                       }
                       .error-red{
                         color:white;
                       }
                          @media only screen and (max-width: 700px) {
                            .swal2-popup {
                                width: 80% !important;
                            }
                          }
             </style>
           `,
        showCancelButton: true,
        cancelButtonText: "キャンセル",
        confirmButtonText: "変更する",
    }).then(result => {
      let passchange
        if (result.isConfirmed) {
          let pass= document.getElementById("password").value
         let newpass = document.getElementById("newPassword").value
         let confirmpass = document.getElementById("confirmpassword").value
         if(pass==""){
           swallerror(error9[my_language],3)
         }else if(newpass==""){
           swallerror(error10[my_language],3)
         }else if(newpass!=confirmpass){
           swallerror(error12[my_language],3)
         }else{
           hankaku2Zenkaku(newpass)
           .then((str1)=>{
           })
           hankaku2Zenkaku(confirmpass)
           .then((str1)=>{
           }).then((passcheck)=>{
             if(regex.test(confirmpass)){
                  axios.get(`https://squid-app-ug7x6.ondigitalocean.app/clientesDados/${gymid}`)
                    .then(function (response) {
                      console.log(response)
                      if(response.status==200){
                        if(response.data[0].PASSWORD==pass){
                          console.log('ok20onaji')
                          fetch("https://squid-app-ug7x6.ondigitalocean.app/passupdate", {//pegar todos dados do table de pagamentos
                            method: 'POST',
                            body: JSON.stringify({ id:gymid,pass:confirmpass}),
                            headers: { "Content-type": "application/json; charset=UTF-8" }
                          })
                            .then((x) => x.json())
                            .then((res) => {
                              swall_success()
                            })
                        }else{
                          swallerror(error13[my_language],3)
                        }
                      }else{
                        swallerror(error14[my_language],3)
                      }

                   })
    　　　　　     }else{
               swallerror(error15[my_language],3)
    }
           })
         }
      }
    })
}


function pushHideButton(data) {
  switch (data) {
    case 1:
    txtPass = document.getElementById("password")
    btnEye = document.getElementById("buttonEye1")
    break;
    case 2:
   txtPass = document.getElementById("newPassword")
   btnEye = document.getElementById("buttonEye2")
   break;
    case 3:
    txtPass = document.getElementById("confirmpassword")
    btnEye = document.getElementById("buttonEye3")
      break;
  }
        if (txtPass.type === "text") {
          txtPass.type = "password";
          btnEye.className = "fa fa-eye";
        } else {
          txtPass.type = "text";
          btnEye.className = "fa fa-eye-slash";
        }
      }

function config_plan(){
fetch('https://squid-app-ug7x6.ondigitalocean.app/planget')
  .then((x) => x.json())
  .then((res) => {
  clients = res
  let plans = []
  plans.push(`<tr>
                 <th class="_sticky z-02">${stext13[my_language]}</th>
                 <th class="_sticky">${stext14[my_language]}</th>
                 <th class="_sticky">${stext20[my_language]}</th>
                 <th class="_sticky">${stext15[my_language]}</th>
                 <th class="_sticky">${stext16[my_language]}</th>
                 <th class="_sticky">${stext17[my_language]}</th>
                 <th class="_sticky">${stext18[my_language]}</th>
                 <th class="_sticky">${stext19[my_language]}</th>
                 <th class="_sticky">${stext25[my_language]}</th>
                 <th class="_sticky">${stext21[my_language]}</th>
                 </tr>`)
  for (let index = 0; index < res.length; index++) {
    if(res[index].GYM_ID==gymid){
      plans.push(`<tr>
                    <th class="_sticky" name="_sticky_name">${res[index].PLANS_NAME}</th>
                    <td>${res[index].PLAN_VALOR}</td>
                    <td>${division[res[index].PLAN_KUBUN]}</td>
                    <td>${res[index].PLAN_DISCRITION1}</td>
                    <td>${res[index].PLAN_DISCRITION2}</td>
                    <td>${res[index].PLAN_DISCRITION3}</td>
                    <td>${res[index].PLAN_DISCRITION4}</td>
                    <td>${res[index].PLAN_DISCRITION5}</td>
                    <td>${res[index].CONTROL_NAME}</td>
                    <td>
                        <img class="image-cursor"  src="../image/edit.svg" onClick="editPlan(${index})" alt="" width="25">
                        <img class="image-cursor"  src="../image/delete.svg" onClick="Plandelete_check(${index})" alt="" width="25">
                    </td>
                  </tr>`
                )
    }

    }

Swal.fire({
 html: `
         <div class="div-flex">
          <input class="button-input" type="button" id="mydata" value="${stext6[my_language]}" onClick="config_main()"/>
          <input class="button-input" type="button" id="select-pass" value="${stext7[my_language]}"/>
          <input class="button-input" type="button" id="select-plans"  value="${stext8[my_language]}"/>
         </div>
         <hr class="underbar" />
         <div class="twrapper">
         <table>
           <tbody>${plans}</tbody>
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
             width:80px !important;
           }

   }
        </style>
        `
, allowOutsideClick : false     //枠外をクリックしても画面を閉じない
, showConfirmButton: true
,showCancelButton: true
,confirmButtonText:stext10[my_language]
,cancelButtonText:stext26[my_language]
}).then((result) => {
 if (result.isConfirmed) {
   config_main()
 }else{
   swal.close()
 }
})
})
}

function Plandelete_check(data){
  Swal.fire({
  title: `${stext23[my_language]}:${clients[data].PLANS_NAME}`
, icon : 'info',
showConfirmButton: true,
confirmButtonText: stext24[my_language],
showCancelButton:true,
cancelButtonText:　stext10[my_language]
}).then((result) => {
 if (result.isConfirmed) {
    fetch("https://squid-app-ug7x6.ondigitalocean.app/planDelete", {//pegar todos dados do table de pagamentos
      method: 'POST',
      body: JSON.stringify({ id: clients[data].ID}),
      headers: { "Content-type": "application/json; charset=UTF-8" }
    })
      .then((x) => x.json())
      .then((res) => {
        swall_success()
      })
 }
})
}
  function editPlan(data){
    Swal.fire({
      title: stext22[my_language],
      customClass: 'customizable',
      html: `
             <div id="clientes-div">
                <div class="div-flex">
                 <div class="div-flex-span">
                   <span>${stext13[my_language]}</span>
                 </div>
                 <div class="div-flex-input">
                   <input id="planname" value="${clients[data].PLANS_NAME}"/>
                 </div>
                </div>
                <div class="div-flex">
                <div class="div-flex-span">
                   <span>${stext14[my_language]}</span>
                 </div>
                 <div class="div-flex-input">
                    <span id="yenmark">￥</span>
                    <input input type="text" onblur="kanmaChange(this);" pattern="\d*" id="palanvalue" value="${clients[data].PLAN_VALOR}"/>
                 </div>
                </div>
                <div class="div-flex">
                 <div class="div-flex-span">
                   <span>${stext20[my_language]}</span>
                 </div>
                 <div class="div-flex-input">
                 <select class="text-input-language" id="division">
                 <option value="1">${division[0]}</option>
                 <option value="2">${division[1]}</option>
                 <option value="3">${division[2]}</option>
                 <option value="4">${division[3]}</option>
                 <option value="5">${division[4]}</option>
                 <option value="${clients[data].PLAN_KUBUN}" selected>${division[(clients[data].PLAN_KUBUN-0)-1]}</option>
                 </select>
                 </div>
                </div>
                <div class="div-flex">
                 <div class="div-flex-span">
                   <span>${stext15[my_language]}</span>
                 </div>
                 <div class="div-flex-input">
                   <input id="plandis1" value="${clients[data].PLAN_DISCRITION1}"/>
                 </div>
                </div>
                <div class="div-flex">
                 <div class="div-flex-span">
                   <span>${stext16[my_language]}</span>
                 </div>
                 <div class="div-flex-input">
                   <input id="plandis2" value="${clients[data].PLAN_DISCRITION2}"/>
                 </div>
                </div>
                <div class="div-flex">
                 <div class="div-flex-span">
                   <span>${stext17[my_language]}</span>
                 </div>
                 <div class="div-flex-input">
                   <input id="plandis3" value="${clients[data].PLAN_DISCRITION3}"/>
                 </div>
                </div>
                <div class="div-flex">
                 <div class="div-flex-span">
                   <span>${stext18[my_language]}</span>
                 </div>
                 <div class="div-flex-input">
                   <input id="plandis4" value="${clients[data].PLAN_DISCRITION4}"/>
                 </div>
                </div>
                <div class="div-flex">
                 <div class="div-flex-span">
                   <span>${stext19[my_language]}</span>
                 </div>
                 <div class="div-flex-input">
                   <input id="plandis5" value="${clients[data].PLAN_DISCRITION5}"/>
                 </div>
                </div>
                <div class="div-flex">
                 <div class="div-flex-span">
                   <span>${stext25[my_language]}</span>
                 </div>
                 <div class="div-flex-input">
                   <input id="controlname" value="${clients[data].CONTROL_NAME}"/>
                 </div>
                </div>
             </div>
             <style>
             .swal2-popup {
                 width: 40% !important;
                 border:2px solid gray;
             }
             #clientes-div{
               display-block;
               align-items:center;
             }
             .div-flex{
               display:flex !important;
               width:100%;
                margin-top:10px;
             }
             input ,select{
               font-size:1.5vw;
               width:80% !important;
               height:35px !important;

               border-radius:10px;
             }
             span{
               font-size:1.5vw;
             }
             .div-input{
               width:70% !important;
                background-color:blue;
             }
             .div-flex-span{
               width:25%;
             }
             .div-flex-input{
               items-align:left;
               width:75%;
             }
             #yenmark{
               width:10%;
                font-size:1.5vw;
           }
           #palanvalue{
             width:70% !important;
           }
           @media only screen and (max-width: 700px) {
             .swal2-popup {
             width: 100% !important;
            }
     }
            </style>
            `
    , allowOutsideClick : true     //枠外をクリックしても画面を閉じない
    , showConfirmButton: true
    ,showCancelButton: true
    ,confirmButtonText:stext9[my_language]
    ,cancelButtonText:stext10[my_language]
    }).then((result) => {
     if (result.isConfirmed) {
         name = document.getElementById("planname").value
         pvalue = document.getElementById("palanvalue").value
         divi = document.getElementById("division").value
         dis1 = document.getElementById("plandis1").value
         dis2 = document.getElementById("plandis2").value
         dis3 = document.getElementById("plandis3").value
         dis4 = document.getElementById("plandis4").value
         dis5 = document.getElementById("plandis5").value
         control_name = document.getElementById("controlname").value
         if(name==""){
           swallerror(error5[my_language],2,data)
         }else if(pvalue==""){
           swallerror(error6[my_language],2,data)
         }else if(dis1==""){
           swallerror(error7[my_language],2,data)
         }else if(control_name==""){
           swallerror(error8[my_language],2,data)
         }else{
           try{
             console.log(clients[data].ID)
           fetch("https://squid-app-ug7x6.ondigitalocean.app/planUpdate", {
             method: 'POST',
             body: JSON.stringify({
               name : name,
               pvalue :pvalue,
               divi :divi,
               dis1 :dis1,
               dis2 :dis2,
               dis3 :dis3,
               dis4 :dis4,
               dis5 :dis5,
               id:clients[data].ID,
               controlname:control_name
             }),
             headers: { "Content-type": "application/json; charset=UTF-8" }
           })
           .then((x) => x.json())
           .then((res) => {
             console.log(res)
             swall_success()
           })
           }catch (error) {
             console.log(error)
           }
     }
  }else{
    swal.close()
    config_plan()
  }
})
}
//半角に修正------------------------------>
function hankaku2Zenkaku(str) {
  console.log(str)
  return new Promise(function (resolve, reject) {
  let syuuseigo =""
  for (let index = 0; index < str.length; index++) {
    var aa = str[index].replace(/[Ａ-Ｚａ-ｚ０-９]/g, function(s) {
        return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
    });
    syuuseigo = syuuseigo + aa
  }
  let returnpass = checkChar(syuuseigo)
  console.log(returnpass)
  resolve(returnpass)
  //return returnpass;
})
}
//英文字のみチェック------------------------------>
function checkChar(elm){
  console.log(elm)
    //var txt=elm.;
    for(i=0 ; i < elm.length ; i++){
        if(escape(elm.charAt(i)).length >= 4){
            //alert("半角英数字を入力してください");
            return 0;
            break;
        }else{
          return elm
        }
    }
}


function kanmaChange(inputAns){
 console.log(inputAns);
 let inputAnsValue = inputAns.value;
 console.log(inputAnsValue);
 let numberAns = inputAnsValue.replace(/[^0-9]/g, "");
 kanmaAns = numberAns.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
 console.log(kanmaAns);
 if(kanmaAns.match(/[^0-9]/g)){
  inputAns.value= kanmaAns;
  return true;
 }
};

function language_select(data){
  if(data==0){
    my_language = 0
    //document.getElementById("languagePT").style.backgroundColor= "#666666"
    //document.getElementById("languagePT").style.Color='white'
    //document.getElementById("languageJP").style.backgroundColor= 'blue'
    //document.getElementById("languageJP").style.Color='#666666'
    //document.getElementById("languageEN").style.backgroundColor='yellow !important'
    //document.getElementById("languageEN").style.Color='#666666'
  }else if(data==2){
    my_language = 2
    //document.getElementById("languagePT").style.backgroundColor='#white'
    //document.getElementById("languagePT").style.Color='#666666'
    //document.getElementById("languageJP").style.backgroundColor='#4169E1'
    //document.getElementById("languageJP").style.Color='white'
    //document.getElementById("languageEN").style.backgroundColor='#white'
    //document.getElementById("languageEN").style.Color='#666666'
  }else{
    my_language = 1
    //document.getElementById("languagePT").style.backgroundColor="#white"
    //document.getElementById("languagePT").style.Color="#666666"
    //document.getElementById("languageJP").style.backgroundColor="#white"
    //document.getElementById("languageJP").style.Color="#666666"
    //document.getElementById("languageEN").style.backgroundColor="#4169E1"
    //document.getElementById("languageEN").style.Color="white"
  }
}


function payswall(){
  let yetmemberswall = []
  let row
  const months = ["0","Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
  yetmemberswall.push(`<tr><th class="_sticky z-02">Nome</th><th class="_stickyy">Ano</th><th class="_stickyy">Mês</th></tr>`)
  for (let index = 0; index < yetpayment.length; index++) {
   row = `<tr><th class="_sticky" name="_sticky_name">${yetpayment[index].nm_member}</th><td>${yetpayment[index].year}</td><td>${months[yetpayment[index].month]}</td></tr>`
  yetmemberswall.push(row)
    }
    console.log(yetmemberswall)
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
                width:80px !important;
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

document.getElementById('graduationdiv').addEventListener('click', graduationswall)

function graduationswall(){
  let yetmemberswall = []
  const months = ["Branca","Azul", "Roxa", "Marrom","Preta"];
  yetmemberswall.push(`<tr><th class="_sticky z-02">Nome</th><th class="_sticky">Faixa atual</th><th  class="_sticky">Aulas</th></tr>`)
  for (let index = 0; index < clients1.length; index++) {
    if(clients1[index].lesson_after>=39){
        let row = `<tr><th class="_sticky" name="_sticky_name">${clients1[index].nm_member}</th><td class="_sticky_y">${months[clients1[index].color]}</td><td class="_sticky_y">${clients1[index].lesson_after}</td></tr>`
        yetmemberswall.push(row)
    }
  }
  console.log(yetmemberswall.length)
    if(yetmemberswall.length<=1){
      Swal.fire({
        title: 'Não há alunos para graduar',
        showCancelButton: true,
        showConfirmButton: false,
        cancelButtonText: 'Voltar',
        width: 550,
      })
    }else{
    Swal.fire({
      title: 'Próximas graduação',
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
          width:80px !important;
        }

}

   </style>`,
    }).then((result) => {
     if (result.isConfirmed) {
       let path = `https://squid-app-ug7x6.ondigitalocean.app/signature-project-front/pages/student.html`;
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
      //memberget_chart()
    });

function plansget(){
  let plansArray = []
  let plans = []
  let plansCount = []
  fetch('https://squid-app-ug7x6.ondigitalocean.app/planget')
    .then((x) => x.json())
    .then((res) => {
    clients = res
    for(let i=0;i<clients.length;i++){
      plans.push(clients[i].CONTROL_NAME)
    }
  }).then((res)=>{
    const obj = { opt1: '', opt2: '' };
    fetch("https://squid-app-ug7x6.ondigitalocean.app/list", {
      method: "POST",
      body: JSON.stringify(obj),
      headers: { "Content-type": "application/json; charset=UTF-8" },
    })
      .then((x) => x.json())
      .then((res) => {
        for(let i =0;i<res.length;i++){
           plansArray.push(res[i].plans)
        }
        var count = []
        for (var i = 0; i < plans.length; i++) {
          mycount = plansArray.countCertainElements(plans[i])
          plansCount.push(mycount)
        }
        datacolor = ["#D0B0FF","#A4C6FF","#FFABCE","Plan D","#A7F1FF","#E9FFA5","#9BF9CC","#AEFFBD","#CCCCCC","#FA8072","#E9967A","#FF00FF","#90EE90","#48D1CC","#9ACD32"]
        create_chart(plansCount,plans,datacolor)
      })
  })
}
plansget()

Array.prototype.countCertainElements = function(value){
    return this.reduce((sum, element) => (element == value ? sum + 1 : sum), 0)
}

function create_chart(data,datacontents,datacolor){
   var ctx = document.getElementById("graph-area")//.getContext("2d");
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
  fontSize: 10,
  fontColor: "black",
  position: "outside"
  },
}
  });

  ///https://squid-app-ug7x6.ondigitalocean.app/signature-project-front/pages/ficha.html

//paymentGet------------------------------------------------->
  axios.get('https://squid-app-ug7x6.ondigitalocean.app/paymentall')
    .then(function (response) {
      document.querySelector('#payment-yet').innerHTML = response.data.length;
      yetpayment = response.data
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

    function swallerror(errormessage,kubun,data){
      console.log(errormessage,kubun,data)
      Swal.fire({
      title: 'error',
      icon: 'warning',
      showCancelButton: false,
      showConfirmButton: true,
      ConfirmButtonText: '戻る',
      width: 300,
      html:`<span>${errormessage}</span>`,
      customClass: "sweet-alert",
      }).then((result) => {
       if (result.isConfirmed) {
         if(kubun==1){
           config_main()
         }else if(kubun==2){
           editPlan(data)
         }else if(kubun==3){
           password_change()
         }
       }
     })
    }

    function swall_success(){
     Swal.fire({
     title: stext11[my_language]
    , html : stext12[my_language]
    , icon : 'success'
    , timer : '1500'
    });
       }
