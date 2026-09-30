@echo off
echo ========================================================
echo        AniPulse - Anime Discovery Platform
echo ========================================================
echo Starting Backend API (Port 5000)...
start "AniPulse Backend" cmd /c "cd /d %~dp0backend && npm start"

echo Starting Frontend Web App (Port 3000)...
start "AniPulse Frontend" cmd /c "cd /d %~dp0frontend && npm run dev"

echo.
echo Application started!
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:5000
echo ========================================================
