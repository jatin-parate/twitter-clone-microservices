# To run skaffold

    skaffold dev --no-prune=false --cache-artifacts=false

# To start minikube

    minikube start --kubernetes-version='v1.19.0

# Enable ingress

    minikube addons enable ingress

# Get ingress ip

    kubectl describe ingress
