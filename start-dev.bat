
@REM Podria funcionar en windows, idk

@echo off
echo Iniciando frontend...
start "" cmd /c "cd frontend && npm run dev"

echo Iniciando backend...
start "" cmd /c "cd backend && npm run dev"

echo Ambos servidores se están en ejecutando
pause