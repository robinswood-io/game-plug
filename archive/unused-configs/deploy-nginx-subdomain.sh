#!/bin/bash

# Script pour déployer la configuration Nginx de Game Plug sur sous-domaine
# Ce script déploie la configuration pour game-plug.robinswood.io

set -e

echo "📦 Déploiement de la configuration Nginx pour game-plug.robinswood.io..."

# Vérifier que le fichier de configuration existe
if [ ! -f "/home/workspace/game-plug/nginx-game-plug-subdomain.conf" ]; then
    echo "❌ Erreur: Le fichier nginx-game-plug-subdomain.conf n'existe pas"
    exit 1
fi

# Créer le répertoire sites-available si nécessaire
echo "📁 Création du répertoire sites-available..."
sudo mkdir -p /opt/ia-webdev/nginx/sites-available/

# Copier la configuration
echo "📄 Copie de la configuration game-plug.robinswood.io.conf..."
sudo cp /home/workspace/game-plug/nginx-game-plug-subdomain.conf \
    /opt/ia-webdev/nginx/sites-available/game-plug.robinswood.io.conf

# Vérifier les permissions
sudo chmod 644 /opt/ia-webdev/nginx/sites-available/game-plug.robinswood.io.conf
sudo chown root:root /opt/ia-webdev/nginx/sites-available/game-plug.robinswood.io.conf

# Créer un lien symbolique dans sites-enabled
echo "🔗 Création du lien symbolique..."
sudo mkdir -p /opt/ia-webdev/nginx/sites-enabled/
sudo ln -sf /opt/ia-webdev/nginx/sites-available/game-plug.robinswood.io.conf \
    /opt/ia-webdev/nginx/sites-enabled/game-plug.robinswood.io.conf

# Copier dans le conteneur Nginx
echo "📦 Copie de la configuration dans le conteneur Nginx..."
docker cp /opt/ia-webdev/nginx/sites-available/game-plug.robinswood.io.conf \
    rbw-nginx:/opt/ia-webdev/nginx/sites-available/game-plug.robinswood.io.conf

docker cp /opt/ia-webdev/nginx/sites-enabled/game-plug.robinswood.io.conf \
    rbw-nginx:/opt/ia-webdev/nginx/sites-enabled/game-plug.robinswood.io.conf

# Tester la configuration Nginx
echo "🔍 Test de la configuration Nginx..."
docker exec rbw-nginx nginx -t

if [ $? -eq 0 ]; then
    echo "✅ Configuration valide"

    # Recharger Nginx
    echo "🔄 Rechargement de Nginx..."
    docker exec rbw-nginx nginx -s reload

    echo ""
    echo "✅ Déploiement réussi !"
    echo ""
    echo "🌐 L'application est maintenant accessible sur :"
    echo "   https://game-plug.robinswood.io/"
    echo ""
    echo "📊 Vérification :"
    echo "   curl -sk https://game-plug.robinswood.io/api/health"
    echo ""
    echo "⚠️  N'oubliez pas de configurer le DNS pour pointer game-plug.robinswood.io vers votre serveur"
else
    echo "❌ Erreur dans la configuration Nginx"
    exit 1
fi
