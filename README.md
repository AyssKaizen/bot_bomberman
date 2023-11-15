# Qu'est ce donc que ce projet ?

Ce projet contient à la fois des instructions et des modèles de fichier afin de vous faire gagner du temps dans le contexte du coding challenge de l'école du dev.

# Conventions

Les chaînes de type `<...>` dans les fichiers de configuration doivent être remplacées par leur pendant équivalent dans votre contexte. Ainsi, `<path/to/public/directory>` doit être remplacée par un chemin d'accès vers un répertoire qui contient les fichiers ou les scripts qui doivent être accessibles à l'aide de `HTTP`.  
Les fichiers préfixés par `java.` et `php.` sont destinés respectivement à être utilisés dans un projet basé sur `java` ou `PHP`.

# Comment utiliser ce projet ?

Il y a plusieurs solutions :

1. Cloner le projet ;
2. Supprimer le répertoire `.git` dans le clone obtenu ;
3. Supprimer les fichiers qui ne vous sont pas utiles ;
4. Renommer les fichiers qui vous sont utiles (cf ci-dessous) ;
5. `git init --initial-branch=main && git add . && git commit -m "Initial import"`.

Une autre est de :

1. Cloner le projet ;
2. Copier depuis le clone ainsi obtenu dans le répertoire de votre projet les fichiers qui lui sont nécessaires.

# À propos du Dockerfile

Cette formation n'a pas pour but de vous faire découvrir `docker` ou à vous apprendre à vous en servir dans le cadre d'un développement.  
Cependant, le déploiement de votre bot va nécessiter sa mise en œuvre.  
Donc, afin de vous faire gagner du temps, les formateurs mettent à votre disposition un modèle de `Dockerfile`, qui, même s'il ne fonctionne pas en l'état, devrait vous permettre après quelques adaptations en fonction de votre contexte, de créer une image de votre bot.  
Évidemment, le fichier `php.Dockerfile` est adapté à un bot développé à l'aide de `PHP`, et `java.Dockerfile` est adapté à un bot développé à  l'aide de `Java` (attention, les choix effectués dans ces `Dockerfile` NE SONT PAS des préconisations ou des recommandations, vous êtes libre de les adapter partiellement ou totalement à vos besoins).  
Le fichier correspondant à vos besoins doit être renommé en `Dockerfile` pour être pris en compte.  
Les formateurs sont évidemment à votre disposition pour vous expliquer sa trame s'il vous reste des questions après avoir lu [la documentation correspondante](https://docs.docker.com/engine/reference/builder/) pour y chercher les réponses à vos interrogations.  
Une fois ce `Dockerfile` adapté à votre contexte, vous pourrez construire votre image à l'aide de la commande suivante :

## Construction d'une image de votre bot

### Sur x86 (amd64) et sur Apple M1 ou M2, pro ou pas, max ou pas, ultra ou pas (arm64)

```
$ docker build -t hub-docker.norsys.fr/ecole_du_dev/<image name>:<image tag> .
```

### Multi-plateforme (amd64 et arm64) avec envoie dans le dépôt d'image de Norsys

Il faut commencer par exécuter (une seule fois) la commande suivante afin de créer le "builder" adéquat et l'utiliser pour les constructions qui vont suivre :

```
$ docker buildx create --name my-awesome-php-bot --driver docker-container --bootstrap --node <name-of-your-php-bot> --platform linux/amd64,linux/arm64 --use
```

La construction de l'image peut alors se lancer à l'aide de la commande suivante :

```
$ docker buildx build --platform linux/arm64,linux/amd64 -t hub-docker.norsys.fr/ecole_du_dev/<image name>:<image tag> --push .
```

## Pour envoyer votre image dans le dépôt d'image de Norsys

Pour pousser l'image construite à l'aide de la commande précédente dans le dépôt d'image de Norsys, il faut commencer par vous authentifier sur le dépôt d'image Norsys à l'aide de vos identifiants Norsys (sans `@norsys.fr`) et de la commande suivante :

```
$  docker login hub-docker.norsys.fr
```

Une fois votre authentification effectuée avec succès, la commande à exécuter ensuite est :

```
$ docker push hub-docker.norsys.fr/<image name>:<image tag>
```

Vous pouvez vérifier que votre image est effectivement dans le dépôt à l'aide de [l'interface adéquate](https://portus.norsys.fr) et après vous y être authentifié à l'aide de vos identifiants Norsys (toujours sans `@norsys.fr`).

## Pour exécuter votre image

Pour exécuter l'image que vous avez contruite, la commande est la suivante :

```
$ docker run hub-docker.norsys.fr/ecole_du_dev/<image name>:<image tag>
```

## Pour plus d'aide à propos de l'utilisation de docker

Si vous désirez plus d'informations à propos de chacune de ses commandes, la commande `docker help <command>` est votre meilleure amie, suivi de près par les formateurs.

# À propos du déploiement

Votre bot doit être déployé sur [https://factory.norsys.fr](https://factory.norsys.fr).  
Pour cela, après vous être connecté au VPN, il vous faut créer un nouveau "workload" dans le cluster `norsys` et le projet `norsys-ecoledudev` à l'aide du bouton `Deploy` de l'onglet `Workloads` avec les paramètres suivants :

- `Name` : Ce que vous voulez ;
- `Docker image` : `proxy-docker.norsys.fr/ecole_du_dev/<your bot's docker image>` ;
- `Namespace` : `dev-arena-bots`

Une fois le "workload" créé, il est nécessaire de définir l'"ingress" correspondant, pour cela, il vous faut utiliser le bouton `Add Ingress` de l'onglet `Load Balancing` avec les paramètres suivants :

- `Name` : `<nom de votre bot>-ingress` ;
- `Namespace` : `dev-arena-bots`

Ensuite :

1. Cliquez sur `Specify a hostname to use` et indiquez le nom d'hôte sur leque vous voulez que votre bot soit accessible en HTTP (attention, ce nom d'hôte doit obligatoirement se terminer par `.app.norsys.io`) ;
2. Définissez `Path` à `/`, `Target` avec le nom du "workload" que vous avez précédemment défini, et `Port` à `80` ;
3. Cliquez sur le bouton "Save".

Normalement, votre bot est maintenant fonctionnel et devrait répondre à des requêtes HTTP effectuées sur le nom d'hôte que vous avez défini !

# À propos de l'intégration continue

Toujours pour vous faire gagner du temps au cours de cette formation, les formateurs mettent à votre disposition un fichier `.gitlab-ci.yml` pour configurer rapidement une intégration continue.  
Tout comme dans le cas du `Dockerfile`, il sera cependant nécessaire de l'adapter un minimum à vos besoins.  
Les formateurs sont également à votre disposition pour vous expliquer sa trame s'il vous reste des questions après avoir lu [la documentation correspondante](https://docs.gitlab.com/ee/ci/) pour y chercher les réponses à vos interrogations.
Évidemment, le fichier `php.gitlab-ci.yml` est adapté à un bot développé à l'aide de `PHP`, et `java.gitlab-ci.yml` est adapté à un bot développé à  l'aide de `Java` (attention, les choix effectués dans ces `Dockerfile` NE SONT PAS des préconisations ou des recommandations, vous êtes libre de les adapter partiellement ou totalement à vos besoins).  
Le fichier correspondant à vos besoins doit être renommé en `.gitlab-ci.yml` pour être pris en compte.  
La valeur des variables suivantes doivent être définies dans votre fichier `.gitlab-ci.yml` :

- `DOCKER_IMAGE`: nom de l'image docker de votre bot défini dans votre "workload" (cf ci-dessus) ;
- `DOCKER_TAG`: tag de l'image docker de votre bot défini dans votre "workload" (cf ci-dessus) ;
- `NORSYS_FACTORY_WORKLOAD`: nom de votre "workload" (cf ci-dessus).
