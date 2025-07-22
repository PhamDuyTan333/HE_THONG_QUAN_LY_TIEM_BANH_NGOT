#!/bin/bash

echo "========================================"
echo "    TIEM BANH DEPLOYMENT SCRIPT"
echo "========================================"
echo

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed or not in PATH"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "ERROR: npm is not installed or not in PATH"
    exit 1
fi

echo "Node.js and npm are installed."
echo

# Function to install dependencies
install_deps() {
    echo
    echo "========================================"
    echo "    INSTALLING DEPENDENCIES"
    echo "========================================"
    echo

    echo "Installing Backend dependencies..."
    cd backend
    if [ ! -f "package.json" ]; then
        echo "ERROR: package.json not found in backend directory"
        cd ..
        return 1
    fi
    npm install
    if [ $? -ne 0 ]; then
        echo "ERROR: Failed to install backend dependencies"
        cd ..
        return 1
    fi
    cd ..

    echo "Installing Frontend dependencies..."
    cd frontend
    if [ ! -f "package.json" ]; then
        echo "ERROR: package.json not found in frontend directory"
        cd ..
        return 1
    fi
    npm install
    if [ $? -ne 0 ]; then
        echo "ERROR: Failed to install frontend dependencies"
        cd ..
        return 1
    fi
    cd ..

    echo
    echo "Dependencies installed successfully!"
}

# Function to setup environment files
setup_env() {
    echo
    echo "========================================"
    echo "    SETTING UP ENVIRONMENT FILES"
    echo "========================================"
    echo

    echo "Setting up Backend environment..."
    cd backend
    if [ ! -f ".env.example" ]; then
        echo "ERROR: .env.example not found in backend directory"
        cd ..
        return 1
    fi
    if [ ! -f ".env" ]; then
        cp ".env.example" ".env"
        echo "Created backend/.env from .env.example"
        echo "Please edit backend/.env with your actual values"
    else
        echo "backend/.env already exists"
    fi
    cd ..

    echo "Setting up Frontend environment..."
    cd frontend
    if [ ! -f ".env.example" ]; then
        echo "ERROR: .env.example not found in frontend directory"
        cd ..
        return 1
    fi
    if [ ! -f ".env" ]; then
        cp ".env.example" ".env"
        echo "Created frontend/.env from .env.example"
        echo "Please edit frontend/.env with your actual values"
    else
        echo "frontend/.env already exists"
    fi
    cd ..

    echo
    echo "Environment files setup complete!"
    echo "Please edit the .env files with your actual configuration values."
}

# Function to deploy backend
deploy_backend() {
    echo
    echo "========================================"
    echo "    DEPLOYING BACKEND TO VERCEL"
    echo "========================================"
    echo

    # Check if Vercel CLI is installed
    if ! command -v vercel &> /dev/null; then
        echo "Vercel CLI not found. Installing..."
        npm install -g vercel
        if [ $? -ne 0 ]; then
            echo "ERROR: Failed to install Vercel CLI"
            return 1
        fi
    fi

    cd backend
    if [ ! -f ".env" ]; then
        echo "WARNING: .env file not found. Please run option 5 first."
        cd ..
        return 1
    fi

    echo "Deploying backend..."
    vercel --prod
    if [ $? -ne 0 ]; then
        echo "ERROR: Backend deployment failed"
        cd ..
        return 1
    fi

    cd ..
    echo
    echo "Backend deployed successfully!"
    echo "Don't forget to add environment variables in Vercel Dashboard."
}

# Function to deploy frontend
deploy_frontend() {
    echo
    echo "========================================"
    echo "    DEPLOYING FRONTEND TO VERCEL"
    echo "========================================"
    echo

    # Check if Vercel CLI is installed
    if ! command -v vercel &> /dev/null; then
        echo "Vercel CLI not found. Installing..."
        npm install -g vercel
        if [ $? -ne 0 ]; then
            echo "ERROR: Failed to install Vercel CLI"
            return 1
        fi
    fi

    cd frontend
    if [ ! -f ".env" ]; then
        echo "WARNING: .env file not found. Please run option 5 first."
        cd ..
        return 1
    fi

    echo "Building frontend..."
    npm run build
    if [ $? -ne 0 ]; then
        echo "ERROR: Frontend build failed"
        cd ..
        return 1
    fi

    echo "Deploying frontend..."
    vercel --prod
    if [ $? -ne 0 ]; then
        echo "ERROR: Frontend deployment failed"
        cd ..
        return 1
    fi

    cd ..
    echo
    echo "Frontend deployed successfully!"
}

# Main menu
while true; do
    echo "Choose deployment option:"
    echo "1. Install dependencies only"
    echo "2. Deploy Backend to Vercel"
    echo "3. Deploy Frontend to Vercel"
    echo "4. Deploy Both (Backend + Frontend)"
    echo "5. Setup Environment Files"
    echo "6. Exit"
    echo
    read -p "Enter your choice (1-6): " choice

    case $choice in
        1)
            install_deps
            ;;
        2)
            deploy_backend
            ;;
        3)
            deploy_frontend
            ;;
        4)
            deploy_backend
            deploy_frontend
            echo
            echo "Both Backend and Frontend deployed successfully!"
            ;;
        5)
            setup_env
            ;;
        6)
            echo
            echo "Thank you for using Tiem Banh Deployment Script!"
            echo
            exit 0
            ;;
        *)
            echo "Invalid choice. Please try again."
            ;;
    esac
    
    echo
    read -p "Press Enter to continue..."
    echo
done
