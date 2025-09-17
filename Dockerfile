FROM node:20.19.3
WORKDIR /opt/server/impact-registry-backend
COPY . .
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone && yarn install
EXPOSE 4000
CMD [ "yarn",  "dev" ]