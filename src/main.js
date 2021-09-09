import "regenerator-runtime/runtime";
import * as nearAPI from "near-api-js"

const contract_name = "dev-1631197441111-31755526677319"
let nearConfig = getConfig(contract_name)
window.nearConfig = nearConfig

function getConfig(contract_name) {
  return {
    networkId: 'testnet',
    nodeUrl: 'https://rpc.testnet.near.org',
    contractName: contract_name,
    walletUrl: 'https://wallet.testnet.near.org',
    helperUrl: 'https://helper.testnet.near.org'
  }
}

// Se conecta a NEAR e provê os objetos `near`, `walletAccount` e `contract` no escopo `window` 
async function connect() {
  // Inicia a conecxão com o nó NEAR
  window.near = await nearAPI.connect(Object.assign(nearConfig, { deps: {keyStore: new nearAPI.keyStores.BrowserLocalStorageKeyStore() }}))

  // Requer acesso a login usando a wallet
  window.walletAccount = new nearAPI.WalletConnection(window.near)

  // Inicializa a interface com o contrato usando o nome do contrato e as configurações
  window.contract = await near.loadContract(nearConfig.contractName, {
    viewMethods: ['getCounter'],
    changeMethods: ['increment', 'decrement'],
    sender: window.walletAccount.getAccountId()
  })

  console.log(await window.contract.getCounter())
}

// Fazer o login usando sua wallet NEAR da testnet, e essa função é adicionada ao botão sign-in
document.querySelector('.sign-in .btn').addEventListener('click', () => {
  walletAccount.requestSignIn(nearConfig.contractName, 'NEAR Counter Example');
});

// Fazer logout com sua wallet NEAR e colocando essa função no botão sign-out
document.querySelector('.sign-out .btn').addEventListener('click', () => {
  walletAccount.signOut();
  window.location.replace(window.location.origin + window.location.pathname);
});

function updateUI() {
  if (!window.walletAccount.getAccountId()) {
    // Somente mostra o requerimento de login
    Array.from(document.querySelectorAll('.sign-in')).map(it => it.style = 'diplay: block;')
  } else {
    // Mostra somente os items que são permitidos quando o usuário está logado
    Array.from(document.querySelectorAll('.after-sign-in')).map(it => it.style = 'display: block;')
    console.log(window.walletAccount.getAccountId())

    // Chamada do contrato e atualização do contador
    contract.getCounter().then(count => {
      document.querySelector('#show').innerText = count == undefined ? 'calculando...' : count;
    })
  }
}

// Função que incrementa o contador, e a coloca no botão de mais
document.querySelector('#plus').addEventListener('click', () => {
  document.querySelector('#show').innerText = 'calculando...'
  contract.increment().then(updateUI)
})

// Função que decrementa o contador, e a coloca no botão de menos
document.querySelector('#minus').addEventListener('click', () => {
  document.querySelector('#show').innerText = 'calculando...'
  contract.decrement().then(updateUI)
})

window.nearInitPromise = connect()
  .then(updateUI) // chamada da função updateUI
  .catch(console.error)
