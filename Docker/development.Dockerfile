FROM node:20.5.1

WORKDIR /usr/src/app

COPY ["package.json","package-lock.json","/usr/src/app/"]


RUN npm install
COPY ["./src/","/usr/src/app/src/"]
COPY ["nest-cli.json","tsconfig.build.json","tsconfig.json","/usr/src/app/"]

RUN npm run build

EXPOSE 3000

# CMD [ "npm","run","dev" ]

# Comando por defecto para iniciar la aplicación
# CMD ["/bin/sh", "-c", "npm run migration:run && npm run seed && npm run dev"]