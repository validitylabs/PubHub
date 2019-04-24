echo "window.ENV = `jo -- \`env | grep APP_ | sed -r 's/([a-z_0-9]+=0x[0-9a-f]+)/-s \1/gi'\``" > applications/ui/public/app-config.js
cd applications/ui/ && yarn start
