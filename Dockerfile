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
FROM signalr-test-base

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
