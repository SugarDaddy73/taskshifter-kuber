# Build Stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Export the port
EXPOSE 7700

# Copy everything
COPY . ./

# Restore as distinct layers
RUN dotnet restore

# Build and publish a release
RUN dotnet publish -o /publish

# Install EF CLI
RUN dotnet tool install --global dotnet-ef --version 6.0.25
ENV PATH="${PATH}:/root/.dotnet/tools"

# Runtime Stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0-jammy AS final
WORKDIR /app

# Copy published output
COPY --from=build /publish .

# Expose application port
ENV ASPNETCORE_HTTP_PORTS=7700

# Entry point for the application
ENTRYPOINT ["dotnet", "TaskShifter.WebApi.dll"]
