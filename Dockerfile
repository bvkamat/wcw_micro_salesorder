FROM node
COPY . /app
WORKDIR /app
ENV PORT 3506
CMD ["node", "app.js"]
