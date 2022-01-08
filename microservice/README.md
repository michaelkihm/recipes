# Microservice version of recipes app

## Auth microservice
nodejs and mongodb application for user authentification 

### create secret example
kubectl create secret generic jwt-secret --from-literal=JWT_KEY=asdf

### Add following to /etc/hosts
127.0.0.1 recipes.dev

## Client
frontend of recipes app

## recipes
nodejs and mongodb application for recipe storing and searching