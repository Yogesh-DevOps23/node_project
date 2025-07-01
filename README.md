# 🚀 Node.js CI/CD with GitHub Actions, Docker, AWS ECR, and Local MySQL

## 🎯 Objective

Build and deploy a Node.js backend to an EC2 instance using:
- GitHub Actions (CI/CD)
- Docker & AWS ECR
- Local MySQL on EC2

---

## 📦 Features

- `.env` management via GitHub Secrets
- Unit tests via Jest
- Dockerized build
- Automatic ECR push and EC2 deployment

---

## 🧑‍💻 Local Setup

```bash
cp .env.example .env
docker-compose up --build