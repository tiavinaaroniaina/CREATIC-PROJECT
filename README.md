# CREATIC-PROJECT


##  Structure du projet

```
/
├── backend/       
├── frontend/         
└── bdd/              
```

##  Installation et démarrage

### environnements

- **Node.js** 20.19.5
- **angular** 21.2.7
- **PostgreSQL** (base de données installée et configurée)

---


## 2️⃣ Backend

### Installer les dépendances

```bash
cd backend
npm install

cd frontend
npm install 
```

### Configurer les variables d'environnement

Créer ou modifier le fichier `.env` dans le dossier `backend/` :

```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=votre mdp
DB_NAME=db name
```

### Démarrer le backend

```bash

npm run dev



Le backend sera accessible sur **http://localhost:5000**

---


### Démarrer le frontend

```bash
# Mode développement
ng serve

# Ou avec npm
npm start
```

Le frontend sera accessible sur **http://localhost:4200**


## 👨‍💻 Développement

### Backend
```bash
cd backend
npm run dev
```

### Frontend (dans un autre terminal)
```bash
cd frontend
ng serve
```

Accédez à l'application sur **http://localhost:4200**

---



