# build runtime image
FROM mcr.microsoft.com/dotnet/core/sdk:3.0

ARG SDKVersion
ENV SDKVersion ${SDKVersion}

# E2E test for management SDK
RUN mkdir -p /app/management
WORKDIR /app/management
COPY ManagementE2ETest/* ./

ENV Azure__SignalR__ConnectionString=""

CMD ["dotnet", "test"]