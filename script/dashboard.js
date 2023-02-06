var gymname = ""
var menbers_active = ""
var next_graduation = ""
var my_division = ""
let yetpayment = []
var membersCount = ""
let membersarry = []
let division
let clients
var next_graduation = 0
const date =new Date();
let row
const regex = /^(?=.*[A-Z])[a-zA-Z0-9.?/-]{8,24}/;
//前ページからの情報を処理----------------------------------------------->
var token = sessionStorage.getItem("token");//token
let gymid = sessionStorage.getItem("GYM_ID")
let language
if(sessionStorage.getItem("Language")=="PT"){
  language = 0
}else if(sessionStorage.getItem("Language")=="EN"){
  language = 1
}else{
  language = 2
}
//language=0
//gymid=4
document.querySelector('#gym-name').innerHTML = sessionStorage.getItem("gym");//gymname
if (token == 567) {
  addMemberDiv.style.display = 'none';
  memberDiv.style.display = 'none';
  paymentDiv.style.display = 'none';
  graduacaoDiv.style.display = 'none';
}else if(token==""){
  window.location = `https://squid-app-ug7x6.ondigitalocean.app/signature-project-front`
}
//翻訳テキスト----------------------------------------------------------->
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
const error16 = ["Erro de acesso no banco de dados, tente novamente","Access error in database, try again", "データベースとの接続に失敗しました、再度試してください"];
//const language = ["PT","EN","JP"]
const stext1 = ["Nome do representante","Name of the representative","代表者名"]
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
const stext13=["Nome para cliente","Name for client","メンバー用名称"]
const stext14=["Valor","Price","価格"]
const stext15=["Discrição1","Discretion1","説明1"]
const stext16=["Discrição2","Discretion2","説明2"]
const stext17=["Discrição3","Discretion3","説明3"]
const stext18=["Discrição4","Discretion4","説明4"]
const stext19=["Discrição5","Discretion5","説明5"]
const stext20=["Divisão","Division","区分"]
const stext21=["Ação","Action","変更・削除"]
const stext22=["Alterar o plano","Change the plan","プランの変更"]
const stext23=["Deletar o plano","Delete the plan","プランの削除"]
const stext24 = ["Deletar","Delete","削除"]
const stext25 = ["Nome ","name ","プラン名"]
const stext26 = ["Início","Home","ホーム"]
const stext27 = ["Alterar a senha","Change the password","パスワードの変更をします"]
const stext28 = ["Senha atual","Current Password","現在のパスワード"]
const stext29 = ["Nova Senha","New Password","新しいパスワード"]
const stext30 = ["Confirme a Senha","Confirm password","パスワードの確認入力"]
const stext31 = ["Letras inválidas","invalid character","半角英数字で入力してください"]
const stext32 = ["alunos registrados","numbers of registered members","登録会員数"]
const stext33 = ["quantidade de alunos","Numbers of registered","メンバー数推移"]
const stext34 = ["Alunos por plano","Menbers by plan","プラン別登録者数"]
const stext35 = ["Inscrição","Inscription","入会"]
const stext36 = ["Alunos","Menbers","メンバー"]
const stext37 = ["Recibos","Receipts","月謝管理"]
const stext38 = ["Calendário","Calender","カレンダー"]
const stext39 = ["Graduação","Graduation","帯管理"]
const stext40 = ["Configuração","Setting","設定"]
const stext41 = ["Entrada","Entrance","入場管理"]
const stext42 = ["Pagamentos atrasados","Late payments","月謝未払いメンバー"]
const stext43 = ["Graduações próximas","Graduations near","帯昇格者"]
const stext44 = ["Número de acessos nos últimos 7 dias","Number of accesses in the last 7 days","直近７日のアクセス数"]
const stext45 = ["Número de acessos por aulas nos últimos 7 dias","Number of accesses by class in the last 7 days","直近７日のクラス別アクセス数"]
const stext46 = ["Não há pagamento atrasado","No late payment","支払いが遅れているメンバーはいません"]
const stext47 = ["Nome","Name","メンバー名"]
const stext48 = ["Ano","Year","年"]
const stext49 = ["Mês","Month","月"]
const stext50 = ["","Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"]
const stext51 = ["","January","February","March","April","May","June","July","August","September","October","November","December"]
const stext52 = ["","1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"]
const stext53 = ["Membros com o pagamento atrasado","Members with late payment","支払いが遅れているメンバー"]
const stext56 = ["Tabela","List","リスト"]
const stext57 = ["Próximas graduação","Next graduation","帯昇格者"]
const stext58 = ["Não há alunos para graduar","There are no member to graduate","昇格対象者が現在いません"]
const stext59 = ["Criar plano","Create Plan","新規プラン"]

document.getElementById("inscricao").innerHTML = stext35[language]
document.getElementById("member").innerHTML = stext36[language]
document.getElementById("payment").innerHTML = stext37[language]
document.getElementById("entrance").innerHTML = stext41[language]
document.getElementById("calender").innerHTML = stext38[language]
document.getElementById("graduacao").innerHTML = stext39[language]
document.getElementById("config-span").innerHTML = stext40[language]
document.getElementById("menbers-discrtion").innerHTML = stext32[language]
document.getElementById("payment-discrtion").innerHTML = stext42[language]
document.getElementById("graduation-discrtion").innerHTML = stext43[language]
//翻訳関係はここまで------------------------------------->
const addMemberDiv = document.querySelector('#add_member_div');
const memberDiv = document.querySelector('#member_div');
const paymentDiv = document.querySelector('#payment_div');
const graduacaoDiv = document.querySelector('#graduacao_div');
//半角に修正------------------------------>
function hankaku2Zenkaku(str) {
  return new Promise(function (resolve, reject) {
  let syuuseigo =""
  for (let index = 0; index < str.length; index++) {
    var aa = str[index].replace(/[Ａ-Ｚａ-ｚ０-９]/g, function(s) {
        return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
    });
    syuuseigo = syuuseigo + aa
  }
  let returnpass = checkChar(syuuseigo)
  resolve(returnpass)
  //return returnpass;
})
}
//英文字のみチェック------------------------------>
function checkChar(elm){
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
 let inputAnsValue = inputAns.value;
 let numberAns = inputAnsValue.replace(/[^0-9]/g, "");
 kanmaAns = numberAns.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
 if(kanmaAns.match(/[^0-9]/g)){
  inputAns.value= kanmaAns;
  return true;
 }
};
//função para navegar entre as páginas do sistema, o arquivo principal é passado por param pelo front
function navigator(ref) {
  let path = `https://squid-app-ug7x6.ondigitalocean.app/signature-project-front/pages/${ref}.html`;
  location.href = path;
}

windowLoadGet()
async function windowLoadGet(){
  const swal =  Swal.fire({
          icon:"info",
          title: 'Processing',
          html: 'Wait',
          allowOutsideClick : false,
          showConfirmButton: false,
          timerProgressBar: true,
          onBeforeOpen: () => {
          Swal.showLoading();
      }
    })
  const graduationNear =  await makerequest(`https://squid-app-ug7x6.ondigitalocean.app/gymgraduationlist?id=${gymid}`)
  const next_graduation = await graduationCountloop(graduationNear)
  document.getElementById("member-total-graduation").innerHTML = next_graduation
  const paymentYetlist =  await makerequest(`https://squid-app-ug7x6.ondigitalocean.app/gympaymentall?id=${gymid}`)
  document.getElementById("payment-yet").innerHTML = paymentYetlist.length
  const memberlist =  await makerequest(`https://squid-app-ug7x6.ondigitalocean.app/gyminfo?id=${gymid}`)
  document.querySelector('#member-total').innerHTML = memberlist.length
  const date = await entrancedateGet ()
  const entrancedate = await date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' +('0' + date.getDate()).slice(-2)
  const weekarray = await weekArraycreate(date)
  const entranceOneweek = await makerequest(`https://squid-app-ug7x6.ondigitalocean.app/gymEntrancehistory?id=${gymid}&entrancedate=${entrancedate}`)//id=${gymid}&
  await weekaccessdataGet(weekarray,entranceOneweek)
  const planAccess = await makerequest(`https://squid-app-ug7x6.ondigitalocean.app/gymcalenderGet?id=${gymid}`)
  await classaccss(planAccess)
  const plansArray = await makerequest(`https://squid-app-ug7x6.ondigitalocean.app/gymplanget?id=${gymid}`)
  await plansget(plansArray,memberlist)
  const allMenberlist = await makerequest(`https://squid-app-ug7x6.ondigitalocean.app/membersCount?id=${gymid}`)
  await  line_chart(allMenberlist)
  const monthArray = await line_chart(allMenberlist)
  swal.close()
}

//APIアクセスファンクション
async function makerequest(url){
  const request = await fetch(url)  //esperar aqui
 return request.json()
}

function graduationCountloop(clients1){
  for (let index = 0; index < clients1.length; index++) {
    if(clients1[index].lesson_after>=39){
      next_graduation ++
    }
  }
   return next_graduation
}
async function payswall(){
  const paymentYetlist = await makerequest(`https://squid-app-ug7x6.ondigitalocean.app/gympaymentall?id=${gymid}`)
    if(paymentYetlist.length==0){
       Swal.fire({
        title: stext46[language],
       showCancelButton: true,
       showConfirmButton: false,
       cancelButtonText: stext10[language],
       width: 550,
       })
       }else{
  const yetmemberswall = await yetmemberRowCreate(paymentYetlist)
  const swal = await Swal.fire({
      showCancelButton: true,
      showConfirmButton: true,
      showDenyButton: true,
      denyButtonText: stext9[language],
      confirmButtonText: stext56[language],
      cancelButtonText: stext10[language],
      allowOutsideClick : false,
      width: 550,
      html: `
            <div class="titlename">
              ${stext53[language]}
            </div>
              <div class="twrapper">
                    ${yetmemberswall}
              </div>
            <style>
            .swal2-popup {
                width: 85% !important;
                height: 600px !important;
            }

            .titlename{
              margin-bottom:20px;
            }
            </style>`,
            scrollbarPadding:false,
    }).then((result) => {
     if (result.isConfirmed) {
       let path = `https://squid-app-ug7x6.ondigitalocean.app/signature-project-front/pages/payment.html`;
       location.href = path;
      } else if (result.isDenied) {
         const answer =  yetmemberupdate(paymentYetlist)
      }else{
       swal.close()
      }
    });
    }
}
async function yetmemberupdate(paymentYetlist){
  for (let index = 0; index < paymentYetlist.length; index++) {
      let imgName = document.getElementById(`pay-img${index}`).name
      if(imgName.split("_")[0]=="paid"){
      const payupdate = await yetmemberupdateCreate(imgName.split("_")[1])
    }
  }
}
async function yetmemberupdateCreate(id) {
  let obj = {
    id: id,
  };
  const attr = {
    method: "POST",
    body: JSON.stringify(obj),
    headers: { "Content-type": "application/json; charset=UTF-8" },
  };
  fetch("https://squid-app-ug7x6.ondigitalocean.app/payUpdatedashbord", attr)
    .then((x) => x.json())
    .then((response) => {
      return 'ok'
    })
    .catch((err) => {
        return 'ng'
    });
};

function yetmemberRowCreate(paymentYetlist){
  let yetmemberswall = []
  let months
  if(language==0){
     months = stext50
  }else if(language==1){
   months = stext51
  }else{
     months = stext52
  }
   for (let index = 0; index < paymentYetlist.length; index++) {
  row = `
  <div class="yetpayment-member-div">
    <div class="yetmember-div-name">
     <span class="yetmember-span-name">${paymentYetlist[index].nm_member}</span>
    </div>
    <div class="year-month-yetpay-div">
     <span>Ano</span>
     <span>${paymentYetlist[index].year}</span>
    </div>
    <div class="year-month-yetpay-div">
     <span>Mês</span>
     <span>${months[paymentYetlist[index].month]}</span>
     </div>
     <div onclick="payment_update_dashbord('pay-img${index}')">
     <img id="pay-img${index}" name="nopaid_${paymentYetlist[index].id}" src="../image/nopaid.png" width="35"/>
     </div>
  </div>`
  yetmemberswall += row
  }
  return yetmemberswall
}

function payment_update_dashbord(data){
  let imgName = document.getElementById(`${data}`).name
  if(imgName.split("_")[0]=="nopaid"){
    document.getElementById(`${data}`).src = "../image/paid.png";
    document.getElementById(`${data}`).name = `paid_${imgName.split("_")[1]}`
  }else{
    document.getElementById(`${data}`).src = "../image/nopaid.png";
    document.getElementById(`${data}`).name = `nopaid_${imgName.split("_")[1]}`
  }
}

async function graduationswall(){
  let yetmemberswall = []
  const clients1 = await await makerequest(`https://squid-app-ug7x6.ondigitalocean.app/gymgraduationlist?id=${gymid}`)
    if(clients1.length<=1){
      Swal.fire({
        title: stext58[language],
        showCancelButton: true,
        showConfirmButton: false,
        cancelButtonText: stext10[language],
        allowOutsideClick : false,
        width: 550,
      })
    }else{
  const graduationArray = await graduationArrayCreat(clients1)
  const graduationrow = await graduationRowCreate(graduationArray)
    Swal.fire({
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: stext56[language],
      cancelButtonText: stext10[language],
      allowOutsideClick : false,
      width: 550,
      html: `
            <div class="titlename">
              ${stext57[language]}
            </div>
              <div class="twrapper">
                    ${graduationrow}
              </div>
            <style>
            .swal2-popup {
                width: 85% !important;
                height: 600px !important;
            }

            .titlename{
              margin-bottom:20px;
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

function graduationArrayCreat(clients1){
  let yetmemberswall =[]
  for (let index = 0; index < clients1.length; index++) {
    if(clients1[index].lesson_after>=39){
          yetmemberswall.push(clients1[index])
    }
  }
  return yetmemberswall
}

async function graduationRowCreate(paymentYetlist){
  yetmemberswall=[]
  color=["white","blue","purple","brown","black"]
   for (let index = 0; index < paymentYetlist.length; index++) {
      const message = await    graduationmessageLanguage(paymentYetlist[index])

  row = `
  <div class="yetpayment-member-div" id="graduation-member-div">
    <div class="yetmember-div-name" id="graduation-member-name">
     <span class="yetmember-span-name">${paymentYetlist[index].nm_member}</span>
    </div>
    <div class="year-month-yetpay-div" id="graduation-span-img">
     <span>Atual</span>
     <img  src="../image/${color[paymentYetlist[index].color]}.png" width="35"/>
    </div>
    <div class="year-month-yetpay-div" id="graduation-message-div">
      <p>${message}</p>
     </div>
  </div>`
  yetmemberswall += row
  }
  return yetmemberswall
}
//昇格メンバーのSWal表示----------------------------------------->
function graduationmessageLanguage(data){
  if(data.fourth_point!="-"){
    if(language==0){
      message=`O aluno finalizou a aula ${data.lesson_after} do 4 grau`
    }else if(language ==1){
      message=`The member finished the class ${data.lesson_after} do 4 grade`
    }else{
      message=`メンバーはストライプ4の${data.lesson_after}番目のレッスンを受けました`
    }
  }else if(data.third_point!="-"){
    if(language==0){
      message=`O aluno finalizou a aula ${data.lesson_after} do 3 grau`
    }else if(language ==1){
      message=`The member finished the class ${data.lesson_after} do 3 grade`
    }else{
      message=`メンバーはストライプ3の${data.lesson_after}番目のレッスンを受けました`
    }
  }else if(data.second_point!="-"){
    if(language==0){
      message=`O aluno finalizou a aula ${data.lesson_after} do 2 grau`
    }else if(language ==1){
      message=`The member finished the class ${data.lesson_after} do 2 grade`
    }else{
      message=`メンバーはストライプ2の${data.lesson_after}番目のレッスンを受けました`
    }
  }else if(data.first_point!="-"){
    if(language==0){
    message=  `O aluno finalizou a aula ${data.lesson_after} do 1 grau`
    }else if(language ==1){
    message=  `The member finished the class ${data.lesson_after} do 1 grade`
    }else{
      message=`メンバーはストライプ1の${data.lesson_after}番目のレッスンを受けました`
    }
  }else{
    if(language==0){
    message=  `O aluno finalizou a aula ${data.lesson_after} após a graduação da faixa atual`
    }else if(language ==1){
      message=`The member finished the class ${data.lesson_after} after graduation from current belt`
    }else{
      message=`メンバーは現在の帯昇格から${data.lesson_after}番目のレッスンを受けました`
    }
  }
  return message
}

function entrancedateGet (){
  const japanweekeday = date.getDay()
  var d1 = date.getFullYear() + '/' + ('0' + (date.getMonth() + 1)).slice(-2) + '/' +('0' + date.getDate()).slice(-2) + ' ' +  ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2) + ':' + ('0' + date.getSeconds()).slice(-2) + '.' + date.getMilliseconds();
  date.setDate(date.getDate() - 6)
      return (date)
}
//レッスン別のアクセス回数のグラフ------------------------------------------->
function weekArraycreate(date){
  weekStart = date.getDay()
  const weekDay = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]//週の名称
      weekdayArray =[] //グラフのラベル
      weekCount = []　//グラフのラベルを週№に変換
      entranceChartArray = []　//グラフの値
      lessontype = []
      if(weekStart==1){//月曜日なら、月曜日から日曜日まで並べる
        for(let i=weekStart;i<=6;i++){
                weekdayArray.push(weekDay[i])
                weekCount.push(i)
        }
      }else{
        for(let i=weekStart;i<=6;i++){//月曜日以外であれば、その次のから土曜日まで並ぶ
              weekdayArray.push(weekDay[i])
              weekCount.push(i)
        }
        for (let i=0;i<=weekStart-1;i++){//日曜日からその日まで並べる
              weekdayArray.push(weekDay[i])
              weekCount.push(i)
        }
      }
      return weekCount
}
//1W前からのアクセス回数のグラフ------------------------------------------->
function weekaccessdataGet(weekdayArray,res){
  lessonWorkerCount = []
     lessontype = res
        for(let i=0;i<res.length;i++){//曜日番号のみを配列に入れる
          lessonWorkerCount.push(res[i].LESSON_DAY)
          //lessontype.push(res[i].LESSON_NAME)
        }
        var count = lessonWorkerCount.reduce(function(prev, current) {//曜日番号ごとに集計
      prev[current] = (prev[current] || 0) + 1;
      return prev;
       }, {});
  for(let i=0;i<weekCount.length;i++){//7日分データを数える
    if(count[weekCount[i]]==undefined){//エントランス存在しない場合は0
      entranceChartArray.push(0)
    }else{
        entranceChartArray.push(count[weekCount[i]])//存在する場合は連想配列から取得
    }
  }
  var ctx2 = document.getElementById("graph-area-entrance")//.getContext("2d");
  var data = {
    labels: weekdayArray,//7日前から並べたもの
      datasets: [{
          label: stext44[language],
          data: entranceChartArray,
          borderColor: '#00BFFF'
      }]
  };
  var options = {};
  var ex_chart1 = new Chart(ctx2, {
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
//レッスン別のアクセス回数のグラフ------------------------------------------->
function classaccss(res){
  let calenderArray = []
  let lessonNameEntrace = []
      for (let i=0;i<res.length;i++){
        if(res[i].DESCRITION_1!=""){
          calenderArray.push(`${res[i].DESCRITION_1}_${res[i].DESCRITION_2}`)
        }
      }
      const arrayB = Array.from(new Set(calenderArray));
      for(let i=0;i<lessontype.length;i++){//曜日番号のみを配列に入れる
        lessonNameEntrace.push(lessontype[i].LESSON_NAME)
      }
      var count = lessonNameEntrace.reduce(function(prev, current) {//曜日番号ごとに集計
    prev[current] = (prev[current] || 0) + 1;
    return prev;
     }, {});
    var array = Object.keys(count).map((k)=>({ key: k, value: count[k] }));
    array.sort((a, b) => b.value - a.value  );
count = Object.assign({}, ...array.map((item) => ({
    [item.key]: item.value,
})));
graphLabel = []
graphLabelAnswer = []
  for (key in count){
    graphLabel.push(key)
    graphLabelAnswer.push(count[key])
  }
var ctx3 = document.getElementById("graph-area-entrance2")//.getContext("2d");
var data = {
  labels: graphLabel,//7日前から並べたもの
    datasets: [{
        label: stext45[language],
        data: graphLabelAnswer,
        borderColor: '#00BFFF'
    }]
};
var options = {};
var ex_chart2 = new Chart(ctx3, {
    type: 'horizontalBar',
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
//プラン別のパイチャート作成----------------------------------->
function plansget(plans,res){
  let plandiv = []
  let plansArray = []
  let plansCount = []
  for(let i =0;i<plans.length;i++){
     plandiv.push(plans[i].CONTROL_NAME)
  }
  var count = []
  for(let i =0;i<res.length;i++){
          plansArray.push(res[i].plans)
       }
  for (var i = 0; i < plandiv.length; i++) {
    mycount = plansArray.countCertainElements(plandiv[i])
    plansCount.push(mycount)
  }
  datacolor = ["#D0B0FF","#A4C6FF","#FFABCE","Plan D","#A7F1FF","#E9FFA5","#9BF9CC","#AEFFBD","#CCCCCC","#FA8072","#E9967A","#FF00FF","#90EE90","#48D1CC","#9ACD32"]
  create_chart(plansCount,plandiv,datacolor)
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
        text: stext34[language]
      },
legend:{
  display:false ,
},
pieceLabel: {
  render: "label",
  fontSize: 10,
  fontColor: "black",
  },
}
  });
}
Array.prototype.countCertainElements = function(value){
    return this.reduce((sum, element) => (element == value ? sum + 1 : sum), 0)
}
//月度別のメンバー数チャート作成------------------------------------------------>
async function line_chart(membersarry){
  var ctx1 = document.getElementById('ex_chart');
  let kongetsu = date.getMonth()
  let kotoshi = date.getFullYear()
  let mystartyear
  let mystartmonth
  let month_name = []//months[day.getMonth()];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  if(kongetsu==11){
      for (let index = 0 ; index < kongetsu; index++) {
        month_name.push(months[index])
      }
      mystartyear = kotoshi
      mystartmonth = "01"
      myfinishmonth = "12"
    }else{
      for (let index = 1 + kongetsu ; index < 12; index++) {
        month_name.push(months[index])
      }
      for (let index = 0 ; index < kongetsu; index++) {
        month_name.push(months[index])
      }
      mystartyear = (kotoshi-0)-1
      mystartmonth = ((2 + kongetsu)<10) ? `0${(2 + kongetsu)}` : (2 + kongetsu);
      myfinishmonth = "12"
    }
   month_name.push(months[kongetsu])
     let month_answer = []//{0:0,1:0,2:0,3:0,4:0,5:0,6:0,7:0,8:0,9:0,10:0,11:0,12:0}//months[day.getMonth()];
//dateToStar = new Date(`${mystartyear}-${mystartmonth}-01`)
let inactiveBefore =0
let startmonthArray = []
let startBeActiveCount = 0
let monthactiveCount = 0
let monthinactiveCount = 0
let toMonths=["2022-03","2022-04","2022-05","2022-06","2022-07","2022-08","2022-09","2022-10","2022-11","2022-12","2023-01","2023-02"]
let answerDataToChart = [startBeActiveCount]
for(let ii=0;ii<=11;ii++){
  for (let i=0;i<membersarry.length;i++){
    if(`${membersarry[i].YEAR}-${membersarry[i].MOUNTH}`==toMonths[ii]){
      monthinactiveCount = membersarry[i].COUNT
    }
  }
  const mcount = (monthinactiveCount!=0) ? startmonthArray.push(monthinactiveCount) : startmonthArray.push(0)
  monthinactiveCount = 0
}
await linechartAnswer(startmonthArray,month_name)
return 'ok'
}
function linechartAnswer(linevalue,month_name){
  var ctx1 = document.getElementById('ex_chart');
  var data = {
      labels: month_name,//["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dez"],
      datasets: [{
          label: stext33[language],
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

//const mydata = await makerequest(`http://localhost:8099/OPCmasterGet?line=PPPP`)
//設定ボタンクリック時の操作------------------------------------------->
document.getElementById("configration").addEventListener("click",config_main)
function config_main(){
axios.get(`https://squid-app-ug7x6.ondigitalocean.app/clientesDados/${gymid}`)
  .then(function (response) {
    if(response.status==200){
        if(language==0){
          languageNow ="Português"
          division = ["Adulto-homem","Adulto-mulher", "Menores", "Plano familiar","Plan free"]
        }else if(language==2){
          languageNow ="日本語"
            division = ["男性-成人","女性-成人", "未成年", "ﾌｧﾐﾘｰﾌﾟﾗﾝ","ﾌﾘｰﾌﾟﾗﾝ"]
        }else{
          languageNow ="Inglês"
            division = ["Male-adult","Famale-adult", "underage", "Family plan","Free plan"]
        }
        console.log(languageNow)
Swal.fire({
 html: `  <div class="div-flex">
            <input class="button-input" type="button" id="select-dada" value="${stext6[language]}"/>
            <input class="button-input" type="button" id="select-pass" value="${stext7[language]}" onclick="password_change()"/>
            <input class="button-input" type="button" id="select-plans" onclick="config_plan()" value="${stext8[language]}"/>
         </div>
         <hr class="underbar" />
         <div class="div-flex">
          <div id="left-div" class="div-block">
             <div><span>${stext1[language]}</span></div>
             <div><span>${stext2[language]}</span></div>
             <div><span>${stext3[language]}</span></div>
             <div><span>${stext4[language]}</span></div>
             <div><span>${stext5[language]}</span></div>
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
         .div-flex{
           display:flex;
           width:100%;
         }
         .swal2-popup {
             width: 60% !important;
             height:700px !important;
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
           border-radius:5px;
           font-size:1.2vw;
           color:#555555 !important;
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
           color:#555555 !important;
         }
         #select-pass ,#select-plans{
           background-color:#CCCCCC !important;
           color:#555555 !important;
         }
         button{
           width:150px;
           height:70px;
           font-size:2vw;
         }
         @media only screen and (max-width: 700px) {
           .swal2-popup {
           width: 100% !important;
            height:700px !important;
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
          .div-block div input{
            margin-left:10px;
          }
         }
         </style>
        `
, allowOutsideClick : false     //枠外をクリックしても画面を閉じない
, showConfirmButton: true
,showCancelButton: true
,confirmButtonText: stext9[language]
,cancelButtonText: 'Home'
,preConfirm: (login) => {
  representant = document.getElementById("representant").value;
  gymname = document.getElementById("gymname").value;
  email = document.getElementById("email").value;
  tel = document.getElementById("tel").value;
  if(representant==""){
    Swal.showValidationMessage(`${error1[language]}`)
  }else if(gymname==""){
    Swal.showValidationMessage(`${error2[language]}`)
  }else if(email==""){
    Swal.showValidationMessage(`${error3[language]}`)
  }else if(tel==""){
    Swal.showValidationMessage(`${error4[language]}`  )
  }else{
  }
}
}).then((result) => {
 if (result.isConfirmed) {
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
       swall_success()
     })
     }catch (error) {
       swallerror(error[language],1)
     }
 }else{
     swal.close()
 }
})
}else{
 swallerror(error[language],1)
}
})
}
//パスワード変更の処理-------------------------------------------------->
function password_change() {
    Swal.fire({
        html: `
        <div class="div-flex">
                   <input class="button-input" type="button" id="select-dada" value="${stext6[language]}" onclick="config_main()"/>
                   <input class="button-input" type="button" id="select-pass" value="${stext7[language]}" onclick="password_change()"/>
                   <input class="button-input" type="button" id="select-plans" onclick="config_plan()" value="${stext8[language]}"/>
                </div>
                <hr class="underbar" />
             <div id="title">${stext27[language]}</div>
             <div id="client">
                 <div id="passdiv" class="right-div">
                     <input  type="password" pattern="^[0-9a-zA-Z]{8,16}" placeholder="${stext28[language]}"  id="password" />
                     <span id="buttonEye1" class="fa fa-eye" onclick="pushHideButton(1)"></span>
                 </div>
                 <div class="right-div">
                     <input  type="password" pattern="^[0-9a-zA-Z]{8,16}" placeholder="${stext29[language]}"  id="newPassword" />
                     <span id="buttonEye2" class="fa fa-eye" onclick="pushHideButton(2)"></span>
                 </div>
                 <div class="right-div">
                     <input  type="password" pattern="^[0-9a-zA-Z]{8,16}" placeholder="${stext30[language]}"  id="confirmpassword" />
                     <span id="buttonEye3" class="fa fa-eye" onclick="pushHideButton(3)"></span>
                 </div>
             </div>
             <style>
             .swal2-popup {
                 width: 60% !important;
                 height:700px !important;
             }
             #select-dada ,#select-plans{
               background-color:#CCCCCC !important;
               color:#555555 !important;
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
                     width:50%;
                     border-radius: 10px;
                     height:70px;
                     border: 1px solid gray;
                     text-indent: 10px;
                     font-size:2.0vw;
                     margin-top:25px;
                 }
                 #client span {
                     font-size:2vw;
                 }
                 #textPassword {
                         border: none; /* デフォルトの枠線を消す */
                       }
                       #fieldPassword {
                         border-width: thin;
                         border-style: solid;
                         width: 200px;
                       }
                       button{
                         width:150px;
                         height:70px;
                         font-size:2vw;
                       }
                          @media only screen and (max-width: 700px) {
                            .swal2-popup {
                            width: 100% !important;
                             height:700px !important;
                           }
                            .button-input{
                              width:28%;
                              font-size:3vw;
                            }
                            #client span {
                                font-size:4vw;
                            }
                            #client input {
                                width:70%;
                                font-size:3.0vw;
                            }
                          }
             </style>
           `,
        allowOutsideClick : false,
        showCancelButton: true,
        confirmButtonText: stext9[language],
        cancelButtonText:  'Home',
        preConfirm: (login) => {
           pass= document.getElementById("password").value
           newpass = document.getElementById("newPassword").value
           confirmpass = document.getElementById("confirmpassword").value
           if(pass==""){
             Swal.showValidationMessage(`${error9[language]}`)
           }else if(newpass==""){
             Swal.showValidationMessage(`${error10[language]}`)
           }else if(newpass!=confirmpass){
             Swal.showValidationMessage(`${error12[language]}`)
           }else{
           }
        }
    }).then(result => {
      let passchange
        if (result.isConfirmed) {
          let pass= document.getElementById("password").value
          let newpass = document.getElementById("newPassword").value
          let confirmpass = document.getElementById("confirmpassword").value
            hankaku2Zenkaku(newpass)//半角に変換
            hankaku2Zenkaku(confirmpass)
           .then((str1)=>{
           }).then((passcheck)=>{
             if(regex.test(confirmpass)){
                  axios.get(`https://squid-app-ug7x6.ondigitalocean.app/clientesDados/${gymid}`)
                    .then(function (response) {
                      if(response.status==200){
                        if(response.data[0].PASSWORD==pass){
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
                          swallerror(error13[language],3)
                        }
                      }else{
                        swallerror(error14[language],3)
                      }
                   })
    　　　　　     }else{
               swallerror(error15[language],3)
    }
           })
      }else{
        swal.close()
      }
    })
}
//パスワード変更時の目マーククリックからのパスを表示------------------------>
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
//Plan変更の処理-------------------------------------------------->
function config_plan(){
fetch('https://squid-app-ug7x6.ondigitalocean.app/planget')
  .then((x) => x.json())
  .then((res) => {
  clients = res
  console.log(res)
  let plans = []
  row = `<tr>
                 <th class="_sticky z-02">${stext25[language]}</th>
                 <th class="_sticky">${stext14[language]}</th>
                 <th class="_sticky">${stext20[language]}</th>
                 <th class="_sticky">${stext15[language]}</th>
                 <th class="_sticky">${stext16[language]}</th>
                 <th class="_sticky">${stext17[language]}</th>
                 <th class="_sticky">${stext18[language]}</th>
                 <th class="_sticky">${stext19[language]}</th>
                 <th class="_sticky">${stext13[language]}</th>
                 <th class="_sticky">${stext21[language]}</th>
                 </tr>`
                 plans += row
  for (let index = 0; index < res.length; index++) {
    if(res[index].GYM_ID==gymid){

      row =`<tr>
                    <th class="_sticky" name="_sticky_name">${res[index].CONTROL_NAME}</th>
                    <td>￥${res[index].PLAN_VALOR}</td>
                    <td>${division[(res[index].PLAN_KUBUN-0)-1]}</td>
                    <td>${res[index].PLAN_DISCRITION1}</td>
                    <td>${res[index].PLAN_DISCRITION2}</td>
                    <td>${res[index].PLAN_DISCRITION3}</td>
                    <td>${res[index].PLAN_DISCRITION4}</td>
                    <td>${res[index].PLAN_DISCRITION5}</td>
                    <td>${res[index].PLANS_NAME}</td>
                    <td>
                        <img class="image-cursor"  src="../image/edit.svg" onClick="editPlan(${index})" alt="" width="25">
                        <img class="image-cursor"  src="../image/delete.svg" onClick="Plandelete_check(${index})" alt="" width="25">
                    </td>
                  </tr>`
                plans += row
    }
    }
Swal.fire({
 html: `
         <div class="div-flex">
          <input class="button-input" type="button" id="select-dada" value="${stext6[language]}" onClick="config_main()"/>
          <input class="button-input" type="button" id="select-pass"  value="${stext7[language]}" onclick="password_change()"/>
          <input class="button-input" type="button" id="select-plans"  value="${stext8[language]}"/>
         </div>
         <hr class="underbar" />
         <div  class="twrapper">
          <table  id="#my-table1">
            <tbody>${plans}</tbody>
          </table>
        </div>
         <style>
         #select-dada ,#select-pass{
           background-color:#CCCCCC !important;
           color:#555555 !important;
         }
         #table{
         	overflow-y:auto;
         }
         .swal2-popup {
             width: 100% !important;
             height:750px !important;
         }
         select{
             cursor: pointer
         }
         .email-tag{
           width: 150px;
         }
         #btn-filter{
           height:70%;
           width:6%;
           border:1px solid #888888;
           background-color: #BBBBBB;
           border-radius:5px;
           font-size:2vh;
           font-weight: bold;
         }
         #btn-filter:hover{
             transform: scale(1.1);
         }
         #header-title{
           font-size:5vh;
         }
         .twrapper{
           overflow-y:scroll;
           overflow-x:scroll;
           height:85%;
         }

         table {
           border-collapse: collapse;
           border-spacing: 0;
           width: 100%;
           min-width: 1000px;
         }
         th, td {
           vertical-align: middle;
           padding: 20px 15px;
           border: 1px solid #ccc;
           font-size: 14px;
           text-align: center;
         }
         th {
           color: #fff;
           background: #795548;
         }
         ._sticky {
           position: sticky;
           top: 0;
           left: 0;
           z-index: 1;
           background: #333333;
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
           width: 200px;
         }

         th[name="_sticky_name"]{
           background: #795548;
         }

         #createdate{
           width:10%;
           height:70%;
           font-size:5vh;
         }

         .image-cursor{
           cursor: pointer
         }

         /* 500px以下の画面で適用 */
         @media only screen and (max-width: 700px) {
           .swal2-popup {
           width: 100% !important;
            height:700px !important;
          }
           .button-input{
             width:28%;
             font-size:3vw;
           }
           #client span {
               font-size:4vw;
           }
           #client input {
               width:70%;
               font-size:3.0vw;
           }
           .mobile-scroll {
             overflow-x: auto; /* 横スクロール */
             -webkit-overflow-scrolling: touch; /* スマホでスムーズにスクロールできるように */
           }
           th, td {
           padding: 5px 15px; /* 上下 左右 */
         }

         #dash #header{
             width: 100%;
             height: 15vh;
             display: block;
         }

         #btn-filter{
           width:15%;
           font-size:1.5vh;
         }
         #header-title{
           font-size:3vh;
         }
           th, td {
           font-size: 8px;
         }

         ._sticky.z-02 {
           z-index: 2;
           width: 100px;
         }

         th[name="_sticky_name"]{
           font-size: 20px;
         }
         #dash #header h3{
             font-size: 5vw;
             color: 	#777777;
             margin-right: 1%;
         }
         #dash #header select{
             width: 35%;
             height: 45%;
             margin-top: 5%;
             font-size: 2.5vw;
         }
         }

        </style>
        `
, allowOutsideClick : false     //枠外をクリックしても画面を閉じない
, showConfirmButton: true
,showCancelButton: true
,confirmButtonText:stext10[language]
,cancelButtonText: 'Home'
,showDenyButton: true
,denyButtonText:stext59[language]
}).then((result) => {
 if (result.isConfirmed) {
   config_main()
 }else if (result.isDenied) {
   createPlanSwal()
 }else{
   swal.close()
 }
})
})
}

function editPlan(data){
  Swal.fire({
    title: stext22[language],
    customClass: 'customizable',
    html: `
           <div id="clientes-div">
              <div class="div-flex">
               <div class="div-flex-span">
                 <span>${stext13[language]}</span>
               </div>
               <div class="div-flex-input">
                 <input id="planname" value="${clients[data].PLANS_NAME}"/>
               </div>
              </div>
              <div class="div-flex">
              <div class="div-flex-span">
                 <span>${stext14[language]}</span>
               </div>
               <div class="div-flex-input">
                  <span id="yenmark">￥</span>
                  <input input type="text" onblur="kanmaChange(this);" pattern="\d*" id="palanvalue" value="${clients[data].PLAN_VALOR}"/>
               </div>
              </div>
              <div class="div-flex">
               <div class="div-flex-span">
                 <span>${stext20[language]}</span>
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
                 <span>${stext15[language]}</span>
               </div>
               <div class="div-flex-input">
                 <input id="plandis1" value="${clients[data].PLAN_DISCRITION1}"/>
               </div>
              </div>
              <div class="div-flex">
               <div class="div-flex-span">
                 <span>${stext16[language]}</span>
               </div>
               <div class="div-flex-input">
                 <input id="plandis2" value="${clients[data].PLAN_DISCRITION2}"/>
               </div>
              </div>
              <div class="div-flex">
               <div class="div-flex-span">
                 <span>${stext17[language]}</span>
               </div>
               <div class="div-flex-input">
                 <input id="plandis3" value="${clients[data].PLAN_DISCRITION3}"/>
               </div>
              </div>
              <div class="div-flex">
               <div class="div-flex-span">
                 <span>${stext18[language]}</span>
               </div>
               <div class="div-flex-input">
                 <input id="plandis4" value="${clients[data].PLAN_DISCRITION4}"/>
               </div>
              </div>
              <div class="div-flex">
               <div class="div-flex-span">
                 <span>${stext19[language]}</span>
               </div>
               <div class="div-flex-input">
                 <input id="plandis5" value="${clients[data].PLAN_DISCRITION5}"/>
               </div>
              </div>
              <div class="div-flex">
               <div class="div-flex-span">
                 <span>${stext25[language]}</span>
               </div>
               <div class="div-flex-input">
                 <input id="controlname" value="${clients[data].CONTROL_NAME}"/>
               </div>
              </div>
           </div>
           <style>
           .swal2-popup {
               width: 50% !important;
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
             color:#555555 !important;

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
  ,confirmButtonText:stext9[language]
  ,cancelButtonText:stext10[language]
  ,denyButtonText: stext59[language]
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
         swallerror(error5[language],2,data)
       }else if(pvalue==""){
         swallerror(error6[language],2,data)
       }else if(dis1==""){
         swallerror(error7[language],2,data)
       }else if(control_name==""){
         swallerror(error8[language],2,data)
       }else{
         try{
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
           swall_success()
         })
         }catch (error) {
         }
   }
}else{
  swal.close()
  config_plan()
}
})
}


function Plandelete_check(data){
  Swal.fire({
  title: `${stext23[language]}:${clients[data].PLANS_NAME}`
, icon : 'info',
showConfirmButton: true,
confirmButtonText: stext24[language],
showCancelButton:true,
cancelButtonText:　stext10[language]
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

function createPlanSwal(){
  Swal.fire({
    title:'Criar plano',
     html: `
     <div class="create-plan-div-top">
        <div>
         <span>Nome do plano para controle</span>
         <input id="plan-control-name"/>
        </div>
        <div>
          <span>Valor</span>
          <input id="plan-value" input type="text" onblur="kanmaChange(this);" pattern="\d*"/>
        </div>
        <div>
          <span>Discrição 1</span>
          <input id="plan-discriton1"/>
        </div>
        <div>
          <span>Discrição 2</span>
          <input id="plan-discriton2"/>
        </div>
        <div>
          <span>Discrição 3</span>
          <input id="plan-discriton3"/>
        </div>
        <div>
          <span>Discrição 4</span>
          <input id="plan-discriton4"/>
        </div>
        <div>
          <span>Discrição 5</span>
          <input id="plan-discriton5"/>
       </div>

       <div>
       <span>Nome para mostrar na inscrição</span>
       <input id="name-of-client"/>
       </div>
       <div class="btn-groupbtn-group-vertical1111">
       <div>
          <span>Homem</span>
          <input type="checkbox" id="plan1" name='typeselect' onclick="selectchek_kubun(1)"><i class="fa fa-square-o fa-2x"></i><i class="fa fa-check-square-o fa-2x"></i>
        </div>
        <div>
          <span>Mulher</span>
          <input type="checkbox" id="plan2"  name='typeselect' onclick="selectchek_kubun(2)"><i class="fa fa-square-o fa-2x"></i><i class="fa fa-check-square-o fa-2x"></i>
        </div>
        <div>
          <span>Fámilia</span>
          <input type="checkbox" id="plan3"  name='typeselect' onclick="selectchek_kubun(3)"><i class="fa fa-square-o fa-2x"></i><i class="fa fa-check-square-o fa-2x"></i>
      </div>
    <div>
    <span>Todos</span>
      <input type="checkbox" id="plan4" name='typeselect' onclick="selectchek_kubun(4)"><i class="fa fa-square-o fa-2x"></i><i class="fa fa-check-square-o fa-2x"></i>
  </div>
  <div>
  <span>Não mostrar</span>
    <input type="checkbox" id="plan5"  name='email3' onclick="selectchek_kubun(5)"><i class="fa fa-square-o fa-2x"></i><i class="fa fa-check-square-o fa-2x"></i>
  </div>
  <div>
  <span>Idade</span>
    <input type="checkbox" id="plan6"  name='typeselect' onclick="selectchek_kubun(6)"><i class="fa fa-square-o fa-2x"></i><i class="fa fa-check-square-o fa-2x"></i>
  </div>
  <div>
  <span>Idade</span>
   <input id="age" type="number"/>
  </div>
     </div>
     <style>
      .create-plan-div-top{
       width:100%;
       display:flex;
      flex-wrap: wrap;
      }
      .create-plan-div-top div{
        margin-top:15px;
        width:48%;
        display: flex;
       flex-direction:column;
       align-items: center;
      }
      .swal2-popup {
        width: 80% !important;
        height: 600px;
      }
      .create-plan-div-top div div{
        width:100%;
      }
      input{
        width:70%;
        height:60px;
        border:1px solid gray;
        font-size:1.5vw;
      }
      .btn-groupbtn-group-vertical1111{
        width:100% !important;
        display: flex !important;
        flex-direction: row !important;
        margin-top:0px !important;
      }
  .optionbutton-div{
    width:10%;
  }
  span{
    margin-bottom:10px;
  }
     </style>


       `,
     showCancelButton: true,
     showConfirmButton:true,
   　confirmButtonText: "Registrar",
     cancelButtonText: "Cancelar",
     allowOutsideClick : false,

     preConfirm: (login) => {
       controlName = document.getElementById("plan-control-name").value
       planValue = document.getElementById("plan-value").value
       planD1 = document.getElementById("plan-discriton1").value
       planD2 = document.getElementById("plan-discriton2").value
       planD3 = document.getElementById("plan-discriton3").value
       planD4 = document.getElementById("plan-discriton4").value
       planD5 = document.getElementById("plan-discriton5").value
       mcheck = document.getElementById('plan1')
       wcheck = document.getElementById('plan2')
       fcheck = document.getElementById('plan3')
       kcheck = document.getElementById('plan6')
       acheck = document.getElementById('plan4')
       ncheck = document.getElementById('plan5')
       age = document.getElementById('age').value
       clientOfName = document.getElementById("name-of-client").value
       if(!controlName){
         Swal.showValidationMessage(`Insira o nome do plano`)
       }else if(!planValue){
         Swal.showValidationMessage(`Insira o valor do plano`)
       }else if(!planD1){
         Swal.showValidationMessage(`A discrição 1 deve estar preenchida`)
       }else if(!clientOfName){
         Swal.showValidationMessage(`Insira o nome para o cliente`)
       }
       if(!mcheck.checked&&!wcheck.checked&&!fcheck.checked&&!kcheck.checked&&!acheck.checked&&!ncheck.checked){
         Swal.showValidationMessage(`Escolha uma opção`)
       }
       if(!kcheck.checked&&age==""){
         Swal.showValidationMessage(`Você selecionou por idade, digita a idade no campo`)
       }
     },
   }).then((result) => {
  if (result.isConfirmed) {
    if(mcheck.checked){
      kubun = 1 //男
    }else if(wcheck.checked){
      kubun=2　//女性
    }else if(fcheck.checked){
      kubun =4　//ファミリー
    }else if(kcheck.checked){
      kubun =3　//子供
    }else if(acheck.checked){
      kubun = 6　//全員
    }else if(ncheck.checked){
      kubun =5　//見せない
    }
    fetch("https://squid-app-ug7x6.ondigitalocean.app/createplans", {
      method: 'POST',
      body: JSON.stringify({
        id:gymid,
        name:clientOfName,
        valor:planValue,
        kubun:kubun,
        dis1:planD1,
        dis2:planD2,
        dis3:planD3,
        dis4:planD4,
        dis5:planD5,
        controlname:controlName,
        age:age}),
      headers: { "Content-type": "application/json; charset=UTF-8" }
     }).then((x) => x.json())
       .then((res) => {
       console.log(res)
     })
  }
  })

  function selectchek_kubun(data){
    if(data==1){
      document.getElementById('plan2').checked = false
      document.getElementById('plan3').checked = false
      document.getElementById('plan4').checked = false
      document.getElementById('plan5').checked = false
      document.getElementById('plan6').checked = false
    }else if(data==2){
      document.getElementById('plan1').checked = false
      document.getElementById('plan3').checked = false
      document.getElementById('plan4').checked = false
      document.getElementById('plan5').checked = false
      document.getElementById('plan6').checked = false
    }else if(data==3){
      document.getElementById('plan1').checked = false
      document.getElementById('plan2').checked = false
      document.getElementById('plan4').checked = false
      document.getElementById('plan5').checked = false
      document.getElementById('plan6').checked = false
    }else if(data==4){
      document.getElementById('plan1').checked = false
      document.getElementById('plan3').checked = false
      document.getElementById('plan2').checked = false
      document.getElementById('plan5').checked = false
      document.getElementById('plan6').checked = false
    }else if(data==5){
      document.getElementById('plan1').checked = false
      document.getElementById('plan3').checked = false
      document.getElementById('plan4').checked = false
      document.getElementById('plan2').checked = false
      document.getElementById('plan6').checked = false
    }else if(data==6){
      document.getElementById('plan1').checked = false
      document.getElementById('plan3').checked = false
      document.getElementById('plan4').checked = false
      document.getElementById('plan5').checked = false
      document.getElementById('plan2').checked = false
    }
  }

  function kanmaChange(inputAns){
   let inputAnsValue = inputAns.value;
   let numberAns = inputAnsValue.replace(/[^0-9]/g, "");
   kanmaAns = numberAns.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
   if(kanmaAns.match(/[^0-9]/g)){
    inputAns.value= kanmaAns;
    return true;
   }
  };
}
