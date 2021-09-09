# Workflow pra criar um Dapp NEAR simples em AssemblyScript

# Estrutura do Projeto

1. root - nome-do-app
    1. **assembly** backend pasta do smart contract

        Backend, que vai usar a sdk da near near-sdk-as para construir o smart contract.

        1. **main.ts**

            Aqui ficam definidas as funções do *smart contract*. 

        2. **model.ts**

            Aqui ficam as estruturas que são salvas na blockchain

        3. **tsconfig.json**

            Configuração do typescript.

            [Exemplo tsconfig.json](docs/exemplo_tsconfig.md)

        4. **__tests__**

            Pastas em que ficarão definidos os testes

            1. **as-pect.d.ts**

                Arquivo de configuração 

                [Exemplo de as-pect.d.ts](docs/exemplo_aspectdts.md)

            2. **main.spec.ts**

                Especificação dos testes para a **main.ts**

    2. **src** - front end

        Front-end, vários dos exemplos foram feitos usando react, é bom ser em algo baseado em js por ter a api que comunica direto com a near pra js, a near-api-js.

    3. **asconfig.js** - configuração do assembly

        Pra configurar a compilação do AssemblyScript para um arquivo .wasm que pode ser dado deploy na blockchain

        [Exemplo de asconfig.json](docs/exemplo_asconfig.md)

    4. **as-pect.config.js** - configuração do asp

        [Exemplo de as-pect.config.js](docs/exemplo_aspectconfigjs.md)

### Versões Utilizadas

- Node 14.17.0

### Repositório do Projeto:

[https://github.com/NEAR-Portuguese-Community/contador/](https://github.com/NEAR-Portuguese-Community/contador/)

# Instalar as API's

- Começar criando o projeto com npm:

```bash
npm init -y
```

- Para fazer a conexão com o javascript (usado mais para o front).

```bash
npm install npm install --save near-api-js@0.42.0
```

- Biblioteca para AssemblyScript (para escrever o contrato).

```bash
npm install --save near-sdk-as
```

- Jest para os testes.

```tsx
yarn add jest jest-environment-node
```

# Escrever o Contrato

Agora basta escrever o contrato.... É bom ter em mente nesse momento as principais funcionalidades que o contrato deve ter, o que ele vai fazer, quais informações deve guardar e com isso já podemos é possível partir para implementação. Há mais abordagens possíveis para se criar o contrato, mas a que usaremos aqui é a de que funções exportadas no código são a interface para a comunicação com ele. Então como mostrado anteriormente nosso código principal fica no arquivo `/assembly/main.ts` .

E a partir de agora o resto do tutorial será criando um exemplo de dApp e tentando mostrar o pensamento ao construí-lo.  Um dos exemplos clássicos nesse ponto é o "contador", então vou descrever brevemente o que nosso dApp deve fazer:

> O contador é um dApp em que há um número inteiro, que pode ser incrementado ou decrementado pelos usuários.

Então: 

- **Quais dados precisamos guardar?**

    Só precisamos guardar um inteiro, que vai ser o valor atual do contador.

- **Quais métodos devem existir para interagir com esses dados?**

    Um método para incrementar, outro para decrementar, e outro para pegar esse número.

Tendo isso em mente, é hora de codar.

## Codando o Contrato

Vamos começar mexendo no arquivo **main.ts**, e importando a biblioteca que instalamos:

```jsx
import { storage } from "near-sdk-as";
```

Aqui vamos usar esse objeto "storage", que podemos interpretar como o banco de dados do nosso contrato, um BD que é basicamente uma estrutura de dados do tipo map em que a chave é uma string e o valor é o dado que queremos salvar nessa chave. O dado a ser salvo será um inteiro de 32 bits do *typescript* o *i32*, então podemos escrever a função que incrementará esse contador como segue:

```tsx
export function increment(): i32 {
  const newVal = storage.getPrimitive<i32>("counter", 0) + 1;
  storage.set<i32>("counter", newVal);
  return newVal;
}
```

Então como vemos acima, a primeira coisa que essa função faz é buscar no *storage* um valor primitivo do tipo *i32* na chave "*counter"* e incrementa-lo em 1, se essa chave ainda não existe ele a cria com o valor default de 0, por isso do 0 como segundo parâmetro. Após isso o novo valor é setado para a chave "*counter*" usando o *set.* Esse valor é então retornado, um i32 (por isso do i32 dps dos parenteses), esse valor será útil para quando lidarmos com a interface ou quando formos chamar esse contrato. Já temos a função de incremento, a função de decremento é análoga só que subtraindo 1 do valor armazenado:

```tsx
export function decrement(): i32 {
  const newVal = storage.getPrimitive<i32>("counter", 0) -decrement 1;
  storage.set<i32>("counter", newVal);
  return newVal;
}
```

Agora uma função para que possamos buscar o valor desse contador, tenho certeza que com base nos anteriores você já sabe como fazer isso, mas por garantia tá aqui:

```tsx
export function getCounter(): i32 {
  return storage.getPrimitive<i32>("counter", 0);
}
```

Com esse código pronto, podemos compila-lo, para um arquivo .wasm, que será o executável interpretado pela blockchain NEAR. É possível fazer isso usando:

```bash
npx asb
```

Acho que com isso já podemos começar a interagir com o contrato, para isso, nesse momento usarei uma interface de linha de comando da near, a near-cli. Para instala-la no linux, basta usar o comando:

```bash
npm install -g near-cli
```

Após a ferramenta instalada, é necessário fazer login com sua conta da testnet, se ainda não criou é só acessar aqui: [https://wallet.testnet.near.org/create](https://wallet.testnet.near.org/create), se já criou roda esse comando no terminal:

```bash
near login
```

Vá para seu navegador e siga as instruções, assim você pode usar a interface de linha de comando da near para interagir com a blockchain usando sua conta da near. Beleza nesse ponto já podemos dar deploy do nosso contrato na *testnet*. O jeito mais fácil de fazer isso é usando o comando abaixo:

```bash
near dev-deploy ./out/main.wasm
```

Isso fará deploy do contrato para uma conta de desenvolvedor gerada pelo comando, na saída ele dará o nome dessa conta que será algo do tipo: dev-XXXXXXXXXXXXX-YYYYYYY, esse comando também gera uma pasta com nome "neardev", que contém as informações da conta de desenvolvedor gerada. Esse é também o endereço que usaremos para fazer chamadas ao contrato. Pronto, temos nosso contrato rodando na testnet NEAR, mas pra termos um gostinho disso vamos interagir com ele usando na *cli* o comando abaixo:

```bash
near call dev-SEU-CONTRATO getCounter ''
```

A saída esperada é algo do tipo:

```bash
Scheduling a call: dev-SEU-CONTRATO.getCounter()
Transaction Id 4JBVATfwb1NGzIDDASUATRANSACAOiuVogQXBY3VUkAaT
To see the transaction in the transaction explorer, please open this url in your browser
https://explorer.testnet.near.org/transactions/4JBVATfwb1NGzIDDASUATRANSACAOiuVogQXBY3VUkAaT
0
```

Em que podemos ver que o número retornado foi zero. Exemplo de como chamar essa função para os outros métodos:

```bash
near call dev-SEU-CONTRATO increment ''
```

```bash
near call dev-SEU-CONTRATO decrement ''
```

Perfeito, temos nosso contrato funcionando e rodando na testnet. Mas legal isso foi um exemplo, e aqui quero mostrar também o workflow para construir coisas mais genéricas, por isso a próxima seção é sobre algumas estruturas de dados que são usadas para guardar dados na blockchain.

### Estruturas de Dados

Há várias estruturas de dados, já implementadas na sdk de typescript, e elas funcionam assim como seus nomes dizem que elas funcionam, então por exemplo o PersistentVector é iterável, tem acesso aleatório, preserva a ordem de inserção e todos atributos de um vector já vistas em outros contextos, pra saber mais da uma olhada na [documentação](https://docs.near.org/docs/concepts/data-storage). E essas estruturas de dados são:

- PersistentVector
- PersistentSet
- PersistentMap
- PersistentUnorderedMap
- PersistentDeque
- AVLTree

É possível também guardar seus dados em classes criadas por você, assim como se cria uma classe em typescript normalmente, porém anotando-a com *@nearBindgen* que é uma anotação que facilita a serialização por parte da blockchain. Mas não vale se aprofundar muito mais nessa parte aqui. Bora tentar fazer um front end pra interagir com esse contador usando a api da near para js.

# Testes

Ninguém liga pros testes..... 

Brincadeira bora fazer uns testes pra garantir que ta tudo funcionando, e aproveitar pra aprender como os testes funcionam para contratos inteligentes da NEAR, testes são especialmente necessários nesse ambiente de blockchains. Iremos utilizar asp para descrever os testes, há vários arquivos para a configuração dos testes, então tenha todos eles prontos conforme mostrado no começo desse tutorial. Nosso diretório principal agora se torna o */assembly/__tests__* e o arquivo que vamos usar é o *main.spec.ts*. Começaremos importando as funções que vamos testar:

```jsx
import { getCounter, increment, decrement } from "../main";
```

Já vou colocar um exemplo de descrição dos testes, lendo esse código você pode entender a sintaxe dos testes e a partir disso pode até adicionar uns testes para brincar e aprender melhor.

```tsx
import { getCounter, increment, decrement } from "../main";

describe('Counter', () => {

    it('get counter', () => {
        expect(getCounter()).toBe(0, 'counter should be zero before any increment or decrement');
    });

    it('increment counter', () => {
        increment();
        expect(getCounter()).toBe(1, 'counter must be one after one increment');
    });

    it('decrement counter', () => {
        increment();
        decrement();
        expect(getCounter()).toBe(0, 'should be zero after one increment and one decrement');
    });
});
```

Para rodar os testes é só chamar o aps usando o yarn.

```bash
yarn asp
```

Se na saída só teve certinhos verdes parece que deu tudo certo, e os testes estão funcionando.

# Front-End

Não farei nada de mais rebuscado nessa parte, será somente uma tela com html básico e bootstrap, que vai interagir com nosso contrato. Muito do que existe com front-end é feito em react ou bibliotecas como essa, mas vamos de simplicidade. Até agora estávamos mexendo na pasta *assembly,* vamos passar para a pasta *src* pois é onde ficará o front-end do nosso dApp.

Podemos começar focando em fazer uma interface reutilizável para fazer as chamadas do contrato, e a conexão com a NEAR wallet e seta-las como atributos da página. 

### Dependências do Front-End e Template HTML

```jsx
yarn add parcel-bundler regenerator-runtime
```

- `parcel-bundler` será o bundler que usaremos para rodar o frontend de forma mais fácil
- `regenerator-runtime` é uma dependência necessária a API js da NEAR

Aproveite para criar o arquivo html que será o nosso templete da interface, com os imports do bootstrap e do arquivo js que criaremos na sequência:

[index.html](docs/indexhtml.md)

### Configuração e Conexão

Mo arquivo `main.js` ficará o código js da aplicação frontend, e seu inicio, com os imports e inicializações necessárias fica assim:

```jsx
import "regenerator-runtime/runtime";
import * as nearAPI from "near-api-js"

const contract_name = "<nome-do-seu-contrato>"
let nearConfig = getConfig(contract_name)
window.nearConfig = nearConfig
```

Em seguida teremos uma função que retorna as configurações necessárias para iniciar a conexão, com as informações do id da rede, no nosso caso a `testnet`; URL do nó que usaremos para acessar o RPC; nome do contrato e as URLs da wallet e do helper:

```jsx
function getConfig(contract_name) {
  return {
    networkId: 'testnet',
    nodeUrl: 'https://rpc.testnet.near.org',
    contractName: contract_name,
    walletUrl: 'https://wallet.testnet.near.org',
    helperUrl: 'https://helper.testnet.near.org'
  }
}
```

Nesse momento faremos uma função para fazer a conexão com a interface RPC do nó da rede, faremos a requisição da conta do usuário e criaremos a interface com o contrato que acabamos de criar. A função ficará assim:

```jsx
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
}
```

Pronto, dessa forma, se ocorrer tudo bem já teremos a conexão feita. 

Mas só acreditar em mim não tem graça, é muito mais legal ver isso funcionando. Podemos fazer isso  assim: coloque essa linha no final da função acima:

```jsx
console.log(await window.contract.getCounter())
```

E então faça uma chamada da função `connect()` no final do arquivo `main.js` :

```jsx
window.nearInitPromise = connect()
  .then()
  .catch(console.error)
```

Para executar o código use o comando `yarn parcel src/index.html` , acesse `[localhost:1234](http://localhost:1234)` e veja o console. Se deu tudo certo é pra ter um `0`, ou algum número, por lá. Note que no momento que iniciamos a interface com o contrato, o objeto window.contract contém os métodos criados por nós quando o escrevemos, assim podem ser feitas as chamadas das suas funções a partir do js.

E assim está pronto, a conexão está feita.

## Interações com o Contrato

Essa seção terá bastante coisa que se derivou da escolha de não usar um framework ou biblioteca js que facilite a renderização e responsividade do front. Portanto muita coisa pode mudar dependendo dessa escolha, o importante é entender como ocorrem as chamadas para o contrato e como essa interação pode ser feita.

### Login e Logout usando a Wallet

Para fazer as operações no nosso dApp o usuário deve estar logado com sua wallet, e ele pode querer dar logout também. Essas duas operações serão feitas por essas duas funções abaixo:

```jsx
// Fazer o login usando sua wallet NEAR da testnet, e essa função é adicionada ao botão sign-in
document.querySelector('.sign-in .btn').addEventListener('click', () => {
  walletAccount.requestSignIn(nearConfig.contractName, 'NEAR Counter Example');
});

// Fazer logout com sua wallet NEAR e colocando essa função no botão sign-out
document.querySelector('.sign-out .btn').addEventListener('click', () => {
  walletAccount.signOut();
  window.location.replace(window.location.origin + window.location.pathname);
});
```

Na próxima seção você poderá testar essa etapa, pois é nela que faremos a lógica de mostrar ou não algumas partes dependendo do usuário estar logado ou não.

### Display do Contador e update da UI

Queremos ver coisas funcionando, vamos mostrar nosso contador na tela e juntar isso a condição de login do usuário, a função que fará isso é a seguinte:

```jsx
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
```

Note que as partes mais estranhas dela são alterações nos items da interface, para que eles sejam mostrados ou não dependendo se usuário está logado ou não. 

Essa função também será chamada quando o usuário quiser incrementar ou decrementar o contador, ela faz o update de toda a UI. Então também é necessário chamar essa função de dentro da main, faça a seguinte alteração linha no final do arquivo `main.js` :

```jsx
window.nearInitPromise = connect()
  .then(updateUI) // chamada da função updateUI
  .catch(console.error)
```

Execute e veja se tudo está funcionando na interface até aqui.

### Incremento e Decremento

Quase lá, temos que fazer as funções que incrementam e decrementam e colocá-las como evento de seus respectivos botões. Você já deve ter entendido como são feitas as chamadas de função do contrato, então nada de muito novo por aqui. Chamamos a função e atualizamos a UI:

```jsx
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
```

E vai pra interface ver se tudo certo por lá, o contador demora um pouco para carregar pois as chamadas com a interface não são tão rápidas, mas é bom lembrar que estamos guardando dados e fazendo chamadas diretamente numa blockchain.

# Conclusão

Você pode observar todas as chamadas feitas também no explorer da NEAR, para isso basta acessar a seguinte URL e colocar o nome do contrato que foi gerado para você no momento do deploy: [explorer.testnet.near.org/accounts/](https://explorer.testnet.near.org/accounts/)<nome-do-seu-contato>

Se esse foi seu primeiro contrato inteligente escrito provavelmente você está até surpreso de quão fácil foi construí-lo, e é assim que deve ser. Para uma adoção maior da tecnologia é necessário que a experiência do programador seja amigável, e esse é um dos focos do protocolo NEAR, tanto que poder fazer isso em typescript é uma mão na roda. Se você já tinha escrito outro contrato inteligente em outros protocolos seria legal ter um feedback de como foi sua experiência, e quais diferenças encontrou.

Se você achou interessante esse desenvolvimento e quer continuar pesquisando sobre, uma indicação que dou é ir atrás de mais exemplos e tentar lê-los, executá-los, reescreve-los, etc; aqui tem vários exemplos, inclusive um de contador que foi usado como base desse tutorial:

[github.com/near-examples/](https://github.com/near-examples/)