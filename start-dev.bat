@echo off
echo ========================================================
echo  22nd Parallel RMS - Development Environment Bootstrapper
echo ========================================================
echo Starting Backend Server on port 5000...
start cmd /k "cd server && npm run dev"

timeout /t 3 /nobreak >nul

echo Starting Staff Admin Portal on port 5180...
start cmd /k "cd client && npm run dev"

timeout /t 2 /nobreak >nul

echo Starting Customer Dining Portal on port 5174...
start cmd /k "cd customer && npm run dev"

echo.
echo ========================================================
echo  All services launched successfully!
echo   - Backend API:       http://localhost:5000
echo   - Staff Portal:      http://localhost:5180
echo   - Customer Portal:   http://localhost:5174
echo ========================================================
pause
