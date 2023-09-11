let accessmainserver = 'https://squid-app-ug7x6.ondigitalocean.app'　　//メインサーバーのチェックアクセス先


let restid=sessionStorage.getItem("restid")           //レストランid
let workerid=sessionStorage.getItem("id")            //ワーカーid
let menbername = sessionStorage.getItem("name")      //ワーカー名
let language = sessionStorage.getItem("language")　　//言語
restid=0　//消す
workerid=0//消す
menbername='Paulo'//消す
language=0

if(restid==null||workerid==null||menbername==null){
  pagechange('loginadminrst')
}


//日付取得
function gettoday(d){
  var today = new Date();
  let yyyy = today.getFullYear();
  let mm = ("0"+(today.getMonth()+1)).slice(-2);
  let dd = ("00" + today.getDate()).slice(-2);
  if(d==0){
    return `${yyyy}-${mm}-01`
  }else if(d==1){
    return `${yyyy}-${mm}-${dd}`
  }
}
//roote
async function makerequest(url){
  const request = await fetch(url)  //esperar aqui
  return request.json()
}

async function kanmaReplase(data){
   let numberAns = (data.split(".")[0]).replace(/[^0-9]/g, "");
   kanmaAns = numberAns.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
   return `￥${kanmaAns}`
   //return `￥${kanmaAns}`
};

async function kanmanomireplace(d){
  let numberAns = d.toString();
  kanmaAns = numberAns.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
  return kanmaAns
}

function sortsyojyunid(d){
  d.sort(function(a, b) {
  	return a.id<b.id;
  });
  return d
}

async function getworker(d){
  let workernm = await makerequest(`${accessmainserver}/getworkernamerest?id=${d}`)
  return workernm[0].worker_name
}

function swallmessages(d){
  const swal =  Swal.fire({
        html: d,
        allowOutsideClick : false,
        showConfirmButton: false,
  })
}

function closeswalas(){
  swal.close()
}


function prcessnoswall(){
  const swal =  Swal.fire({
          icon:"info",
          title: ltxt81[language],
          html: ltxt82[language],
          allowOutsideClick : false,
          showConfirmButton: false,
          timerProgressBar: true,
          onBeforeOpen: () => {
          Swal.showLoading();
      }
    })
}

//翻訳テキスト//
const etxt1 = ["O campo do nome não pode está em branco","Enter name of the representative", "代表者名を入力してください"];
const etxt2 = ["O campo do nome da academia não pode está em branco","Enter gym name", "ジム名を入力してください"];
const etxt3 = ["O campo do email não pode está em branco","Enter  email", "メールアドレスを入力してください"];
const etxt4 = ["O campo do telefone não pode está em branco","Enter phone", "電話番号を入力してください"];
const etxt5 = ["O campo do nome do plano não pode está em branco","Enter plan name", "プラン名を入力してください"];
const etxt6 = ["O campo do valor não pode está em branco","Enter plan price", "金額を入力してください"];
const etxt7 = ["O campo da discrição 1 não pode está em branco","Enter plan discretion 1", "プラン説明1を入力してください"];
const etxt8 = ["O campo do nome para controle não pode está em branco","Enter name for control", "管理用の名称を入力してください"];
const etxt9 = ["Por favor, digite sua senha atual","Please enter your current password", "現在のパスワードを入力してください"];
const etxt10 = ["por favor digite uma nova senha","please enter a new password", "新しいパスワードを入力してください"];
const etxt11 = ["Insira uma senha de confirmação","Please enter a confirmation password", "確認パスワードを入力してください"];
const etxt12 = ["A nova senha e a senha de confirmação estão diferentes","New password and confirmation password are different", "新しいパスワードと確認パスワードが違ってます"];
const etxt13 = ["Erro na senha atual","etxt in current password", "現在のパスワードに誤りがあります"];
const etxt14 = ["Erro na alteração, tente novamente","Change etxt, try again", "変更に失敗しました,　再度お試しください"];
const etxt15 = ["Senha inválida, senha tem que ter no mínimo 8 dígitos","Invalid password, password must have at least 8 digits", "無効なパスワード、パスワードは少なくとも8桁でなければなりません"];
const etxt16 = ["Erro de acesso no banco de dados, tente novamente","Access etxt in database, try again", "データベースとの接続に失敗しました、再度試してください"];
//const language = ["PT","EN","JP"]
const ltxt1 = ["Nome do representante","Name of the representative","代表者名"]
const ltxt2 = ["Nome da academia","Gym name","ジム名"]
const ltxt3 = ["Email","Email","メールアドレス"]
const ltxt4 = ["Telefone","Telephone","電話番号"]
const ltxt5 = ["Idioma","Language","言語"]
const ltxt6 = ["Meus dados","My data","個人情報"]
const ltxt7 = ["Senha","Password","パスワード"]
const ltxt8 = ["Planos","Plans","プラン"]
const ltxt9 = ["Salvar","Save","保存"]
const ltxt10 = ["Voltar","Back","戻る"]
const ltxt11=["Alteração foi feita com sucesso","Change was successfully made","変更が完了しました"]
const ltxt12=["Pronto","Success","完了"]
const ltxt13=["Nome para cliente","Name for client","メンバー用名称"]
const ltxt14=["Valor","Price","価格"]
const ltxt15=["Discrição1","Discretion1","説明1"]
const ltxt16=["Discrição2","Discretion2","説明2"]
const ltxt17=["Discrição3","Discretion3","説明3"]
const ltxt18=["Discrição4","Discretion4","説明4"]
const ltxt19=["Discrição5","Discretion5","説明5"]
const ltxt20=["Divisão","Division","区分"]
const ltxt21=["Ação","Action","変更・削除"]
const ltxt22=["Alterar o plano","Change the plan","プランの変更"]
const ltxt23=["Deletar o plano","Delete the plan","プランの削除"]
const ltxt24 = ["Deletar","Delete","削除"]
const ltxt25 = ["Nome ","name ","プラン名"]
const ltxt26 = ["Início","Home","ホーム"]
const ltxt27 = ["Alterar a senha","Change the password","パスワードの変更をします"]
const ltxt28 = ["Senha atual","Current Password","現在のパスワード"]
const ltxt29 = ["Nova Senha","New Password","新しいパスワード"]
const ltxt30 = ["Confirme a Senha","Confirm password","パスワードの確認入力"]
const ltxt31 = ["Letras inválidas","invalid character","半角英数字で入力してください"]
const ltxt32 = ["alunos registrados","numbers of registered members","登録会員数"]
const ltxt33 = ["quantidade de alunos","Numbers of registered","メンバー数推移"]
const ltxt34 = ["Alunos por plano","Menbers by plan","プラン別登録者数"]
const ltxt35 = ["Inscrição","Inscription","入会"]
const ltxt36 = ["Alunos","Menbers","メンバー"]
const ltxt37 = ["Recibos","Receipts","月謝管理"]
const ltxt38 = ["Calendário","Calender","カレンダー"]
const ltxt39 = ["Graduação","Graduation","帯管理"]
const ltxt40 = ["Configuração","Setting","設定"]
const ltxt41 = ["Entrada","Entrance","入場管理"]
const ltxt42 = ["Pagamentos atrasados","Late payments","月謝未払いメンバー"]
const ltxt43 = ["Graduações próximas","Graduations near","帯昇格者"]
const ltxt44 = ["Número de acessos nos últimos 7 dias","Number of accesses in the last 7 days","直近７日のアクセス数"]
const ltxt45 = ["Número de acessos por aulas nos últimos 7 dias","Number of accesses by class in the last 7 days","直近７日のクラス別アクセス数"]
const ltxt46 = ["Não há pagamento atrasado","No late payment","支払いが遅れているメンバーはいません"]
const ltxt47 = ["Nome","Name","メンバー名"]
const ltxt48 = ["Ano","Year","年"]
const ltxt49 = ["Mês","Month","月"]
const ltxt50 = ["","Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"]
const ltxt51 = ["","January","February","March","April","May","June","July","August","September","October","November","December"]
const ltxt52 = ["","1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"]
const ltxt53 = ["Membros com o pagamento atrasado","Members with late payment","支払いが遅れているメンバー"]
const ltxt56 = ["Tabela","List","リスト"]
const ltxt57 = ["Próximas graduações","Next graduation","帯昇格者"]
const ltxt58 = ["Não há alunos para graduar","There are no member to graduate","昇格対象者が現在いません"]
const ltxt59 = ["Criar plano","Create Plan","新規プラン"]
const ltxt60 = ["Idade","Age","年齢"]
const ltxt61 = ["Editar o plano","Edit plan","プランを修正"]
const ltxt62 = ["Nome do plano para controle","Plan name for control","管理用プラン名"]
const ltxt63 = ["Discrição 1","Discretion 1","プラン説明 1"]
const ltxt64 = ["Discrição 2","Discretion 2","プラン説明 2"]
const ltxt65 = ["Discrição 3","Discretion 3","プラン説明 3"]
const ltxt66 = ["Discrição 4","Discretion 4","プラン説明 4"]
const ltxt67 = ["Discrição 5","Discretion 5","プラン説明 5"]
const ltxt68 = ["Nome para mostrar na inscrição","Name to show in the inscription","入会者表示用プラン名"]
const ltxt69 = ["Homem","Man","男性"]
const ltxt70 = ["Mulher","Woman","女性"]
const ltxt71 = ["Fámilia","Family","家族"]
const ltxt72 = ["Não mostrar","Not show","表示を隠す"]
const ltxt73 = ["Por idade","By age","年齢"]
const ltxt74 = ["Todos","All","全て"]
const ltxt75 = ["Insira o nome do plano","Enter plan name","プラン名を入力してください"]
const ltxt76 = ["Insira o valor do plano","Enter the value of the plan","プランの金額を入力してください"]
const ltxt77 = ["A discrição 1 deve estar preenchida","Discretion 1 must be filled in","プランの詳細説明1を入力してください"]
const ltxt78 = ["Insira o nome para o cliente","Enter the name for the customer","入会者に表示するプラン名を入力してください"]
const ltxt79 = ["Escolha uma opção","choose an option","プランの区分を選択してください"]
const ltxt80 = ["Você selecionou por idade, digita a idade no campo","You selected by age, enter the age in the field","表示する年齢の上限を入力してください"]
const ltxt81 = ["Buscando dados","Processing","データ取得中"]
const ltxt82 = ["Aguarde","Wait","そのままおまちください"]
const ltxt83 = ["buscar","検索"]
const ltxt84 = ["Banco","銀行"]
const ltxt85 = ["Cash","現金"]
const ltxt86 = ["Credito","クレジット"]
const ltxt87 = ["Quant.","件数"]
const ltxt88 = ["Total","合計"]
const ltxt89 = ["No. da despesa","経費登録番号"]
const ltxt90 = ["Registante","登録者"]
const ltxt91 = ["data","日付"]
const ltxt92 = ["Categoria","科目"]
const ltxt93 = ["No. do recibo","レシート番号"]
const ltxt94 = ["Pago","支払済"]
const ltxt95 = ["Pendente","未払い"]
