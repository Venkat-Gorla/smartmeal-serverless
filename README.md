# 🍱 Smart Meals Platform

A personal project to design and prototype a full-stack, event-driven, serverless meals application — built for learning, and future extensibility.

**“SmartMeal”** — Meal sharing with image uploads, real-time voting, and notification via microservices on AWS using event-driven SNS and DynamoDB. Built in Node.js, deployed with serverless infra.

## 📐 Architecture

![System Diagram](./services/docs/architecture.PNG)

This project follows a **CQRS architecture** and leverages:

- 🟦 Microservices (Node.js + Lambda)
- 🟩 AWS-native services: S3, DynamoDB, EventBridge, SNS, Cognito, OpenSearch, API Gateway
- 📨 Event-driven communication for **loose coupling** (pub-sub pattern)
- 🔀 Separation of write and read planes (Command-Query Responsibility Segregation)

> The full proposed design is represented in the system diagram.  
> Not everything is implemented for the MVP.

## What is done for MVP

All backend services are fully implemented and tested.

Currently not implemented but part of planned work:

- Upload and auth integration
- Like meal flow

## 🧪 Testing

✅ Rigorous test coverage across all services and frontend:

- **Unit Testing**: [Vitest](https://vitest.dev/) for logic
- **UI Testing**: [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- **Integration & Contract Tests**

## 🎯 Highlights

- ⚙️ Node.js + AWS Lambda
- 🌐 React-based frontend (standalone, no backend wiring yet)
- 📬 API Gateway secured with **Amazon Cognito**
- 🔄 EventBridge & DynamoDB Streams used for inter-service events
- 🧠 Designed for learning and growth

## 🖥️ Frontend Preview

- **Live Preview**: [Try it!](https://smartmeal-preview.netlify.app/)
- **Source**: [`/react-client`](./react-client/)

## 📁 Services Overview

Each service is documented with its own detailed README:

- [`/auth`](./services/auth/README.md)
- [`/upload`](./services/upload-meal/README.md)
- [`/dynamodb`](./services/get-meals/events/README.md)
- [`/indexer-opensearch`](./services/get-meals/elastic-search/README.md)

## 📚 Motivation

> This project is a deep dive into:
>
> - Event-driven architecture
> - AWS serverless design patterns
> - Real-world system design for interviews

All code is open-sourced and maintained here on GitHub.

## 🚀 License

MIT License © 2025 VG — open to contributions, if you find it useful.
