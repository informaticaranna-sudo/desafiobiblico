# Desafio Bíblico — versão de publicação

Aplicativo web instalável (PWA), preparado para publicação gratuita no GitHub Pages.

## Conteúdo desta versão

- Acervo com **1.001 perguntas** e suas referências bíblicas, preservadas a partir do PDF fornecido.
- Área **Estudar perguntas**: todas as 1.001 questões podem ser abertas para leitura. A tela mostra a pergunta, a referência e o texto bíblico ARC, sem alternativas e sem fluxo de resposta.
- Questões marcadas para conferência aparecem com o aviso **EM REVISÃO**.
- Área **Começar desafio**: apresenta perguntas com três alternativas já preparadas. O desafio funciona em rodadas de 10 perguntas. As demais ficam disponíveis para estudo enquanto suas alternativas são preparadas e conferidas. Não foram inventadas alternativas para completar o jogo.
- Nome/apelido e progresso básico ficam salvos no próprio aparelho.

## Texto bíblico

A leitura do texto ARC é carregada sob demanda a partir do conjunto público de dados `bible-data-pt-por` (Almeida Revista e Corrigida), mantido por mrk214: https://github.com/mrk214/bible-data-pt-por. É necessária conexão com a internet na primeira leitura. Se o serviço externo estiver indisponível, o botão **Abrir passagem na ARC** continua disponível como alternativa.

## Publicar no GitHub Pages

1. Descompacte o arquivo ZIP.
2. Envie todos os arquivos e a pasta `icons` para a raiz do repositório público.
3. No GitHub, abra **Settings → Pages**.
4. Em **Build and deployment**, escolha **Deploy from a branch**.
5. Selecione a branch `main` e a pasta `/(root)`, depois clique em **Save**.
6. Aguarde a publicação e abra o endereço informado pelo GitHub.

## Observações

- A instalação do PWA exige HTTPS; o GitHub Pages fornece HTTPS.
- O texto bíblico sob demanda depende de internet e de um serviço externo; o conteúdo das perguntas fica no próprio pacote.
- As questões com aviso **EM REVISÃO** devem ser conferidas com o professor antes de considerar seu gabarito definitivo.


## Tela inicial e reinício do progresso
- O aplicativo abre em uma tela inicial com nome/apelido, botão Entrar e opção para instalar.
- Na área principal há os botões Sair e Reiniciar perguntas.
- Reiniciar perguntas apaga o nome salvo, os acertos e o histórico de estudo deste aparelho, além do cache interno do aplicativo. O cache geral do navegador não é apagado.


Atualização: o modo Desafio funciona em rodadas de 10 perguntas. Ao terminar uma rodada, a pessoa pode Concluir e voltar à área principal ou Continuar para uma nova rodada de 10 perguntas. A mensagem informa 10 perguntas por rodada, sem afirmar que o total preparado é 25.


### Ilustração da tela inicial
A tela inicial agora usa uma ilustração própria de uma Bíblia aberta azul com detalhes dourados, no lugar dos emojis de livro e estrela. O arquivo `icons/bible-welcome.png` faz parte do pacote e é incluído no cache do aplicativo.


## Banco de perguntas — atualização v14

- Total preservado: 1.001 registros.
- Questões com alternativas aprovadas nesta versão: 59.
- Questões antigas mantidas em revisão e fora do sorteio: 19.
- Questão 496 permanece substituída/pendente, sem entrar no sorteio.
- Registros sem três alternativas e sem aprovação explícita permanecem pendentes e não entram no sorteio.
- O sorteio usa uma lista de permissão: somente `reviewStatus: "aprovada"`, com exatamente três alternativas e uma correta.

Observação: o ZIP de origem não continha as alternativas dos lotes 26–800 e parte dos lotes posteriores, embora esses lotes tenham sido aprovados na conversa. Por segurança, esta versão não inventa nem ativa essas questões; elas permanecem fora do sorteio até que seus dados completos sejam incorporados.

## Situação da reconstrução

- 83 questões liberadas para o desafio.
- 19 questões em revisão.
- 898 aguardando alternativas.
- Questão 496 com substituição pendente.


## Atualização v16 — revisão autorizada pela usuária

As questões 45, 99, 105, 189, 200, 252, 302, 304, 351, 352, 353, 359, 360, 365, 370, 496, 567, 605, 619 e 692 foram substituídas/reescritas com enunciados objetivos e referências corrigidas. Todas possuem três alternativas e um único gabarito.

As questões ainda classificadas como `pendente_alternativas` permanecem fora do sorteio até que as alternativas sejam incorporadas.


## Integração dos chats 4 e 5 — versão atualizada

- As 898 perguntas que estavam aguardando alternativas foram liberadas no status do banco, conforme autorização da usuária.
- **Limitação do pacote recebido:** essas 898 perguntas ainda estão sem as três alternativas porque os links compartilhados dos chats não puderam ser lidos nesta sessão; por isso, embora estejam liberadas para estudo, não entram no sorteio do desafio até que as alternativas sejam recuperadas ou preparadas.
- A questão 496 foi substituída por uma questão sobre Natã e Davi (2 Samuel 12:1–7).
- A questão 510 foi substituída por uma questão sobre a libertação de Pedro da prisão (Atos 12:7–10), evitando a contagem ambígua dos naufrágios de Paulo.
- Foram revisadas as redações/alternativas dos itens 817, 823, 824, 833, 834, 882, 843, 861, 866 e 867.
- A questão 6 já contém a redação corrigida solicitada sobre os homens lançados na fornalha.
- A ilustração de Bíblia aberta já está na tela inicial (`icons/bible-welcome.png`); o botão de saída do desafio também já não aparece no código desta base.
- Total de perguntas: 1.001. Todas estão com status `aprovada`; somente as que têm exatamente três alternativas e uma resposta correta são sorteadas no desafio.


## Atualização da rodada e integração do chat 5

As 10 questões substituídas/revisadas no lote do chat 5 estão incorporadas ao `perguntas.json`, todas aprovadas, com três alternativas e um único gabarito correto:
817, 823, 824, 833, 834, 843, 861, 866, 867 e 882.

Na missão de 10 perguntas:
- Da 1ª à 9ª, aparece **Próxima pergunta**.
- Na 10ª, **Concluir desafio** aparece somente depois de responder.
- O cache do service worker foi atualizado para que a versão nova do aplicativo seja carregada.



## Competição entre amigos (v17)

O aplicativo inclui competição privada por convite: até 10 participantes, apelido sem conta, desafio por turnos e batalha ao vivo. No modo por turnos, cada pessoa responde no próprio horário. Na batalha ao vivo, todos recebem a mesma pergunta; o organizador avança quando todos responderem. Cada acerto vale 10 pontos.

### Ativação do serviço online

A competição entre aparelhos precisa de backend online. Esta versão usa Supabase e inclui `competition.sql` com tabelas e funções seguras. Para ativar:

1. Crie um projeto gratuito em https://supabase.com/.
2. Abra **SQL Editor**, cole todo o conteúdo de `competition.sql` e execute.
3. Em **Project Settings → API**, copie a **Project URL** e a chave pública **anon/publishable**. Nunca use a chave `service_role` no aplicativo.
4. Abra `supabase-config.js` e substitua os dois textos `COLE_...` pela URL e chave pública do projeto.
5. Publique novamente todos os arquivos do diretório no mesmo endereço HTTPS onde o PWA está hospedado.
6. Abra o app, entre com seu apelido e use **Competir com amigos**.

Sem configurar o Supabase, o modo individual continua funcionando normalmente, mas as salas online não podem ser criadas ou sincronizadas. O código de convite funciona como chave de acesso: compartilhe apenas com os amigos convidados. O apelido não comprova identidade; qualquer pessoa com o convite pode tentar entrar.

### Limites e proteção

- Máximo de 10 participantes por sala (criador incluído).
- Cada sala recebe as mesmas 10 perguntas já aprovadas, com três alternativas e uma correta.
- As respostas são validadas no banco; a pontuação não depende do cálculo do navegador.
- A chave individual da sala fica salva somente no aparelho do participante.
- O placar atualiza automaticamente por consulta periódica ao servidor.
- A batalha ao vivo é sincronizada por pergunta; o organizador libera a próxima depois que todos os participantes atuais responderem.
- A competição não altera o progresso individual, medalhas ou histórico de estudo.


## Atualização v18 — perguntas fáceis e Desafio Kids

- Foram adicionadas 199 perguntas do material “250 Perguntas — Quiz Bíblico” (ids 1002 a 1200), todas com `level: "facil"`, três alternativas e um gabarito.
- 64 delas foram marcadas com `kids5: true` e alimentam o botão **Desafio Kids (até 5 anos)**, em rodadas de 10 perguntas. Um adulto pode ler as perguntas em voz alta.
- As demais perguntas fáceis ficam disponíveis em **Estudar perguntas → Fáceis e Kids (novas)**.
- O Desafio principal e a competição entre amigos continuam usando apenas as 1.001 perguntas originais. As medalhas também contam só as originais.
- As alternativas do PDF tinham 4 opções; foi removida uma alternativa errada de cada pergunta para ficar com 3. As perguntas Kids têm referência bíblica; as outras podem receber referência depois (campo `answer`).
- Para mudar uma pergunta de grupo, edite `kids5` em `perguntas.json` (`true` entra no Desafio Kids).
- Não foram importadas 51 do PDF: repetidas, com só 2 alternativas, sem gabarito, já existentes no acervo ou com gabarito duvidoso.
