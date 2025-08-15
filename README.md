# DevTinder

# Deploymemt

- Updated DB Password
- allowed ec2 public IP on mongodb server
- npm install pm2 -g
- pm2 start npm --name "devTinder-backend -- start
- pm2 logs
- pm2 list, pm2 flush <name>, pm2 stop <name>, pm2 delete <name>

Frontend = devTinder.com
Backend = devTinder.com:3000 => devTinder.com/api (port 3000 is mapped to path /api) using nginx proxy pass

# Ngnix

    Frontend = http://18.212.120.53/
    Backend = http://18.212.120.53:3000/

    Domain name = devtinder.com => 18.212.120.53

    Frontend = devtinder.com
    Backend = devtinder.com:3000 => devtinder.com/api

    nginx config : open using : sudo nano /etc/nginx/sites-available/default
    edit below lines: .....

    server_name 18.212.120.53;

    location /api/ {
        proxy_pass http://localhost:3000/;  # Pass the request to the Node.js app
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
