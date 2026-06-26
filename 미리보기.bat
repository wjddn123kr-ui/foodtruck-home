@echo off
chcp 65001 >nul
title 푸드트럭하우스 로컬 미리보기  (확인 끝나면 이 창을 닫으세요)
echo.
echo  ================================================
echo   푸드트럭하우스 - 로컬 미리보기
echo  ================================================
echo.
echo   잠시 후 브라우저가 자동으로 열립니다.
echo   (헤더/푸터는 http 에서만 보입니다 - 파일 더블클릭으로는 안 보여요)
echo.
echo   * 확인이 끝나면 이 검은 창을 닫으면 서버가 꺼집니다.
echo.
start "" /min powershell -NoProfile -ExecutionPolicy Bypass -Command "Start-Sleep 2; Start-Process 'http://localhost:8123/'"
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0serve.ps1"
