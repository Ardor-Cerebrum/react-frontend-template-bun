#!/bin/bash
set -e

# Ensure dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    bun install
fi

# Start the development server
echo "Starting development server..."
export PORT=1337
exec bun dev
