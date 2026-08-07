// =========================================================
//            BANCO DE DADOS DOS USUÁRIOS 
// =========================================================
const usuariosHQ = {
    "rimuru": {
        senha: "23182",
        cargo: "patrão",
        email: "rimuru@rancho.com",
        msg: "🤠 Salve, Patrão Rimuru! Cofre liberado!"
    },
    "joker": {
        senha: "92043",
        cargo: "patrão",
        email: "joker@rancho.com",
        msg: "🤠 Salve, Patrão Joker! Cofre liberado!"
    },
    "jose carlos": {
        senha: "328432",
        cargo: "patrão",
        email: "josecarlos@rancho.com",
        msg: "🤠 Salve, Patrão Zé Carlos! Cofre liberado!"
    },
    "renan": {
        senha: "2432",
        cargo: "patrão",
        email: "renan@rancho.com",
        msg: "🤠 Salve, Patrão Renan! Cofre liberado!"
    }
};


// =========================================================
//       SISTEMA DE SEGURANÇA (CHAVE TEMPORÁRIA)
// =========================================================
function obterchavedinamica() {
    const blocodetempo = Math.floor(Date.now() / 30000);
    return ((blocodetempo * 43274) % 9000 + 1000);
}


// =========================================================
//      VARIÁVEIS DE CONTROLE DO RANCHO
// =========================================================
let contadorerros = 0;
let emlockIN = false;

const mensagenserros = [
    "> ⚠️ Cuidado, se não vai acordar o bode, Zé... (Restam 2 tentativas)",
    "> ⚠️ O bode acordou e tá te encarando com raiva, Zé! (Resta 1 tentativa)",
    "> 🚨 [ÁUDIO]: CORRE NEGADA! O BODE TÁ SOLTO E VEM PRA DAR CHIFRADA!"
];


// =========================================================
//            SISTEMA DE ÁUDIO DE EMERGÊNCIA
// =========================================================
const sombodesolto = new Audio("corre_negada.mp3");


// =========================================================
//           FUNÇÃO DE ATIVAÇÃO DO LOCK IN 
// =========================================================
function ativarlockIN(botao, terminal) {
    emlockIN = true;

    sombodesolto.play();

    botao.innerText = "🚨 LOCK IN ATIVO (REQUER CHAVE DO PATRÃO)";
    botao.style.background = "#cc0000";
    botao.style.color = "#ffffff";

    setTimeout(() => {
        terminal.innerHTML += `<br>> 🔒 [LOCK IN ATIVADO]: O bode tá solto! Chave enviada ao console dos Patrões!`;
    }, 500);

    enviaremailpatroes();
}


// =========================================================
//         SIMULAÇÃO DE E-MAIL NO TERMINAL DO VS CODE
// =========================================================
let temporizadorLockIn = null;

function enviaremailpatroes() {
    const chaveatual = obterchavedinamica();

    console.clear();
    console.log("=================================================");
    console.log("✉️  [SISTEMA INTERNO DE E-MAIL DO RANCHO]");
    console.log("=================================================");

    for (let u in usuariosHQ) {
        if (usuariosHQ[u].cargo === "patrão") {
            console.log(`> 📬 E-mail enviado para: ${usuariosHQ[u].email} (${u})`);
        }
    }

    console.log("-------------------------------------------------");
    console.log(`🔑 CHAVE TEMPORÁRIA DE DESTRAVAMENTO: >>> ${chaveatual} <<<`);
    console.log("⏳ Válida por 30 segundos! (Atualizando...)");
    console.log("=================================================");

    if (!temporizadorLockIn) {
        temporizadorLockIn = setInterval(() => {
            if (emlockIN) {
                enviaremailpatroes();
            }
        }, 30000);
    }
}


// =========================================================
//       FUNÇÃO PRINCIPAL DE AUTENTICAÇÃO (LOGIN)
// =========================================================
function autenticar() {
    const user = document.getElementById("usuario").value.toLowerCase().trim();
    const pass = document.getElementById("senha").value;
    const btnAcessar = document.getElementById("btnAcessar");
    const terminal = document.getElementById("terminal");

    
    if (emlockIN) {
        const chaveatual = obterchavedinamica();

        if (pass === chaveatual.toString()) {
            emlockIN = false;
            contadorerros = 0;

            clearInterval(temporizadorLockIn);
            temporizadorLockIn = null;

            btnAcessar.innerText = "ACESSO LIBERADO";
            btnAcessar.style.background = "#28a745";
            btnAcessar.style.color = "#ffffff";

            terminal.innerHTML += `<br>> 🟢 [DESTRAVADO]: Bode amarrado com sucesso pelo Patrão! Sistema normalizado.`;
            console.log("✅ SISTEMA DESTRAVADO PELO PATRÃO!");
        } else {
            terminal.innerHTML += `<br>> ❌ [ERRO]: Chave dinâmica incorreta! Verifique o console.`;
        }
        return; 
    }

    // 2. FLUXO NORMAL DE LOGIN
    if (usuariosHQ[user] && usuariosHQ[user].senha === pass) {
        contadorerros = 0;
        terminal.innerHTML += `<br>> ${usuariosHQ[user].msg}`;
        btnAcessar.innerText = "ACESSO LIBERADO";
        btnAcessar.style.background = "#28a745";
    } else {
        if (contadorerros < 2) {
            terminal.innerHTML += `<br>${mensagenserros[contadorerros]}`;
            contadorerros++;
        } else {
            terminal.innerHTML += `<br>${mensagenserros[2]}`;
            ativarlockIN(btnAcessar, terminal);
        }
    }
}