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
