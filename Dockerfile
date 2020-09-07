FROM microsoft/dotnet:2.1-sdk-stretch AS build-env
WORKDIR /app

ARG SDKVersion

# copy server and build
WORKDIR /app/server
RUN mkdir server
COPY server/*.csproj ./
COPY server/NuGet.config ./
RUN dotnet restore

COPY server ./
RUN dotnet publish -c Release -o out

# copy serverAad and build
WORKDIR /app/serverAad
RUN mkdir serverAad
COPY serverAad/*.csproj ./
COPY serverAad/NuGet.config ./
RUN dotnet restore

COPY serverAad ./
RUN dotnet publish -c Release -o out

# build runtime image
FROM zackliu/signalr-test-base

ENV Azure__SignalR__ConnectionString="" \
    DELAY="500" \
    PORT="80" \
    TIMEOUT="60000"

ARG SDKVersion
ENV SDKVersion ${SDKVersion}

# Copy Server and Client
RUN mkdir server client
COPY --from=build-env /app/server/out server/
COPY --from=build-env /app/serverAad/out serverAad/
COPY client client/
RUN cd client && npm install

COPY run.sh run.sh
RUN chmod +x run.sh

CMD ["/bin/bash", "-c", "/run.sh"]
