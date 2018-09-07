FROM microsoft/dotnet:2.1-sdk-stretch AS build-env
WORKDIR /app

ARG SDKVersion

# copy csproj and restore as distinct layers
RUN mkdir server && cd server/
COPY server/*.csproj ./
COPY server/NuGet.config ./
RUN dotnet restore

# copy server and build
COPY server ./
RUN dotnet publish -c Release -o out

# build runtime image
FROM signalr-test-base

ENV Azure__SignalR__ConnectionString="" \
    DELAY="500" \
    PORT="80" \
    TIMEOUT="60000"

ARG SDKVersion
ENV SDKVersion ${SDKVersion}

# Copy Server and Client
RUN mkdir server client
COPY --from=build-env /app/out server/
COPY client client/
RUN cd client && npm install

COPY run.sh run.sh
RUN chmod +x run.sh

CMD ["/bin/bash", "-c", "/run.sh"]
