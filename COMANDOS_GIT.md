# 📦 Comandos Git para Subir o Projeto

## 🚀 Passo a Passo Rápido

### 1️⃣ Inicializar Git (se ainda não fez)

```bash
cd c:\Users\luis.alves_kovi\Documents\Repositorios\whatsapp

git init
```

### 2️⃣ Adicionar todos os arquivos

```bash
git add .
```

### 3️⃣ Fazer primeiro commit

```bash
git commit -m "Initial commit - WhatsApp Manager System"
```

### 4️⃣ Criar repositório no GitHub

1. Acesse: https://github.com/new
2. Nome do repositório: `whatsapp-manager`
3. Deixe **Público** ou **Privado** (sua escolha)
4. **NÃO marque** "Initialize with README"
5. Clique em **Create repository**

### 5️⃣ Conectar ao GitHub

**Substitua `SEU_USUARIO` pelo seu username do GitHub:**

```bash
git remote add origin https://github.com/SEU_USUARIO/whatsapp-manager.git
```

### 6️⃣ Renomear branch para main

```bash
git branch -M main
```

### 7️⃣ Fazer push

```bash
git push -u origin main
```

---

## ✅ Pronto! Projeto está no GitHub

Acesse: `https://github.com/SEU_USUARIO/whatsapp-manager`

---

## 🔄 Comandos para Atualizações Futuras

Sempre que fizer alterações no código:

```bash
# 1. Adicionar arquivos modificados
git add .

# 2. Fazer commit com mensagem descritiva
git commit -m "Descrição da alteração"

# 3. Enviar para GitHub
git push
```

---

## 📝 Exemplos de Mensagens de Commit

```bash
git commit -m "Add WhatsApp integration with Baileys"
git commit -m "Fix CORS configuration for production"
git commit -m "Update dashboard with new metrics"
git commit -m "Add chatbot flow builder"
```

---

## 🔍 Comandos Úteis

### Ver status dos arquivos
```bash
git status
```

### Ver histórico de commits
```bash
git log --oneline
```

### Ver diferenças antes de commitar
```bash
git diff
```

### Desfazer último commit (mantém alterações)
```bash
git reset --soft HEAD~1
```

### Ver branches
```bash
git branch
```

### Criar nova branch
```bash
git checkout -b feature/nova-funcionalidade
```

---

## ⚠️ Arquivos que NÃO sobem (já configurado no .gitignore)

- `node_modules/`
- `.env`
- `.env.local`
- `dist/`
- `.next/`
- `*.log`

---

## 🆘 Problemas Comuns

### Erro: "remote origin already exists"
```bash
git remote remove origin
git remote add origin https://github.com/SEU_USUARIO/whatsapp-manager.git
```

### Erro: "failed to push"
```bash
git pull origin main --rebase
git push
```

### Esqueceu de adicionar arquivo
```bash
git add arquivo-esquecido.ts
git commit --amend --no-edit
git push --force
```

---

## 🎯 Próximo Passo

Após subir para o GitHub, siga o arquivo **DEPLOY.md** para fazer deploy nas plataformas.
