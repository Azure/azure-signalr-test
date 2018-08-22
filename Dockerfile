FROM microsoft/dotnet:2.1-sdk-stretch AS build-env
WORKDIR /app

ARG SDKVersion

# copy csproj and restore as distinct layers
RUN mkdir Server && cd Server/
COPY src/Server/*.csproj ./
RUN dotnet restore

# copy server and build
COPY src/Server ./
RUN dotnet publish -c Release -o out

# build runtime image
FROM microsoft/dotnet:2.1-aspnetcore-runtime
WORKDIR /app
ENV Azure__SignalR__ConnectionString ""
COPY --from=build-env /app/out .
COPY