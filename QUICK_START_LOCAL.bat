@echo off
echo ========================================
echo WhatsApp Manager - Setup Local
echo ========================================
echo.

echo [1/5] Verificando Node.js...
node --version || (
    echo ERRO: Node.js nao encontrado!
    echo Baixe em: https://nodejs.org/
    pause
    exit
)

echo.
echo [2/5] Instalando dependencias do Backend...
cd backend
call npm install

echo.
echo [3/5] Configurando banco de dados...
if not exist .env (
    copy .env.example .env
    echo Arquivo .env criado! Configure DATABASE_URL antes de continuar.
    pause
)

echo.
echo [4/5] Executando migrations...
call npx prisma migrate dev --name init
call npx prisma db seed

echo.
echo [5/5] Instalando dependencias do Frontend...
cd ..\frontend
call npm install

if not exist .env.local (
    copy .env.example .env.local
)

echo.
echo ========================================
echo Setup concluido!
echo ========================================
echo.
echo Para iniciar o sistema:
echo.
echo Terminal 1 - Backend:
echo   cd backend
echo   npm run dev
echo.
echo Terminal 2 - Frontend:
echo   cd frontend
echo   npm run dev
echo.
echo Acesse: http://localhost:3000
echo Login: admin@whatsapp.com / admin123
echo.
pause
