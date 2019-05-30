# build runtime image
FROM ubuntu:16.04
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        wget \
        curl

# Install .Net Core Runtime
ENV ASPNETCORE_URLS=http://+:80 \
    DOTNET_RUNNING_IN_CONTAINER=true

RUN apt-get update -y \
    && wget --no-check-certificate https://packages.microsoft.com/config/ubuntu/16.04/packages-microsoft-prod.deb \
    && dpkg -i packages-microsoft-prod.deb \
    && apt-get install -y apt-transport-https \
    && apt-get update \
    && apt-get install -y aspnetcore-runtime-2.1

# Install Node.js
RUN curl -sL https://deb.nodesource.com/setup_8.x | bash - \
    && apt-get install -y nodejs \
    && apt-get install -y build-essential \
    && npm install -g npm
