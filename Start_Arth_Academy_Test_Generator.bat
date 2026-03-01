@echo off
title Arth Academy AI Test Generator
echo ==========================================
echo    Arth Academy AI Test Generator Server
echo ==========================================
echo Starting up the local engine...
echo.

:: Start the Flask app quietly in the background of this terminal
start /b python app.py

:: Wait for a few seconds to let the server fully boot up
timeout /t 3 /nobreak >nul

:: Open the default browser automatically
echo Opening the application in your browser...
start http://127.0.0.1:5002

echo.
echo ==========================================
echo IMPORTANT: Leave this black window open!
echo Closing this window will stop the generator.
echo When you are completely done, you can close it.
echo ==========================================
echo.
pause
