# 📦 Node.js CI/CD Pipeline with MySQL, Docker, GitHub Actions, and AWS ECR

This project demonstrates a complete CI/CD pipeline for a **Node.js backend** connected to a **MySQL** database, built and deployed using **Docker**, **GitHub Actions**, and **AWS ECR**.

---

## 🎯 Objective

* Build a Dockerized Node.js backend that connects to a MySQL database.
* Push the Docker image to AWS ECR.
* Deploy to a remote EC2 server (staging) using GitHub Actions + SSH.
* Use a local MySQL instance running on the EC2.

---

## 🧾 Prerequisites

### ✅ On AWS:

* An AWS account
* A created **ECR repository** (e.g., `nodeproject`)
* A running EC2 instance (Ubuntu)
* MySQL installed and configured to accept remote Docker connections
* Port `3306` open in EC2 Security Group (for MySQL)
* Port `3000` open in EC2 SG (for Node.js app)

### ✅ On Local Machine:

* Node.js and npm
* Docker & Docker Compose
* GitHub repository with this project code
* `.env` file (see `.env.example`)

---

## 📂 Project Structure

```
node_project/
├── app.js
├── Dockerfile
├── docker-compose.yml
├── package.json
├── .env.example
├── .gitignore
├── deploy.sh
└── .github/
    └── workflows/
        └── staging-deploy.yml
```

---

## 🧪 Local Development (with local Docker)

### 1. Create `.env` from `.env.example`

```bash
cp .env.example .env
```

### 2. Start app using Docker

```bash
docker-compose up --build
```

Access app at: `http://localhost:3000`

---

## ☁️ EC2 Setup (Staging Server)

### 1. SSH into your EC2

```bash
ssh -i your-key.pem ubuntu@<EC2_PUBLIC_IP>
```

### 2. Install Docker

```bash
sudo apt update
sudo apt install docker.io -y
```

### 3. Install MySQL

```bash
sudo apt install mysql-server -y
```

### 4. Configure MySQL to allow Docker connection

Edit:

```bash
sudo nano /etc/mysql/mysql.conf.d/mysqld.cnf
```

Change:

```
bind-address = 0.0.0.0
```

Then:

```bash
sudo systemctl restart mysql
```

### 5. Create MySQL User and Database

```sql
CREATE DATABASE testdb;
CREATE USER 'node_project'@'%' IDENTIFIED BY 'yourpassword';
GRANT ALL PRIVILEGES ON testdb.* TO 'node_project'@'%';
FLUSH PRIVILEGES;
```

---

## 🔐 GitHub Secrets to Set

Go to **GitHub → Repo → Settings → Secrets → Actions** and add:

| Name                     | Value                      |
| ------------------------ | -------------------------- |
| AWS\_ACCESS\_KEY\_ID     | Your AWS key               |
| AWS\_SECRET\_ACCESS\_KEY | Your AWS secret            |
| AWS\_REGION              | us-west-2 (or your region) |
| ECR\_REPOSITORY\_URI     | `<your_id>.dkr.ecr...`     |
| EC2\_HOST                | Public IP of your EC2      |
| EC2\_SSH\_KEY            | Contents of your .pem file |
| DB\_HOST                 | `172.17.0.1` (or EC2 IP)   |
| DB\_USER                 | `node_project`             |
| DB\_PASSWORD             | `yourpassword`             |
| DB\_NAME                 | `testdb`                   |
| PORT                     | `3000`                     |
| THIRD\_PARTY\_API\_KEY   | Optional API key (example) |

---

## 🔁 GitHub Actions CI/CD Workflow

### `.github/workflows/staging-deploy.yml` will:

1. Trigger on push to `staging` branch
2. Build and tag Docker image
3. Push image to AWS ECR
4. SSH into EC2
5. Create and execute `deploy.sh` on remote

### SSH Block of the Workflow:

```yaml
    - name: Deploy to EC2 via SSH
      uses: appleboy/ssh-action@v1.0.0
      with:
        host: ${{ secrets.EC2_HOST }}
        username: ubuntu
        key: ${{ secrets.EC2_SSH_KEY }}
        script: |
          echo "💻 Creating deploy.sh..."
          cat << 'EOF' > deploy.sh
          #!/bin/bash
          set -e
          echo "🔐 Logging in to AWS ECR..."
          aws ecr get-login-password --region ${{ secrets.AWS_REGION }} | \
          docker login --username AWS --password-stdin ${{ secrets.ECR_REPOSITORY_URI }}

          echo "📥 Pulling Docker image..."
          docker pull ${{ secrets.ECR_REPOSITORY_URI }}:latest

          echo "🧹 Stopping old container..."
          docker stop node-app || true
          docker rm node-app || true

          echo "🚀 Running new container..."
          docker run -d --name node-app -p 3000:3000 \
            -e DB_HOST=${{ secrets.DB_HOST }} \
            -e DB_USER=${{ secrets.DB_USER }} \
            -e DB_PASSWORD=${{ secrets.DB_PASSWORD }} \
            -e DB_NAME=${{ secrets.DB_NAME }} \
            -e PORT=${{ secrets.PORT }} \
            -e THIRD_PARTY_API_KEY=${{ secrets.THIRD_PARTY_API_KEY }} \
            ${{ secrets.ECR_REPOSITORY_URI }}:latest
          echo "✅ Deployment Complete!"
          EOF

          chmod +x deploy.sh
          ./deploy.sh
```

---

## 🧪 Test the Deployment

Once deployed, visit:

```
http://<EC2_PUBLIC_IP>:3000
```

You should see:

```
🚀 App running and connected to MySQL
```

Check logs with:

```bash
docker logs node-app
```

---

## ✅ Final Tips

* Never commit `.env` (it's ignored via `.gitignore`)
* Always use GitHub Secrets for CI/CD variables
* Ensure MySQL allows external (Docker) connections
* Developers should request new secrets to be added via GitHub Secrets — not commit them

---

## 🛡️ Secret Management Best Practices

* Developers use placeholders like `$THIRD_PARTY_API_KEY` in code/scripts.
* Secrets are injected by GitHub Actions using `secrets.XYZ`.
* Values are stored securely by DevOps in GitHub Secrets.
* `.env.example` should document expected secret names.
* Optional: use inline `: "${ENV_VAR:?Missing}"` to force error if missing.

---

## 💬 Need Help?

Feel free to reach out or open an issue. 🚀
