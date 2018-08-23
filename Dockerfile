FROM microsoft/dotnet:2.1-sdk-stretch AS build-env
WORKDIR /app

ARG SDKVersion

# copy csproj and restore as distinct layers
RUN mkdir server && cd server/
COPY server/*.csproj ./
RUN dotnet restore

# copy server and build
COPY server ./
RUN dotnet publish -c Release -o out

# build runtime image
FROM ubuntu:16.04
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        wget \
        curl

# Install .Net Core Runtime
ENV ASPNETCORE_URLS=http://+:80 \
    DOTNET_RUNNING_IN_CONTAINER=true

RUN wget --no-check-certificate https://packages.microsoft.com/config/ubuntu/16.04/packages-microsoft-prod.deb \
    && dpkg -i packages-microsoft-prod.deb \
    && apt-get install -y apt-transport-https \
    && apt-get update \
    && apt-get install -y aspnetcore-runtime-2.1

# Install Node.js
RUN curl -sL https://deb.nodesource.com/setup_8.x | bash - \
    && apt-get install -y nodejs \
    && apt-get install -y build-essential \
    && npm install -g npm

# Copy Server and Client
RUN mkdir server client
ENV Azure__SignalR__ConnectionString ""
ENV DELAY "500"
ENV PORT "80"
COPY --from=build-env /app/out server/
COPY client client/
RUN cd client && npm install

COPY run.sh run.sh
RUN chmod +x run.sh

CMD ["/bin/bash", "-c", "/run.sh"]
