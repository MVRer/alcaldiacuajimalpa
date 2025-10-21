#!/bin/bash

sudo apt update
sudo apt install git nano curl unzip -y

    
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
curl -fsSL https://bun.com/install | bash
export PATH="$HOME/.bun/bin:$PATH"
git clone https://github.com/MVRer/alcaldiacuajimalpa.git


echo "Starting deployment script"
echo "Front or backend? (f/b)"
read app_type

if [ "$app_type" == "f" ]; then
    echo "Frontend deployment selected"

    sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /etc/ssl/private/selfsigned.key -out /etc/ssl/certs/selfsigned.crt
    cd alcaldiacuajimalpa/frontend
    cp .env.example .env
    bun install
    bun run build
    bun run serve

elif [ "$app_type" == "b" ]; then
    echo "Backend deployment selected"
    sudo apt install -y curl gnupg
    curl -fsSL https://pgp.mongodb.com/server-8.0.asc | sudo gpg --dearmor -o /usr/share/keyrings/mongodb-server-8.0.gpg
    echo "deb [signed-by=/usr/share/keyrings/mongodb-server-8.0.gpg] https://repo.mongodb.org/apt/debian bookworm/mongodb-org/8.0 main" | sudo tee /etc/apt/sources.list.d/mongodb-org-8.0.list
    sudo apt install -y mongodb-org
    sudo systemctl start mongod
    sudo systemctl enable mongod
    sudo systemctl status mongod
    sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /etc/ssl/private/selfsigned.key -out /etc/ssl/certs/selfsigned.crt
    cd alcaldiacuajimalpa/backend
    cp .env.example .env
    bun install
    bun run start

else
    echo "Invalid option"
    exit 1
fi









