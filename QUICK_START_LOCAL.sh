#!/bin/bash

echo "========================================"
echo "WhatsApp Manager - Setup Local"
echo "========================================"
echo ""

echo "[1/5] Verificando Node.js..."
if ! command -v node &> /dev/null; then
    echo "ERRO: Node.js não encontrado!"
    echo "Baixe em: https://nodejs.org/"
    exit 1
fi
node --version

echo ""
echo "[2/5] Instalando dependências do Backend..."
cd backend
npm install

echo ""
echo "[3/5] Configurando banco de dados..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo "Arquivo .env criado! Configure DATABASE_URL antes de continuar."
    read -p "Pressione Enter para continuar..."
fi

echo ""
echo "[4/5] Executando migrations..."
npx prisma migrate dev --name init
npx prisma db seed

echo ""
echo "[5/5] Instalando dependências do Frontend..."
cd ../frontend
npm install

if [ ! -f .env.local ]; then
    cp .env.example .env.local
fi

echo ""
echo "========================================"
echo "Setup concluído!"
echo "========================================"
echo ""
echo "Para iniciar o sistema:"
echo ""
echo "Terminal 1 - Backend:"
echo "  cd backend"
echo "  npm run dev"
echo ""
echo "Terminal 2 - Frontend:"
echo "  cd frontend"
echo "  npm run dev"
echo ""
echo "Acesse: http://localhost:3000"
echo "Login: admin@whatsapp.com / admin123"
echo ""
