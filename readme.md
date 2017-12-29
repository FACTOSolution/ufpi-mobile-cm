# UFPI Mobile support API

A API web de suporte do UFPI Mobile permite a busca de informações sobre o **cardápio** do restaurante universitário, os eventos do **calendário** acadêmico e as últimas **notícias** no website da UFPI.

### URL base

Todas as URLs mencionadas nesse documento usam a seguinte base:

    https://ufpi-mobile-cm.herokuapp.com

### Autenticação

As requisições HTTP para adicionar informações no servidor são protegidas por uma [autenticação básica](https://en.wikipedia.org/wiki/Basic_access_authentication). As informações sobre o cardápio e o calendário não são consideradas únicas para a instituição e, por isso, elas devem estar associadas a um **usuário** da API. De forma resumida, você vai precisar de um **e-mail** e **senha** para cadastrar novos cardápios ou calendários.

#### Usuários (users)

Para criar um novo usuário, envie uma requisição com o método `POST` para o *endpoint* `/api/users`. Este endpoint aguarda um objeto **JSON**, que representa o novo usuário, no corpo da mensagem. Tal objeto tem duas propriedades do tipo `string`, a propriedade `email` e a propriedade `password`, como apresentado no exemplo abaixo:

```json
{
  "email": "exemplo@email.com",
  "password": "exemplo senha"
}
```

Com o envio da requisição, a API confirma a adição do novo usuário com a identificação (`id`) desse usuário por meio de outro objeto JSON, por exemplo:

```json
{
  "id": "aaa111bbb222ccc333ddd444",
  "email": "exemplo@email.com"
}
```

Essa `id` será utilizada para pesquisar os **cardápios** e os **calendários** postados por esse usuário.

### Recursos

A seguir, são apresentados os endpoints para cada uma das informações armazenadas pela API.

#### Cardápios (menus)

Um modelo do JSON que representa o cardápio semanal pode ser visualizado em [cardapio.json](examples/cardapio.json).

| URL | Método | Autenticação | Descrição |
| :- | :-: | :-: | - |
| `/api/menus` | `POST` | Sim | Adiciona um novo cardápio para o usuário autenticado
| `/api/menus/{id}` | `GET` | Não | Retorna uma coleção de cardápios associados ao usuário identificado pela `id`
| `/api/menus/{id}/latest` | `GET` | Não | Retorna o cardápio mais recente do usuário `id`

#### Calendários (calendars)

Um modelo do JSON que representa o calendário acadêmico pode ser visualizado em [calendario.json](examples/calendario.json).

| URL | Método | Autenticação | Descrição |
| :- | :-: | :-: | - |
| `/api/calendars` | `POST` | Sim | Adiciona um novo calendário para o usuário autenticado
| `/api/calendars/{id}` | `GET` | Não | Retorna uma coleção de calendários associados ao usuário identificado pela `id`
| `/api/calendars/{id}/latest` | `GET` | Não | Retorna o calendário mais recente do usuário `id`

#### Notícias (articles)

Um modelo do JSON que representa uma notícia pode ser visualizado em [noticia.json](examples/noticia.json).

| URL | Método | Autenticação | Descrição |
| :- | :-: | :-: | - |
| `/api/articles` | `GET` | Não | Retorna uma lista de notícias obtidas no website da UFPI. Os resultados dessa rota não apresentam as propriedades `text`, `links` e `images`
| `/api/articles/{code}` | `GET` | Não | Retorna todos as informações de uma notícia específica identificada pelo valor numérico `code`
| `/api/articles/update` | `GET` | Não | Requisita que novas notícias sejam adicionadas ao servidor
