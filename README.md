### Overview

A custom-designed DevOps project that consists of fully automated CI/CD pipeline involving automated build of dockerized backend flask app, automated sanity test check and canary deployment, and the eventual automated production deployment into the Kubernetes cluster. Jenkins is used for CI, docker is used for building container image and Kubernetes (kubeadm) is used for container orchestration on the backend nodes and the cluster networking solution is based on flannel. A Kubernetes ingress is implemented to route the traffic from backend services to the front end service. A key feature of the CI/CD pipeline is that any commit or change to the source code submitted by various developers working on the same Github project would result in triggering automated Jenkins pipeline that can result in efficient and fast deployment of the backend service. 

This project was originally derived from the AWS Modern Web App, but with entirely different implementation of the infrastructure and CI/CD pipeline (the original AWS uses Code Pipeline as CI/CD solution and AWS FarGate as serverless container orchestration service). Front end implementation is modified to accommodate for increased scalability (implementation of promises to handle multiple callbacks between front end and backend service) and ease of future development on the project and additional features that increases user experience, such as CSS animation and dynamically repopulating content on the page using Javascript either upon hovering and clicking on each of the mysfit icon.

### Challenges
Some of the challenges encountered during the project includes managing dependency and configuration between different versions of the DevOps tools in order for them to work properly. Some of the Jenkins plugins only support limited features which makes certain solution difficult to achieve. It is important to manually put together the app and ensure it is working before switching to automation, so if any error occurs, we would only need to troubleshoot for a smaller range of the problems. Also, just because the automated process is successful does not mean the app is functional. It is important to track all the logs entries for the container as well as the pods and services(docker inspect, docker logs, kubectl get nodes, kubectl get pods -w and kubectl describe pods) to ensure they are working properly and to test the actual application. Overall the project helps me to understand testing, Jenkins, Docker, Javascript and Kubernetes on a deeper level.

### Demonstration

1. These are the Grafana dashboard that aggregates the Kubernetes cluster data gathered by Prometheus from the nodes. It shows historical time series of cluster health and performance.
![alt text](https://github.com/enyu0226/Custom-Web-App-CI-CD-Pipeline/blob/master/image-and-video/Prometheus%20and%20Grafana%20Monitor%201.png)
![alt text](https://github.com/enyu0226/Custom-Web-App-CI-CD-Pipeline/blob/master/image-and-video/Prometheus%20and%20Grafana%20Monitor%202.png)

2. This is a lists of processes/pods running on both master and worker nodes.
![alt text](https://github.com/enyu0226/Custom-Web-App-CI-CD-Pipeline/blob/master/image-and-video/kubernetes%20processes.png)

3. The following is a architectural layout of the CI/CD pipeline and a high level overview of the backend services deployed in the Kubernetes cluster. 
![alt text](https://github.com/enyu0226/Custom-Web-App-CI-CD-Pipeline/blob/master/image-and-video/App%20Archetecture.png)

4. This is the automated multibranch pipeline that perform automated CI/CD for our web app using Jenkinsfile.
![alt text](https://github.com/enyu0226/Custom-Web-App-CI-CD-Pipeline/blob/master/image-and-video/Jenkin%20Pipeline.png)

5. The following is a video of the finished web app in action. For the front end, all the cute animals icons (mysfits) would swing side to side when mouse is hovered on top and when clicked, would make a squeaky toy sound and reload their profile pictures as well as their stats. All the image data and the stats are loaded from the backend endpoint presented by the Nodeport (developer version) or Ingress (production version)
![alt text](https://github.com/enyu0226/Custom-Web-App-CI-CD-Pipeline/blob/master/image-and-video/web_app_demo.gif)

### Sysadmin Consideration
In terms of Sysadmin tasks, the kubeadm Kubernetes consists of one master and two worker nodes, so three separate cloud Ubuntu servers are set up in this case. The containerized app are deployed as pods, which are scheduled by the master onto the worker nodes. The Kubernetes cluster is set up using kubeadm, for the setup instruction please refers to https://kubernetes.io/docs/setup/independent/create-cluster-kubeadm/. After the cluster is set up, install flannel on the Kubernetes master by running 
kubectl apply -f https://raw.githubusercontent.com/coreos/flannel/v0.9.1/Documentation/kube-flannel.yml. For cluster monitoring, install Prometheus and Grafana on the master by using Helm. 
https://gardener.cloud/050-tutorials/content/howto/prometheus/

A separate CentOs7 cloud server is setup as the Jenkin server with installation of docker and various plugins such as Kubernetes CD, docker and HTTP Request. The Github credential, Dockerhub credential and kubeconfig credentials are set up and stored as global Jenkin credentials. A multibranch pipeline project is selected and configured to communicate with the Github account and automation occurs according to the pipeline instructions in the Jenkinsfile. The image building instructions are packaged in the Dockerfile.

### System Design Consideration
The interest behind this project was initially sparked through the use of AWS Fargate for the implementation of mythical mysfit backend flask application. Even though it is convenience to use as it frees developers from any infrastructure concerns, as the app grows to be sufficiently large and uses quite frequently, its cost would be 2-3X the cost of deploying the app onto regular EC2 or EKS service. The current project implementation is cost-effective, reliable and scalable. The project could be reimplemented on AWS using kops with Jenkins, by packaging them on the same EC2 instance (deploying dockerized Jenkins directly into kops cluster) or different instances in the same subnet to avoid authentication and networking issue. Implementation of the backend flask service on EKS(AWS native container orchestration service using Kubernetes and Code Pipeline (AWS native CI/CD solution) would also be cost-effective, reliable and scalable for large-scaled web project. Check out [AWS Fargate: why it’s awesome (and not)](https://medium.freecodecamp.org/amazon-fargate-goodbye-infrastructure-3b66c7e3e413)

For the services to be ready for production, the master would need to be replicated in odd number, with 5 been the typical number that is deployed in most production clusters in order to achieve high availability. Since any number of worker nodes can be joined to the master, it can easily achieve high availability. Kubernetes cluster can manage large-scaled container orchestration through autoscaler of pods in replica and thus represents an excellent option for scalability of the web app. The services deployed in Kubernetes are reliable since the pods can be deployed in replicas and the scheduler on the master node can reschedule the pods onto a different nodes should the pods or the worker nodes experience network problem or hardware failure, which also allows it to achieved high availability. The use of ingress controller can also reduce the number of load balancer (each load balancer would cost on average $20 per month + additional cost per GB of data processed) on multiple different services on the backend node by intelligently routing the request and response for each service, as the load balancer service on Kubernetes would requires each service to be associated with one load balancer on the Cloud platform. The front end service could be deployed to AWS S3 for its high scalability, availability, durability and reliability, using static website hosting. To increase web performance, a cache layer (Redis, Memcached, etc) could be added before the backend end service to store frequently accessed content that are requested by the front end service by numerous users.
