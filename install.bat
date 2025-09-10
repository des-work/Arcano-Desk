@echo off
echo.
echo ========================================
echo    ARCANO DESK - MAGIC STUDY ASSISTANT
echo ========================================
echo.
echo Installing dependencies...
echo.

REM Install npm dependencies
call npm install

echo.
echo ========================================
echo Installation complete!
echo ========================================
echo.
echo Next steps:
echo 1. Install Ollama from https://ollama.ai
echo 2. Start Ollama: ollama serve
echo 3. Pull a model: ollama pull llama2
echo 4. Start the app: npm start
echo.
echo Press any key to continue...
pause >nul
