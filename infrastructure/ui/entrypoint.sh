echo "window.ENV = `jo -- \`env | grep APP_ | sed -r 's/([a-z_0-9]+=0x[0-9a-f]+)/-s \1/gi'\``" > /usr/share/nginx/html/app-config.js
nginx -g "daemon off;"
