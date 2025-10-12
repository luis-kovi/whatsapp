@echo off
echo ========================================
echo WhatsApp Manager - Instalacao Completa
echo ========================================
echo.

echo [1/6] Instalando dependencias do Backend...
cd backend
call npm install
if errorlevel 1 (
    echo ERRO ao instalar dependencias do backend!
    pause
    exit /b 1
)

echo.
echo [2/6] Gerando Prisma Client...
call npx prisma generate
if errorlevel 1 (
    echo ERRO ao gerar Prisma Client!
    pause
    exit /b 1
)

echo.
echo [3/6] Configurando .env do Backend...
if not exist .env (
    copy .env.example .env
    echo Arquivo .env criado! Configure antes de continuar.
    notepad .env
)

echo.
echo [4/6] Instalando dependencias do Frontend...
cd ..\frontend
call npm install
if errorlevel 1 (
    echo ERRO ao instalar dependencias do frontend!
    pause
    exit /b 1
)

echo.
echo [5/6] Configurando .env.local do Frontend...
if not exist .env.local (
    copy .env.example .env.local
    echo Arquivo .env.local criado!
)

echo.
echo [6/6] Executando migrations...
cd ..\backend
call npx prisma migrate dev --name init
call npx prisma db seed

echo.
echo ========================================
echo Instalacao concluida com sucesso!
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
