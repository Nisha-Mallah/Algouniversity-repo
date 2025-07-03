# Base image
FROM ubuntu:latest

# Install dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    openjdk-11-jdk \
    curl \
    && apt-get clean

# Install Node.js (LTS) and npm from NodeSource
RUN curl -fsSL https://deb.nodesource.com/setup_lts.x | bash - && \
    apt-get install -y nodejs && \
    apt-get clean

# Set up default paths for convenience
RUN ln -s /usr/bin/python3 /usr/bin/python

# Verify installations
RUN python --version && \
    java -version && \
    node --version && \
    npm --version

# Create a directory for code execution
WORKDIR /code

CMD ["/bin/bash"]
