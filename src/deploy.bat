@echo off
echo ========================================
echo    TIEM BANH DEPLOYMENT SCRIPT
echo ========================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: npm is not installed or not in PATH
    pause
    exit /b 1
)

echo Node.js and npm are installed.
echo.

REM Menu
:menu
echo Choose deployment option:
echo 1. Install dependencies only
echo 2. Deploy Backend to Vercel
echo 3. Deploy Frontend to Vercel
echo 4. Deploy Both (Backend + Frontend)
echo 5. Setup Environment Files
echo 6. Exit
echo.
set /p choice="Enter your choice (1-6): "

if "%choice%"=="1" goto install_deps
if "%choice%"=="2" goto deploy_backend
if "%choice%"=="3" goto deploy_frontend
if "%choice%"=="4" goto deploy_both
if "%choice%"=="5" goto setup_env
if "%choice%"=="6" goto exit
echo Invalid choice. Please try again.
goto menu

:install_deps
echo.
echo ========================================
echo    INSTALLING DEPENDENCIES
echo ========================================
echo.

echo Installing Backend dependencies...
cd backend
if not exist "package.json" (
    echo ERROR: package.json not found in backend directory
    cd ..
    pause
    goto menu
)
npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install backend dependencies
    cd ..
    pause
    goto menu
)
cd ..

echo Installing Frontend dependencies...
cd frontend
if not exist "package.json" (
    echo ERROR: package.json not found in frontend directory
    cd ..
    pause
    goto menu
)
npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install frontend dependencies
    cd ..
    pause
    goto menu
)
cd ..

echo.
echo Dependencies installed successfully!
pause
goto menu

:setup_env
echo.
echo ========================================
echo    SETTING UP ENVIRONMENT FILES
echo ========================================
echo.

echo Setting up Backend environment...
cd backend
if not exist ".env.example" (
    echo ERROR: .env.example not found in backend directory
    cd ..
    pause
    goto menu
)
if not exist ".env" (
    copy ".env.example" ".env"
    echo Created backend/.env from .env.example
    echo Please edit backend/.env with your actual values
) else (
    echo backend/.env already exists
)
cd ..

echo Setting up Frontend environment...
cd frontend
if not exist ".env.example" (
    echo ERROR: .env.example not found in frontend directory
    cd ..
    pause
    goto menu
)
if not exist ".env" (
    copy ".env.example" ".env"
    echo Created frontend/.env from .env.example
    echo Please edit frontend/.env with your actual values
) else (
    echo frontend/.env already exists
)
cd ..

echo.
echo Environment files setup complete!
echo Please edit the .env files with your actual configuration values.
pause
goto menu

:deploy_backend
echo.
echo ========================================
echo    DEPLOYING BACKEND TO VERCEL
echo ========================================
echo.

REM Check if Vercel CLI is installed
vercel --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Vercel CLI not found. Installing...
    npm install -g vercel
    if %errorlevel% neq 0 (
        echo ERROR: Failed to install Vercel CLI
        pause
        goto menu
    )
)

cd backend
if not exist ".env" (
    echo WARNING: .env file not found. Please run option 5 first.
    cd ..
    pause
    goto menu
)

echo Deploying backend...
vercel --prod
if %errorlevel% neq 0 (
    echo ERROR: Backend deployment failed
    cd ..
    pause
    goto menu
)

cd ..
echo.
echo Backend deployed successfully!
echo Don't forget to add environment variables in Vercel Dashboard.
pause
goto menu

:deploy_frontend
echo.
echo ========================================
echo    DEPLOYING FRONTEND TO VERCEL
echo ========================================
echo.

REM Check if Vercel CLI is installed
vercel --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Vercel CLI not found. Installing...
    npm install -g vercel
    if %errorlevel% neq 0 (
        echo ERROR: Failed to install Vercel CLI
        pause
        goto menu
    )
)

cd frontend
if not exist ".env" (
    echo WARNING: .env file not found. Please run option 5 first.
    cd ..
    pause
    goto menu
)

echo Building frontend...
npm run build
if %errorlevel% neq 0 (
    echo ERROR: Frontend build failed
    cd ..
    pause
    goto menu
)

echo Deploying frontend...
vercel --prod
if %errorlevel% neq 0 (
    echo ERROR: Frontend deployment failed
    cd ..
    pause
    goto menu
)

cd ..
echo.
echo Frontend deployed successfully!
pause
goto menu

:deploy_both
echo.
echo ========================================
echo    DEPLOYING BOTH BACKEND AND FRONTEND
echo ========================================
echo.

call :deploy_backend
call :deploy_frontend

echo.
echo Both Backend and Frontend deployed successfully!
pause
goto menu

:exit
echo.
echo Thank you for using Tiem Banh Deployment Script!
echo.
pause
exit /b 0
