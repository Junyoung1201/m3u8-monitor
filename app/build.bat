@echo off
echo.
echo    m3u8 모니터 빌드 시작
echo.
rmdir ./assets /s /q
cd renderer
npm run build
copy build/*.* ../assets/*.*
echo react 빌드 끝
cd..
npx tsc
electron-builder
echo 빌드 끝