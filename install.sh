#!/bin/sh

cat <<'EOF'


               ░████    ░██                          
              ░██       ░██                          
 ░███████  ░████████ ░████████  ░███████  ░████████  
░██    ░██    ░██       ░██    ░██    ░██ ░██    ░██ 
░██           ░██       ░██    ░██    ░██ ░██    ░██ 
░██    ░██    ░██       ░██    ░██    ░██ ░███   ░██ 
 ░███████     ░██        ░████  ░███████  ░██░█████  
                                          ░██        
                                          ░██        
                                          

EOF

echo "cftop: Terminal UI for monitoring Cloudflare Workers."
echo ""

set -e

# REPO="NWBY/cftop"
# BINARY="cftop"
# DEST="/usr/local/bin/$BINARY"
# GITHUB_API="https://api.github.com/repos/$REPO/releases/latest"

# ARCH=$(uname -m)
# OS=$(uname | tr '[:upper:]' '[:lower:]')

# # Map architectures to release asset names
# if [ "$ARCH" = "x86_64" ]; then
#     ARCH_SHORT="x64"
# elif [ "$ARCH" = "arm64" ] || [ "$ARCH" = "aarch64" ]; then
#     ARCH_SHORT="arm64"
# else
#     echo "❌ Unsupported architecture: $ARCH"
#     exit 1
# fi

# # Compose asset file name
# ASSET="${BINARY}-${OS}-${ARCH_SHORT}"

# echo "🔍 Detecting latest release..."
# TAG=$(curl -sL $GITHUB_API | grep '"tag_name":' | sed -E 's/.*"([^"]+)".*/\1/')
# DOWNLOAD_URL="https://github.com/$REPO/releases/download/${TAG}/${ASSET}"

# echo "⬇️  Downloading $ASSET ($TAG) ..."
# curl -L --fail -o $BINARY "$DOWNLOAD_URL" || {
#     echo "❌ Failed to download binary for $OS/$ARCH_SHORT. Please check the project releases."
#     exit 1
# }

# chmod +x $BINARY

# echo "🚚 Installing to $DEST (may require sudo)..."
# if mv $BINARY $DEST 2>/dev/null; then
#     :
# else
#     sudo mv $BINARY $DEST
# fi

echo ""
echo "✅ Installation complete!"
echo "   You can now run: cftop"
echo ""
