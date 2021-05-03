FROM ubuntu:20.04

# squelch idiotic tzdata prompt
ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update \
    && apt-get install bash -y \
    && apt-get install curl -y \
    && apt-get install python3-minimal -y \
    && curl -s -O https://deb.nodesource.com/node_12.x/pool/main/n/nodejs/nodejs_12.20.2-deb-1nodesource1_amd64.deb \
    && dpkg -i nodejs_12.20.2-deb-1nodesource1_amd64.deb \
    && rm nodejs_12.20.2-deb-1nodesource1_amd64.deb \
    && mkdir -p /opt/objectstore \
    && adduser -u 1000 objectstore \
    && chmod 700 -R /opt/objectstore \
    && chown -R objectstore /opt/objectstore

# copy the build zip in, unpack, stripping the first folder level when unzipping, then clean up build.zip
COPY ./build.tar.gz /tmp
RUN tar -xzvf /tmp/build.tar.gz -C /opt/objectstore --strip 2 \
    && rm /tmp/build.tar.gz

USER objectstore

CMD cd /opt/objectstore && npm start
