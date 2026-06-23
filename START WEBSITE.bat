@echo off
title COA Flashcards
echo Starting local server...
echo.
echo When you see "Accepting connections", open this link in your browser:
echo   http://localhost:3456
echo.
echo Keep this window open while using the site. Press Ctrl+C to stop.
echo.
cd /d "%~dp0"
start http://localhost:3456
npx --yes serve -l 3456 .
