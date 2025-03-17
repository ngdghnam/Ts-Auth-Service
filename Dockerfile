FROM node:lts-alpine
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
# Install ALL dependencies (including dev) for build
RUN npm install && mv node_modules ../
COPY . .
# Run the build
RUN npm run build
# Then prune dev dependencies for production
RUN npm prune --production
EXPOSE 3000
RUN chown -R node /usr/src/app
USER node
CMD ["node", "dist/server.js"]