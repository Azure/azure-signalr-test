FROM microsoft/dotnet:2.1-sdk-stretch AS build-env
WORKDIR /app

ARG SDKVersion
ENV SDKVersion ${SDKVersion}

# copy server and build
WORKDIR /app/server
RUN mkdir server
COPY server/*.csproj ./
COPY server/NuGet.config ./
RUN dotnet restore

COPY server ./
RUN dotnet publish -c Release -o out

# build runtime image
FROM zackliu/signalr-test-base

ENV Azure__SignalR__ConnectionString="" \
    DELAY="500" \
    TIMEOUT="60000"

ARG SDKVersion
ENV SDKVersion ${SDKVersion}

# Copy Server and Client
RUN mkdir server SDKTest
COPY --from=build-env /app/server/out server/

COPY SDKTest SDKTest/
RUN cd SDKTest && npm install && cd ..

COPY run*.sh /
RUN chmod +x run*.sh

CMD ["/bin/bash", "-c", "/run.sh"]
