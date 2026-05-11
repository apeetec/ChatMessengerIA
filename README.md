# ChatMessengerIA 🤖

[![Security](https://img.shields.io/badge/Security-Highly%20Protected-brightgreen.svg)](#-segurança)
[![Version](https://img.shields.io/badge/Version-1.0.0-blue.svg)](#)

Uma interface de chat moderna e elegante desenvolvida em tecnologias Web nativas, integrada diretamente com a inteligência artificial via **OpenRouter API**. 

O projeto utiliza um paradigma de **Proxy Backend Seguro em PHP** para encapsular a comunicação e ocultar chaves de API críticas, garantindo que dados sensíveis nunca cheguem ao navegador do cliente final.

---

## ✨ Funcionalidades

- **Visual Premium:** Interface refinada com design responsivo, paleta de cores moderna baseada no Tailwind/Inter, e sombras suaves.
- **Micromovimentos:** Animações nativas CSS de entrada de mensagens e indicador visual de digitação dinâmico.
- **Arquitetura Segura:** Total encapsulamento da chave de API via PHP, mantendo seu código JavaScript limpo de segredos.
- **Feedback em Tempo Real:** Exibição do tempo de resposta da API em milissegundos para monitoramento de performance.
- **Segurança Nativa:** Filtros de segurança integrados (Headers de anti-sniffing, bloqueio de frames, e sanitização HTML básica na entrada).

## 🏗️ Stack Tecnológica

### Front-end
- **HTML5:** Estruturação semântica.
- **CSS3 Customizado:** Sem frameworks externos. Utiliza Flexbox, Animações e Variáveis CSS.
- **Vanilla JavaScript:** Comunicação assíncrona via `fetch()` com tratamento rigoroso de erros.

### Back-end (Proxy de Segurança)
- **PHP:** Script `proxy.php` ultraleve agindo como intermediário cURL.
- **OpenRouter API:** Motor de inteligência artificial flexível.
- **Dotenv nativo:** Leitura segura de variáveis de ambiente (.env) via sistema de arquivos.

## 📂 Estrutura do Projeto

```bash
.
├── index.html     # Estrutura e layout da aplicação
├── styles.css     # Estilização moderna e responsiva
├── script.js      # Lógica do frontend e comunicação AJAX
├── proxy.php      # Backend intermediário cURL (Oculta a API Key)
├── .htaccess      # Configuração de servidor para proteção de diretório
├── .gitignore     # Garante que segredos locais (.env) fiquem fora do Git
└── .env           # [Local apenas] Armazena sua OPENROUTER_API_KEY
```

## 🚀 Como Rodar o Projeto Localmente

### Pré-requisitos
- Um servidor local com PHP 7.4+ ativado (WAMP, XAMPP, Docker ou servidor embutido do PHP).
- Uma conta e chave de API ativa no [OpenRouter](https://openrouter.ai/).

### Instalação

1. **Clonar o Repositório**
   ```bash
   git clone https://github.com/apeetec/ChatMessengerIA.git
   cd ChatMessengerIA
   ```

2. **Configurar Variáveis de Ambiente**
   Crie um arquivo chamado `.env` na raiz do projeto e adicione sua chave de API:
   ```env
   OPENROUTER_API_KEY=seu_token_sk-or-aqui
   ```
   *(Nota: O arquivo `.env` já está configurado no `.gitignore` e jamais deve ser enviado ao repositório público).*

3. **Executar Servidor**
   Se estiver usando o terminal, navegue até a pasta e rode:
   ```bash
   php -S localhost:8000
   ```
   Em seguida, acesse `http://localhost:8000` no navegador.

## 🔒 Segurança

Para garantir a integridade do sistema, as seguintes medidas foram implementadas:
1. **Escopo de Requisição:** O arquivo `proxy.php` rejeita qualquer requisição que não utilize o verbo `POST`.
2. **Headers de Proteção:** Headers `X-Content-Type-Options: nosniff` e `X-Frame-Options: DENY` impedem vulnerabilidades de segurança no servidor.
3. **Sem Vazamento:** A chave da API NUNCA é inserida no código-fonte JavaScript.
4. **Sanitização:** Substituição de caracteres `<` e `>` no script JavaScript para prevenção simplificada de Injeções HTML nos inputs do usuário.

---
<p align="center">Desenvolvido com ❤️ para experiências de IA rápidas e seguras.</p>
