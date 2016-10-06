FROM registry.ng.bluemix.net/ibmnode
ENV NODE_ENV production
EXPOSE 3000
ADD ./ssetest.js /ssetest/ssetest.js
CMD ["node", "/ssetest/ssetest.js"]
