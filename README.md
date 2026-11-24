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
