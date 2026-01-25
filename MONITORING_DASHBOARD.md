# MONITORING DASHBOARD - MIGRATION NESTJS

**Projet:** Game-Plug - Call of Cthulhu RPG Platform
**Date:** 2026-01-24
**Objectif:** Monitorer migration canary Express → NestJS en temps réel

---

## 🎯 OVERVIEW

Ce document décrit les métriques clés à surveiller, les commandes de monitoring, et les dashboards à configurer pendant le déploiement canary.

**Principe:** Détecter toute dégradation avant impact utilisateur visible.

---

## 📊 MÉTRIQUES CLÉS PAR CATÉGORIE

### 1. Performance API (Critique)

| Métrique | Description | Baseline Express | Target NestJS | Alert |
|----------|-------------|------------------|---------------|-------|
| **Latence p50** | Temps réponse médian | ~80ms | ≤ 100ms | > 150ms |
| **Latence p95** | Temps réponse 95e percentile | ~150ms | ≤ 180ms | > 225ms |
| **Latence p99** | Temps réponse 99e percentile | ~300ms | ≤ 400ms | > 450ms |
| **Throughput** | Requêtes par seconde | ~20 req/s | ≥ 20 req/s | < 15 req/s |

**Commandes monitoring:**
```bash
# Latence moyenne (via logs Traefik)
docker logs traefik --tail=1000 2>&1 | \
  grep "game-plug" | \
  awk '{print $NF}' | \
  sed 's/ms//' | \
  awk '{sum+=$1; count++} END {print "Avg latency:", sum/count, "ms"}'

# Throughput temps réel (req/s)
docker logs traefik --tail=100 --timestamps 2>&1 | \
  grep "game-plug" | \
  awk '{print $1}' | \
  cut -d'.' -f1 | \
  uniq -c | \
  awk '{print $1 " req/s"}'

# Latence par endpoint (Top 5 lents)
docker logs game-plug-backend --tail=500 2>&1 | \
  grep -oP '"path":"[^"]+".+"duration":\K\d+' | \
  sort -rn | \
  head -5
```

---

### 2. Taux d'Erreurs (Bloquant)

| Métrique | Description | Baseline | Target | Alert |
|----------|-------------|----------|--------|-------|
| **Erreurs 5xx** | Erreurs serveur (%) | < 0.05% | < 0.1% | > 1% |
| **Erreurs 4xx** | Erreurs client (%) | ~2% | ≤ 2% | > 5% |
| **Timeouts** | Requêtes > 30s | 0 | 0 | > 3/heure |
| **Exceptions** | Non catchées | 0 | 0 | > 1 |

**Commandes monitoring:**
```bash
# Taux erreurs 5xx (dernière heure)
docker logs traefik --since 1h 2>&1 | \
  grep "game-plug" | \
  awk '{
    total++;
    if ($0 ~ /HTTP\/[0-9.]+ 5[0-9]{2}/) errors++
  }
  END {
    printf "5xx rate: %.2f%% (%d/%d)\n", (errors/total)*100, errors, total
  }'

# Erreurs par code HTTP
docker logs game-plug-backend --tail=1000 2>&1 | \
  grep -oP 'statusCode":\K\d+' | \
  sort | \
  uniq -c | \
  sort -rn

# Exceptions non catchées (FATAL)
docker logs game-plug-backend --tail=500 2>&1 | \
  grep -i "fatal\|uncaught\|unhandled" | \
  tail -10

# Timeouts (requêtes > 30s)
docker logs game-plug-backend --tail=500 2>&1 | \
  grep -oP '"duration":\K\d+' | \
  awk '$1 > 30000 {count++} END {print "Timeouts (>30s):", count+0}'
```

---

### 3. Ressources Système (Infrastructure)

| Métrique | Description | Baseline | Limite | Alert |
|----------|-------------|----------|--------|-------|
| **CPU usage** | Utilisation CPU (%) | 30-50% | 80% | > 90% |
| **Memory usage** | RAM utilisée (MB) | 500-800MB | 2GB | > 1.5GB |
| **Memory leak** | Croissance RAM/heure | 0MB/h | 10MB/h | > 50MB/h |
| **Container restarts** | Redémarrages | 0 | 0 | > 1/jour |

**Commandes monitoring:**
```bash
# Ressources temps réel
docker stats game-plug-backend --no-stream --format \
  "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.MemPerc}}"

# Memory usage évolution (dernière heure)
for i in {1..12}; do
  docker stats game-plug-backend --no-stream --format "{{.MemUsage}}"
  sleep 300  # Toutes les 5 min
done

# Vérifier memory leak (croissance constante)
docker stats game-plug-backend --no-stream --format "{{.MemUsage}}" | \
  awk '{print $1}' | \
  sed 's/MiB//' > /tmp/mem_start.txt
# Attendre 1h
docker stats game-plug-backend --no-stream --format "{{.MemUsage}}" | \
  awk '{print $1}' | \
  sed 's/MiB//' > /tmp/mem_end.txt
# Comparer
paste /tmp/mem_start.txt /tmp/mem_end.txt | \
  awk '{printf "Memory growth: %.2f MB/h\n", $2-$1}'

# Container restarts (uptime)
docker ps --filter name=game-plug-backend --format "{{.Status}}"
# → "Up X hours" (si < 1h après deploy, possiblement restarté)

# Historique restarts
docker inspect game-plug-backend | \
  jq -r '.[0].RestartCount'
```

---

### 4. Base de Données (Backend)

| Métrique | Description | Baseline | Limite | Alert |
|----------|-------------|----------|--------|-------|
| **Connexions actives** | Pool PostgreSQL | 5-15 | 50 | > 40 |
| **Query latency** | Temps requêtes SQL | 5-20ms | 100ms | > 200ms |
| **Slow queries** | Requêtes > 1s | 0 | 0 | > 5/heure |
| **Deadlocks** | Verrous DB | 0 | 0 | > 1 |

**Commandes monitoring:**
```bash
# Connexions actives NestJS
docker exec dev_postgres psql -U devuser -d game_plug -c "
SELECT
  COUNT(*) as total_connections,
  COUNT(*) FILTER (WHERE state = 'active') as active,
  COUNT(*) FILTER (WHERE state = 'idle') as idle
FROM pg_stat_activity
WHERE application_name LIKE '%nest%' OR usename = 'devuser';
"

# Top 10 requêtes lentes (> 100ms)
docker exec dev_postgres psql -U devuser -d game_plug -c "
SELECT
  LEFT(query, 60) as query_preview,
  calls,
  ROUND(mean_exec_time::numeric, 2) as avg_time_ms
FROM pg_stat_statements
WHERE mean_exec_time > 100
ORDER BY mean_exec_time DESC
LIMIT 10;
"
# Note: Nécessite pg_stat_statements activé

# Locks & deadlocks
docker exec dev_postgres psql -U devuser -d game_plug -c "
SELECT
  COUNT(*) as locked_queries
FROM pg_locks
WHERE NOT granted;
"

# Slow queries en cours (> 1s)
docker exec dev_postgres psql -U devuser -d game_plug -c "
SELECT
  pid,
  NOW() - query_start AS duration,
  LEFT(query, 100) as query
FROM pg_stat_activity
WHERE state = 'active'
  AND NOW() - query_start > interval '1 second'
ORDER BY duration DESC;
"
```

---

### 5. Redis Cache (Performance)

| Métrique | Description | Baseline | Target | Alert |
|----------|-------------|----------|--------|-------|
| **Hit rate** | Taux cache hit (%) | 80-90% | ≥ 75% | < 60% |
| **Memory used** | RAM Redis | 50-100MB | 500MB | > 800MB |
| **Evictions** | Clés évictées | 0-10/h | < 50/h | > 100/h |
| **Connexions** | Clients connectés | 2-5 | 20 | > 15 |

**Commandes monitoring:**
```bash
# Stats Redis globales
docker exec dev_redis redis-cli -a redis_dev_password INFO stats | \
  grep -E "keyspace_hits|keyspace_misses|evicted_keys|connected_clients"

# Calcul hit rate
docker exec dev_redis redis-cli -a redis_dev_password INFO stats | \
  awk -F: '
    /keyspace_hits/ {hits=$2}
    /keyspace_misses/ {misses=$2}
    END {
      total = hits + misses
      if (total > 0) {
        printf "Cache hit rate: %.2f%%\n", (hits/total)*100
      }
    }
  '

# Memory usage Redis
docker exec dev_redis redis-cli -a redis_dev_password INFO memory | \
  grep -E "used_memory_human|maxmemory_human"

# Top clés volumineuses
docker exec dev_redis redis-cli -a redis_dev_password --bigkeys

# Connexions actives
docker exec dev_redis redis-cli -a redis_dev_password CLIENT LIST | wc -l
```

---

### 6. Métriques Business (Fonctionnel)

| Métrique | Description | Baseline | Target | Alert |
|----------|-------------|----------|--------|-------|
| **Sessions créées** | Nouvelles parties/jour | ~50 | ≥ 50 | < 30 |
| **Utilisateurs actifs** | Connexions/jour | ~20 | ≥ 20 | < 15 |
| **Personnages créés** | Nouveaux chars/jour | ~30 | ≥ 30 | < 20 |
| **Dés lancés** | Rolls/jour | ~200 | ≥ 200 | < 150 |
| **Générations IA** | Avatars IA/jour | ~10 | ≥ 10 | < 5 |

**Commandes monitoring:**
```bash
# Sessions créées (24h)
docker exec dev_postgres psql -U devuser -d game_plug -c "
SELECT COUNT(*) as sessions_today
FROM sessions
WHERE created_at > NOW() - INTERVAL '24 hours';
"

# Utilisateurs actifs (24h)
docker exec dev_postgres psql -U devuser -d game_plug -c "
SELECT COUNT(DISTINCT user_id) as active_users_today
FROM sessions
WHERE created_at > NOW() - INTERVAL '24 hours';
"

# Personnages créés (24h)
docker exec dev_postgres psql -U devuser -d game_plug -c "
SELECT COUNT(*) as characters_today
FROM characters
WHERE created_at > NOW() - INTERVAL '24 hours';
"

# Dés lancés (approximation via logs)
docker logs game-plug-backend --since 24h 2>&1 | \
  grep -c "POST /api/dice/roll"

# Générations IA (24h)
docker logs game-plug-backend --since 24h 2>&1 | \
  grep -c "ai/generate-avatar"
```

---

## 🖥️ DASHBOARDS RECOMMANDÉS

### Dashboard 1: Overview Santé Système

**Panels:**
1. **Status Services** (gauge)
   - Express: UP/DOWN
   - NestJS: UP/DOWN
   - PostgreSQL: UP/DOWN
   - Redis: UP/DOWN

2. **Distribution Trafic** (pie chart)
   - % Express
   - % NestJS

3. **Taux Erreurs Global** (timeseries)
   - 5xx Express (ligne rouge)
   - 5xx NestJS (ligne orange)
   - Seuil alert 1% (ligne pointillée)

4. **Latence Comparée** (timeseries)
   - p95 Express (ligne bleue)
   - p95 NestJS (ligne verte)
   - Baseline +20% (ligne pointillée)

**Commandes:**
```bash
# Status services (JSON)
echo "{
  \"express\": \"$(docker inspect game-plug --format '{{.State.Status}}')\",
  \"nestjs\": \"$(docker inspect game-plug-backend --format '{{.State.Status}}')\",
  \"postgres\": \"$(docker exec dev_postgres pg_isready -q && echo UP || echo DOWN)\",
  \"redis\": \"$(docker exec dev_redis redis-cli -a redis_dev_password PING 2>/dev/null | grep -q PONG && echo UP || echo DOWN)\"
}" | jq

# Distribution trafic (dernières 1000 requêtes)
docker logs traefik --tail=1000 2>&1 | \
  grep "game-plug" | \
  grep -oP 'upstream="[^"]+' | \
  sort | \
  uniq -c | \
  awk '{
    if ($2 ~ /express/) express=$1
    else if ($2 ~ /nest/) nest=$1
  }
  END {
    total = express + nest
    printf "Express: %.1f%% (%d)\n", (express/total)*100, express
    printf "NestJS: %.1f%% (%d)\n", (nest/total)*100, nest
  }'
```

---

### Dashboard 2: Performance Détaillée

**Panels:**
1. **Latence par Endpoint** (bar chart)
   - Top 10 endpoints lents (p95)
   - Comparaison Express vs NestJS

2. **Throughput** (timeseries)
   - Requêtes par seconde
   - Par service (Express/NestJS)

3. **Ressources CPU/Memory** (area chart)
   - CPU % Express
   - CPU % NestJS
   - Memory MB Express
   - Memory MB NestJS

4. **Database Performance** (gauge)
   - Connexions actives
   - Query latency moyenne
   - Pool saturation %

**Commandes:**
```bash
# Top 10 endpoints par latence
docker logs game-plug-backend --tail=2000 2>&1 | \
  grep -oP '"path":"[^"]+".+"duration":\K\d+' | \
  awk '{sum[$1]+=$2; count[$1]++}
       END {for (endpoint in sum)
         printf "%s: %.2f ms (avg)\n", endpoint, sum[endpoint]/count[endpoint]
       }' | \
  sort -t: -k2 -rn | \
  head -10

# Throughput 1 min (Express vs NestJS)
echo "Express RPS:" && \
docker logs game-plug --since 1m 2>&1 | \
  grep -c "HTTP" | \
  awk '{print $1/60}'

echo "NestJS RPS:" && \
docker logs game-plug-backend --since 1m 2>&1 | \
  grep -c "HTTP" | \
  awk '{print $1/60}'
```

---

### Dashboard 3: Détection Anomalies

**Panels:**
1. **Erreurs par Type** (stacked bar)
   - 400 Bad Request
   - 401 Unauthorized
   - 404 Not Found
   - 500 Internal Error
   - 502 Bad Gateway
   - 503 Service Unavailable

2. **Memory Leak Detection** (line chart)
   - Memory usage (échantillons 5 min)
   - Tendance linéaire (détection leak)

3. **Container Restarts** (counter)
   - Nombre redémarrages 24h
   - Temps uptime actuel

4. **Slow Queries** (table)
   - Top requêtes SQL > 100ms
   - Fréquence d'exécution

**Commandes:**
```bash
# Erreurs par code HTTP (dernière heure)
docker logs traefik --since 1h 2>&1 | \
  grep "game-plug" | \
  grep -oP 'HTTP/[0-9.]+ \K\d+' | \
  sort | \
  uniq -c | \
  sort -rn

# Détection memory leak (croissance linéaire)
# Collecter 12 échantillons sur 1h (toutes les 5 min)
for i in {1..12}; do
  docker stats game-plug-backend --no-stream --format "{{.MemUsage}}" | \
    awk '{print $1}' | \
    sed 's/MiB//' >> /tmp/mem_trend.txt
  sleep 300
done

# Analyser tendance (régression linéaire basique)
awk '{sum+=$1; sumsq+=$1*$1} END {
  mean = sum/NR
  variance = (sumsq - sum*sum/NR) / NR
  stddev = sqrt(variance)
  printf "Memory trend: mean=%.2f MB, stddev=%.2f\n", mean, stddev
  if (stddev > 50) print "⚠️ WARNING: Memory leak suspected!"
}' /tmp/mem_trend.txt

# Container uptime
docker inspect game-plug-backend --format '{{.State.StartedAt}}' | \
  xargs -I {} date -d {} +%s | \
  awk '{print "Uptime:", (systime() - $1)/3600, "hours"}'
```

---

## 🔔 ALERTES AUTOMATIQUES

### Configuration Alerting (Prometheus + Alertmanager)

**Alert 1: Taux erreur 5xx critique**
```yaml
# prometheus-alerts.yml
groups:
  - name: game-plug-backend
    interval: 30s
    rules:
      - alert: HighErrorRate
        expr: |
          (
            sum(rate(http_requests_total{service="game-plug-backend",status=~"5.."}[5m]))
            /
            sum(rate(http_requests_total{service="game-plug-backend"}[5m]))
          ) > 0.01
        for: 5m
        labels:
          severity: critical
          phase: canary
        annotations:
          summary: "NestJS error rate > 1%"
          description: "5xx errors: {{ $value | humanizePercentage }}"
```

**Alert 2: Memory leak détecté**
```yaml
      - alert: MemoryLeak
        expr: |
          (
            container_memory_usage_bytes{name="game-plug-backend"}
            -
            container_memory_usage_bytes{name="game-plug-backend"} offset 1h
          ) > 100000000  # 100MB growth in 1h
        for: 10m
        labels:
          severity: warning
          phase: canary
        annotations:
          summary: "NestJS memory leak suspected"
          description: "Memory growth: {{ $value | humanize1024 }}B/hour"
```

**Alert 3: Container down**
```yaml
      - alert: ContainerDown
        expr: |
          up{job="docker",container_name="game-plug-backend"} == 0
        for: 1m
        labels:
          severity: critical
          phase: canary
        annotations:
          summary: "NestJS container DOWN"
          description: "Service unavailable for 1+ minute"
```

---

## 📈 SCRIPT MONITORING AUTOMATISÉ

### Monitoring en continu (toutes les 30s)

```bash
#!/bin/bash
# /srv/workspace/scripts/monitor-canary.sh

INTERVAL=30
LOG_FILE="/var/log/game-plug/canary-monitor.log"

echo "=== Game-Plug Canary Monitoring Started ===" | tee -a $LOG_FILE
echo "Timestamp: $(date)" | tee -a $LOG_FILE

while true; do
  TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

  # 1. Health checks
  EXPRESS_HEALTH=$(curl -s http://localhost:5000/api/health 2>/dev/null | jq -r '.status // "DOWN"')
  NESTJS_HEALTH=$(curl -s http://localhost:4000/api/health 2>/dev/null | jq -r '.status // "DOWN"')

  # 2. Métriques ressources
  NESTJS_STATS=$(docker stats game-plug-backend --no-stream --format "{{.CPUPerc}}|{{.MemUsage}}")
  CPU=$(echo $NESTJS_STATS | cut -d'|' -f1)
  MEM=$(echo $NESTJS_STATS | cut -d'|' -f2 | awk '{print $1}')

  # 3. Taux erreur (dernières 100 requêtes)
  ERROR_RATE=$(docker logs game-plug-backend --tail=100 2>&1 | \
    awk '/statusCode/ {
      total++
      if ($0 ~ /statusCode":5[0-9]{2}/) errors++
    }
    END {
      if (total > 0) printf "%.2f%%", (errors/total)*100
      else print "0.00%"
    }')

  # 4. Connexions BDD
  DB_CONNS=$(docker exec dev_postgres psql -U devuser -d game_plug -t -c \
    "SELECT COUNT(*) FROM pg_stat_activity WHERE application_name LIKE '%nest%';" 2>/dev/null | xargs)

  # 5. Output
  echo "[$TIMESTAMP] Express: $EXPRESS_HEALTH | NestJS: $NESTJS_HEALTH | CPU: $CPU | Mem: $MEM | Errors: $ERROR_RATE | DB: $DB_CONNS conns" | \
    tee -a $LOG_FILE

  # 6. Alertes
  if [ "$NESTJS_HEALTH" != "ok" ]; then
    echo "🚨 ALERT: NestJS health check FAILED!" | tee -a $LOG_FILE
  fi

  if [[ "${CPU%\%}" -gt 90 ]]; then
    echo "⚠️ WARNING: High CPU usage ($CPU)" | tee -a $LOG_FILE
  fi

  if [[ "${ERROR_RATE%\%}" > 1 ]]; then
    echo "🚨 ALERT: High error rate ($ERROR_RATE)" | tee -a $LOG_FILE
  fi

  sleep $INTERVAL
done
```

**Lancer monitoring:**
```bash
# En foreground (terminal)
bash /srv/workspace/scripts/monitor-canary.sh

# En background (tmux/screen)
screen -dmS canary-monitor bash /srv/workspace/scripts/monitor-canary.sh

# Vérifier logs
tail -f /var/log/game-plug/canary-monitor.log
```

---

## 🧪 TESTS DE CHARGE

### Simuler charge production

```bash
# Test 1: Charge légère (baseline)
ab -n 1000 -c 10 -H "Authorization: Bearer $JWT_TOKEN" \
  https://game-plug.rbw.ovh/api/sessions

# Test 2: Charge moyenne (2x baseline)
ab -n 5000 -c 25 -H "Authorization: Bearer $JWT_TOKEN" \
  https://game-plug.rbw.ovh/api/sessions

# Test 3: Charge haute (stress test)
ab -n 10000 -c 50 -H "Authorization: Bearer $JWT_TOKEN" \
  https://game-plug.rbw.ovh/api/sessions

# Test 4: Endpoints critiques (scénario utilisateur)
# Login
ab -n 500 -c 10 -p login.json -T application/json \
  https://game-plug.rbw.ovh/api/auth/login

# Create session
ab -n 300 -c 5 -p session.json -T application/json \
  -H "Authorization: Bearer $JWT_TOKEN" \
  https://game-plug.rbw.ovh/api/sessions

# Roll dice
ab -n 1000 -c 20 -p dice.json -T application/json \
  https://game-plug.rbw.ovh/api/dice/roll
```

**Analyser résultats:**
```bash
# Extraire métriques clés
ab -n 1000 -c 10 https://game-plug.rbw.ovh/api/health | \
  grep -E "Requests per second|Time per request|Failed requests"

# Exemple output:
# Requests per second:    45.32 [#/sec] (mean)
# Time per request:       22.06 [ms] (mean)
# Failed requests:        0
```

---

## 📞 CHECKLIST MONITORING QUOTIDIEN

### Matin (09:00) - Santé générale

- [ ] Vérifier uptime services: `docker ps | grep game-plug`
- [ ] Vérifier logs erreurs: `docker logs game-plug-backend --tail=500 | grep -i error`
- [ ] Vérifier métriques ressources: `docker stats game-plug-backend --no-stream`
- [ ] Vérifier taux erreur 24h: (commande taux erreur ci-dessus)
- [ ] Vérifier métriques business: (sessions créées, users actifs)

### Midi (12:00) - Performance

- [ ] Latence p95: Comparer baseline Express
- [ ] Throughput: Vérifier stable
- [ ] Distribution trafic: Confirmer % attendu (10%, 25%, etc.)
- [ ] Database: Vérifier connexions < 20

### Soir (18:00) - Tendances

- [ ] Memory trend: Vérifier croissance < 10MB/h
- [ ] CPU trend: Vérifier moyenne < 70%
- [ ] Slow queries: Identifier requêtes > 100ms
- [ ] Cache hit rate: Vérifier > 75%

### Avant Phase suivante (GO/NO-GO)

- [ ] Tous checks quotidiens OK 48h consécutives
- [ ] Aucun restart container
- [ ] Aucune alerte critique
- [ ] Métriques business stables ou meilleures
- [ ] Équipe consensus GO

---

## 📚 OUTILS COMPLÉMENTAIRES

### Grafana + Prometheus (recommandé)

**Installation rapide:**
```bash
# docker-compose.monitoring.yml
services:
  prometheus:
    image: prom/prometheus:latest
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus
    ports:
      - "9090:9090"

  grafana:
    image: grafana/grafana:latest
    volumes:
      - grafana_data:/var/lib/grafana
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin

volumes:
  prometheus_data:
  grafana_data:
```

**Prometheus config:**
```yaml
# prometheus.yml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'docker'
    static_configs:
      - targets: ['cadvisor:8080']

  - job_name: 'nestjs'
    static_configs:
      - targets: ['game-plug-backend:4000']
    metrics_path: /metrics
```

---

## ✅ RÉSUMÉ MÉTRIQUES CRITIQUES

| Catégorie | Métrique Principale | Commande Rapide | Seuil Alert |
|-----------|---------------------|-----------------|-------------|
| **Performance** | Latence p95 | `docker logs traefik` + calcul | > Express + 50% |
| **Erreurs** | Taux 5xx | `docker logs \| grep 5[0-9]{2}` | > 1% |
| **Ressources** | Memory usage | `docker stats --no-stream` | > 1.5GB |
| **Database** | Connexions actives | `psql -c "SELECT COUNT(*)"` | > 40 |
| **Business** | Sessions/jour | `psql -c "SELECT COUNT(*)"` | < 30 |

**Objectif:** Monitorer ces 5 métriques minimum toutes les 4h pendant déploiement canary.

---

**Auteur:** Claude Sonnet 4.5
**Date:** 2026-01-24
**Version:** 1.0
**Projet:** game-plug - Call of Cthulhu RPG Platform
